import { createClient } from '@/lib/supabase/client';
import type {
  SubscriptionPlan,
  UserSubscription,
  SubscriptionHistory,
  SubscriptionPlanName,
  SubscriptionStatus,
  BillingPeriod,
  CheckoutData,
} from '@/types/subscription.types';
import { calculateEndDateFromNow } from '@/lib/utils/subscription-dates';

const supabase = createClient() as ReturnType<typeof createClient>;

export class SubscriptionService {
  /**
   * Get all active subscription plans
   */
  static async getPlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await (supabase as any)
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch plans: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get a specific subscription plan by name
   */
  static async getPlanByName(name: SubscriptionPlanName): Promise<SubscriptionPlan | null> {
    const { data, error } = await (supabase as any)
      .from('subscription_plans')
      .select('*')
      .eq('name', name)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch plan: ${error.message}`);
    }

    return data;
  }

  /**
   * Get a specific subscription plan by ID
   */
  static async getPlanById(planId: string): Promise<SubscriptionPlan | null> {
    const { data, error } = await (supabase as any)
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch plan: ${error.message}`);
    }

    return data;
  }

  /**
   * Get user's current subscription
   */
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('user_subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No subscription found
        }
        // If relationship error, try without the join
        if (error.message?.includes('relationship')) {
          const { data: subData, error: subError } = await (supabase as any)
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (subError) {
            if (subError.code === 'PGRST116') {
              return null;
            }
            console.error('Failed to fetch subscription:', subError);
            return null;
          }

          // Fetch plan separately if subscription exists
          if (subData && subData.plan_id) {
            const { data: planData } = await (supabase as any)
              .from('subscription_plans')
              .select('*')
              .eq('id', subData.plan_id)
              .single();

            return { ...subData, plan: planData };
          }

          return subData;
        }
        console.error('Failed to fetch subscription:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserSubscription:', error);
      return null;
    }
  }

  /**
   * Check if user has an active subscription
   * Note: Trial is considered active for subscription purposes but not for content access
   */
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    return subscription?.status === 'active' || subscription?.status === 'trial';
  }

  /**
   * Check if user has a paid (non-trial) subscription
   */
  static async hasPaidSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    return subscription?.status === 'active';
  }

  /**
   * Check if user has access to a specific plan
   */
  static async hasPlanAccess(userId: string, planName: SubscriptionPlanName): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription || !subscription.plan) {
      return false;
    }

    // Edge plan has access to everything
    if (subscription.plan.name === 'edge') {
      return true;
    }

    // Hub plan only has access to hub content
    if (subscription.plan.name === 'hub' && planName === 'hub') {
      return subscription.status === 'active' || subscription.status === 'trial';
    }

    return false;
  }

  /**
   * Start a trial subscription
   */
  static async startTrial(
    userId: string,
    planId: string,
    trialDays: number = 14
  ): Promise<UserSubscription> {
    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + trialDays);

    const { data, error } = await (supabase as any)
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'trial',
        trial_start: trialStart.toISOString(),
        trial_end: trialEnd.toISOString(),
      })
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .single();

    if (error) {
      throw new Error(`Failed to start trial: ${error.message}`);
    }

    // Log subscription history
    await this.logSubscriptionHistory(userId, planId, 'trial_started');

    return data;
  }

  /**
   * Create or update subscription (for checkout completion)
   */
  static async createSubscription(
    userId: string,
    planId: string,
    stripeSubscriptionId?: string,
    stripeCustomerId?: string
  ): Promise<UserSubscription> {
    // Check if user already has a subscription
    const existing = await this.getUserSubscription(userId);

    if (existing) {
      // Update existing subscription
      // Get plan to determine billing period
      const plan = await this.getPlanById(planId);
      const billingPeriod = plan?.billing_period || 'monthly';
      
      const { data, error } = await (supabase as any)
        .from('user_subscriptions')
        .update({
          plan_id: planId,
          status: 'active',
          stripe_subscription_id: stripeSubscriptionId,
          stripe_customer_id: stripeCustomerId,
          current_period_start: new Date().toISOString(),
          current_period_end: calculateEndDateFromNow(billingPeriod),
          cancel_at_period_end: false,
          cancelled_at: null,
        })
        .eq('user_id', userId)
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .single();

      if (error) {
        throw new Error(`Failed to update subscription: ${error.message}`);
      }

      // Log subscription history
      const action = existing.plan_id !== planId ? 'upgraded' : 'renewed';
      await this.logSubscriptionHistory(userId, planId, action, existing.plan_id);

      return data;
    } else {
      // Create new subscription
      // Get plan to determine billing period
      const plan = await this.getPlanById(planId);
      const billingPeriod = plan?.billing_period || 'monthly';
      
      const { data, error } = await (supabase as any)
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          status: 'active',
          stripe_subscription_id: stripeSubscriptionId,
          stripe_customer_id: stripeCustomerId,
          current_period_start: new Date().toISOString(),
          current_period_end: calculateEndDateFromNow(billingPeriod),
        })
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .single();

      if (error) {
        throw new Error(`Failed to create subscription: ${error.message}`);
      }

      // Log subscription history
      await this.logSubscriptionHistory(userId, planId, 'created');

      return data;
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(userId: string, cancelAtPeriodEnd: boolean = true): Promise<UserSubscription> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) {
      throw new Error('No subscription found');
    }

    const { data, error } = await (supabase as any)
      .from('user_subscriptions')
      .update({
        cancel_at_period_end: cancelAtPeriodEnd,
        cancelled_at: cancelAtPeriodEnd ? null : new Date().toISOString(),
        status: cancelAtPeriodEnd ? subscription.status : 'cancelled',
      })
      .eq('user_id', userId)
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .single();

    if (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }

    // Log subscription history
    if (subscription.plan_id) {
      await this.logSubscriptionHistory(userId, subscription.plan_id, 'cancelled');
    }

    return data;
  }

  /**
   * Get subscription history
   */
  static async getSubscriptionHistory(userId: string): Promise<SubscriptionHistory[]> {
    const { data, error } = await (supabase as any)
      .from('subscription_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch subscription history: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Log subscription history
   */
  private static async logSubscriptionHistory(
    userId: string,
    planId: string,
    action: SubscriptionHistory['action'],
    previousPlanId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await (supabase as any)
      .from('subscription_history')
      .insert({
        user_id: userId,
        plan_id: planId,
        action,
        previous_plan_id: previousPlanId,
        metadata: metadata || {},
      });
  }

  /**
   * Prepare checkout data
   */
  static async prepareCheckout(planName: SubscriptionPlanName, billingPeriod: BillingPeriod = 'monthly'): Promise<CheckoutData> {
    const plan = await this.getPlanByName(planName);
    if (!plan) {
      throw new Error(`Plan ${planName} not found`);
    }

    const price = billingPeriod === 'yearly' && plan.price_yearly
      ? plan.price_yearly
      : plan.price_monthly;

    return {
      planId: plan.id,
      planName: plan.name,
      billingPeriod,
      price,
    };
  }
}

