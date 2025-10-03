'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWidgets } from '@/hooks/useWidgets';
import { 
  WidgetContainer, 
  WidgetToolbar, 
  AddWidgetModal,
  SaveLayoutModal,
  LoadLayoutModal 
} from '@/components/widgets';
import type { WidgetType, WidgetSize } from '@/types/widget';
import type { Layout } from 'react-grid-layout';

export default function DashboardPage() {
  const {
    widgets,
    layouts,
    savedLayouts,
    activeLayoutId,
    addWidget,
    removeWidget,
    updateWidgetSize,
    updateLayout,
    saveCurrentLayout,
    loadLayout,
    deleteLayout,
    resetToDefault,
  } = useWidgets();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

  const handleLayoutChange = (newLayouts: Layout[]) => {
    updateLayout(newLayouts);
  };

  const handleAddWidget = (type: WidgetType) => {
    addWidget(type);
  };

  const handleResizeWidget = (id: string, size: WidgetSize) => {
    updateWidgetSize(id, size);
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-[#00ff00] relative overflow-hidden">
      {/* Grid de fondo - efecto terminal */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full h-px bg-[#00ff00]"
            style={{ top: `${i * 5}%` }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-full w-px bg-[#00ff00]"
            style={{ left: `${i * 5}%` }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.span
              className="text-[#00ff00] text-2xl font-mono"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {'>'}
            </motion.span>
            <h1 className="text-3xl md:text-4xl font-bold text-[#00ff00] font-mono tracking-wider">
              DASHBOARD
            </h1>
          </div>
          <p className="text-[#00ff00]/60 text-sm font-mono ml-9">
            Panel personalizable de widgets cripto
          </p>
        </motion.div>

        {/* Toolbar */}
        <WidgetToolbar
          onAddWidget={() => setIsAddModalOpen(true)}
          onSaveLayout={() => setIsSaveModalOpen(true)}
          onLoadLayout={() => setIsLoadModalOpen(true)}
          onResetLayout={resetToDefault}
          savedLayoutsCount={savedLayouts.length}
          widgetsCount={widgets.length}
        />

        {/* Widget Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <WidgetContainer
            widgets={widgets}
            layouts={layouts}
            onLayoutChange={handleLayoutChange}
            onRemoveWidget={removeWidget}
            onResizeWidget={handleResizeWidget}
          />
        </motion.div>

        {/* Help text */}
        {widgets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-[#00ff00]/5 border border-[#00ff00]/30 rounded-lg"
          >
            <h3 className="text-lg font-mono font-bold text-[#00ff00] mb-3">
              {`>`} Primeros pasos
            </h3>
            <ul className="space-y-2 text-sm font-mono text-[#00ff00]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#00ff00]">•</span>
                <span>Haz clic en <strong className="text-[#00ff00]">&quot;Agregar Widget&quot;</strong> para añadir tu primer widget</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00ff00]">•</span>
                <span>Arrastra los widgets para reorganizar tu dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00ff00]">•</span>
                <span>Redimensiona usando el ícono en la esquina inferior derecha</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00ff00]">•</span>
                <span>Guarda tus configuraciones favoritas con <strong className="text-[#00ff00]">&quot;Guardar&quot;</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00ff00]">•</span>
                <span>Alterna entre layouts guardados con <strong className="text-[#00ff00]">&quot;Cargar&quot;</strong></span>
              </li>
            </ul>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AddWidgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddWidget}
      />

      <SaveLayoutModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={saveCurrentLayout}
      />

      <LoadLayoutModal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        savedLayouts={savedLayouts}
        activeLayoutId={activeLayoutId}
        onLoad={loadLayout}
        onDelete={deleteLayout}
      />
    </main>
  );
}
