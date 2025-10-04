export type ThemeName = 'matrix' | 'cyberpunk' | 'minimal' | 'high-contrast' | 'custom';

export interface ThemeColors {
  // Colores principales
  primary: string;
  primaryDark: string;
  primaryLight: string;
  
  // Colores de fondo
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Colores de texto
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Colores de acento
  accent: string;
  accentSecondary: string;
  
  // Colores de estado
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Colores de borde
  border: string;
  borderLight: string;
  borderDark: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  colors: ThemeColors;
  isCustom: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface CustomTheme extends ThemeConfig {
  baseTheme: ThemeName;
  customizations: Partial<ThemeColors>;
}

export interface ThemeContextValue {
  currentTheme: ThemeConfig;
  themeName: ThemeName;
  availableThemes: ThemeConfig[];
  customThemes: CustomTheme[];
  setTheme: (themeName: ThemeName) => void;
  createCustomTheme: (name: string, baseTheme: ThemeName, customizations: Partial<ThemeColors>) => void;
  updateCustomTheme: (id: string, customizations: Partial<ThemeColors>) => void;
  deleteCustomTheme: (id: string) => void;
  exportTheme: (themeId: string) => string;
  importTheme: (themeData: string) => void;
}
