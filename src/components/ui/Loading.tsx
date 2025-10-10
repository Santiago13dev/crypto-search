import { motion } from 'framer-motion';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "searching cryptocurrency data..." }: LoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      {/* Spinner con efecto de pulso */}
      <div className="relative">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
        <div 
          className="absolute inset-0 animate-pulse rounded-full h-16 w-16"
          style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}
        ></div>
      </div>

      {/* Mensaje */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-primary/80 text-lg font-mono"
      >
        {`>`} {message}
      </motion.p>

      {/* Puntos animados */}
      <div className="flex gap-1 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
