import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type {
  SignUpData,
  SignInData,
  UserProfile,
  PlayerProfile,
  CoachProfile,
  ProfileUpdateData,
  PlayerProfileUpdateData,
  CoachProfileUpdateData,
} from '@/types/auth.types';
import { SubscriptionService } from './subscription.service';
import { SubscriptionEdgeService } from './subscription-edge.service';

// Lazy Supabase client creation - only create when needed, not at module level
function getSupabaseClient() {
  return createClient() as ReturnType<typeof createClient>;
}

export class AuthService {
  /**
   * Sign up with email and password
   * Automatically creates a 14-day trial subscription for players
   */
  static async signUp(data: SignUpData) {
    const { email, password, full_name, role, ...additionalData } = data;

    // Create auth user
    // All users get 14-day free trial automatically (one per unique email)
    const supabase = getSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role,
        },
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/verify-email`,
      },
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    // If email confirmation is required, authData.session will be null
    // In this case, we should just return success and let the email verification handle the rest
    if (!authData.session) {
      // Email confirmation required - user will verify via email link
      // The handle_new_user trigger will create the profile when they verify
      return {
        user: authData.user,
        session: null,
        needsEmailVerification: true,
      };
    }

    // If we have a session, set it on the client so RLS policies work
    // supabase already defined above
    await supabase.auth.setSession(authData.session);

    // Wait a moment for the database trigger to create the profile
    // The trigger handle_new_user() automatically creates user_profiles and role-specific profiles
    await new Promise(resolve => setTimeout(resolve, 500));

    // Fetch the profile created by the trigger (or create if trigger didn't run)
    let profile;
    let profileError;

    // First, try to fetch the profile
    // Note: This will only work if we have a session (email confirmation disabled)
    // If email confirmation is required, profile will be fetched after email verification
    // supabase already defined at the start of signUp method
    const { data: existingProfile, error: fetchError } = await (supabase as any)
      .from('user_profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (existingProfile) {
      // Profile exists (created by trigger)
      profile = existingProfile;
    } else {
      // Fallback: Try to create profile manually if trigger didn't work
      // This handles cases where trigger might fail or email confirmation is disabled
      const { data: newProfile, error: insertError } = await (supabase as any)
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          full_name,
          role,
          ...additionalData,
        })
        .select()
        .single();

      if (insertError) {
        // Check if it's a duplicate key error (profile already exists)
        if (insertError.code === '23505') {
          // Profile already exists, fetch it
          const { data: fetchedProfile, error: refetchError } = await (supabase as any)
            .from('user_profiles')
            .select('*')
            .eq('user_id', authData.user.id)
            .single();

          if (refetchError) {
            profileError = refetchError;
          } else {
            profile = fetchedProfile;
          }
        } else {
          profileError = insertError;
        }
      } else {
        profile = newProfile;
      }

      // Create role-specific profile if it doesn't exist
      if (profile && !profileError) {
        if (role === 'player') {
          const { error: playerError } = await (supabase as any)
            .from('player_profiles')
            .insert({
              user_id: authData.user.id,
            })
            .select()
            .single();

          if (playerError && playerError.code !== '23505') {
            // Ignore duplicate key errors
            console.error('Player profile creation error:', playerError);
          }
        } else if (role === 'coach') {
          const { error: coachError } = await (supabase as any)
            .from('coach_profiles')
            .insert({
              user_id: authData.user.id,
            })
            .select()
            .single();

          if (coachError && coachError.code !== '23505') {
            // Ignore duplicate key errors
            console.error('Coach profile creation error:', coachError);
          }
        }
      }
    }

    // If we don't have a session (email confirmation required), return early with minimal profile
    // The profile will be created by the trigger when the user verifies their email
    if (!authData.session) {
      const minimalProfile: UserProfile = {
        id: authData.user.id,
        email: authData.user.email || '',
        full_name: full_name || '',
        role: (role || 'player') as 'player' | 'coach' | 'admin',
        status: 'pending' as const,
        avatar_url: undefined,
        phone_number: undefined,
        date_of_birth: undefined,
        country: undefined,
        city: undefined,
        bio: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login_at: undefined,
      };

      return {
        user: authData.user,
        session: null,
        profile: minimalProfile,
      };
    }

    // If profile doesn't exist yet (shouldn't happen if trigger worked), create a minimal profile object
    // The actual profile will be fetched after email verification
    if (profileError || !profile) {
      // If email confirmation is required, the profile exists but we can't read it yet
      // Return a minimal profile that will be updated after email verification
      if (authData.session) {
        // We have a session but still can't read profile - this is an error
        const errorMessage = profileError
          ? (profileError.message || profileError.details || JSON.stringify(profileError))
          : 'No profile found';
        console.error('Profile creation/fetch error:', JSON.stringify(profileError || 'No profile found', null, 2));
        throw new Error(`Failed to create user profile: ${errorMessage}`);
      } else {
        // No session (email confirmation required) - profile was created by trigger but we can't read it yet
        // Return minimal profile - it will be fetched after email verification
        profile = {
          user_id: authData.user.id,
          full_name: full_name || '',
          role: role || 'player',
          avatar: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
    }

    // Map profile to UserProfile format
    const userProfile: UserProfile = {
      id: authData.user.id,
      email: authData.user.email || '',
      full_name: profile.full_name || full_name || '',
      role: (profile.role || role || 'player') as 'player' | 'coach' | 'admin',
      status: authData.session ? 'verified' as const : 'pending' as const,
      avatar_url: profile.avatar || undefined,
      phone_number: undefined,
      date_of_birth: undefined,
      country: undefined,
      city: undefined,
      bio: undefined,
      created_at: profile.created_at || new Date().toISOString(),
      updated_at: profile.updated_at || new Date().toISOString(),
      last_login_at: undefined,
    };

    // Ensure user exists in users table (required for trigger to work)
    // The trigger handle_new_user() should create this, but we ensure it exists
    if (authData.session) {
      try {
        // Check if user exists in users table, if not create it
        // supabase already defined above
        const { data: existingUser, error: userCheckError } = await (supabase as any)
          .from('users')
          .select('id')
          .eq('id', authData.user.id)
          .single();

        if (!existingUser && !userCheckError) {
          // User doesn't exist in users table, create it
          // This will trigger auto_assign_trial() function
          const { error: insertUserError } = await (supabase as any)
            .from('users')
            .insert({
              id: authData.user.id,
              email: authData.user.email || email,
              full_name: full_name || '',
              role: role || 'player',
            });

          if (insertUserError && insertUserError.code !== '23505') {
            // Ignore duplicate key errors (user already exists)
            console.error('Failed to create user in users table:', insertUserError);
          }
        }
      } catch (userError) {
        console.error('Error checking/creating user in users table:', userError);
      }
    }

    // Handle subscription creation using new subscription system
    // Only if we have a session (email confirmation disabled)
    // If email confirmation is required, subscription will be created after verification in verify-email page
    // All players automatically get 14-day free trial (one per unique email)
    if (authData.session && role === 'player') {
      try {
        // Wait a moment for trigger to potentially assign trial
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if trial was already assigned by trigger
        const activePlan = await SubscriptionEdgeService.getActivePlan();

        // Auto-assign trial subscription (14 days) if no active plan exists
        // The trigger should handle this, but we ensure it's assigned here as well
        if (!activePlan.plan || activePlan.is_expired) {
          // Auto-assign trial subscription (14 days) using new system
          await SubscriptionEdgeService.subscribePlan('trial');
        }
      } catch (subscriptionError) {
        // Log error but don't fail signup if subscription creation fails
        // The trigger should handle trial assignment as fallback
        console.error('Failed to create subscription:', subscriptionError);
      }
    }

    return {
      user: authData.user,
      session: authData.session,
      profile: userProfile,
    };
  }

  /**
   * Resend confirmation email
   */
  static async resendConfirmationEmail(email: string) {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/verify-email`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Sign in with email and password
   * Auto-assigns trial subscription if user doesn't have one
   */
  static async signIn(data: SignInData) {
    const { email, password } = data;
    const supabase = getSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Failed to sign in');
    }

