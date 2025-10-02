import { motion } from 'framer-motion';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ message = 'Cargando...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-[#00ff00]/20 border-t-[#00ff00] rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#00ff00] font-mono text-sm"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}