import { createClient } from '@/lib/supabase/client';
import type {
  ContentItem,
  ContentSection,
  ContentLevel,
  ContentType,
  ContentPage,
  UserContentProgress,
  ContentAccessInfo,
} from '@/types/content.types';
import { SubscriptionEdgeService } from './subscription-edge.service';

const supabase = createClient() as ReturnType<typeof createClient>;

export class ContentService {
  /**
   * Get user's current content access level based on subscription
   * Trial users always get free content access (even after expiration) - limited and static content
   * All registered users automatically get a 14-day trial on signup, so trial content is never locked
   */
  static async getUserContentLevel(userId: string | null): Promise<ContentLevel> {
    if (!userId) {
      return 'free';
    }

    // Use new Edge Service for subscription data
    const activePlan = await SubscriptionEdgeService.getActivePlan();
    
    // IMPORTANT: All registered users automatically get a 14-day trial on signup
    // Trial content should ALWAYS be accessible, even after trial expiration
    // Trial content is limited and static, but never locked for registered users
    
    // Check if user has an active paid subscription (hub or edge)
    if (activePlan?.plan && !activePlan.plan_expired && activePlan.plan !== 'trial') {
      // User has active paid subscription - give them that level
      // But they still have access to trial content (free level)
      switch (activePlan.plan) {
        case 'hub':
          return 'hub_elite';
        case 'edge':
          return 'edge';
        default:
          return 'free'; // Fallback to free (trial content)
      }
    }

    // For all other cases (trial active, trial expired, or no plan):
    // Registered users always get free level access (trial content)
    // This ensures trial content is never locked, even after expiration
    return 'free';
  }

  /**
   * Check if user has access to a specific content level
   * For hub_elite, also checks if hub_starter is completed
   */
  static async hasContentAccess(
    userId: string | null,
    requiredLevel: ContentLevel
  ): Promise<ContentAccessInfo> {
    if (!userId) {
      return {
        hasAccess: requiredLevel === 'free',
        requiredLevel,
        currentLevel: 'free',
        message: requiredLevel === 'free' ? undefined : 'Please sign up to access this content.',
      };
    }

    const userLevel = await this.getUserContentLevel(userId);
    const levelHierarchy: ContentLevel[] = ['free', 'hub_starter', 'hub_elite', 'edge'];
    const userLevelIndex = levelHierarchy.indexOf(userLevel);
    const requiredLevelIndex = levelHierarchy.indexOf(requiredLevel);

    // Check subscription access
    let hasAccess = userLevelIndex >= requiredLevelIndex;

    // Special check for hub_elite: must complete hub_starter first
    if (requiredLevel === 'hub_elite' && hasAccess) {
      const { data: starterProgress } = await (supabase as any)
        .from('user_level_progress')
        .select('is_completed')
        .eq('user_id', userId)
        .eq('level', 'hub_starter')
        .single();

      if (!starterProgress?.is_completed) {
        hasAccess = false;
        return {
          hasAccess: false,
          requiredLevel,
          currentLevel: userLevel,
          message: 'Complete all Hub Starter content to unlock Hub Elite level.',
        };
      }
    }

    return {
      hasAccess,
      requiredLevel,
      currentLevel: userLevel,
      message: hasAccess
        ? undefined
        : `This content requires ${requiredLevel} subscription. Upgrade to access.`,
    };
  }

