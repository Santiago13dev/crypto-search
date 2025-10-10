import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import type { WidgetSize } from '@/types/widget';

interface BaseWidgetProps {
  id: string;
  title: string;
  size: WidgetSize;
  children: ReactNode;
  onRemove: () => void;
  onToggleSize?: () => void;
  icon?: ReactNode;
  className?: string;
}

export default function BaseWidget({
  title,
  size,
  children,
  onRemove,
  onToggleSize,
  icon,
  className = '',
}: BaseWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`h-full bg-background border border-primary/30 rounded-lg overflow-hidden flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/30 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary">{icon}</div>}
          <h3 className="text-sm font-mono font-bold text-primary tracking-wider">
            {`>`} {title}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Toggle size button */}
          {onToggleSize && (
            <button
              onClick={onToggleSize}
              className="p-1 hover:bg-[#00ff00]/10 rounded transition-colors"
              title={size === 'compact' ? 'Expandir' : 'Compactar'}
            >
              {size === 'compact' ? (
                <ArrowsPointingOutIcon className="w-4 h-4 text-primary" />
              ) : (
                <ArrowsPointingInIcon className="w-4 h-4 text-primary" />
              )}
            </button>
          )}
          
          {/* Remove button */}
          <button
            onClick={onRemove}
            className="p-1 hover:bg-red-500/10 rounded transition-colors group"
            title="Eliminar widget"
          >
            <XMarkIcon className="w-4 h-4 text-primary group-hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 scrollbar-terminal">
        {children}
      </div>

      {/* Terminal effect - bottom border */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#00ff00] to-transparent opacity-50" />
    </motion.div>
  );
}
