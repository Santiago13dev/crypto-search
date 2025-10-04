import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

interface FavoritesFloatingButtonProps {
  count: number;
  onClick: () => void;
}

export default function FavoritesFloatingButton({
  count,
  onClick,
}: FavoritesFloatingButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 p-4 rounded-full transition-all z-30 group"
      style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-background)',
        boxShadow: '0 0 30px var(--color-primary)',
      }}
      whileHover={{ 
        scale: 1.1,
        boxShadow: '0 0 40px var(--color-primary)',
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      aria-label={`Ver favoritos (${count})`}
    >
      <div className="relative">
        <StarIcon className="w-7 h-7" />
        
        {/* Badge con contador */}
        {count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2"
            style={{
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
            }}
          >
            {count > 99 ? '99+' : count}
          </motion.div>
        )}

        {/* Efecto de pulso */}
        {count > 0 && (
          <motion.div
            className="absolute inset-0 rounded-full opacity-20"
            style={{ backgroundColor: 'var(--color-primary)' }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div 
          className="px-3 py-2 rounded-none text-sm font-mono whitespace-nowrap border"
          style={{
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-primary)',
            borderColor: 'var(--color-primary)',
          }}
        >
          {count === 0 ? 'Sin favoritos' : `${count} favorito${count !== 1 ? 's' : ''}`}
        </div>
      </div>
    </motion.button>
  );
}
