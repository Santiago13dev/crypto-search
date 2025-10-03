# 📱 Sistema de Widgets Personalizables - Documentación

## 🎯 Características Implementadas

### ✅ Panel Personalizable con Drag & Drop
- Sistema completo de arrastrar y soltar usando `react-grid-layout`
- Reorganización de widgets en tiempo real
- Grid responsivo de 12 columnas
- Transiciones suaves y animaciones

### ✅ Widgets Disponibles

1. **💰 Widget de Precios**
   - Muestra precios en tiempo real de tus monedas favoritas
   - Cambio porcentual en 24h
   - Modo compacto (3 monedas) y expandido (6 monedas)

2. **📰 Widget de Noticias**
   - Últimas noticias del mundo crypto
   - Categorización por tipo
   - Vista compacta y expandida

3. **🔔 Widget de Alertas**
   - Gestión de alertas activas y activadas
   - Detalles de condiciones de precio
   - Eliminación rápida de alertas

4. **📊 Widget de Portafolio**
   - Resumen de inversión total
   - Ganancias/Pérdidas en tiempo real
   - Lista de holdings con valores actuales

5. **📈 Widget de Gráficos**
   - Gráfico interactivo SVG
   - Selector de monedas
   - Estadísticas de máximo, mínimo y variación

### ✅ Guardar Layouts Diferentes
- Guarda configuraciones completas de widgets
- Múltiples layouts con nombres personalizados
- Fecha de creación y última actualización
- Carga rápida de layouts guardados

### ✅ Modo Compacto/Expandido
- Toggle entre tamaños en cada widget
- Ajuste automático de contenido
- Preservación de estado al cambiar tamaño

## 📦 Instalación

### 1. Instalar Dependencias

```bash
npm install react-grid-layout @types/react-grid-layout
```

### 2. Importar CSS de React Grid Layout

Agrega al archivo `src/app/globals.css`:

```css
@import 'react-grid-layout/css/styles.css';
@import 'react-resizable/css/styles.css';
```

## 🚀 Uso

### Acceder al Dashboard

1. Navega a `/dashboard` en tu aplicación
2. Haz clic en el enlace "Dashboard" en la navbar

### Agregar Widgets

1. Click en **"Agregar Widget"**
2. Selecciona el tipo de widget que desees
3. El widget aparecerá en el grid

### Reorganizar Widgets

1. **Arrastra** el widget desde cualquier parte de su header
2. Suéltalo en la posición deseada
3. El layout se guarda automáticamente en localStorage

### Redimensionar Widgets

1. Haz hover sobre la **esquina inferior derecha** del widget
2. Aparecerá un indicador de redimensionamiento
3. Arrastra para cambiar el tamaño

### Alternar Tamaño (Compacto/Expandido)

1. Click en el ícono de **flechas** en el header del widget
2. El widget alternará entre modo compacto y expandido

### Eliminar Widgets

1. Click en la **X** en el header del widget
2. El widget será removido inmediatamente

### Guardar Layout

1. Organiza tus widgets como desees
2. Click en **"Guardar"**
3. Ingresa un nombre para el layout
4. Click en "Guardar"

### Cargar Layout

1. Click en **"Cargar"**
2. Selecciona el layout que deseas cargar
3. El dashboard se actualizará con esa configuración

### Eliminar Layout

1. En el modal de "Cargar Layout"
2. Click en el ícono de **basura** junto al layout
3. Confirma la eliminación

### Reset a Default

1. Click en **"Reset"**
2. Confirma la acción
3. Todos los widgets y layouts serán eliminados

## 🎨 Personalización

### Configuración de Grid

El grid está configurado en `WidgetContainer.tsx`:

```typescript
<GridLayout
  cols={12}              // 12 columnas
  rowHeight={80}         // Altura de cada fila
  margin={[16, 16]}      // Margen entre widgets
  // ...
/>
```

### Tamaños por Defecto

Los tamaños de widgets se definen en `useWidgets.ts`:

```typescript
const DEFAULT_LAYOUTS: Record<WidgetType, Omit<WidgetLayout, 'i'>> = {
  price: { x: 0, y: 0, w: 4, h: 3, minW: 2, minH: 2 },
  news: { x: 4, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
  // ...
};
```

