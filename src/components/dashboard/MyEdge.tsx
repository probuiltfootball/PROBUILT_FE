'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import type { ActivePlan } from '@/types/subscription.types';
import { ContentService } from '@/lib/services/content.service';
import type { ContentSection } from '@/types/content.types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DashboardPlans from './DashboardPlans';

interface MyEdgeProps {
  activePlan: ActivePlan | null;
}

export default function MyEdge({ activePlan }: MyEdgeProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Load edge content (tier 3 - full access) - pass user ID for proper access control
        const sections = await ContentService.getContentSections('edge', user?.id || null);
        setContentSections(sections);
      } catch (error) {
        console.error('Failed to load edge content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [user]);

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
          <div className="w-12 h-12 rounded-lg bg-[#00FFC2]/20 flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">My Edge</h1>
            <p className="text-gray-300 text-lg mt-1">
              Full access to premium coaching, insights, and exclusive content
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Status Card */}
      {activePlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#00FFC2]/10 to-[#00E0AA]/10 border-2 border-[#00FFC2] rounded-xl p-6 mb-8"
        >
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Edge Membership Active</h2>
            <p className="text-gray-300">
              {activePlan.end_date
                ? `Active until ${new Date(activePlan.end_date).toLocaleDateString()}`
                : 'Active subscription - Full access enabled'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Content Sections */}
      <div className="space-y-6">
        {contentSections.length > 0 ? (
          contentSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#2E2E2E] rounded-xl p-6 border-2 border-[#00FFC230]"
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
                <div className="flex items-center gap-2 text-green-400">
                  <FaCheckCircle />
                  <span className="text-sm">Available</span>
                </div>
              </div>

              {section.items && section.items.length > 0 && (
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
                      <span className="text-[#00FFC2] text-sm">Edge</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-[#2E2E2E] rounded-xl border border-[#00FFC230]">
            <p className="text-gray-400 mb-4">No content available at this time.</p>
          </div>
        )}
      </div>

      {/* Plans Section - Show current Edge plan (no upgrade available) */}
      <DashboardPlans 
        activePlan={activePlan} 
        currentPlanName={activePlan?.plan === 'edge' ? 'edge' : null} 
      />
    </div>
  );
}

