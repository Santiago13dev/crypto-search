import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import type { ThemeConfig, ThemeName, CustomTheme, ThemeColors } from '@/types/theme';
import { predefinedThemes, defaultTheme, getThemeByName } from '@/lib/themes/predefined';

const THEME_STORAGE_KEY = 'crypto-search-theme';
const CUSTOM_THEMES_KEY = 'crypto-search-custom-themes';

export const useTheme = () => {
  const [themeName, setThemeName] = useState<ThemeName>('matrix');
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar tema y temas personalizados desde localStorage
  useEffect(() => {
    try {
      // Cargar tema actual
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setThemeName(savedTheme as ThemeName);
      }

      // Cargar temas personalizados
      const savedCustomThemes = localStorage.getItem(CUSTOM_THEMES_KEY);
      if (savedCustomThemes) {
        const parsed = JSON.parse(savedCustomThemes);
        setCustomThemes(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error al cargar temas:', error);
      toast.error('Error al cargar configuración de temas');
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
    // Buscar en temas predefinidos
    const predefined = getThemeByName(themeName);
    if (predefined) return predefined;

    // Buscar en temas personalizados
    const custom = customThemes.find(t => t.name === themeName);
    if (custom) {
      // Combinar tema base con personalizaciones
      const baseTheme = getThemeByName(custom.baseTheme) || defaultTheme;
      return {
        ...custom,
        colors: {
          ...baseTheme.colors,
          ...custom.customizations,
        },
      };
    }

    // Fallback al tema por defecto
    return defaultTheme;
  }, [themeName, customThemes]);

  // Todos los temas disponibles (predefinidos + personalizados)
  const availableThemes = useMemo((): ThemeConfig[] => {
    return [...predefinedThemes, ...customThemes];
  }, [customThemes]);

  // Cambiar tema
  const setTheme = useCallback((newThemeName: ThemeName) => {
    setThemeName(newThemeName);
    const theme = availableThemes.find(t => t.name === newThemeName);
    if (theme) {
      toast.success(`Tema "${theme.displayName}" activado`, { icon: '🎨' });
    }
  }, [availableThemes]);

  // Crear tema personalizado
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
      colors: customizations as ThemeColors, // Se combinará con el base
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setCustomThemes(prev => [...prev, newTheme]);
    toast.success(`Tema "${name}" creado`, { icon: '✨' });
    return newTheme;
  }, []);

  // Actualizar tema personalizado
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

  // Eliminar tema personalizado
  const deleteCustomTheme = useCallback((id: string) => {
    const theme = customThemes.find(t => t.id === id);
    if (!theme) return;

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el tema "${theme.displayName}"?`
    );

    if (confirmed) {
      setCustomThemes(prev => prev.filter(t => t.id !== id));
      
      // Si el tema eliminado era el activo, cambiar a Matrix
      if (currentTheme.id === id) {
        setThemeName('matrix');
      }
      
      toast.success(`Tema "${theme.displayName}" eliminado`, { icon: '🗑️' });
    }
  }, [customThemes, currentTheme]);

  // Exportar tema como JSON
  const exportTheme = useCallback((themeId: string): string => {
    const theme = availableThemes.find(t => t.id === themeId);
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
      toast.success('Tema exportado al portapapeles', { icon: '📋' });
      return json;
    } catch (error) {
      console.error('Error al exportar tema:', error);
      toast.error('Error al exportar tema');
      return '';
    }
  }, [availableThemes]);

  // Importar tema desde JSON
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

  return {
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
};
