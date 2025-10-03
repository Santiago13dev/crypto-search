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
      className="fixed bottom-6 right-6 p-4 bg-[#00ff00] text-black rounded-full shadow-[0_0_30px_rgba(0,255,0,0.5)] hover:shadow-[0_0_40px_rgba(0,255,0,0.7)] transition-all z-30 group"
      whileHover={{ scale: 1.1 }}
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
            className="absolute -top-2 -right-2 bg-black text-[#00ff00] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-[#00ff00]"
          >
            {count > 99 ? '99+' : count}
          </motion.div>
        )}

        {/* Efecto de pulso */}
        {count > 0 && (
          <motion.div
            className="absolute inset-0 bg-[#00ff00] rounded-full opacity-20"
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
        <div className="bg-black text-[#00ff00] px-3 py-2 rounded-none text-sm font-mono whitespace-nowrap border border-[#00ff00]/20">
          {count === 0 ? 'Sin favoritos' : `${count} favorito${count !== 1 ? 's' : ''}`}
        </div>
      </div>
    </motion.button>
  );
}
