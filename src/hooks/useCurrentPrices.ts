import { useState, useEffect } from 'react';
import { coingeckoService } from '@/lib/services/coingecko';

interface CoinPrice {
  id: string;
  current_price: number;
  price_change_percentage_24h: number;
}

/**
 * Hook para obtener precios actuales de múltiples criptomonedas
 */
export const useCurrentPrices = (coinIds: string[]) => {
  const [prices, setPrices] = useState<Record<string, CoinPrice>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (coinIds.length === 0) {
      setPrices({});
      return;
    }

    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener precios de todas las monedas
        const pricePromises = coinIds.map(async (id) => {
          try {
            const data = await coingeckoService.getCoinDetails(id);
            return {
              id,
              current_price: data.market_data?.current_price?.usd || 0,
              price_change_percentage_24h: data.market_data?.price_change_percentage_24h || 0,
            };
          } catch (err) {
            console.error(`Error fetching price for ${id}:`, err);
            return {
              id,
              current_price: 0,
              price_change_percentage_24h: 0,
            };
          }
        });

        const pricesData = await Promise.all(pricePromises);
        
        const pricesMap: Record<string, CoinPrice> = {};
        pricesData.forEach((price) => {
          pricesMap[price.id] = price;
        });

        setPrices(pricesMap);
      } catch (err) {
        console.error('Error fetching prices:', err);
        setError('Error al obtener precios actuales');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();

    // Actualizar cada 2 minutos
    const interval = setInterval(fetchPrices, 120000);

    return () => clearInterval(interval);
  }, [coinIds.join(',')]); // Solo re-ejecutar si cambian los IDs

  return { prices, loading, error };
 feature/widgets-personalizables
};
=======
};
 main
