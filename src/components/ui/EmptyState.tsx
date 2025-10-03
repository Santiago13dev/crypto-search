import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  message?: string;
  showIcon?: boolean;
}

export default function EmptyState({ 
  message = "Enter a cryptocurrency name to start searching...",
  showIcon = true 
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-20 px-4"
    >
      {showIcon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#00ff00]/10 rounded-full blur-xl"></div>
            <MagnifyingGlassIcon className="w-20 h-20 text-[#00ff00]/30 relative z-10" />
          </div>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[#00ff00]/70 text-lg font-mono mb-4"
      >
        {`>`} {message}
      </motion.p>

      {/* Líneas decorativas */}
      <div className="max-w-md mx-auto mt-8 space-y-2">
        {[60, 80, 70].map((width, i) => (
          <motion.div
            key={i}
            initial={{ width: 0 }}
            animate={{ width: `${width}%` }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
            className="h-px bg-gradient-to-r from-transparent via-[#00ff00]/20 to-transparent mx-auto"
          />
        ))}
      </div>
    </motion.div>
  );
}
