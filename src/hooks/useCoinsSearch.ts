import { useState, useCallback } from 'react';
import { Coin } from '@/types/coin';
import { coingeckoService } from '@/lib/services/coingecko';
import { toast } from 'react-hot-toast';

interface UseCoinsSearchReturn {
  results: Coin[];
  isLoading: boolean;
  error: string | null;
  handleSearch: (query: string) => Promise<void>;
  clearResults: () => void;
}

/**
 * Hook personalizado para manejar la búsqueda de criptomonedas
 */
export const useCoinsSearch = (): UseCoinsSearchReturn => {
  const [results, setResults] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    // Validación de entrada
    if (!query.trim()) {
      toast.error('Por favor ingresa un término de búsqueda');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await coingeckoService.searchCoins(query);

      if (data?.coins && Array.isArray(data.coins)) {
        setResults(data.coins);

        if (data.coins.length === 0) {
          toast('No se encontraron resultados', { 
            icon: '🔍',
            duration: 3000,
          });
        } else {
          toast.success(`Se encontraron ${data.coins.length} resultados`, {
            duration: 2000,
          });
        }
      } else {
        throw new Error('Formato de datos inesperado');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido al buscar criptomonedas';
      setError(message);
      console.error('Error en búsqueda:', err);
      toast.error(message, { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    handleSearch,
    clearResults,
  };
};
