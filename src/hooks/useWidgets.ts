import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import type { WidgetConfig, WidgetLayout, SavedLayout, WidgetType, WidgetSize } from '@/types/widget';

const WIDGETS_KEY = 'crypto-widgets';
const LAYOUTS_KEY = 'crypto-layouts';
const ACTIVE_LAYOUT_KEY = 'crypto-active-layout';

interface UseWidgetsReturn {
  widgets: WidgetConfig[];
  layouts: WidgetLayout[];
  savedLayouts: SavedLayout[];
  activeLayoutId: string | null;
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  updateWidgetSize: (id: string, size: WidgetSize) => void;
  updateWidgetSettings: (id: string, settings: Record<string, unknown>) => void;
  updateLayout: (newLayouts: WidgetLayout[]) => void;
  saveCurrentLayout: (name: string) => void;
  loadLayout: (layoutId: string) => void;
  deleteLayout: (layoutId: string) => void;
  resetToDefault: () => void;
}

const DEFAULT_LAYOUTS: Record<WidgetType, Omit<WidgetLayout, 'i'>> = {
  price: { x: 0, y: 0, w: 4, h: 3, minW: 2, minH: 2 },
  news: { x: 4, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
  alerts: { x: 8, y: 0, w: 4, h: 3, minW: 2, minH: 2 },
  portfolio: { x: 0, y: 3, w: 6, h: 4, minW: 4, minH: 3 },
  chart: { x: 6, y: 3, w: 6, h: 4, minW: 4, minH: 3 },
};

const WIDGET_TITLES: Record<WidgetType, string> = {
  price: 'Precios en Tiempo Real',
  news: 'Noticias Cripto',
  alerts: 'Alertas Activas',
  portfolio: 'Mi Portafolio',
  chart: 'Gráfico de Precios',
};

export const useWidgets = (): UseWidgetsReturn => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [layouts, setLayouts] = useState<WidgetLayout[]>([]);
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [activeLayoutId, setActiveLayoutId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar datos desde localStorage
  useEffect(() => {
    try {
      const storedWidgets = localStorage.getItem(WIDGETS_KEY);
      const storedLayouts = localStorage.getItem(LAYOUTS_KEY);
      const storedActiveLayout = localStorage.getItem(ACTIVE_LAYOUT_KEY);

      if (storedWidgets) {
        const parsedWidgets = JSON.parse(storedWidgets);
        setWidgets(Array.isArray(parsedWidgets) ? parsedWidgets : []);
      }

      if (storedLayouts) {
        const parsedLayouts = JSON.parse(storedLayouts);
        setSavedLayouts(Array.isArray(parsedLayouts) ? parsedLayouts : []);
      }

      if (storedActiveLayout) {
        setActiveLayoutId(storedActiveLayout);
      }
    } catch (error) {
      console.error('Error al cargar widgets:', error);
      toast.error('Error al cargar la configuración');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Guardar widgets
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(WIDGETS_KEY, JSON.stringify(widgets));
      } catch (error) {
        console.error('Error al guardar widgets:', error);
      }
    }
  }, [widgets, isInitialized]);

  // Guardar layouts
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(LAYOUTS_KEY, JSON.stringify(savedLayouts));
      } catch (error) {
        console.error('Error al guardar layouts:', error);
      }
    }
  }, [savedLayouts, isInitialized]);

  // Guardar layout activo
  useEffect(() => {
    if (isInitialized && activeLayoutId) {
      try {
        localStorage.setItem(ACTIVE_LAYOUT_KEY, activeLayoutId);
      } catch (error) {
        console.error('Error al guardar layout activo:', error);
      }
    }
  }, [activeLayoutId, isInitialized]);

  // Agregar widget
  const addWidget = useCallback((type: WidgetType) => {
    const id = `widget_${type}_${Date.now()}`;
    const newWidget: WidgetConfig = {
      id,
      type,
      title: WIDGET_TITLES[type],
      size: 'expanded',
      settings: {},
    };

    const defaultLayout = DEFAULT_LAYOUTS[type];
    const newLayout: WidgetLayout = {
      i: id,
      ...defaultLayout,
    };

    setWidgets((prev) => [...prev, newWidget]);
    setLayouts((prev) => [...prev, newLayout]);

    toast.success(`Widget "${WIDGET_TITLES[type]}" agregado`, { icon: '✨' });
  }, []);

  // Eliminar widget
  const removeWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setLayouts((prev) => prev.filter((l) => l.i !== id));
    toast.success('Widget eliminado', { icon: '🗑️' });
  }, []);

  // Actualizar tamaño del widget
  const updateWidgetSize = useCallback((id: string, size: WidgetSize) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size } : w))
    );
  }, []);

  // Actualizar configuración del widget
  const updateWidgetSettings = useCallback((id: string, settings: Record<string, unknown>) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, settings: { ...w.settings, ...settings } } : w))
    );
  }, []);

  // Actualizar layout
  const updateLayout = useCallback((newLayouts: WidgetLayout[]) => {
    setLayouts(newLayouts);
  }, []);

  // Guardar layout actual
  const saveCurrentLayout = useCallback((name: string) => {
    const newLayout: SavedLayout = {
      id: `layout_${Date.now()}`,
      name,
      layouts: [...layouts],
      widgets: [...widgets],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setSavedLayouts((prev) => [...prev, newLayout]);
    setActiveLayoutId(newLayout.id);
    toast.success(`Layout "${name}" guardado`, { icon: '💾' });
  }, [layouts, widgets]);

  // Cargar layout guardado
  const loadLayout = useCallback((layoutId: string) => {
    const layout = savedLayouts.find((l) => l.id === layoutId);
    if (layout) {
      setWidgets(layout.widgets);
      setLayouts(layout.layouts);
      setActiveLayoutId(layoutId);
      toast.success(`Layout "${layout.name}" cargado`, { icon: '📂' });
    }
  }, [savedLayouts]);

  // Eliminar layout
  const deleteLayout = useCallback((layoutId: string) => {
    const layout = savedLayouts.find((l) => l.id === layoutId);
    if (layout) {
      setSavedLayouts((prev) => prev.filter((l) => l.id !== layoutId));
      if (activeLayoutId === layoutId) {
        setActiveLayoutId(null);
      }
      toast.success(`Layout "${layout.name}" eliminado`, { icon: '🗑️' });
    }
  }, [savedLayouts, activeLayoutId]);

  // Reset a default
  const resetToDefault = useCallback(() => {
    const confirmed = window.confirm('¿Estás seguro de restablecer a la configuración por defecto?');
    if (confirmed) {
      setWidgets([]);
      setLayouts([]);
      setActiveLayoutId(null);
      toast.success('Configuración restablecida', { icon: '🔄' });
    }
  }, []);

  return {
    widgets,
    layouts,
    savedLayouts,
    activeLayoutId,
    addWidget,
    removeWidget,
    updateWidgetSize,
    updateWidgetSettings,
    updateLayout,
    saveCurrentLayout,
    loadLayout,
    deleteLayout,
    resetToDefault,
  };
};
