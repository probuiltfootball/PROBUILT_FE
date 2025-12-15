'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { SubscriptionService } from '@/lib/services/subscription.service';
import { ContentService } from '@/lib/services/content.service';
import type { ContentSection } from '@/types/content.types';
import type { UserSubscription } from '@/types/subscription.types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Link from 'next/link';
import { FaLock, FaCheckCircle, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function TrialContentPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        // Load subscription
        const sub = await SubscriptionService.getUserSubscription(user.id);
        setSubscription(sub);

        // Load free content (trial users only get free content)
        const sections = await ContentService.getContentSections('hub', user.id);
        setContentSections(sections);
      } catch (error) {
        console.error('Failed to load trial content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getTrialDaysRemaining = () => {
    if (!subscription?.trial_end) return null;
    const days = Math.ceil(
      (new Date(subscription.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days > 0 ? days : 0;
  };

  const trialDays = getTrialDaysRemaining();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FaClock className="text-yellow-400 text-3xl" />
          <h1 className="text-4xl font-bold text-white">My Trial</h1>
        </div>
        <p className="text-gray-300 text-lg">
          Explore free content during your 14-day trial period
        </p>
      </div>

      {/* Trial Status Card */}
      {subscription?.status === 'trial' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 border-2 border-yellow-400 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Trial Active</h2>
              <p className="text-gray-300">
                {trialDays !== null && trialDays > 0
                  ? `${trialDays} days remaining in your trial`
                  : 'Your trial has ended'}
              </p>
              {subscription.trial_end && (
                <p className="text-gray-400 text-sm mt-1">
                  Trial ends: {new Date(subscription.trial_end).toLocaleDateString()}
                </p>
              )}
            </div>
            <Link
              href="/membership"
              className="px-6 py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors"
            >
              Upgrade Now
            </Link>
          </div>
        </motion.div>
      )}

      {/* Content Sections */}
      <div className="space-y-6">
        {contentSections.length > 0 ? (
          contentSections.map((section, index) => {
            const isLocked = section.is_locked || section.level !== 'free';
            
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-[#2E2E2E] rounded-xl p-6 border-2 ${
                  isLocked ? 'border-gray-700 opacity-60' : 'border-[#00FFC230]'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {section.name}
                    </h3>
                    {section.description && (
                      <p className="text-gray-300">{section.description}</p>
                    )}
                  </div>
                  {isLocked ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <FaLock />
                      <span className="text-sm">Locked</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400">
                      <FaCheckCircle />
                      <span className="text-sm">Available</span>
                    </div>
                  )}
                </div>

                {isLocked && section.lock_reason && (
                  <div className="mt-4 p-4 bg-[#1A1A1A] rounded-lg border border-yellow-400/30">
                    <p className="text-yellow-400 text-sm mb-2">
                      🔒 {section.lock_reason}
                    </p>
                    <Link
                      href="/membership"
                      className="text-[#00FFC2] text-sm font-medium hover:underline"
                    >
                      Upgrade to unlock this content →
                    </Link>
                  </div>
                )}

                {!isLocked && section.items && section.items.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-[#1A1A1A] rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <p className="text-white font-medium">{item.title}</p>
                          {item.description && (
                            <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                          )}
                        </div>
                        <span className="text-green-400 text-sm">Free</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-[#2E2E2E] rounded-xl border border-[#00FFC230]">
            <p className="text-gray-400 mb-4">No content available at this time.</p>
            <Link
              href="/membership"
              className="inline-block px-6 py-3 rounded-lg bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors"
            >
              View Plans
            </Link>
          </div>
        )}
      </div>

      {/* Upgrade CTA */}
      {subscription?.status === 'trial' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center bg-gradient-to-r from-[#00FFC2]/10 to-[#00E0AA]/10 border-2 border-[#00FFC2] rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Unlock Full Access
          </h3>
          <p className="text-gray-300 mb-6">
            Upgrade to Hub or Edge to access all training content, videos, and exclusive features.
          </p>
          <Link
            href="/membership"
            className="inline-block px-8 py-3 rounded-lg bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors"
          >
            View Plans & Upgrade
          </Link>
        </motion.div>
      )}
    </div>
  );
}

