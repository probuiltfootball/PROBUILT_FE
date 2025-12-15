'use client';

import { useAppSelector } from '@/lib/store/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { FaEdit, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaCoins } from 'react-icons/fa';
import { format } from 'date-fns';

export default function ProfileView() {
  const { profile, playerProfile, coachProfile } = useAppSelector(
    (state) => state.auth
  );

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <Link
          href="/dashboard/profile/edit"
          className="flex items-center gap-2 px-4 py-2 bg-[#00FFC2] text-black rounded-lg font-medium hover:bg-[#00E0AA] transition-colors"
        >
          <FaEdit size={14} />
          Edit Profile
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-[#2E2E2E] border border-[#00FFC230] rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[#00FFC2] flex items-center justify-center">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-black font-bold text-4xl">
                  {profile.full_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              {profile.full_name}
            </h2>
            <div className="inline-block px-3 py-1 bg-[#00FFC2]/20 text-[#00FFC2] rounded-full text-sm font-medium mb-4">
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </div>

            <div className="space-y-3">
              {profile.email && (
                <div className="flex items-center gap-3 text-gray-300">
                  <FaEnvelope size={16} className="text-[#00FFC2]" />
                  <span>{profile.email}</span>
                </div>
              )}

              {profile.phone_number && (
                <div className="flex items-center gap-3 text-gray-300">
                  <FaPhone size={16} className="text-[#00FFC2]" />
                  <span>{profile.phone_number}</span>
                </div>
              )}

              {(profile.city || profile.country) && (
                <div className="flex items-center gap-3 text-gray-300">
                  <FaMapMarkerAlt size={16} className="text-[#00FFC2]" />
                  <span>
                    {[profile.city, profile.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}

              {profile.date_of_birth && (
                <div className="flex items-center gap-3 text-gray-300">
                  <FaCalendar size={16} className="text-[#00FFC2]" />
                  <span>
                    {format(new Date(profile.date_of_birth), 'MMMM d, yyyy')}
                  </span>
                </div>
              )}

              {profile.bio && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-300">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific Profile */}
      {profile.role === 'player' && playerProfile && (
        <div className="bg-[#2E2E2E] border border-[#00FFC230] rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Player Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-400">Position</label>
              <p className="text-white font-medium">
                {playerProfile.position || 'Not set'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Preferred Foot</label>
              <p className="text-white font-medium">
                {playerProfile.preferred_foot || 'Not set'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Skill Level</label>
              <p className="text-white font-medium">
                {playerProfile.skill_level
                  ? playerProfile.skill_level.charAt(0).toUpperCase() +
                    playerProfile.skill_level.slice(1)
                  : 'Not set'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Pro Points</label>
              <div className="flex items-center gap-2">
                <FaCoins className="text-yellow-400" />
                <p className="text-white font-medium">
                  {playerProfile.total_pro_points || 0}
                </p>
              </div>
            </div>
            {playerProfile.current_club && (
              <div>
                <label className="text-sm text-gray-400">Current Club</label>
                <p className="text-white font-medium">
                  {playerProfile.current_club}
                </p>
              </div>
            )}
            {playerProfile.height_cm && (
              <div>
                <label className="text-sm text-gray-400">Height</label>
                <p className="text-white font-medium">
                  {playerProfile.height_cm} cm
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {profile.role === 'coach' && coachProfile && (
        <div className="bg-[#2E2E2E] border border-[#00FFC230] rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Coach Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-400">Rating</label>
              <p className="text-white font-medium">
                {coachProfile.rating ? `${coachProfile.rating.toFixed(1)}/5` : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Total Sessions</label>
              <p className="text-white font-medium">
                {coachProfile.total_sessions || 0}
              </p>
            </div>
            {coachProfile.years_experience && (
              <div>
                <label className="text-sm text-gray-400">Years Experience</label>
                <p className="text-white font-medium">
                  {coachProfile.years_experience} years
                </p>
              </div>
            )}
            {coachProfile.specializations && coachProfile.specializations.length > 0 && (
              <div>
                <label className="text-sm text-gray-400">Specializations</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {coachProfile.specializations.map((spec: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#00FFC2]/20 text-[#00FFC2] rounded-full text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {coachProfile.bio_extended && (
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400">Bio</label>
                <p className="text-white mt-2">{coachProfile.bio_extended}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

