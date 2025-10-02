import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function FavoriteButton({
  isFavorite,
  onToggle,
  size = 'md',
  showLabel = false,
}: FavoriteButtonProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
  };

  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={`${buttonSizeClasses[size]} rounded-none border border-[#00ff00]/20 bg-[#0a0f1e] hover:bg-[#00ff00]/10 transition-all group relative ${
        showLabel ? 'flex items-center gap-2 px-3' : ''
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {isFavorite ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          <StarIcon className={`${sizeClasses[size]} text-[#00ff00]`} />
        </motion.div>
      ) : (
        <StarOutlineIcon
          className={`${sizeClasses[size]} text-[#00ff00]/50 group-hover:text-[#00ff00] transition-colors`}
        />
      )}

      {showLabel && (
        <span className="text-xs font-mono text-[#00ff00]">
          {isFavorite ? 'Favorito' : 'Agregar'}
        </span>
      )}

      <motion.div
        className="absolute inset-0 bg-[#00ff00]/0 group-hover:bg-[#00ff00]/5 transition-colors pointer-events-none"
        initial={false}
      />
    </motion.button>
  );
}