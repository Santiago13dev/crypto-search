import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const PORTFOLIO_KEY = 'crypto-portfolio';

export interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  amount: number;
  buyPrice: number;
  addedAt: number;
}

interface UsePortfolioReturn {
  portfolio: PortfolioItem[];
  addToPortfolio: (item: Omit<PortfolioItem, 'addedAt'>) => void;
  removeFromPortfolio: (id: string) => void;
  updateAmount: (id: string, newAmount: number) => void;
  clearPortfolio: () => void;
  getTotalInvestment: () => number;
  portfolioCount: number;
}

/**
 * Hook para manejar el portafolio de criptomonedas
 */
export const usePortfolio = (): UsePortfolioReturn => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar portafolio desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PORTFOLIO_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPortfolio(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error al cargar portafolio:', error);
      toast.error('Error al cargar el portafolio');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Guardar portafolio en localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
      } catch (error) {
        console.error('Error al guardar portafolio:', error);
        toast.error('Error al guardar el portafolio');
      }
    }
  }, [portfolio, isInitialized]);

  /**
   * Agregar criptomoneda al portafolio
   */
  const addToPortfolio = useCallback(
    (item: Omit<PortfolioItem, 'addedAt'>) => {
      setPortfolio((prev) => {
        const exists = prev.find((p) => p.id === item.id);

        if (exists) {
          // Si ya existe, actualizar cantidad
          toast.success(`${item.name} actualizado en el portafolio`, {
            icon: '📊',
          });
          return prev.map((p) =>
            p.id === item.id
              ? { ...p, amount: p.amount + item.amount }
              : p
          );
        } else {
          // Agregar nuevo
          toast.success(`${item.name} agregado al portafolio`, {
            icon: '💼',
          });
          return [...prev, { ...item, addedAt: Date.now() }];
        }
      });
    },
    []
  );

  /**
   * Eliminar del portafolio
   */
  const removeFromPortfolio = useCallback((id: string) => {
    setPortfolio((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) {
        toast.success(`${item.name} eliminado del portafolio`, {
          icon: '🗑️',
        });
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  /**
   * Actualizar cantidad de una moneda
   */
  const updateAmount = useCallback((id: string, newAmount: number) => {
    if (newAmount <= 0) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }

    setPortfolio((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, amount: newAmount } : p
      )
    );
    toast.success('Cantidad actualizada', { icon: '✅' });
  }, []);

  /**
   * Limpiar todo el portafolio
   */
  const clearPortfolio = useCallback(() => {
    if (portfolio.length === 0) {
      toast.error('El portafolio ya está vacío');
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar todas las ${portfolio.length} monedas del portafolio?`
    );

    if (confirmed) {
      setPortfolio([]);
      toast.success('Portafolio limpiado', { icon: '🗑️' });
    }
  }, [portfolio.length]);

  /**
   * Calcular inversión total
   */
  const getTotalInvestment = useCallback(() => {
    return portfolio.reduce(
      (total, item) => total + item.amount * item.buyPrice,
      0
    );
  }, [portfolio]);

  return {
    portfolio,
    addToPortfolio,
    removeFromPortfolio,
    updateAmount,
    clearPortfolio,
    getTotalInvestment,
    portfolioCount: portfolio.length,
  };
};