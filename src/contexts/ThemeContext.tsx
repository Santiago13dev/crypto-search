'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import type { ThemeConfig, ThemeName, CustomTheme, ThemeColors, ThemeContextValue } from '@/types/theme';
import { predefinedThemes, defaultTheme, getThemeByName } from '@/lib/themes/predefined';

const THEME_STORAGE_KEY = 'crypto-search-theme';
const CUSTOM_THEMES_KEY = 'crypto-search-custom-themes';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('matrix');
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar tema y temas personalizados desde localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setThemeName(savedTheme as ThemeName);
      }

      const savedCustomThemes = localStorage.getItem(CUSTOM_THEMES_KEY);
      if (savedCustomThemes) {
        const parsed = JSON.parse(savedCustomThemes);
        setCustomThemes(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error al cargar temas:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Guardar tema actual
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, themeName);
      } catch (error) {
        console.error('Error al guardar tema:', error);
      }
    }
  }, [themeName, isInitialized]);

  // Guardar temas personalizados
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(customThemes));
      } catch (error) {
        console.error('Error al guardar temas personalizados:', error);
      }
    }
  }, [customThemes, isInitialized]);

  // Obtener tema actual
  const currentTheme = useMemo((): ThemeConfig => {
    const predefined = getThemeByName(themeName);
    if (predefined) return predefined;

    const custom = customThemes.find(t => t.name === themeName);
    if (custom) {
      const baseTheme = getThemeByName(custom.baseTheme) || defaultTheme;
      return {
        ...custom,
        colors: {
          ...baseTheme.colors,
          ...custom.customizations,
        },
      };
    }

    return defaultTheme;
  }, [themeName, customThemes]);

  // Aplicar variables CSS cuando cambia el tema
  useEffect(() => {
    if (!currentTheme || !isInitialized) return;

    const root = document.documentElement;
    const colors = currentTheme.colors;

    // Aplicar todas las variables CSS
    Object.entries({
      '--color-primary': colors.primary,
      '--color-primary-dark': colors.primaryDark,
      '--color-primary-light': colors.primaryLight,
      '--color-background': colors.background,
      '--color-background-secondary': colors.backgroundSecondary,
      '--color-background-tertiary': colors.backgroundTertiary,
      '--color-text': colors.text,
      '--color-text-secondary': colors.textSecondary,
      '--color-text-tertiary': colors.textTertiary,
      '--color-accent': colors.accent,
      '--color-accent-secondary': colors.accentSecondary,
      '--color-success': colors.success,
      '--color-error': colors.error,
      '--color-warning': colors.warning,
      '--color-info': colors.info,
      '--color-border': colors.border,
      '--color-border-light': colors.borderLight,
      '--color-border-dark': colors.borderDark,
    }).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Aplicar directamente al body
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;

    console.log('✅ Tema aplicado:', currentTheme.displayName, colors);
  }, [currentTheme, isInitialized]);

  const availableThemes = useMemo((): ThemeConfig[] => {
    return [...predefinedThemes, ...customThemes];
  }, [customThemes]);

  const setTheme = useCallback((newThemeName: ThemeName) => {
    setThemeName(newThemeName);
    const theme = [...predefinedThemes, ...customThemes].find(t => t.name === newThemeName);
    if (theme) {
      toast.success(`Tema "${theme.displayName}" activado`, { icon: '🎨' });
    }
  }, [customThemes]);

  const createCustomTheme = useCallback((
    name: string,
    baseTheme: ThemeName,
    customizations: Partial<ThemeColors>
  ) => {
    const id = `custom_theme_${Date.now()}`;
    const newTheme: CustomTheme = {
      id,
      name: `custom-${Date.now()}`,
      displayName: name,
      description: `Tema personalizado basado en ${baseTheme}`,
      baseTheme,
      customizations,
      isCustom: true,
      colors: customizations as ThemeColors,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setCustomThemes(prev => [...prev, newTheme]);
    toast.success(`Tema "${name}" creado`, { icon: '✨' });
    return newTheme;
  }, []);

  const updateCustomTheme = useCallback((
    id: string,
    customizations: Partial<ThemeColors>
  ) => {
    setCustomThemes(prev =>
      prev.map(theme =>
        theme.id === id
          ? {
              ...theme,
              customizations: { ...theme.customizations, ...customizations },
              updatedAt: Date.now(),
            }
          : theme
      )
    );
    toast.success('Tema actualizado', { icon: '✏️' });
  }, []);

  const deleteCustomTheme = useCallback((id: string) => {
    const theme = customThemes.find(t => t.id === id);
    if (!theme) return;

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el tema "${theme.displayName}"?`
    );

    if (confirmed) {
      setCustomThemes(prev => prev.filter(t => t.id !== id));
      
      if (currentTheme.id === id) {
        setThemeName('matrix');
      }
      
      toast.success(`Tema "${theme.displayName}" eliminado`, { icon: '🗑️' });
    }
  }, [customThemes, currentTheme]);

  const exportTheme = useCallback((themeId: string): string => {
    const theme = [...predefinedThemes, ...customThemes].find(t => t.id === themeId);
    if (!theme) {
      toast.error('Tema no encontrado');
      return '';
    }

    try {
      const exportData = {
        version: '1.0',
        theme: {
          displayName: theme.displayName,
          description: theme.description,
          colors: theme.colors,
          baseTheme: (theme as CustomTheme).baseTheme || theme.name,
          customizations: (theme as CustomTheme).customizations || {},
        },
        exportedAt: Date.now(),
      };

      const json = JSON.stringify(exportData, null, 2);
      toast.success('Tema exportado', { icon: '📋' });
      return json;
    } catch (error) {
      console.error('Error al exportar tema:', error);
      toast.error('Error al exportar tema');
      return '';
    }
  }, [customThemes]);

  const importTheme = useCallback((themeData: string) => {
    try {
      const parsed = JSON.parse(themeData);
      
      if (!parsed.theme || !parsed.theme.colors) {
        toast.error('Formato de tema inválido');
        return;
      }

      const imported = parsed.theme;
      const newTheme: CustomTheme = {
        id: `imported_${Date.now()}`,
        name: `custom-${Date.now()}`,
        displayName: imported.displayName || 'Tema Importado',
        description: imported.description || 'Tema importado desde archivo',
        baseTheme: imported.baseTheme || 'matrix',
        customizations: imported.customizations || {},
        isCustom: true,
        colors: imported.colors,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setCustomThemes(prev => [...prev, newTheme]);
      toast.success(`Tema "${newTheme.displayName}" importado`, { icon: '📥' });
    } catch (error) {
      console.error('Error al importar tema:', error);
      toast.error('Error al importar tema - formato inválido');
    }
  }, []);

  const value: ThemeContextValue = {
    currentTheme,
    themeName,
    availableThemes,
    customThemes,
    setTheme,
    createCustomTheme,
    updateCustomTheme,
    deleteCustomTheme,
    exportTheme,
    importTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
