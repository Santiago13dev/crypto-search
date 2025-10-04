'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/components/language/I18nProvider';
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
  const [mounted, setMounted] = useState(false);
  const { t, currentLanguage } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          <motion.div
            key={currentLanguage}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-background border-l border-primary/20 z-50 overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StarIcon className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold text-primary font-mono">
                    {t('favorites.title').toUpperCase()}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-primary hover:bg-primary/10 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-primary/60 font-mono">
                  {t('favorites.count', { count: favorites.length })}
                </p>
                {favorites.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-xs text-error hover:text-error/80 font-mono transition-colors"
                  >
                    {t('favorites.clearAll')}
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {favorites.length === 0 ? (
                <div className="text-center py-20 px-4">
                  <StarIcon className="w-16 h-16 text-primary/20 mx-auto mb-4" />
                  <p className="text-primary/60 font-mono">
                    {t('favorites.empty')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favorites.map((coin, index) => (
                    <motion.div
                      key={coin.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative p-3 border border-primary/20 hover:border-primary/40 transition-colors bg-background-secondary"
                    >
                      <Link href={`/coin/${coin.id}`} className="block">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                              src={coin.image}
                              alt={coin.name}
                              fill
                              className="object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-primary font-mono truncate">
                              {coin.name}
                            </h3>
                            <p className="text-xs text-primary/60 font-mono">
                              {coin.symbol.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </Link>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(coin.id);
                        }}
                        className="absolute top-2 right-2 p-1 text-primary/40 hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
