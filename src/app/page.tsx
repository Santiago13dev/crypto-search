'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import CoinCard from '@/components/features/CoinCard';
import SearchBar from '@/components/features/SearchBar';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/EmptyState';
import FavoritesPanel from '@/components/features/FavoritesPanel';
import FavoritesFloatingButton from '@/components/ui/FavoritesFloatingButton';
import { useCoinsSearch } from '@/hooks/useCoinsSearch';
import { useFavorites } from '@/hooks/useFavorites';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const { results, isLoading, handleSearch } = useCoinsSearch();
  const {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites,
    favoritesCount,
  } = useFavorites();

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Esperar a que el componente esté montado en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mostrar un loader mientras se monta
  if (!mounted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-primary relative overflow-hidden">
      {/* Grid de fondo - efecto terminal */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full h-px bg-primary"
            style={{ top: `${i * 5}%` }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-full w-px bg-primary"
            style={{ left: `${i * 5}%` }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          {/* Título principal */}
          <div className="relative mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.span
                className="text-primary text-2xl md:text-3xl font-mono"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {'>'}
              </motion.span>
              <motion.span
                className="text-primary text-2xl md:text-3xl font-mono"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              >
                {'-'}
              </motion.span>
              <h1 className="text-4xl md:text-6xl font-bold text-primary font-mono tracking-wider">
                {t('home.title')}
              </h1>
            </div>

            {/* Subtítulos */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-primary/90 text-lg md:text-xl mb-2 mt-4 font-mono"
            >
              {`>`} {t('home.subtitle')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-primary/60 text-sm font-mono"
            >
              {t('home.description')}
            </motion.p>
          </div>

          {/* Barra de búsqueda */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={isLoading}
              placeholder={t('home.searchPlaceholder')}
            />
          </motion.div>
        </motion.div>

        {/* Contenido dinámico */}
        <div className="mt-16">
          {isLoading ? (
            <Loading />
          ) : results.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {results.map((coin, index) => (
                <CoinCard
                  key={coin.id}
                  coin={coin}
                  index={index}
                  isFavorite={isFavorite(coin.id)}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: coin.id,
                      name: coin.name,
                      symbol: coin.symbol,
                      image: coin.thumb || coin.large,
                      addedAt: Date.now(),
                    })
                  }
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Footer info */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-primary/50 text-sm font-mono">
              {`>`} {t('home.results', { count: results.length })}
            </p>
          </motion.div>
        )}
      </div>

      {/* Botón flotante de favoritos */}
      <FavoritesFloatingButton
        count={favoritesCount}
        onClick={() => setIsPanelOpen(true)}
      />

      {/* Panel lateral de favoritos */}
      <FavoritesPanel
        favorites={favorites}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onRemove={removeFavorite}
        onClearAll={clearAllFavorites}
      />
    </main>
  );
}
