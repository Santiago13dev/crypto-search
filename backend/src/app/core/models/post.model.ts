export interface Post {
  id: string;
  author_id: string;
  coin_id: string;
  coin_symbol: string;
  title: string;
  content: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  target_price?: number;
  is_public: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface PostWithAuthor extends Post {
  username: string;
  full_name?: string;
  avatar_url?: string;
  level: number;
  likes_count: number;
  bullish_count: number;
  bearish_count: number;
  fire_count: number;
  comments_count: number;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_comment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: 'like' | 'bullish' | 'bearish' | 'fire';
  created_at: string;
}
