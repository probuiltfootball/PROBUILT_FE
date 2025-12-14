'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { FaVideo, FaTrophy, FaCalendar, FaUsers } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CoachDashboard() {
  const { profile, coachProfile } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const basePath = '/dashboard/coach';

  const stats = [
    {
      label: 'Total Sessions',
      value: coachProfile?.total_sessions || 0,
      icon: FaCalendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/30',
    },
    {
      label: 'Rating',
      value: coachProfile?.rating ? `${coachProfile.rating.toFixed(1)}/5` : 'N/A',
      icon: FaTrophy,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/30',
    },
    {
      label: 'Pending Feedback',
      value: 0, // TODO: Get from API
      icon: FaVideo,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/30',
    },
    {
      label: 'Active Players',
      value: 0, // TODO: Get from API
      icon: FaUsers,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/30',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, Coach {profile?.full_name || 'Coach'}! 👋
        </h1>
        <p className="text-gray-400">
          Manage your sessions, provide feedback, and help players develop.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-[#2E2E2E] border ${stat.borderColor} rounded-xl p-6 ${stat.bgColor}`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`${stat.color} text-2xl`} />
                <span className={`${stat.color} text-3xl font-bold`}>
                  {stat.value}
                </span>
              </div>
              <h3 className="text-gray-300 font-medium">{stat.label}</h3>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pending Feedback */}
        <div className="bg-[#2E2E2E] border border-[#00FFC230] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Pending Feedback</h2>
            <Link
              href={`${basePath}/videos`}
              className="text-[#00FFC2] hover:text-[#00E0AA] text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="text-center py-8 text-gray-400">
            <FaVideo size={48} className="mx-auto mb-4 opacity-50" />
            <p>No pending feedback</p>
            <Link
              href={`${basePath}/videos`}
              className="mt-4 inline-block px-4 py-2 bg-[#00FFC2] text-black rounded-lg font-medium hover:bg-[#00E0AA] transition-colors"
            >
              Review Videos
            </Link>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-[#2E2E2E] border border-[#00FFC230] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Active Sessions</h2>
            <Link
              href={`${basePath}/sessions`}
              className="text-[#00FFC2] hover:text-[#00E0AA] text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="text-center py-8 text-gray-400">
            <FaCalendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>No active sessions</p>
            <Link
              href={`${basePath}/sessions/create`}
              className="mt-4 inline-block px-4 py-2 bg-[#00FFC2] text-black rounded-lg font-medium hover:bg-[#00E0AA] transition-colors"
            >
              Create Session
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#2E2E2E] border border-[#00FFC230] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-400">
          <p>No recent activity</p>
        </div>
      </div>
    </div>
  );
}

