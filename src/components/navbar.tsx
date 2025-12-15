"use client";

import { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { useAppSelector } from "@/lib/store/hooks";
import UserMenu from "@/components/shared/UserMenu";

const Link = NextLink;
import SiteLogo from "@/assets/figma/logo2.png";
import { FaTimes, FaBars } from "react-icons/fa";
import { Button } from "./ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, profile } = useAppSelector((state) => state.auth);

  // Get subscription plan from profile (preferred) or fallback to user_metadata
  // Profile subscription is available from user-profile Edge Function
  const subscription = profile?.subscription;
  const userRole = profile?.role || user?.user_metadata?.role || 'player';

  // Fallback: If profile subscription not available, check user_metadata (legacy)
  // Get plan from metadata (already normalized to 'trial' in signup)
  const metadataPlan = user?.user_metadata?.plan;
  const normalizedMetadataPlan = metadataPlan === 'free_trial' ? 'trial' : metadataPlan; // Backward compatibility

  // Use profile subscription if available, otherwise fallback to metadata
  // For metadata fallback, assume not expired (since we don't have expiry info)
  const plan = subscription?.plan || (normalizedMetadataPlan as 'trial' | 'hub' | 'edge' | null) || null;
  const isExpired = subscription ? subscription.plan_expired : false;

  // Determine which links to show based on subscription and role
  // Rules:
  // 1. Public Hub/Edge links: Only show for logged out users
  // 2. Dashboard link text: Changes based on plan (MyTrial, MyHub, MyEdge)
  // 3. Hide public Hub/Edge when user is logged in

  const isPlayer = userRole === 'player';
  const hasActivePlan = plan && !isExpired;

  // Public links: Only show for logged out users
  const showPublicHub = !isAuthenticated;
  const showPublicEdge = !isAuthenticated;

  // Dashboard link text and visibility based on plan and role
  const getDashboardLinkText = () => {
    if (!isAuthenticated || !isPlayer || !hasActivePlan) return null;

    switch (plan) {
      case 'trial':
        return 'MyTrial';
      case 'hub':
        return 'MyHub';
      case 'edge':
        return 'MyEdge';
      default:
        return 'Dashboard';
    }
  };

  const dashboardLinkText = getDashboardLinkText();
  const showDashboard = isAuthenticated && isPlayer && hasActivePlan;

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 h-[150px] bg-black border-b border-gray-800">
      <div className="max-w-[1280px] mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 ">
            <div className="flex items-center justify-center p-1.5 ml-1">
              <Image
                src={SiteLogo}
                alt="ProBuilt Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="text-white text-lg md:text-3xl font-semibold relative">
              ProBuilt Football
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {showPublicHub && (
            <Link
              href="/hub"
              className="text-white font-medium text-[20px]! md:text-base hover:text-[#00FFC2] transition-colors"
            >
              Hub
            </Link>
          )}

          {showPublicEdge && (
            <Link
              href="/edge"
              className="text-white font-medium text-[20px]! md:text-base hover:text-[#00FFC2] transition-colors"
            >
              Edge
            </Link>
          )}

          {/* Membership/Plans link - visible to all users */}
          {!isAuthenticated && (
            <Link
              href="/membership"
              className="text-white font-medium text-[20px]! md:text-base hover:text-[#00FFC2] transition-colors"
            >
              Plans
            </Link>
          )}

          {/* Dashboard link with dynamic text based on plan */}
          {showDashboard && dashboardLinkText && (
            <Link
              href="/dashboard"
              className="text-white font-medium text-[20px]! md:text-base hover:text-[#00FFC2] transition-colors"
            >
              {dashboardLinkText}
            </Link>
          )}

          <Link
            href="/community"
            className="text-white font-medium text-[20px]! md:text-base hover:text-[#00FFC2] transition-colors"
          >
            Community
          </Link>

          <Link
            href="/pb-points"
            className="text-white font-medium text-[20px]! md:text-base hover:text-[#00FFC2] transition-colors"
          >
            PB Points
          </Link>
        </div>

        <div className="flex items-center gap-4 min-w-[200px] justify-end">
          {/* Auth State */}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Link
                href="/signup"
                className="px-4 md:px-6 py-2 rounded-full bg-[#00FFC2] text-black text-sm md:text-base font-medium hover:bg-[#00E0AA] transition-colors"
              >
                Register
              </Link>

              <Link
                href="/login"
                className="px-4 md:px-6 py-2 rounded-full border border-white bg-black text-white text-sm md:text-base font-medium hover:bg-white/10 transition-colors"
              >
                Log In
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b border-gray-800 p-4 z-40 shadow-lg">
          <div className="max-w-[1280px] mx-auto">
            <nav className="flex flex-col gap-2">
              {showPublicHub && (
                <Link
                  href="/hub"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-white hover:text-[#00FFC2] transition-colors"
                >
                  Hub
                </Link>
              )}
              {showPublicEdge && (
                <Link
                  href="/edge"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-white hover:text-[#00FFC2] transition-colors"
                >
                  Edge
                </Link>
              )}
              {/* Membership/Plans link - visible to all users */}
              <Link
                href="/membership"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-white hover:text-[#00FFC2] transition-colors"
              >
                Plans
              </Link>
              {/* Dashboard link with dynamic text based on plan */}
              {showDashboard && dashboardLinkText && (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-white hover:text-[#00FFC2] transition-colors"
                >
                  {dashboardLinkText}
                </Link>
              )}
              <Link
                href="/community"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-white hover:text-[#00FFC2] transition-colors"
              >
                Community
              </Link>
              <Link
                href="/pb-points"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-white hover:text-[#00FFC2] transition-colors"
              >
                PB Points
              </Link>
              {!isAuthenticated && (
                <>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 mt-2 rounded-full bg-[#00FFC2] text-black text-center font-medium hover:bg-[#00E0AA] transition-colors"
                  >
                    Register
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 rounded-full border border-white bg-black text-white text-center font-medium hover:bg-white/10 transition-colors"
                  >
                    Log In
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
