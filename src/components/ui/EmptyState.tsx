'use client';

import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/components/language/I18nProvider';

interface EmptyStateProps {
  message?: string;
  showIcon?: boolean;
}

export default function EmptyState({ 
  message,
  showIcon = true 
}: EmptyStateProps) {
  const { t, currentLanguage } = useTranslation();
  const displayMessage = message || t('home.enterQuery');

  return (
    <motion.div
      key={currentLanguage}
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
            <div 
              className="absolute inset-0 rounded-full blur-xl"
              style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}
            ></div>
            <MagnifyingGlassIcon className="w-20 h-20 text-primary/30 relative z-10" />
          </div>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-primary/70 text-lg font-mono mb-4"
      >
        {`>`} {displayMessage}
      </motion.p>

      <div className="max-w-md mx-auto mt-8 space-y-2">
        {[60, 80, 70].map((width, i) => (
          <motion.div
            key={i}
            initial={{ width: 0 }}
            animate={{ width: `${width}%` }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
            className="h-px mx-auto"
            style={{
              backgroundImage: 'linear-gradient(to right, transparent, var(--color-primary), transparent)',
              opacity: 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
