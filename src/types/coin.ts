export interface Coin {
  id: string;
  name: string;
  symbol: string;
  large?: string;
  thumb?: string;
  market_cap_rank?: number;
  price_btc?: number;
  score?: number;
}

export interface SearchResponse {
  coins: Coin[];
}

export interface CoinDetails extends Coin {
  description?: {
    en: string;
  };
  market_data?: {
    current_price?: { usd: number };
    market_cap?: { usd: number };
    total_volume?: { usd: number };
    price_change_percentage_24h?: number;
    price_change_percentage_7d?: number;
    price_change_percentage_30d?: number;
    high_24h?: { usd: number };
    low_24h?: { usd: number };
    circulating_supply?: number;
    total_supply?: number;
    max_supply?: number;
  };
  links?: {
    homepage?: string[];
    blockchain_site?: string[];
    official_forum_url?: string[];
    twitter_screen_name?: string;
    telegram_channel_identifier?: string;
  };
  image?: {
    thumb: string;
    small: string;
    large: string;
  };
}

export interface TrendingCoin {
  item: Coin & {
    price_btc: number;
    slug: string;
  };
}

export interface TrendingResponse {
  coins: TrendingCoin[];
}
