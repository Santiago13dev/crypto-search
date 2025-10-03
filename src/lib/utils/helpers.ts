import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind de manera segura
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea números grandes con sufijos (K, M, B, T)
 */
export function formatNumber(num: number | undefined): string {
  if (num === undefined || num === null) return 'N/A';

  if (num >= 1_000_000_000_000) {
    return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
}

/**
 * Formatea porcentajes con color
 */
export function formatPercentage(percentage: number | undefined): {
  value: string;
  isPositive: boolean;
} {
  if (percentage === undefined || percentage === null) {
    return { value: 'N/A', isPositive: false };
  }

  const isPositive = percentage >= 0;
  return {
    value: `${isPositive ? '+' : ''}${percentage.toFixed(2)}%`,
    isPositive,
  };
}

/**
 * Trunca texto con ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Debounce para funciones
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Valida si una URL es válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtiene el primer enlace válido de un array
 */
export function getFirstValidUrl(urls?: string[]): string | null {
  if (!urls || urls.length === 0) return null;
  
  for (const url of urls) {
    if (url && isValidUrl(url)) {
      return url;
    }
  }
  
  return null;
}
