export type ContentLevel = 'free' | 'hub_starter' | 'hub_elite' | 'edge';
export type ContentType = 'video' | 'article' | 'course' | 'exercise' | 'drill' | 'analysis';
export type ContentPage = 'hub' | 'edge';

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  content_type: ContentType;
  level: ContentLevel;
  thumbnail_url?: string;
  video_url?: string;
  content_url?: string;
  duration_minutes?: number;
  order_index: number;
  is_featured: boolean;
  tags: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  progress?: UserContentProgress; // Joined from user_content_progress
}

export interface ContentSection {
  id: string;
  name: string;
  description?: string;
  page: ContentPage;
  level: ContentLevel;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  items?: ContentItem[]; // Joined from content_section_items
  is_locked?: boolean; // Added for level progression
  lock_reason?: string; // Reason why section is locked
}

export interface UserContentProgress {
  id: string;
  user_id: string;
  content_item_id: string;
  progress_percentage: number;
  is_completed: boolean;
  last_accessed_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentAccessInfo {
  hasAccess: boolean;
  requiredLevel: ContentLevel;
  currentLevel?: ContentLevel;
  message?: string;
}

