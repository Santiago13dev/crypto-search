export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  total_invested: number;
  current_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  portfolio_id: string;
  coin_id: string;
  coin_symbol: string;
  amount: number;
  purchase_price: number;
  current_price?: number;
  purchase_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioWithItems extends Portfolio {
  items: PortfolioItem[];
}
