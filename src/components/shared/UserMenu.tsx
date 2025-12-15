'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { signOut } from '@/lib/store/slices/auth.slice';
import { SubscriptionEdgeService } from '@/lib/services/subscription-edge.service';
import Image from 'next/image';
import Link from 'next/link';
import { FaUser, FaCog, FaSignOutAlt, FaChevronDown, FaCrown } from 'react-icons/fa';
import type { ActivePlan } from '@/types/subscription.types';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { profile, playerProfile, coachProfile, user } = useAppSelector(
    (state) => state.auth
  );

  // Load subscription info using new edge service - only when authenticated
  useEffect(() => {
    const loadActivePlan = async () => {
      // Only call API if user is authenticated
      if (!user) {
        setActivePlan(null);
        return;
      }

      try {
        const plan = await SubscriptionEdgeService.getActivePlan();
        setActivePlan(plan);
      } catch (error) {
        console.error('Failed to load active plan:', error);
        setActivePlan(null);
      }
    };
    loadActivePlan();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Check if current route is a public route
   * Public routes: /, /hub, /edge, /community, /pb-points, /membership, /login, /signup, /verify-email, /checkout
   * Secure routes: /dashboard/*, /auth/*
   */
  const isPublicRoute = (path: string): boolean => {
    const publicRoutes = [
      '/',
      '/hub',
      '/edge',
      '/community',
      '/pb-points',
      '/membership',
      '/login',
      '/signup',
      '/verify-email',
      '/checkout',
    ];

    // Check exact matches
    if (publicRoutes.includes(path)) {
      return true;
    }

    // Check if it's a secure route (dashboard or auth)
    if (path.startsWith('/dashboard') || path.startsWith('/auth')) {
      return false;
    }

    // Default to public for other routes
    return true;
  };

  const handleSignOut = async () => {
    try {
      setIsOpen(false);
      await dispatch(signOut()).unwrap();

      // Use replace instead of push to prevent back button issues
      // and ensure proper navigation away from protected routes
      router.replace('/');
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, redirect to home
      router.replace('/');
    }
  };

  const getDashboardPath = () => {
    if (!profile) return '/dashboard';
    return `/dashboard/${profile.role}`;
  };

  const getProfilePath = () => {
    return '/dashboard/profile';
  };

  const getSettingsPath = () => {
    return '/dashboard/settings';
  };

  const getDisplayName = () => {
    return profile?.full_name || 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarUrl = () => {
    return profile?.avatar_url || '/default-avatar.png';
  };

  const getPlanDisplayName = () => {
    if (!activePlan?.plan) return null;
    const planName = activePlan.plan.charAt(0).toUpperCase() + activePlan.plan.slice(1);
    return planName;
  };

  const getPlanStatus = () => {
    if (!activePlan) return null;
    if (activePlan.plan === 'trial' && !activePlan.is_expired) {
      return 'Trial';
    }
    if (activePlan.is_expired) {
      return 'Expired';
    }
    return 'Active';
  };

  const getDaysLeft = () => {
    if (!activePlan?.days_left) return null;
    return activePlan.days_left;
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="relative min-w-1/3" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#00FFC210] transition-colors"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <Link
          href={getProfilePath()}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-linear-to-br from-[#00FFC2] to-[#00E0AA] flex items-center justify-center border-2 border-[#00FFC2]/50">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={getDisplayName()}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-black font-bold text-sm">
                {getInitials()}
              </span>
            )}
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-white capitalize font-medium text-sm max-w-[120px] truncate">
              {getDisplayName()}
            </span>
            {activePlan?.plan && (
              <span className="text-[#00FFC2] text-xs font-medium flex items-center gap-1">
                <FaCrown size={10} />
                {getPlanDisplayName()}
                {activePlan.plan === 'trial' && !activePlan.is_expired && ' (Trial)'}
              </span>
            )}
          </div>
        </Link>
        <FaChevronDown
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''
            }`}
          size={12}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#2E2E2E] border border-[#00FFC230] rounded-lg shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-linear-to-br from-[#00FFC2] to-[#00E0AA] flex items-center justify-center border-2 border-[#00FFC2]/50">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={getDisplayName()}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-black font-bold">
                    {getInitials()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{getDisplayName()}</p>
                <p className="text-gray-400 text-xs truncate">{profile.email}</p>
              </div>
            </div>
            {activePlan?.plan && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Current Plan</span>
                  <span className="text-[#00FFC2] text-xs font-semibold flex items-center gap-1">
                    <FaCrown size={10} />
                    {getPlanDisplayName()}
                  </span>
                </div>
                {activePlan.plan === 'trial' && !activePlan.is_expired && (
                  <>
                    {getDaysLeft() !== null && (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-400 text-xs">Days Left</span>
                        <span className="text-yellow-400 text-xs font-semibold">
                          {getDaysLeft()} / 14 days
                        </span>
                      </div>
                    )}
                    {activePlan.end_date && (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-400 text-xs">Trial ends</span>
                        <span className="text-yellow-400 text-xs">
                          {new Date(activePlan.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {activePlan.is_expired && (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-400 text-xs">Status</span>
                    <span className="text-red-400 text-xs font-semibold">
                      Expired
                    </span>
                  </div>
                )}
              </div>
            )}
            {playerProfile && (
              <p className="text-[#00FFC2] text-xs mt-2">
                {playerProfile.total_pro_points} Pro Points
              </p>
            )}
          </div>

          <nav className="py-2">
            <Link
              href={getDashboardPath()}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#00FFC210] hover:text-[#00FFC2] transition-colors"
            >
              <FaUser size={14} />
              <span>Dashboard</span>
            </Link>

            <Link
              href={getProfilePath()}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#00FFC210] hover:text-[#00FFC2] transition-colors"
            >
              <FaUser size={14} />
              <span>Profile</span>
            </Link>

            <Link
              href={getSettingsPath()}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#00FFC210] hover:text-[#00FFC2] transition-colors"
            >
              <FaCog size={14} />
              <span>Settings</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <FaSignOutAlt size={14} />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

