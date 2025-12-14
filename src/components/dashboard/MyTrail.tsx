'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import type { ActivePlan } from '@/types/subscription.types';
import { SubscriptionEdgeService } from '@/lib/services/subscription-edge.service';
import { ContentService } from '@/lib/services/content.service';
import type { ContentSection } from '@/types/content.types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Link from 'next/link';
import { FaLock, FaCheckCircle, FaClock, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DashboardPlans from './DashboardPlans';

interface MyTrailProps {
  activePlan: ActivePlan | null;
}

export default function MyTrail({ activePlan }: MyTrailProps) {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Load free content (trial content) for registered users
        // Trial content is always accessible, even after trial expiration
        // Pass user ID so content service knows user is registered
        const sections = await ContentService.getContentSections('hub', user?.id || null);
        // Filter to only show free content (trial content is limited and static)
        const freeSections = sections.filter(
          (section) => section.level === 'free' || !section.is_locked
        );
        setContentSections(freeSections);
      } catch (error) {
        console.error('Failed to load trial content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [user]);

  const daysLeft = activePlan?.days_left ?? null;
  const isExpired = activePlan?.is_expired ?? false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FaClock className="text-yellow-400 text-3xl" />
          <h1 className="text-4xl font-bold text-white">My Trial</h1>
        </div>
        <p className="text-gray-300 text-lg">
          {isExpired 
            ? 'Trial content is always accessible - limited and static resources'
            : 'Explore free content during your 14-day trial period'}
        </p>
      </div>

      {/* Trial Status Card */}
      {activePlan?.plan === 'trial' && !isExpired && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-yellow-400/10 to-yellow-500/10 border-2 border-yellow-400 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Trial Active</h2>
              <p className="text-gray-300">
                {daysLeft !== null && daysLeft > 0
                  ? `${daysLeft} days remaining in your trial`
                  : 'Your trial has ended'}
              </p>
              {activePlan.end_date && (
                <p className="text-gray-400 text-sm mt-1">
                  Trial ends: {new Date(activePlan.end_date).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Link
                href="/checkout?plan=hub"
                className="px-6 py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors"
              >
                Upgrade to Hub
              </Link>
              <Link
                href="/checkout?plan=edge"
                className="px-6 py-3 rounded-lg bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors"
              >
                Upgrade to Edge
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Expired Trial Card */}
      {isExpired && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 border-2 border-yellow-400 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Trial Period Ended</h2>
              <p className="text-gray-300">
                Your 14-day trial has ended, but trial content remains accessible. Upgrade to Hub or Edge to unlock premium content and features.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Note: Trial content is limited and static - it will not update with new resources.
              </p>
            </div>
            <Link
              href="/membership"
              className="px-6 py-3 rounded-lg bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors"
            >
              View Plans
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
                className={`bg-[#2E2E2E] rounded-xl p-6 border-2 ${isLocked ? 'border-gray-700 opacity-60' : 'border-[#00FFC230]'
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
                      href="/checkout?plan=hub"
                      className="text-[#00FFC2] text-sm font-medium hover:underline inline-flex items-center gap-1"
                    >
                      Upgrade to unlock this content <FaArrowRight />
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
          </div>
        )}
      </div>

      {/* Plans Section - Show upgrade options for trial users */}
      <DashboardPlans 
        activePlan={activePlan} 
        currentPlanName={activePlan?.plan === 'trial' ? 'trial' : null} 
      />
    </div>
  );
}

