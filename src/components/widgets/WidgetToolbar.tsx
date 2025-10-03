'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon,
  BookmarkIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  ViewColumnsIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface WidgetToolbarProps {
  onAddWidget: () => void;
  onSaveLayout: () => void;
  onLoadLayout: () => void;
  onResetLayout: () => void;
  savedLayoutsCount: number;
  widgetsCount: number;
}

export default function WidgetToolbar({
  onAddWidget,
  onSaveLayout,
  onLoadLayout,
  onResetLayout,
  savedLayoutsCount,
  widgetsCount,
}: WidgetToolbarProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-[#0a0f1e] border border-[#00ff00]/30 rounded-lg p-4 mb-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Left side - Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ViewColumnsIcon className="w-5 h-5 text-[#00ff00]" />
            <span className="text-sm font-mono text-[#00ff00]">
              {widgetsCount} Widget{widgetsCount !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <BookmarkIcon className="w-5 h-5 text-[#00ff00]" />
            <span className="text-sm font-mono text-[#00ff00]">
              {savedLayoutsCount} Layout{savedLayoutsCount !== 1 ? 's' : ''} guardado{savedLayoutsCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Add Widget */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddWidget}
            className="flex items-center gap-2 px-4 py-2 bg-[#00ff00]/20 border border-[#00ff00] rounded hover:bg-[#00ff00]/30 transition-colors"
          >
            <PlusIcon className="w-4 h-4 text-[#00ff00]" />
            <span className="text-sm font-mono font-bold text-[#00ff00]">
              Agregar Widget
            </span>
          </motion.button>

          {/* Save Layout */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSaveLayout}
            disabled={widgetsCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#00ff00]/5 border border-[#00ff00]/30 rounded hover:bg-[#00ff00]/10 hover:border-[#00ff00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BookmarkIcon className="w-4 h-4 text-[#00ff00]" />
            <span className="text-sm font-mono text-[#00ff00]">Guardar</span>
          </motion.button>

          {/* Load Layout */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLoadLayout}
            disabled={savedLayoutsCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#00ff00]/5 border border-[#00ff00]/30 rounded hover:bg-[#00ff00]/10 hover:border-[#00ff00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className="w-4 h-4 text-[#00ff00]" />
            <span className="text-sm font-mono text-[#00ff00]">Cargar</span>
          </motion.button>

          {/* Reset Layout */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onResetLayout}
            disabled={widgetsCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/5 border border-red-500/30 rounded hover:bg-red-500/10 hover:border-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrashIcon className="w-4 h-4 text-red-400" />
            <span className="text-sm font-mono text-red-400">Reset</span>
          </motion.button>
        </div>
      </div>

      {/* Info bar */}
      <div className="mt-4 pt-4 border-t border-[#00ff00]/20">
        <p className="text-xs text-[#00ff00]/60 font-mono">
          💡 <span className="text-[#00ff00]">Tip:</span> Arrastra los widgets para reorganizar. 
          Usa las esquinas para redimensionar.
        </p>
      </div>
    </motion.div>
  );
}