### Agregar Nuevo Widget

1. Crear componente en `src/components/widgets/MiWidget.tsx`
2. Agregar tipo en `src/types/widget.ts`:
   ```typescript
   export type WidgetType = 'price' | 'news' | 'mi-widget';
   ```
3. Agregar en `WidgetContainer.tsx`:
   ```typescript
   case 'mi-widget':
     return <MiWidget {...commonProps} />;
   ```
4. Agregar opción en `AddWidgetModal.tsx`

## 💾 Persistencia de Datos

Todos los datos se guardan en `localStorage`:

- **Widgets**: `crypto-widgets`
- **Layouts guardados**: `crypto-layouts`
- **Layout activo**: `crypto-active-layout`

## 🔧 Estructura de Archivos

```
src/
├── types/
│   └── widget.ts                    # Tipos TypeScript
├── hooks/
│   └── useWidgets.ts                # Hook principal de widgets
├── components/
│   └── widgets/
│       ├── BaseWidget.tsx           # Componente base
│       ├── PriceWidget.tsx          # Widget de precios
│       ├── NewsWidget.tsx           # Widget de noticias
│       ├── AlertsWidget.tsx         # Widget de alertas
│       ├── PortfolioWidget.tsx      # Widget de portafolio
│       ├── ChartWidget.tsx          # Widget de gráficos
│       ├── WidgetContainer.tsx      # Contenedor drag & drop
│       ├── WidgetToolbar.tsx        # Barra de herramientas
│       ├── AddWidgetModal.tsx       # Modal agregar widget
│       ├── SaveLayoutModal.tsx      # Modal guardar layout
│       ├── LoadLayoutModal.tsx      # Modal cargar layout
│       └── index.ts                 # Exports
└── app/
    └── dashboard/
        └── page.tsx                 # Página del dashboard
```

## 🎯 Funcionalidades Adicionales

### Indicadores Visuales

- **Layout activo**: Badge "ACTIVO" en el layout actual
- **Grid placeholder**: Visualización de dónde caerá el widget
- **Resize handle**: Indicador visual en esquina inferior derecha
- **Drag cursor**: Cursor de mover al arrastrar

### Responsive Design

- Grid responsive que se adapta a diferentes tamaños de pantalla
- Widgets ajustan su contenido según el espacio disponible
- Mobile-friendly con scroll horizontal si es necesario

### Animaciones

- Entrada suave de widgets con Framer Motion
- Transiciones al reorganizar
- Fade in/out de modales
- Indicadores animados

## 🐛 Solución de Problemas

### Los widgets no se mueven

- Asegúrate de que la clase `widget-drag-handle` esté en el elemento correcto
- Verifica que `isDraggable={true}` en GridLayout

### El tamaño no se guarda

- Revisa que `onLayoutChange` esté conectado correctamente
- Verifica localStorage en DevTools

### Widgets desaparecen al recargar

- Confirma que el hook `useWidgets` esté inicializando desde localStorage
- Revisa la consola por errores de JSON.parse

## 📝 Notas Importantes

1. **React Grid Layout requiere dimensiones fijas**: El contenedor usa `width={1200}` - ajusta según tu diseño

2. **SSR**: React Grid Layout se importa dinámicamente para evitar problemas con Next.js SSR

3. **Performance**: Con muchos widgets (10+), considera virtualización o lazy loading

4. **Browser Compatibility**: Probado en Chrome, Firefox, Safari y Edge modernos

## 🚀 Próximas Mejoras Sugeridas

- [ ] Temas personalizables por widget
- [ ] Exportar/Importar layouts como JSON
- [ ] Compartir layouts entre usuarios
- [ ] Widget de configuración global
- [ ] Modo pantalla completa por widget
- [ ] Atajos de teclado
- [ ] Drag & drop entre diferentes pages
- [ ] Historial de cambios (undo/redo)

## 📄 Licencia

Este sistema de widgets es parte del proyecto Crypto Search.

---

**¿Necesitas ayuda?** Revisa la documentación de [React Grid Layout](https://github.com/react-grid-layout/react-grid-layout) para más detalles sobre personalización avanzada.
