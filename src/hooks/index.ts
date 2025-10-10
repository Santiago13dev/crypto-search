// Exportar todos los hooks
export { useCoinsSearch } from './useCoinsSearch';
export { useFavorites } from './useFavorites';
export { usePortfolio } from './usePortfolio';
export { useCurrentPrices } from './useCurrentPrices';
export { useAlerts } from './useAlerts';
export { useWidgets } from './useWidgets';
// useTheme ahora se exporta desde el context
export { useTheme } from '../contexts/ThemeContext';
export type { FavoriteCoin } from './useFavorites';
export type { PortfolioItem } from './usePortfolio';
export type { PriceAlert, AlertCondition, AlertStatus } from './useAlerts';
