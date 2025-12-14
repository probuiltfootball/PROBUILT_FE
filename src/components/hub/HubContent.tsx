"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaLock, FaPlay, FaBook, FaChartLine } from "react-icons/fa6";
import { useAppSelector } from "@/lib/store/hooks";
import { ContentService } from "@/lib/services/content.service";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { LevelProgressionService } from "@/lib/services/level-progression.service";
import type { ContentSection, ContentItem, ContentLevel } from "@/types/content.types";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";
import HubCtaSection from "./HubCtaSection";

const levelLabels: Record<ContentLevel, string> = {
  free: "Free",
  hub_starter: "Hub Starter",
  hub_elite: "Hub Elite",
  edge: "Edge",
};

const contentTypeIcons = {
  video: FaPlay,
  article: FaBook,
  course: FaPlay,
  exercise: FaChartLine,
  drill: FaChartLine,
  analysis: FaChartLine,
};

export default function HubContent() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [userLevel, setUserLevel] = useState<ContentLevel>("free");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const userId = user?.id || null;
        const level = await ContentService.getUserContentLevel(userId);
        setUserLevel(level);

        const contentSections = await ContentService.getContentSections("hub", userId);
        setSections(contentSections);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [user, isAuthenticated]);

  const handleContentClick = (item: ContentItem) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/hub`);
      return;
    }

    // Check access
    const levelHierarchy: ContentLevel[] = ["free", "hub_starter", "hub_elite", "edge"];
    const userLevelIndex = levelHierarchy.indexOf(userLevel);
    const itemLevelIndex = levelHierarchy.indexOf(item.level);

    if (userLevelIndex < itemLevelIndex) {
      // Redirect to membership page to upgrade
      router.push("/membership");
      return;
    }

    // TODO: Navigate to content viewer page
    console.log("View content:", item.id);
  };

  const getLevelBadgeColor = (level: ContentLevel) => {
    switch (level) {
      case "free":
        return "bg-gray-600";
      case "hub_starter":
        return "bg-green-600";
      case "hub_elite":
        return "bg-blue-600";
      case "edge":
        return "bg-yellow-600";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#2E2E2E] py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#2E2E2E] py-20 px-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-[#1a1a1a] to-[#2E2E2E] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            ProBuilt Hub
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Elevate your game through expert digital coaching
          </p>
          {isAuthenticated && (
            <div className="inline-flex items-center gap-2 bg-[#2E2E2E] px-4 py-2 rounded-full border border-[#00FFC230]">
              <span className="text-gray-300">Your Plan:</span>
              <span className={`px-3 py-1 rounded-full text-white font-semibold ${getLevelBadgeColor(userLevel)}`}>
                {levelLabels[userLevel]}
              </span>
            </div>
          )}
        </motion.div>

        {/* Content Sections */}
        {sections.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No content available at the moment.</p>
            {!isAuthenticated && (
              <button
                onClick={() => router.push("/signup")}
                className="mt-4 bg-[#00FFC2] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00e6b8] transition-colors"
              >
                Sign Up to Access Content
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {sections.map((section, sectionIndex) => {
              const levelHierarchy: ContentLevel[] = ["free", "hub_starter", "hub_elite", "edge"];
              const userLevelIndex = levelHierarchy.indexOf(userLevel);
              const sectionLevelIndex = levelHierarchy.indexOf(section.level);
              const hasAccess = userLevelIndex >= sectionLevelIndex;

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="bg-[#2E2E2E] rounded-2xl p-8 border-2 border-[#00FFC230]"
                >
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-white">{section.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getLevelBadgeColor(section.level)}`}>
                          {levelLabels[section.level]}
                        </span>
                        {section.level === 'hub_elite' && section.is_locked && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
                            Locked - Complete Starter First
                          </span>
                        )}
                      </div>
                      {section.description && (
                        <p className="text-gray-400">{section.description}</p>
                      )}
                      {section.is_locked && section.lock_reason && (
                        <p className="text-orange-400 text-sm mt-2">
                          🔒 {section.lock_reason}
                        </p>
                      )}
                    </div>
                    {!hasAccess && isAuthenticated && (
                      <button
                        onClick={() => router.push("/membership")}
                        className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                      >
                        <FaLock className="w-4 h-4" />
                        Upgrade to Access
                      </button>
                    )}
                  </div>

                  {/* Content Items Grid */}
                  {section.items && section.items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {section.items.map((item) => {
                        const Icon = contentTypeIcons[item.content_type] || FaPlay;
                        const itemLevelIndex = levelHierarchy.indexOf(item.level);
                        const itemHasAccess = userLevelIndex >= itemLevelIndex;

                        return (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            className={`bg-[#1a1a1a] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                              itemHasAccess
                                ? "border-[#00FFC230] hover:border-[#00FFC2]"
                                : "border-gray-700 opacity-60"
                            }`}
                            onClick={() => handleContentClick(item)}
                          >
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-gray-800">
                              {item.thumbnail_url ? (
                                <img
                                  src={item.thumbnail_url}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Icon className="w-12 h-12 text-gray-600" />
                                </div>
                              )}
                              {!itemHasAccess && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <FaLock className="w-8 h-8 text-white" />
                                </div>
                              )}
                              {item.is_featured && (
                                <div className="absolute top-2 right-2 bg-[#00FFC2] text-black px-2 py-1 rounded text-xs font-bold">
                                  Featured
                                </div>
                              )}
                            </div>

                            {/* Content Info */}
                            <div className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-4 h-4 text-[#00FFC2]" />
                                <span className="text-xs text-gray-400 uppercase">
                                  {item.content_type}
                                </span>
                                {item.duration_minutes && (
                                  <span className="text-xs text-gray-500">
                                    • {item.duration_minutes} min
                                  </span>
                                )}
                              </div>
                              <h3 className="text-white font-semibold mb-1 line-clamp-2">
                                {item.title}
                              </h3>
                              {item.description && (
                                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                  {item.description}
                                </p>
                              )}
                              {!itemHasAccess && (
                                <div className="flex items-center gap-2 text-xs text-yellow-400">
                                  <FaLock className="w-3 h-3" />
                                  <span>Requires {levelLabels[item.level]}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <p>No content in this section yet.</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Call to Action Section */}
        <HubCtaSection 
          isAuthenticated={isAuthenticated} 
          userLevel={userLevel}
          userId={user?.id}
          router={router}
        />
      </div>
    </div>
  );
}

