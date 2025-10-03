/**
 * Configuración de ejemplo para el sistema de widgets
 * Puedes copiar este contenido en localStorage para comenzar con un dashboard pre-configurado
 */

// ====================================
// WIDGETS DE EJEMPLO
// ====================================
// Copia este JSON en localStorage con la key: 'crypto-widgets'

const EXAMPLE_WIDGETS = [
  {
    "id": "widget_price_1",
    "type": "price",
    "title": "Precios en Tiempo Real",
    "size": "expanded",
    "settings": {}
  },
  {
    "id": "widget_portfolio_1",
    "type": "portfolio",
    "title": "Mi Portafolio",
    "size": "expanded",
    "settings": {
      "showChart": true,
      "sortBy": "value"
    }
  },
  {
    "id": "widget_alerts_1",
    "type": "alerts",
    "title": "Alertas Activas",
    "size": "compact",
    "settings": {
      "showTriggered": true,
      "limit": 5
    }
  },
  {
    "id": "widget_news_1",
    "type": "news",
    "title": "Noticias Cripto",
    "size": "expanded",
    "settings": {
      "category": "all",
      "limit": 10
    }
  },
  {
    "id": "widget_chart_1",
    "type": "chart",
    "title": "Gráfico de Precios",
    "size": "expanded",
    "settings": {
      "coinId": "bitcoin",
      "timeRange": "24h",
      "chartType": "line"
    }
  }
];

// ====================================
// LAYOUTS DE EJEMPLO
// ====================================

// Layout 1: Dashboard Principal
const LAYOUT_MAIN = {
  "id": "layout_main",
  "name": "Dashboard Principal",
  "layouts": [
    { "i": "widget_price_1", "x": 0, "y": 0, "w": 4, "h": 3, "minW": 2, "minH": 2 },
    { "i": "widget_portfolio_1", "x": 4, "y": 0, "w": 4, "h": 3, "minW": 4, "minH": 3 },
    { "i": "widget_alerts_1", "x": 8, "y": 0, "w": 4, "h": 3, "minW": 2, "minH": 2 },
    { "i": "widget_news_1", "x": 0, "y": 3, "w": 6, "h": 4, "minW": 3, "minH": 2 },
    { "i": "widget_chart_1", "x": 6, "y": 3, "w": 6, "h": 4, "minW": 4, "minH": 3 }
  ],
  "widgets": EXAMPLE_WIDGETS,
  "createdAt": Date.now(),
  "updatedAt": Date.now()
};

// Layout 2: Vista Trading
const LAYOUT_TRADING = {
  "id": "layout_trading",
  "name": "Vista Trading",
  "layouts": [
    { "i": "widget_chart_1", "x": 0, "y": 0, "w": 8, "h": 6, "minW": 6, "minH": 4 },
    { "i": "widget_price_1", "x": 8, "y": 0, "w": 4, "h": 3, "minW": 2, "minH": 2 },
    { "i": "widget_alerts_1", "x": 8, "y": 3, "w": 4, "h": 3, "minW": 2, "minH": 2 }
  ],
  "widgets": [
    EXAMPLE_WIDGETS[0],
    EXAMPLE_WIDGETS[2],
    EXAMPLE_WIDGETS[4]
  ],
  "createdAt": Date.now(),
  "updatedAt": Date.now()
};

// Layout 3: Vista Compacta
const LAYOUT_COMPACT = {
  "id": "layout_compact",
  "name": "Vista Compacta",
  "layouts": [
    { "i": "widget_price_1", "x": 0, "y": 0, "w": 3, "h": 2, "minW": 2, "minH": 2 },
    { "i": "widget_portfolio_1", "x": 3, "y": 0, "w": 3, "h": 2, "minW": 2, "minH": 2 },
    { "i": "widget_alerts_1", "x": 6, "y": 0, "w": 3, "h": 2, "minW": 2, "minH": 2 },
    { "i": "widget_news_1", "x": 9, "y": 0, "w": 3, "h": 2, "minW": 2, "minH": 2 }
  ],
  "widgets": EXAMPLE_WIDGETS.map(w => ({ ...w, size: "compact" })),
  "createdAt": Date.now(),
  "updatedAt": Date.now()
};

const SAVED_LAYOUTS = [LAYOUT_MAIN, LAYOUT_TRADING, LAYOUT_COMPACT];

// ====================================
// FUNCIÓN PARA APLICAR CONFIGURACIÓN
// ====================================

/**
 * Ejecuta esta función en la consola del navegador para cargar la configuración de ejemplo
 */
function loadExampleConfiguration() {
  try {
    // Guardar widgets
    localStorage.setItem('crypto-widgets', JSON.stringify(EXAMPLE_WIDGETS));
    console.log('✅ Widgets de ejemplo cargados');
    
    // Guardar layouts
    localStorage.setItem('crypto-layouts', JSON.stringify(SAVED_LAYOUTS));
    console.log('✅ Layouts de ejemplo cargados');
    
    // Establecer layout activo
    localStorage.setItem('crypto-active-layout', 'layout_main');
    console.log('✅ Layout principal activado');
    
    console.log('');
    console.log('🎉 Configuración de ejemplo cargada exitosamente!');
    console.log('🔄 Recarga la página para ver los cambios');
    console.log('');
    
    return true;
  } catch (error) {
    console.error('❌ Error al cargar configuración:', error);
    return false;
  }
}

/**
 * Limpia toda la configuración de widgets
 */
function clearWidgetConfiguration() {
  try {
    localStorage.removeItem('crypto-widgets');
    localStorage.removeItem('crypto-layouts');
    localStorage.removeItem('crypto-active-layout');
    
    console.log('✅ Configuración de widgets limpiada');
    console.log('🔄 Recarga la página para empezar desde cero');
    
    return true;
  } catch (error) {
    console.error('❌ Error al limpiar configuración:', error);
    return false;
  }
}

// ====================================
// EXPORTAR PARA USO EN CONSOLA
// ====================================

if (typeof window !== 'undefined') {
  window.loadExampleConfiguration = loadExampleConfiguration;
  window.clearWidgetConfiguration = clearWidgetConfiguration;
  
  console.log('');
  console.log('📋 Funciones disponibles:');
  console.log('  - loadExampleConfiguration() : Cargar configuración de ejemplo');
  console.log('  - clearWidgetConfiguration() : Limpiar configuración');
  console.log('');
}

// ====================================
// CONFIGURACIONES PERSONALIZADAS
// ====================================

/**
 * Ejemplo de configuración para diferentes tipos de usuarios
 */

// Para Traders activos
const TRADER_CONFIG = {
  widgets: [
    { type: "chart", size: "expanded" },
    { type: "price", size: "expanded" },
    { type: "alerts", size: "expanded" }
  ]
};

// Para HODLers
const HODLER_CONFIG = {
  widgets: [
    { type: "portfolio", size: "expanded" },
    { type: "price", size: "compact" },
    { type: "news", size: "expanded" }
  ]
};

// Para Analistas
const ANALYST_CONFIG = {
  widgets: [
    { type: "chart", size: "expanded" },
    { type: "news", size: "expanded" },
    { type: "portfolio", size: "compact" },
    { type: "alerts", size: "compact" }
  ]
};

export {
  EXAMPLE_WIDGETS,
  SAVED_LAYOUTS,
  loadExampleConfiguration,
  clearWidgetConfiguration,
  TRADER_CONFIG,
  HODLER_CONFIG,
  ANALYST_CONFIG
};