    // Load user profile
    const profile = await this.getUserProfile(authData.user.id);

    // Load role-specific profiles
    let playerProfile: PlayerProfile | null = null;
    let coachProfile: CoachProfile | null = null;

    if (profile.role === 'player') {
      playerProfile = await this.getPlayerProfile(authData.user.id);

      // Ensure user exists in users table
      try {
        // supabase already defined above in signIn method
        const { data: existingUser } = await (supabase as any)
          .from('users')
          .select('id')
          .eq('id', authData.user.id)
          .single();

        if (!existingUser) {
          // User doesn't exist in users table, create it
          const { error: insertUserError } = await (supabase as any)
            .from('users')
            .insert({
              id: authData.user.id,
              email: authData.user.email || '',
              full_name: profile.full_name || '',
              role: profile.role || 'player',
            });

          if (insertUserError && insertUserError.code !== '23505') {
            console.error('Failed to create user in users table:', insertUserError);
          }
        }

        // Check if user has active subscription, if not assign trial
        try {
          const activePlan = await SubscriptionEdgeService.getActivePlan();
          if (!activePlan.plan || activePlan.is_expired) {
            // No active subscription, assign trial
            await SubscriptionEdgeService.subscribePlan('trial');
          }
        } catch (subError) {
          console.error('Failed to check/assign trial subscription:', subError);
        }
      } catch (userError) {
        console.error('Error ensuring user subscription:', userError);
      }
    } else if (profile.role === 'coach') {
      coachProfile = await this.getCoachProfile(authData.user.id);
    }

