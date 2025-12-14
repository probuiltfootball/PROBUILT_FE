export type SubscriptionPlanName = 'trial' | 'hub' | 'edge';
export type SubscriptionStatus = 'trial' | 'active' | 'cancelled' | 'expired' | 'past_due';
export type BillingPeriod = 'monthly' | 'yearly';
export type SubscriptionAction = 'created' | 'upgraded' | 'downgraded' | 'cancelled' | 'renewed' | 'trial_started' | 'trial_ended';

// New backend structure - Active Plan Response
export interface ActivePlan {
  plan: 'trial' | 'hub' | 'edge' | null;
  tier: number | null; // 1=trial, 2=hub, 3=edge
  start_date: string | null;
  end_date: string | null;
  is_expired: boolean;
  plan_expired: boolean; // Alias for is_expired for clarity
  days_left: number | null; // Calculated for all plans (trial, hub, edge) if end_date exists, null for ongoing subscriptions
}

// Legacy types for backward compatibility (if needed)
export interface SubscriptionPlan {
  id: string;
  name: SubscriptionPlanName;
  display_name: string;
  price_monthly: number;
  price_yearly?: number;
  billing_period: BillingPeriod;
  features: string[];
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id?: string;
  plan?: SubscriptionPlan; // Legacy - for backward compatibility
  status: SubscriptionStatus;
  // New fields matching backend structure
  plan_name?: 'trial' | 'hub' | 'edge';
  tier?: number;
  start_date?: string;
  end_date?: string;
  is_expired?: boolean;
  days_left?: number;
  // Legacy fields
  current_period_start?: string;
  current_period_end?: string;
  trial_start?: string;
  trial_end?: string;
  cancel_at_period_end: boolean;
  cancelled_at?: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionHistory {
  id: string;
  user_id: string;
  plan_id?: string;
  action: SubscriptionAction;
  previous_plan_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CheckoutData {
  planId: string;
  planName: SubscriptionPlanName;
  billingPeriod: BillingPeriod;
  price: number;
}

