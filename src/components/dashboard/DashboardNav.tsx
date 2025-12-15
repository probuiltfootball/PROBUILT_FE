'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/lib/store/hooks';
import {
  FaHome,
  FaVideo,
  FaTrophy,
  FaCalendar,
  FaUser,
  FaCog,
} from 'react-icons/fa';

const getPlayerNavItems = (basePath: string) => [
  { href: `${basePath}`, label: 'Home', icon: FaHome },
  { href: '/dashboard/content/hub', label: 'Hub Content', icon: FaVideo },
  { href: '/dashboard/content/edge', label: 'Edge Content', icon: FaVideo },
  { href: `${basePath}/challenges`, label: 'Challenges', icon: FaTrophy },
  { href: `${basePath}/sessions`, label: 'Sessions', icon: FaCalendar },
  { href: '/dashboard/profile', label: 'Profile', icon: FaUser },
];

const getCoachNavItems = (basePath: string) => [
  { href: `${basePath}`, label: 'Home', icon: FaHome },
  { href: `${basePath}/videos`, label: 'Videos', icon: FaVideo },
  { href: `${basePath}/challenges`, label: 'Challenges', icon: FaTrophy },
  { href: `${basePath}/sessions`, label: 'Sessions', icon: FaCalendar },
  { href: '/dashboard/profile', label: 'Profile', icon: FaUser },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const { profile } = useAppSelector((state) => state.auth);

  const basePath = profile?.role === 'coach' ? '/dashboard/coach' : '/dashboard/player';
  const navItems =
    profile?.role === 'coach' ? getCoachNavItems(basePath) : getPlayerNavItems(basePath);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#2E2E2E] border-b border-[#00FFC230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              ProBuilt <span className="text-[#00FFC2]">Dashboard</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#00FFC2]/10 text-[#00FFC2]'
                      : 'text-gray-300 hover:bg-[#00FFC210] hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <FaCog size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

