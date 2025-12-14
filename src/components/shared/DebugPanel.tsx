'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { SubscriptionEdgeService } from '@/lib/services/subscription-edge.service';
import type { ActivePlan } from '@/types/subscription.types';
import { FaBug, FaTimes, FaUser, FaEnvelope, FaCrown, FaCalendar } from 'react-icons/fa';

export default function DebugPanel() {
  const { user, profile, isAuthenticated } = useAppSelector((state) => state.auth);
  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivePlan = async () => {
      if (isAuthenticated) {
        try {
          const plan = await SubscriptionEdgeService.getActivePlan();
          setActivePlan(plan);
        } catch (error) {
          console.error('Failed to load active plan:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadActivePlan();
  }, [isAuthenticated]);

  if (!isAuthenticated || !user || !profile) {
    return null;
  }

  const getDaysLeft = () => {
    if (!activePlan?.days_left) return null;
    return activePlan.days_left;
  };

  const getRegistrationDate = () => {
    if (!user.created_at) return 'N/A';
    return new Date(user.created_at).toLocaleDateString();
  };

  const getPlanDisplay = () => {
    if (!activePlan?.plan) return 'No Active Plan';
    const planName = activePlan.plan.charAt(0).toUpperCase() + activePlan.plan.slice(1);
    if (activePlan.is_expired) {
      return `${planName} (Expired)`;
    }
    return planName;
  };

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-[#00FFC2] text-black rounded-full flex items-center justify-center shadow-lg hover:bg-[#00E0AA] transition-colors"
        aria-label="Toggle debug panel"
      >
        <FaBug size={20} />
      </button>

      {/* Debug Panel - Sticky */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-80 max-h-[600px] overflow-y-auto bg-[#1A1A1A] border-2 border-[#00FFC2] rounded-lg shadow-2xl">
          <div className="sticky top-0 bg-[#2E2E2E] border-b border-[#00FFC230] p-4 flex items-center justify-between">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <FaBug className="text-[#00FFC2]" />
              Debug Info
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close debug panel"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* User Info */}
            <div className="space-y-2">
              <h4 className="text-[#00FFC2] text-xs font-semibold uppercase tracking-wide">
                User Information
              </h4>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <FaUser className="text-[#00FFC2] w-4" />
                  <span className="font-medium">Name:</span>
                  <span className="text-white">{profile.full_name || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <FaEnvelope className="text-[#00FFC2] w-4" />
                  <span className="font-medium">Email:</span>
                  <span className="text-white text-xs break-all">{profile.email || user.email || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <FaUser className="text-[#00FFC2] w-4" />
                  <span className="font-medium">Type:</span>
                  <span className="text-white capitalize">
                    {(profile as any).user_type || profile.role || 'player'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <FaCalendar className="text-[#00FFC2] w-4" />
                  <span className="font-medium">Registered:</span>
                  <span className="text-white">{getRegistrationDate()}</span>
                </div>
              </div>
            </div>

            {/* Subscription Info */}
            <div className="space-y-2 pt-2 border-t border-gray-700">
              <h4 className="text-[#00FFC2] text-xs font-semibold uppercase tracking-wide">
                Subscription
              </h4>

              {loading ? (
                <div className="text-gray-400 text-sm">Loading...</div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaCrown className="text-yellow-400 w-4" />
                    <span className="font-medium">Plan:</span>
                    <span className="text-white">{getPlanDisplay()}</span>
                  </div>

                  {activePlan?.tier && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="font-medium">Tier:</span>
                      <span className="text-white">{activePlan.tier} (1=Trial, 2=Hub, 3=Edge)</span>
                    </div>
                  )}

                  {activePlan?.plan === 'trial' && !activePlan.is_expired && (
                    <>
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="font-medium">Trial Status:</span>
                        <span className="text-yellow-400 font-semibold">Active</span>
                      </div>
                      {getDaysLeft() !== null && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <span className="font-medium">Days Left:</span>
                          <span className="text-yellow-400 font-semibold">
                            {getDaysLeft()} / 14 days
                          </span>
                        </div>
                      )}
                      {activePlan.end_date && (
                        <div className="flex items-center gap-2 text-gray-300 text-xs">
                          <span className="font-medium">Ends:</span>
                          <span className="text-white">
                            {new Date(activePlan.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {activePlan?.is_expired && (
                    <div className="flex items-center gap-2 text-red-400">
                      <span className="font-medium">Status:</span>
                      <span className="font-semibold">Expired</span>
                    </div>
                  )}

                  {activePlan?.start_date && (
                    <div className="flex items-center gap-2 text-gray-300 text-xs">
                      <span className="font-medium">Started:</span>
                      <span className="text-white">
                        {new Date(activePlan.start_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-2 pt-2 border-t border-gray-700">
              <h4 className="text-[#00FFC2] text-xs font-semibold uppercase tracking-wide">
                Additional Info
              </h4>
              <div className="space-y-1 text-xs text-gray-400">
                <div>User ID: {user.id.substring(0, 8)}...</div>
                {activePlan && (
                  <div>Plan: {JSON.stringify(activePlan, null, 2)}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

