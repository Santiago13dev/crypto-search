import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { FavoriteCoin } from '@/hooks/useFavorites';
import Image from 'next/image';
import Link from 'next/link';

interface FavoritesPanelProps {
  favorites: FavoriteCoin[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (coinId: string) => void;
  onClearAll: () => void;
}

export default function FavoritesPanel({
  favorites,
  isOpen,
  onClose,
  onRemove,
  onClearAll,
}: FavoritesPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-[#0a0f1e] border-l border-[#00ff00]/20 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#00ff00]/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StarIcon className="w-6 h-6 text-[#00ff00]" />
                  <h2 className="text-xl font-bold text-[#00ff00] font-mono">
                    FAVORITOS
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#00ff00]/10 rounded-none transition-colors"
                  aria-label="Cerrar panel"
                >
                  <XMarkIcon className="w-6 h-6 text-[#00ff00]" />
                </button>
              </div>
              <p className="text-sm text-[#00ff00]/60 font-mono">
                {`>`} {favorites.length} {favorites.length === 1 ? 'moneda' : 'monedas'} guardada
                {favorites.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-4">
              {favorites.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <StarIcon className="w-16 h-16 text-[#00ff00]/20 mx-auto mb-4" />
                  <p className="text-[#00ff00]/60 font-mono mb-2">
                    No hay favoritos aún
                  </p>
                  <p className="text-[#00ff00]/40 text-sm font-mono">
                    Agrega monedas a favoritos para verlas aquí
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {favorites.map((coin, index) => (
                    <motion.div
                      key={coin.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <Link
                        href={`/coin/${coin.id}`}
                        onClick={onClose}
                        className="block p-3 border border-[#00ff00]/20 bg-[#0a0f1e] hover:bg-[#00ff00]/5 rounded-none transition-all"
                      >
                        <div className="flex items-center gap-3">
                          {/* Imagen */}
                          {coin.image && (
                            <div className="relative w-10 h-10 flex-shrink-0">
                              <Image
                                src={coin.image}
                                alt={coin.name}
                                width={40}
                                height={40}
                                className="rounded-full border border-[#00ff00]/20"
                                unoptimized
                              />
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-grow min-w-0">
                            <h3 className="font-bold text-[#00ff00] font-mono text-sm truncate">
                              {coin.name}
                            </h3>
                            <p className="text-xs text-[#00ff00]/60 font-mono uppercase">
                              {coin.symbol}
                            </p>
                          </div>

                          {/* Botón eliminar */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onRemove(coin.id);
                            }}
                            className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-none transition-all"
                            aria-label={`Eliminar ${coin.name} de favoritos`}
                          >
                            <TrashIcon className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {favorites.length > 0 && (
              <div className="p-4 border-t border-[#00ff00]/20">
                <button
                  onClick={onClearAll}
                  className="w-full px-4 py-3 bg-red-500/20 border border-red-500/40 text-red-400 font-mono font-bold rounded-none hover:bg-red-500/30 transition-all"
                >
                  <TrashIcon className="w-5 h-5 inline mr-2" />
                  ELIMINAR TODOS
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
