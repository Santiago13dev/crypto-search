export interface Alert {
  id: string;
  user_id: string;
  coin_id: string;
  coin_symbol: string;
  target_price: number;
  condition: 'above' | 'below';
  status: 'active' | 'triggered' | 'cancelled';
  message?: string;
  notify_email: boolean;
  triggered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PopularAlert {
  coin_id: string;
  coin_symbol: string;
  target_price: number;
  condition: 'above' | 'below';
  users_count: number;
  avg_target_price: number;
  sentiment: 'bullish' | 'bearish';
}
