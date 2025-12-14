'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { SubscriptionService } from '@/lib/services/subscription.service';
import type { UserSubscription } from '@/types/subscription.types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { FaCrown, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscription = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const sub = await SubscriptionService.getUserSubscription(user.id);
        setSubscription(sub);
      } catch (error) {
        console.error('Failed to load subscription:', error);
        // Don't throw error, just set subscription to null
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getStatusIcon = () => {
    if (!subscription) return <FaTimesCircle className="text-gray-400" />;

    switch (subscription.status) {
      case 'trial':
        return <FaClock className="text-yellow-400" />;
      case 'active':
        return <FaCheckCircle className="text-green-400" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-400" />;
      case 'expired':
        return <FaTimesCircle className="text-gray-400" />;
      default:
        return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusText = () => {
    if (!subscription) return 'No Active Subscription';

    switch (subscription.status) {
      case 'trial':
        return 'Trial Active';
      case 'active':
        return 'Active';
      case 'cancelled':
        return 'Cancelled';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

      {/* Subscription Section */}
      <div className="bg-[#2E2E2E] rounded-xl p-8 border border-[#00FFC230] mb-8">
        <div className="flex items-center gap-3 mb-6">
          <FaCrown className="text-[#00FFC2] text-2xl" />
          <h2 className="text-2xl font-bold text-white">Subscription</h2>
        </div>

        {subscription ? (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg">
              <div>
                <p className="text-gray-400 text-sm mb-1">Current Plan</p>
                <p className="text-white text-xl font-semibold">
                  {subscription.plan?.display_name || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className="text-white font-semibold">{getStatusText()}</span>
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#1A1A1A] rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Plan Name</p>
                <p className="text-white font-medium">
                  {subscription.plan?.name === 'hub' ? 'Hub' :
                    subscription.plan?.name === 'edge' ? 'Edge' :
                      subscription.plan?.display_name || 'N/A'}
                </p>
              </div>

              <div className="p-4 bg-[#1A1A1A] rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Price</p>
                <p className="text-white font-medium">
                  {subscription.plan?.price_monthly
                    ? `$${subscription.plan.price_monthly}/month`
                    : 'Free'}
                </p>
              </div>
            </div>

            {/* Trial Information */}
            {subscription.status === 'trial' && subscription.trial_end && (
              <div className="p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                <p className="text-yellow-400 text-sm mb-1">Trial Ends</p>
                <p className="text-white font-semibold">
                  {formatDate(subscription.trial_end)}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  {Math.ceil((new Date(subscription.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                </p>
              </div>
            )}

            {/* Subscription Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#1A1A1A] rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Started</p>
                <p className="text-white font-medium">
                  {formatDate(subscription.created_at)}
                </p>
              </div>

              {subscription.current_period_end && (
                <div className="p-4 bg-[#1A1A1A] rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Current Period Ends</p>
                  <p className="text-white font-medium">
                    {formatDate(subscription.current_period_end)}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/membership"
                className="flex-1 px-6 py-3 rounded-lg bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors text-center"
              >
                {subscription.status === 'trial' ? 'Upgrade Plan' : 'Manage Subscription'}
              </Link>
              {subscription.status === 'trial' && (
                <Link
                  href="/dashboard/content/trial"
                  className="flex-1 px-6 py-3 rounded-lg border border-[#00FFC2] text-[#00FFC2] font-semibold hover:bg-[#00FFC2]/10 transition-colors text-center"
                >
                  View Trial Content
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-6">You don't have an active subscription.</p>
            <Link
              href="/membership"
              className="inline-block px-6 py-3 rounded-lg bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors"
            >
              View Plans
            </Link>
          </div>
        )}
      </div>

      {/* Account Settings Section */}
      <div className="bg-[#2E2E2E] rounded-xl p-8 border border-[#00FFC230]">
        <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
        <div className="space-y-4">
          <div className="p-4 bg-[#1A1A1A] rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Email</p>
            <p className="text-white">{user?.email || 'N/A'}</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/dashboard/profile"
              className="px-6 py-3 rounded-lg border border-gray-600 text-white font-medium hover:border-[#00FFC2] transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