  /**
   * Get content sections for a page (Hub or Edge)
   */
  static async getContentSections(
    page: ContentPage,
    userId: string | null
  ): Promise<ContentSection[]> {
    const userLevel = await this.getUserContentLevel(userId);

    // Get sections user has access to
    const { data, error } = await (supabase as any)
      .from('content_sections')
      .select(`
        *,
        items:content_section_items(
          order_index,
          content:content_items(
            id,
            title,
            description,
            type,
            level,
            thumbnail_url,
            url,
            duration_minutes,
            order_index,
            is_featured,
            tags,
            metadata,
            created_at,
            updated_at
          )
        )
      `)
      .eq('page', page)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch content sections: ${error.message}`);
    }

    // Filter sections and items based on user's access level and progression
    const levelHierarchy: ContentLevel[] = ['free', 'hub_starter', 'hub_elite', 'edge'];
    const userLevelIndex = levelHierarchy.indexOf(userLevel);

    // Check if hub_starter is completed (for hub_elite access)
    let hubStarterCompleted = false;
    if (userId) {
      const { data: starterProgress } = await (supabase as any)
        .from('user_level_progress')
        .select('is_completed')
        .eq('user_id', userId)
        .eq('level', 'hub_starter')
        .single();
      
      hubStarterCompleted = starterProgress?.is_completed || false;
    }

    const filteredSections = (data || []).map((section: any) => {
      const sectionLevelIndex = levelHierarchy.indexOf(section.level);
      let hasSectionAccess = userLevelIndex >= sectionLevelIndex;

      // IMPORTANT: Free level (trial content) is ALWAYS accessible to registered users
      // Trial content is limited and static, but never locked, even after trial expiration
      if (section.level === 'free' && userId) {
        hasSectionAccess = true;
      }

      // Special check for hub_elite: must complete hub_starter
      if (section.level === 'hub_elite' && hasSectionAccess && !hubStarterCompleted) {
        hasSectionAccess = false;
      }

      if (!hasSectionAccess) {
        return {
          ...section,
          items: [],
          is_locked: true,
          lock_reason: section.level === 'hub_elite' 
            ? 'Complete Hub Starter content to unlock'
            : 'Upgrade your subscription to access',
        };
      }

      // Filter items within section
      const filteredItems = (section.items || [])
        .map((item: any) => {
          const itemLevel = item.content?.level || 'free';
          const itemLevelIndex = levelHierarchy.indexOf(itemLevel);
          let hasItemAccess = userLevelIndex >= itemLevelIndex;

          // IMPORTANT: Free level (trial content) items are ALWAYS accessible to registered users
          // Trial content is limited and static, but never locked
          if (itemLevel === 'free' && userId) {
            hasItemAccess = true;
          }

          // Check hub_elite access
          if (itemLevel === 'hub_elite' && hasItemAccess && !hubStarterCompleted) {
            hasItemAccess = false;
          }

          if (!hasItemAccess) {
            return null;
          }

          return {
            ...item.content,
            content_type: item.content.type, // Map type to content_type for frontend
            video_url: item.content.url, // Map url to video_url
            content_url: item.content.url, // Map url to content_url
            progress: null, // Will be loaded separately if needed
          };
        })
        .filter((item: any) => item !== null)
        .sort((a: any, b: any) => a.order_index - b.order_index);

      return {
        ...section,
        items: filteredItems,
        is_locked: false,
      };
    });

    return filteredSections;
  }

  /**
   * Get all content items for a page (with access filtering)
   */
  static async getContentItems(
    page: ContentPage,
    userId: string | null,
    options?: {
      level?: ContentLevel;
      type?: ContentType;
      featured?: boolean;
    }
  ): Promise<ContentItem[]> {
    const userLevel = await this.getUserContentLevel(userId);

    let query = (supabase as any)
      .from('content_items')
      .select('*')
      .order('order_index', { ascending: true });

    // Filter by level (only show what user has access to)
    const levelHierarchy: ContentLevel[] = ['free', 'hub_starter', 'hub_elite', 'edge'];
    const userLevelIndex = levelHierarchy.indexOf(userLevel);

    // Get items user can access
    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch content items: ${error.message}`);
    }

    // Filter by access level
    const accessibleItems = (data || []).filter((item: ContentItem) => {
      const itemLevelIndex = levelHierarchy.indexOf(item.level);
      return userLevelIndex >= itemLevelIndex;
    });

    // Apply additional filters
    let filtered = accessibleItems;

    if (options?.level) {
      filtered = filtered.filter((item: ContentItem) => item.level === options.level);
    }

    if (options?.type) {
      filtered = filtered.filter((item: ContentItem) => item.content_type === options.type);
    }

    if (options?.featured !== undefined) {
      filtered = filtered.filter((item: ContentItem) => item.is_featured === options.featured);
    }

    // Load user progress if userId provided
    if (userId && filtered.length > 0) {
      const itemIds = filtered.map((item: ContentItem) => item.id);
      const { data: progressData } = await (supabase as any)
        .from('user_content_progress')
        .select('*')
        .eq('user_id', userId)
        .in('content_item_id', itemIds);

      const progressMap = new Map(
        (progressData || []).map((p: UserContentProgress) => [p.content_item_id, p])
      );

      filtered = filtered.map((item: ContentItem) => ({
        ...item,
        progress: progressMap.get(item.id),
      }));
    }

    return filtered;
  }

  /**
   * Get a single content item by ID
   */
  static async getContentItem(
    itemId: string,
    userId: string | null
  ): Promise<ContentItem | null> {
    const { data, error } = await (supabase as any)
      .from('content_items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch content item: ${error.message}`);
    }

    // Check access
    const accessInfo = await this.hasContentAccess(userId, data.level);
    if (!accessInfo.hasAccess) {
      throw new Error(accessInfo.message || 'Access denied');
    }

    // Load progress if userId provided
    if (userId) {
      const { data: progressData } = await (supabase as any)
        .from('user_content_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('content_item_id', itemId)
        .single();

      data.progress = progressData || null;
    }

    return data;
  }

  /**
   * Update user content progress
   */
  static async updateContentProgress(
    userId: string,
    contentItemId: string,
    progress: {
      progress_percentage?: number;
      is_completed?: boolean;
    }
  ): Promise<UserContentProgress> {
    const updateData: any = {
      progress_percentage: progress.progress_percentage ?? 0,
      is_completed: progress.is_completed ?? false,
      last_accessed_at: new Date().toISOString(),
    };

    if (progress.is_completed) {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await (supabase as any)
      .from('user_content_progress')
      .upsert(
        {
          user_id: userId,
          content_item_id: contentItemId,
          ...updateData,
        },
        {
          onConflict: 'user_id,content_item_id',
        }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update progress: ${error.message}`);
    }

    return data;
  }

  /**
   * Get user's content progress summary
   */
  static async getUserProgressSummary(userId: string): Promise<{
    total: number;
    completed: number;
    in_progress: number;
    not_started: number;
  }> {
    const { data, error } = await (supabase as any)
      .from('user_content_progress')
      .select('is_completed, progress_percentage')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to fetch progress summary: ${error.message}`);
    }

    const completed = (data || []).filter((p: any) => p.is_completed).length;
    const inProgress = (data || []).filter(
      (p: any) => !p.is_completed && p.progress_percentage > 0
    ).length;
    const notStarted = (data || []).filter(
      (p: any) => !p.is_completed && p.progress_percentage === 0
    ).length;

    return {
      total: data?.length || 0,
      completed,
      in_progress: inProgress,
      not_started: notStarted,
    };
  }
}

