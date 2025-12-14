import { createClient } from '@/lib/supabase/client';
import type { ActivePlan } from '@/types/subscription.types';
import type { BillingPeriod } from '@/lib/utils/subscription-dates';

// Lazy Supabase client creation - only create when needed, not at module level
function getSupabaseClient() {
  return createClient() as ReturnType<typeof createClient>;
}

/**
 * New Subscription Service using Edge Functions
 * This service handles all subscription logic via backend edge functions
 */
export class SubscriptionEdgeService {
  private static getSupabaseUrl(): string {
    return process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  }

  /**
   * Get user's active subscription plan
   * Uses the get-active-plan edge function
   * Only makes API call if user is authenticated
   */
  static async getActivePlan(): Promise<ActivePlan> {
    // Use getUser() to securely verify authentication
    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Return guest state immediately if no user - don't make API call
    if (!user) {
      return {
        plan: null,
        tier: null,
        start_date: null,
        end_date: null,
        is_expired: true,
        plan_expired: true,
        days_left: null,
      };
    }

    // Get session for access token after verifying user
    // supabase already defined above
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        plan: null,
        tier: null,
        start_date: null,
        end_date: null,
        is_expired: true,
        plan_expired: true,
        days_left: null,
      };
    }

    // Only make API call if user has a valid session
    try {
      const supabaseUrl = this.getSupabaseUrl();
      const response = await fetch(`${supabaseUrl}/functions/v1/get-active-plan`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If unauthorized, return guest state instead of throwing
        if (response.status === 401 || response.status === 403) {
          return {
            plan: null,
            tier: null,
            start_date: null,
            end_date: null,
            is_expired: true,
            plan_expired: true,
            days_left: null,
          };
        }
        throw new Error(`Failed to fetch active plan: ${response.statusText}`);
      }

      const data: ActivePlan = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching active plan:', error);
      // Return guest state on error instead of throwing
      return {
        plan: null,
        tier: null,
        start_date: null,
        end_date: null,
        is_expired: true,
        plan_expired: true,
        days_left: null,
      };
    }
  }

  /**
   * Subscribe to a plan (trial, hub, or edge)
   * Uses the subscribe-plan edge function
   * Handles upgrade logic, prevents downgrades, auto-assigns trial
   * 
   * @param plan - The plan to subscribe to ('trial', 'hub', or 'edge')
   * @param billingPeriod - Optional billing period ('monthly' or 'yearly'). Required for hub/edge plans, ignored for trial
   */
  static async subscribePlan(
    plan: 'trial' | 'hub' | 'edge',
    billingPeriod?: BillingPeriod
  ): Promise<{
    message: string;
    subscription: {
      id: string;
      plan: string;
      tier: number;
      start_date: string;
      end_date: string | null;
      is_active: boolean;
      days_left: number | null;
    };
  }> {
    // Use getUser() to securely verify authentication
    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Authentication required');
    }

    // Get session for access token after verifying user
    // supabase already defined above
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Session not found');
    }

    // Validate billing period for paid plans
    if ((plan === 'hub' || plan === 'edge') && !billingPeriod) {
      throw new Error(`Billing period is required for ${plan} plan`);
    }

    const supabaseUrl = this.getSupabaseUrl();
    const requestBody: { plan: string; billing_period?: BillingPeriod } = { plan };
    
    // Only include billing_period for paid plans (not trial)
    if (billingPeriod && plan !== 'trial') {
      requestBody.billing_period = billingPeriod;
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/subscribe-plan`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to subscribe: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Check if user has access to content based on required tier
   * Uses the check-content-access edge function
   */
  static async checkContentAccess(
    contentId: string,
    contentType: 'library_resource' | 'challenge' | 'training_program' | 'video' | 'news_post',
    requiredTier?: number
  ): Promise<{
    has_access: boolean;
    user_tier: number;
    required_tier: number;
    reason: string;
  }> {
    // Use getUser() to securely verify authentication
    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get session for access token if user is authenticated
    let accessToken = '';
    if (user) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      accessToken = session?.access_token || '';
    }

    const supabaseUrl = this.getSupabaseUrl();
    const response = await fetch(`${supabaseUrl}/functions/v1/check-content-access`, {
      method: 'POST',
      headers: {
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content_id: contentId,
        content_type: contentType,
        required_tier: requiredTier,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to check content access: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get CTA visibility based on user's plan
   * Returns which CTAs should be shown
   * Only makes API call if user is authenticated
   */
  static async getCtaVisibility(): Promise<{
    showTrial: boolean;
    showHub: boolean;
    showEdge: boolean;
  }> {
    // Use getUser() to securely verify authentication
    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Guest: show all CTAs
      return {
        showTrial: true,
        showHub: true,
        showEdge: true,
      };
    }

    const activePlan = await this.getActivePlan();

    // Guest: show all CTAs
    if (!activePlan.plan) {
      return {
        showTrial: true,
        showHub: true,
        showEdge: true,
      };
    }

    // Trial: show hub and edge CTAs
    if (activePlan.plan === 'trial') {
      return {
        showTrial: false,
        showHub: true,
        showEdge: true,
      };
    }

    // Hub: show only edge CTA
    if (activePlan.plan === 'hub') {
      return {
        showTrial: false,
        showHub: false,
        showEdge: true,
      };
    }

    // Edge: show no CTAs
    return {
      showTrial: false,
      showHub: false,
      showEdge: false,
    };
  }

  /**
   * Check if user can upgrade to a specific plan
   */
  static async canUpgradeTo(plan: 'hub' | 'edge'): Promise<boolean> {
    const activePlan = await this.getActivePlan();

    if (!activePlan.plan || activePlan.is_expired) {
      return true; // Guest or expired can subscribe
    }

    const planTiers: Record<string, number> = {
      trial: 1,
      hub: 2,
      edge: 3,
    };

    const currentTier = planTiers[activePlan.plan] || 0;
    const targetTier = planTiers[plan] || 0;

    return targetTier > currentTier;
  }
}

