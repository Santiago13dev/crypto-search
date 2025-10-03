export interface Coin {
  id: string;
  name: string;
  symbol: string;
  large: string;
  market_cap_rank: number;
  price_btc: number;
  score: number;
  thumb: string;
}

export interface SearchResponse {
  coins: Coin[];
}
