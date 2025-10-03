const BASE_URL = process.env.NEXT_PUBLIC_COINGECKO_API || 'https://api.coingecko.com/api/v3';

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000;

const getCached = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCached = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const coingeckoService = {
  async searchCoins(query: string) {
    const cacheKey = `search_${query}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;
    const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Error en la búsqueda');
    const data = await response.json();
    setCached(cacheKey, data);
    return data;
  },

  async getCoinDetails(id: string) {
    const cacheKey = `coin_${id}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;
    const response = await fetch(`${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);
    if (!response.ok) throw new Error('Error al obtener detalles');
    const data = await response.json();
    setCached(cacheKey, data);
    return data;
  },

  async getTopCoins(limit: number = 50) {
    const cacheKey = `top_${limit}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;
    const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`);
    if (!response.ok) throw new Error('Error al obtener top coins');
    const data = await response.json();
    setCached(cacheKey, data);
    return data;
  },
};