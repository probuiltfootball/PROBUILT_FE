/**
 * Subscription Date Calculation Utilities
 * 
 * Rules:
 * - Monthly: If subscribed on 12th day, valid until 11th of next month at midnight
 * - Yearly: If subscribed on 12th day, valid until 11th day of same month next year at midnight
 */

export type BillingPeriod = 'monthly' | 'yearly';

/**
 * Calculate subscription end date based on start date and billing period
 * 
 * @param startDate - The subscription start date
 * @param billingPeriod - 'monthly' or 'yearly'
 * @returns End date as ISO string, set to midnight (00:00:00) of the expiration day
 * 
 * @example
 * // Monthly: Subscribed on Jan 12 -> expires Feb 11 at midnight
 * calculateEndDate(new Date('2024-01-12'), 'monthly')
 * // Returns: '2024-02-11T00:00:00.000Z'
 * 
 * @example
 * // Yearly: Subscribed on Jan 12 -> expires Jan 11 next year at midnight
 * calculateEndDate(new Date('2024-01-12'), 'yearly')
 * // Returns: '2025-01-11T00:00:00.000Z'
 */
export function calculateSubscriptionEndDate(
  startDate: Date | string,
  billingPeriod: BillingPeriod
): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const startDay = start.getDate();
  
  let endDate: Date;
  
  if (billingPeriod === 'monthly') {
    // Monthly: Add 1 month, then subtract 1 day from the start day
    endDate = new Date(start);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(startDay - 1);
  } else {
    // Yearly: Add 1 year, then subtract 1 day from the start day
    endDate = new Date(start);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setDate(startDay - 1);
  }
  
  // Set to midnight (00:00:00) in UTC
  endDate.setUTCHours(0, 0, 0, 0);
  
  return endDate.toISOString();
}

/**
 * Calculate subscription end date from current date
 * 
 * @param billingPeriod - 'monthly' or 'yearly'
 * @returns End date as ISO string
 */
export function calculateEndDateFromNow(billingPeriod: BillingPeriod): string {
  return calculateSubscriptionEndDate(new Date(), billingPeriod);
}

/**
 * Get the day of month from a date
 */
export function getDayOfMonth(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getDate();
}

/**
 * Check if a subscription is expired based on end date
 * 
 * @param endDate - Subscription end date (ISO string)
 * @returns true if current date/time is past the end date
 */
export function isSubscriptionExpired(endDate: string | null): boolean {
  if (!endDate) return false;
  const end = new Date(endDate);
  const now = new Date();
  return now >= end;
}

/**
 * Calculate days remaining until subscription expires
 * 
 * @param endDate - Subscription end date (ISO string)
 * @returns Number of days remaining, or null if no end date
 */
export function calculateDaysRemaining(endDate: string | null): number | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