    return {
      user: authData.user,
      session: authData.session,
      profile,
      playerProfile,
      coachProfile,
    };
  }

  /**
   * Sign out
   */
  static async signOut() {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Get current user
   */
  static async getUser() {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  /**
   * Get user profile with subscription details
   * Uses the user-profile Edge Function to get comprehensive profile data
   */
  static async getUserProfile(userId: string, useEdgeFunction: boolean = true): Promise<UserProfile> {
    // Use Edge Function for comprehensive profile with subscription details
    if (useEdgeFunction) {
      try {
        // Use getUser() to securely verify authentication
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('No authenticated user found');
        }

        // Get session for access token after verifying user
        // supabase already defined above
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('No session found');
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const response = await fetch(`${supabaseUrl}/functions/v1/user-profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Fallback to direct database query if Edge Function fails
          return this.getUserProfileFromDatabase(userId);
        }

        const profileData = await response.json();

        // Map Edge Function response to UserProfile type
        return {
          id: profileData.id,
          email: profileData.email,
          full_name: profileData.full_name,
          role: profileData.role,
          status: 'verified' as const,
          avatar_url: profileData.avatar_url,
          phone_number: profileData.phone_number,
          date_of_birth: profileData.date_of_birth,
          country: profileData.country,
          city: profileData.city,
          bio: profileData.bio,
          user_type: profileData.user_type,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at,
          last_login_at: profileData.last_login_at,
          subscription: profileData.subscription,
          player_profile: profileData.player_profile,
          coach_profile: profileData.coach_profile,
        } as UserProfile;
      } catch (error) {
        console.error('Error fetching profile from Edge Function, falling back to database:', error);
        // Fallback to direct database query
        return this.getUserProfileFromDatabase(userId);
      }
    }

    // Fallback: Direct database query (legacy method)
    return this.getUserProfileFromDatabase(userId);
  }

  /**
   * Get user profile directly from database (legacy method)
   * Used as fallback when Edge Function is unavailable
   */
  private static async getUserProfileFromDatabase(userId: string): Promise<UserProfile> {
    // Get profile from user_profiles table
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any)
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Get email from users table (auth.users)
    // supabase already defined above
    const { data: userData } = await (supabase as any)
      .from('users')
      .select('email, user_type')
      .eq('id', userId)
      .single();

    const email = userData?.email || '';

    // Map to UserProfile type
    return {
      id: userId,
      email: email || '',
      full_name: data.full_name || '',
      role: (data.role || 'player') as 'player' | 'coach' | 'admin',
      status: 'verified' as const, // Default status
      avatar_url: data.avatar || undefined,
      phone_number: undefined,
      date_of_birth: undefined,
      country: undefined,
      city: undefined,
      bio: undefined,
      user_type: userData?.user_type || data.role || 'player',
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
      last_login_at: undefined,
    } as UserProfile;
  }

  /**
   * Get player profile
   */
  static async getPlayerProfile(userId: string): Promise<PlayerProfile | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any)
      .from('player_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Get coach profile
   */
  static async getCoachProfile(userId: string): Promise<CoachProfile | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any)
      .from('coach_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    data: ProfileUpdateData
  ): Promise<UserProfile> {
    const supabase = getSupabaseClient();
    const { data: updatedProfile, error } = await (supabase as any)
      .from('user_profiles')
      .update({
        full_name: data.full_name,
        avatar: data.avatar_url,
        ...data,
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.getUserProfile(userId);
  }

  /**
   * Update player profile
   */
  static async updatePlayerProfile(
    userId: string,
    data: PlayerProfileUpdateData
  ): Promise<PlayerProfile> {
    const supabase = getSupabaseClient();
    const { data: updatedProfile, error } = await (supabase as any)
      .from('player_profiles')
      .update(data)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return updatedProfile;
  }

  /**
   * Update coach profile
   */
  static async updateCoachProfile(
    userId: string,
    data: CoachProfileUpdateData
  ): Promise<CoachProfile> {
    const supabase = getSupabaseClient();
    const { data: updatedProfile, error } = await (supabase as any)
      .from('coach_profiles')
      .update(data)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return updatedProfile;
  }

  /**
   * Check if user is authenticated
   * Uses getUser() to securely verify authentication
   */
  static async checkAuth() {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }

  /**
   * Get current session
   * Note: Use getUser() first to verify authentication, then getSession() for access token
   */
  static async getSession() {
    // Verify user first for security
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }
    // Get session for access token after verification  
    // supabase already defined above
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
}
