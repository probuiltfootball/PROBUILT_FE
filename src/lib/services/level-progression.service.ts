import { createClient } from '@/lib/supabase/client';
import type { ContentLevel } from '@/types/content.types';

// Lazy Supabase client creation - only create when needed, not at module level
function getSupabaseClient() {
  return createClient() as ReturnType<typeof createClient>;
}

export class LevelProgressionService {
  /**
   * Initialize level progress for a user
   */
  static async initializeLevelProgress(userId: string, level: 'hub_starter' | 'hub_elite') {
    // Get total content count for this level
    const supabase = getSupabaseClient();
    const { count } = await (supabase as any)
      .from('content_items')
      .select('*', { count: 'exact', head: true })
      .eq('level', level);

    const { data, error } = await (supabase as any)
      .from('user_level_progress')
      .upsert({
        user_id: userId,
        level,
        total_content_count: count || 0,
        completed_content_count: 0,
        completion_percentage: 0,
        is_completed: false,
        unlocked_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,level',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to initialize level progress: ${error.message}`);
    }

    return data;
  }

  /**
   * Update level progress when content is completed
   */
  static async updateLevelProgress(userId: string, level: ContentLevel) {
    if (level === 'free' || level === 'edge') {
      return; // Only track hub_starter and hub_elite
    }

    // Get completed content count for this level
    const supabase = getSupabaseClient();
    const { count: completedCount } = await (supabase as any)
      .from('user_content_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_completed', true)
      .in('content_item_id',
        (supabase as any)
          .from('content_items')
          .select('id')
          .eq('level', level)
      );

    // Get total content count for this level
    const { count: totalCount } = await (supabase as any)
      .from('content_items')
      .select('*', { count: 'exact', head: true })
      .eq('level', level);

    const completionPercentage = totalCount && totalCount > 0
      ? Math.round((completedCount || 0) / totalCount * 100)
      : 0;

    const isCompleted = completionPercentage >= 100;

    const { data, error } = await (supabase as any)
      .from('user_level_progress')
      .upsert({
        user_id: userId,
        level,
        completed_content_count: completedCount || 0,
        total_content_count: totalCount || 0,
        completion_percentage: completionPercentage,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      }, {
        onConflict: 'user_id,level',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update level progress: ${error.message}`);
    }

    return data;
  }

  /**
   * Check if user can access a level
   */
  static async canAccessLevel(
    userId: string | null,
    level: 'hub_starter' | 'hub_elite'
  ): Promise<{ canAccess: boolean; reason?: string }> {
    if (!userId) {
      return { canAccess: false, reason: 'Please sign up to access this level' };
    }

    // Check subscription
    const supabase = getSupabaseClient();
    const { data: subscription } = await (supabase as any)
      .from('user_subscriptions')
      .select(`
        status,
        plan:subscription_plans(name)
      `)
      .eq('user_id', userId)
      .single();

    if (!subscription || (subscription.status !== 'active' && subscription.status !== 'trial')) {
      return { canAccess: false, reason: 'Active subscription required' };
    }

    const planName = subscription.plan?.name;

    // Check if plan includes this level
    if (level === 'hub_starter') {
      if (!['hub_starter', 'hub_elite', 'edge'].includes(planName)) {
        return { canAccess: false, reason: 'Hub Starter subscription required' };
      }
      return { canAccess: true };
    }

    if (level === 'hub_elite') {
      if (!['hub_elite', 'edge'].includes(planName)) {
        return { canAccess: false, reason: 'Hub Elite subscription required' };
      }

      // Check if hub_starter is completed
      const { data: starterProgress } = await (supabase as any)
        .from('user_level_progress')
        .select('is_completed')
        .eq('user_id', userId)
        .eq('level', 'hub_starter')
        .single();

      if (!starterProgress?.is_completed) {
        return {
          canAccess: false,
          reason: 'Complete all Hub Starter content to unlock Hub Elite',
        };
      }

      return { canAccess: true };
    }

    return { canAccess: false };
  }

  /**
   * Get user's level progress
   */
  static async getUserLevelProgress(userId: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any)
      .from('user_level_progress')
      .select('*')
      .eq('user_id', userId)
      .order('level', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch level progress: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Mark content as completed and update level progress
   */
  static async markContentCompleted(
    userId: string,
    contentItemId: string
  ) {
    // Update content progress
    const supabase = getSupabaseClient();
    const { error: progressError } = await (supabase as any)
      .from('user_content_progress')
      .upsert({
        user_id: userId,
        content_item_id: contentItemId,
        is_completed: true,
        progress_percentage: 100,
        completed_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,content_item_id',
      });

    if (progressError) {
      throw new Error(`Failed to mark content completed: ${progressError.message}`);
    }

    // Get content level
    const { data: content } = await (supabase as any)
      .from('content_items')
      .select('level')
      .eq('id', contentItemId)
      .single();

    if (content?.level && ['hub_starter', 'hub_elite'].includes(content.level)) {
      // Update level progress
      await this.updateLevelProgress(userId, content.level as ContentLevel);
    }
  }
}

