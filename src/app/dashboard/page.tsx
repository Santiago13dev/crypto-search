'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/components/language/I18nProvider';
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
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
    <main className="min-h-screen bg-background text-primary relative overflow-hidden">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full h-px bg-primary" style={{ top: `${i * 5}%` }} />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full w-px bg-primary" style={{ left: `${i * 5}%` }} />
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold font-mono text-primary">
              {`>`} {t('dashboard.title')}
            </h1>
          </div>
          <p className="text-primary/60 font-mono mb-6">
            {t('dashboard.subtitle')}
          </p>

          <WidgetToolbar
            widgetCount={widgets.length}
            savedLayoutsCount={savedLayouts.length}
            onAdd={() => setIsAddModalOpen(true)}
            onSave={() => setIsSaveModalOpen(true)}
            onLoad={() => setIsLoadModalOpen(true)}
            onReset={resetToDefault}
          />
        </motion.div>

        <WidgetContainer
          widgets={widgets}
          layouts={layouts}
          onLayoutChange={handleLayoutChange}
          onRemoveWidget={removeWidget}
          onResizeWidget={handleResizeWidget}
        />
      </div>

      <AddWidgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddWidget}
        existingWidgets={widgets}
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
