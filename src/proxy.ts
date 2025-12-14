import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If Supabase is not configured, allow all requests (for development)
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Use getUser() to securely verify authentication
  let user = null;
  let session = null;
  try {
    const {
      data: { user: authUser },
      error: userError,
    } = await supabase.auth.getUser();
    
    if (!userError && authUser) {
      user = authUser;
      // Get session for access token after verifying user
      const {
        data: { session: authSession },
      } = await supabase.auth.getSession();
      session = authSession;
    }
  } catch (error) {
    // If there's an error getting user, continue without auth check
    console.error('Proxy auth error:', error);
  }

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user || !session) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check subscription status for players and redirect accordingly
    if (user && session) {
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profile && profile.role === 'player') {
          // Get active subscription plan using edge function
          try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
            const planResponse = await fetch(`${supabaseUrl}/functions/v1/get-active-plan`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
            });

            if (planResponse.ok) {
              const activePlan = await planResponse.json();
              
              // If trial expired or no active plan, redirect to membership page
              if (!activePlan.plan || activePlan.is_expired || activePlan.plan_expired) {
                return NextResponse.redirect(new URL('/membership', request.url));
              }

              // Allow access to dashboard for all active plans (trial, hub, edge)
              // Users should be able to access their dashboard and content pages
              if (activePlan.plan === 'trial' || activePlan.plan === 'hub' || activePlan.plan === 'edge') {
                // Redirect /dashboard to role-specific dashboard
                if (request.nextUrl.pathname === '/dashboard') {
                  const dashboardPath = `/dashboard/${profile.role}`;
                  return NextResponse.redirect(new URL(dashboardPath, request.url));
                }
                return response; // Allow access to dashboard and all dashboard routes
              }
            }
          } catch (planError) {
            // If we can't check plan, allow access (fallback)
            console.error('Proxy plan check error:', planError);
          }
        }

        // Redirect /dashboard to role-specific dashboard for non-players or if plan check failed
        if (request.nextUrl.pathname === '/dashboard') {
          if (profile) {
            const dashboardPath = `/dashboard/${profile.role}`;
            return NextResponse.redirect(new URL(dashboardPath, request.url));
          }
        }
      } catch (error) {
        // If error, redirect to default
        console.error('Proxy dashboard redirect error:', error);
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup'
  ) {
    if (user && session) {
      try {
        // Get user role and subscription status
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profile && profile.role === 'player') {
          // Check subscription status for players
          try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
            const planResponse = await fetch(`${supabaseUrl}/functions/v1/get-active-plan`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
            });

            if (planResponse.ok) {
              const activePlan = await planResponse.json();
              
              // If trial expired or no active plan, redirect to membership page
              if (!activePlan.plan || activePlan.is_expired || activePlan.plan_expired) {
                return NextResponse.redirect(new URL('/membership', request.url));
              }

              // For all active plans (trial, hub, edge), redirect to dashboard
              // Hub users can access dashboard and will see upgrade options in the UI
              if (activePlan.plan === 'trial' || activePlan.plan === 'hub' || activePlan.plan === 'edge') {
                const dashboardPath = `/dashboard/${profile.role}`;
                return NextResponse.redirect(new URL(dashboardPath, request.url));
              }
            }
          } catch (planError) {
            // If we can't check plan, redirect to dashboard (fallback)
            console.error('Proxy plan check error:', planError);
          }
        }

        // For non-players or if plan check failed, redirect to dashboard
        if (profile) {
          const dashboardPath = `/dashboard/${profile.role}`;
          return NextResponse.redirect(new URL(dashboardPath, request.url));
        }
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (error) {
        // If there's an error, just redirect to dashboard
        console.error('Proxy profile error:', error);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  // Redirect authenticated users away from membership page
  // Membership page is public-only - logged-in users see plans on their dashboard
  if (request.nextUrl.pathname === '/membership') {
    if (user && session) {
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          // Redirect to role-specific dashboard where plans are shown
          const dashboardPath = `/dashboard/${profile.role}`;
          return NextResponse.redirect(new URL(dashboardPath, request.url));
        }
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (error) {
        // If error, redirect to dashboard
        console.error('Proxy membership redirect error:', error);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  // Protect checkout page - only allow trial/free or hub users
  // Edge users should not access checkout (no upgrade available)
  if (request.nextUrl.pathname === '/checkout') {
    if (!user || !session) {
      // Redirect to login if not authenticated
      const plan = request.nextUrl.searchParams.get('plan');
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', `/checkout${plan ? `?plan=${plan}` : ''}`);
      return NextResponse.redirect(redirectUrl);
    }

    // Check if user has Edge plan - redirect to dashboard
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const planResponse = await fetch(`${supabaseUrl}/functions/v1/get-active-plan`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (planResponse.ok) {
        const activePlan = await planResponse.json();
        
        // If user has active Edge plan, redirect to dashboard (no upgrade available)
        if (activePlan?.plan === 'edge' && !activePlan.plan_expired) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          
          if (profile) {
            const dashboardPath = `/dashboard/${profile.role}`;
            return NextResponse.redirect(new URL(dashboardPath, request.url));
          }
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    } catch (error) {
      // If error checking plan, allow access (fallback)
      console.error('Proxy checkout plan check error:', error);
    }
  }

  // Redirect old /auth/* routes to home (except error pages)
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    // Don't redirect error pages
    if (
      !request.nextUrl.pathname.includes('/error') &&
      !request.nextUrl.pathname.includes('/404') &&
      !request.nextUrl.pathname.includes('/500')
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

