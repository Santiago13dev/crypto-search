import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

interface FavoritesFloatingButtonProps {
  count: number;
  onClick: () => void;
}

export default function FavoritesFloatingButton({
  count,
  onClick,
}: FavoritesFloatingButtonProps) {
  if (count === 0) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="fixed bottom-6 right-6 z-50 p-4 bg-[#00ff00] text-black rounded-none shadow-lg hover:brightness-125 transition-all group"
        aria-label="Ver favoritos"
      >
        <div className="relative">
          <StarIcon className="w-6 h-6" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-black text-[#00ff00] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold font-mono border border-[#00ff00]"
          >
            {count}
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
        />
      </motion.button>
    </AnimatePresence>
  );
}