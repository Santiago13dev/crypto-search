import type { ThemeConfig } from '@/types/theme';

// Tema Matrix (actual - verde terminal)
export const matrixTheme: ThemeConfig = {
  id: 'theme_matrix',
  name: 'matrix',
  displayName: 'Matrix Terminal',
  description: 'Tema clásico de terminal con verde neón estilo Matrix',
  isCustom: false,
  colors: {
    // Colores principales
    primary: '#00ff00',
    primaryDark: '#00cc00',
    primaryLight: '#33ff33',
    
    // Fondos
    background: '#0a0f1e',
    backgroundSecondary: '#0d1420',
    backgroundTertiary: '#111827',
    
    // Texto
    text: '#00ff00',
    textSecondary: 'rgba(0, 255, 0, 0.8)',
    textTertiary: 'rgba(0, 255, 0, 0.6)',
    
    // Acentos
    accent: '#00ffff',
    accentSecondary: '#ff00ff',
    
    // Estados
    success: '#00ff00',
    error: '#ff0033',
    warning: '#ffaa00',
    info: '#00ffff',
    
    // Bordes
    border: 'rgba(0, 255, 0, 0.3)',
    borderLight: 'rgba(0, 255, 0, 0.2)',
    borderDark: 'rgba(0, 255, 0, 0.5)',
  },
};

// Tema Cyberpunk (rosa/cyan neón)
export const cyberpunkTheme: ThemeConfig = {
  id: 'theme_cyberpunk',
  name: 'cyberpunk',
  displayName: 'Cyberpunk 2077',
  description: 'Colores neón vibrantes estilo cyberpunk con rosa y cyan',
  isCustom: false,
  colors: {
    // Colores principales
    primary: '#ff00ff',
    primaryDark: '#cc00cc',
    primaryLight: '#ff33ff',
    
    // Fondos
    background: '#0a0a1e',
    backgroundSecondary: '#100a20',
    backgroundTertiary: '#1a0f2e',
    
    // Texto
    text: '#ff00ff',
    textSecondary: 'rgba(255, 0, 255, 0.8)',
    textTertiary: 'rgba(255, 0, 255, 0.6)',
    
    // Acentos
    accent: '#00ffff',
    accentSecondary: '#ffff00',
    
    // Estados
    success: '#00ff9f',
    error: '#ff0055',
    warning: '#ffaa00',
    info: '#00d4ff',
    
    // Bordes
    border: 'rgba(255, 0, 255, 0.3)',
    borderLight: 'rgba(255, 0, 255, 0.2)',
    borderDark: 'rgba(255, 0, 255, 0.5)',
  },
};

// Tema Minimal (blanco/gris suave)
export const minimalTheme: ThemeConfig = {
  id: 'theme_minimal',
  name: 'minimal',
  displayName: 'Minimal Clean',
  description: 'Diseño minimalista con tonos suaves y elegantes',
  isCustom: false,
  colors: {
    // Colores principales
    primary: '#ffffff',
    primaryDark: '#e5e5e5',
    primaryLight: '#ffffff',
    
    // Fondos
    background: '#1a1a1a',
    backgroundSecondary: '#242424',
    backgroundTertiary: '#2e2e2e',
    
    // Texto
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
    textTertiary: 'rgba(255, 255, 255, 0.6)',
    
    // Acentos
    accent: '#a0a0a0',
    accentSecondary: '#d0d0d0',
    
    // Estados
    success: '#4ade80',
    error: '#f87171',
    warning: '#fbbf24',
    info: '#60a5fa',
    
    // Bordes
    border: 'rgba(255, 255, 255, 0.15)',
    borderLight: 'rgba(255, 255, 255, 0.1)',
    borderDark: 'rgba(255, 255, 255, 0.3)',
  },
};

// Tema High Contrast (máximo contraste para accesibilidad)
export const highContrastTheme: ThemeConfig = {
  id: 'theme_high_contrast',
  name: 'high-contrast',
  displayName: 'High Contrast',
  description: 'Máximo contraste para mejor accesibilidad visual',
  isCustom: false,
  colors: {
    // Colores principales
    primary: '#ffff00',
    primaryDark: '#cccc00',
    primaryLight: '#ffff33',
    
    // Fondos
    background: '#000000',
    backgroundSecondary: '#0a0a0a',
    backgroundTertiary: '#1a1a1a',
    
    // Texto
    text: '#ffff00',
    textSecondary: 'rgba(255, 255, 0, 0.9)',
    textTertiary: 'rgba(255, 255, 0, 0.7)',
    
    // Acentos
    accent: '#ffffff',
    accentSecondary: '#00ffff',
    
    // Estados
    success: '#00ff00',
    error: '#ff0000',
    warning: '#ffa500',
    info: '#00ffff',
    
    // Bordes
    border: 'rgba(255, 255, 0, 0.5)',
    borderLight: 'rgba(255, 255, 0, 0.3)',
    borderDark: 'rgba(255, 255, 0, 0.7)',
  },
};

// Array con todos los temas predefinidos
export const predefinedThemes: ThemeConfig[] = [
  matrixTheme,
  cyberpunkTheme,
  minimalTheme,
  highContrastTheme,
];

// Obtener tema por nombre
export const getThemeByName = (name: string): ThemeConfig | undefined => {
  return predefinedThemes.find(theme => theme.name === name);
};

// Tema por defecto
export const defaultTheme = matrixTheme;
