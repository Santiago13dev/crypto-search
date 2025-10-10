import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const FAVORITES_KEY = 'crypto-favorites';

export interface FavoriteCoin {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  addedAt: number;
}

interface UseFavoritesReturn {
  favorites: FavoriteCoin[];
  isFavorite: (coinId: string) => boolean;
  toggleFavorite: (coin: FavoriteCoin) => void;
  removeFavorite: (coinId: string) => void;
  clearAllFavorites: () => void;
  favoritesCount: number;
}

/**
 * Hook personalizado para manejar favoritos con localStorage
 */
export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<FavoriteCoin[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar favoritos desde localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      toast.error('Error al cargar favoritos');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error al guardar favoritos:', error);
        toast.error('Error al guardar favoritos');
      }
    }
  }, [favorites, isInitialized]);

  /**
   * Verifica si una moneda está en favoritos
   */
  const isFavorite = useCallback(
    (coinId: string): boolean => {
      return favorites.some((fav) => fav.id === coinId);
    },
    [favorites]
  );

  /**
   * Agrega o elimina una moneda de favoritos
   */
  const toggleFavorite = useCallback(
    (coin: FavoriteCoin) => {
      setFavorites((prev) => {
        const exists = prev.find((fav) => fav.id === coin.id);

        if (exists) {
          // Eliminar de favoritos
          toast.success(`${coin.name} eliminado de favoritos`, {
            icon: '💔',
            duration: 2000,
          });
          return prev.filter((fav) => fav.id !== coin.id);
        } else {
          // Agregar a favoritos
          const newFavorite: FavoriteCoin = {
            ...coin,
            addedAt: Date.now(),
          };
          toast.success(`${coin.name} agregado a favoritos`, {
            icon: '⭐',
            duration: 2000,
          });
          return [...prev, newFavorite];
        }
      });
    },
    []
  );

  /**
   * Elimina una moneda específica de favoritos
   */
  const removeFavorite = useCallback((coinId: string) => {
    setFavorites((prev) => {
      const coin = prev.find((fav) => fav.id === coinId);
      if (coin) {
        toast.success(`${coin.name} eliminado de favoritos`, {
          icon: '💔',
          duration: 2000,
        });
      }
      return prev.filter((fav) => fav.id !== coinId);
    });
  }, []);

  /**
   * Elimina todos los favoritos
   */
  const clearAllFavorites = useCallback(() => {
    if (favorites.length === 0) {
      toast.error('No hay favoritos para eliminar');
      return;
    }

    // Confirmar antes de eliminar
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar todos los ${favorites.length} favoritos?`
    );

    if (confirmed) {
      setFavorites([]);
      toast.success('Todos los favoritos eliminados', {
        icon: '🗑️',
        duration: 2000,
      });
    }
  }, [favorites.length]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites,
    favoritesCount: favorites.length,
  };
};
