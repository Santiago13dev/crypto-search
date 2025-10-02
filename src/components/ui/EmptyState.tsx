import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  message?: string;
  submessage?: string;
  showIcon?: boolean;
}

export default function EmptyState({
  message = 'No hay resultados',
  submessage = 'Intenta buscar algo diferente',
  showIcon = true,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {showIcon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="mb-6"
        >
          <MagnifyingGlassIcon className="w-24 h-24 text-[#00ff00]/20" />
        </motion.div>
      )}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-[#00ff00]/80 font-mono mb-2 text-center"
      >
        {message}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-[#00ff00]/50 font-mono text-center max-w-md"
      >
        {submessage}
      </motion.p>
    </motion.div>
  );
}