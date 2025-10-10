export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  experience_points: number;
  level: number;
  is_public: boolean;
  show_portfolio: boolean;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
}
