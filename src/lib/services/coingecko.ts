 feature/widgets-personalizables
import { SearchResponse, CoinDetails, TrendingResponse } from '@/types/coin';

const COINGECKO_API = process.env.NEXT_PUBLIC_COINGECKO_API || 'https://api.coingecko.com/api/v3';
const CACHE_TIME = 5 * 60 * 1000; // 5 minutos

// Cache simple en memoria
const cache = new Map<string, { data: any; timestamp: number }>();

class CoingeckoService {
  /**
   * Realiza una petición con sistema de cache
   */
  private async fetchWithCache(url: string): Promise<any> {
    const cached = cache.get(url);
    
    // Verificar si existe cache válido
    if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
      console.log('✓ Datos obtenidos desde cache:', url);
      return cached.data;
    }

    try {
      const response = await fetch(url, {
        next: { revalidate: 300 }, // ISR de Next.js - 5 minutos
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Límite de solicitudes excedido. Por favor, intenta más tarde.');
        }
        if (response.status === 404) {
          throw new Error('Recurso no encontrado.');
        }
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // Guardar en cache
      cache.set(url, { data, timestamp: Date.now() });
      console.log('✓ Datos obtenidos desde API:', url);
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido al obtener datos');
    }
  }

  /**
   * Buscar criptomonedas por nombre o símbolo
   */
  async searchCoins(query: string): Promise<SearchResponse> {
    if (!query.trim()) {
      return { coins: [] };
    }

    const url = `${COINGECKO_API}/search?query=${encodeURIComponent(query.trim())}`;
    return await this.fetchWithCache(url);
  }

  /**
   * Obtener detalles completos de una criptomoneda
   */
  async getCoinDetails(id: string): Promise<CoinDetails> {
    const url = `${COINGECKO_API}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`;
    return await this.fetchWithCache(url);
  }

  /**
   * Obtener las criptomonedas en tendencia
   */
  async getTrendingCoins(): Promise<TrendingResponse> {
    const url = `${COINGECKO_API}/search/trending`;
    return await this.fetchWithCache(url);
  }

  /**
   * Obtener las principales criptomonedas por capitalización de mercado
   */
  async getTopCoins(limit = 10) {
    const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;
    return await this.fetchWithCache(url);
  }

  /**
   * Limpiar el cache manualmente
   */
  clearCache(): void {
    cache.clear();
    console.log('✓ Cache limpiado');
  }

  /**
   * Obtener tamaño del cache
   */
  getCacheSize(): number {
    return cache.size;
  }
}

// Exportar instancia única (Singleton)
export const coingeckoService = new CoingeckoService();
=======
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
 main
