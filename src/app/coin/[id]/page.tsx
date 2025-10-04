'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  GlobeAltIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { coingeckoService } from '@/lib/services/coingecko';
import { CoinDetails } from '@/types/coin';
import { formatNumber, formatPercentage, getFirstValidUrl } from '@/lib/utils/helpers';
import Loading from '@/components/ui/Loading';
import FavoriteButton from '@/components/ui/FavoriteButton';
import AddToPortfolioModal from '@/components/features/AddToPortfolioModal';
import { useFavorites } from '@/hooks/useFavorites';
import { usePortfolio } from '@/hooks/usePortfolio';
import { toast } from 'react-hot-toast';

export default function CoinPage() {
  const params = useParams();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToPortfolio } = usePortfolio();
  
  const [coin, setCoin] = useState<CoinDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);

  const coinId = params.id as string;

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await coingeckoService.getCoinDetails(coinId);
        setCoin(data);
      } catch (err) {
        console.error('Error fetching coin details:', err);
        const message = err instanceof Error ? err.message : 'Error al cargar los detalles';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (coinId) {
      fetchCoinDetails();
    }
  }, [coinId]);

  const handleAddToPortfolio = (amount: number, buyPrice: number) => {
    if (!coin) return;

    addToPortfolio({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image?.thumb || coin.image?.small,
      amount,
      buyPrice,
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-primary flex items-center justify-center">
        <Loading message="Loading cryptocurrency data..." />
      </main>
    );
  }

  if (error || !coin) {
    return (
      <main className="min-h-screen bg-background text-primary flex items-center justify-center">
        <div className="text-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold font-mono mb-2">Error</h1>
            <p className="text-primary/70 font-mono mb-6">
              {error || 'No se pudo cargar la información de la criptomoneda'}
            </p>
          </motion.div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff00] text-black font-bold font-mono rounded-none hover:brightness-125 transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const price = coin.market_data?.current_price?.usd;
  const marketCap = coin.market_data?.market_cap?.usd;
  const volume = coin.market_data?.total_volume?.usd;
  const change24h = coin.market_data?.price_change_percentage_24h;
  const change7d = coin.market_data?.price_change_percentage_7d;
  const high24h = coin.market_data?.high_24h?.usd;
  const low24h = coin.market_data?.low_24h?.usd;
  const circulatingSupply = coin.market_data?.circulating_supply;
  const totalSupply = coin.market_data?.total_supply;
  const maxSupply = coin.market_data?.max_supply;

  const change24hData = formatPercentage(change24h);
  const change7dData = formatPercentage(change7d);

  const homepage = getFirstValidUrl(coin.links?.homepage);

  return (
    <main className="min-h-screen bg-background text-primary relative overflow-hidden">
      {/* Grid de fondo */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full h-px bg-[#00ff00]"
            style={{ top: `${i * 5}%` }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-full w-px bg-[#00ff00]"
            style={{ left: `${i * 5}%` }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Botón volver */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-primary/20 text-primary font-mono hover:bg-[#00ff00]/10 transition-all rounded-none"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            {`>`} BACK
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {coin.image && (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                  <div className="absolute inset-0 bg-[#00ff00]/10 rounded-full blur-lg"></div>
                  <Image
                    src={coin.image.large || coin.image.small}
                    alt={coin.name}
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-primary/20 relative z-10"
                    unoptimized
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl sm:text-5xl font-bold font-mono text-primary">
                  {coin.name}
                </h1>
                <p className="text-xl text-primary/70 font-mono uppercase mt-1">
                  {coin.symbol}
                </p>
                {coin.market_cap_rank && (
                  <p className="text-sm text-primary/50 font-mono mt-2">
                    {`>`} Rank #{coin.market_cap_rank}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPortfolioModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ff00]/10 border border-primary/40 text-primary font-mono hover:bg-[#00ff00]/20 transition-all rounded-none"
              >
                <PlusIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Portafolio</span>
              </button>

              <FavoriteButton
                isFavorite={isFavorite(coin.id)}
                onToggle={() =>
                  toggleFavorite({
                    id: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                    image: coin.image?.thumb || coin.image?.small,
                    addedAt: Date.now(),
                  })
                }
                size="lg"
              />
            </div>
          </div>
        </motion.div>

        {/* Resto del contenido igual... */}
        {/* Precio principal */}
        {price !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 border border-primary/20 bg-background rounded-none"
          >
            <p className="text-sm text-primary/60 font-mono mb-2">{`>`} CURRENT PRICE</p>
            <div className="flex items-end gap-4 flex-wrap">
              <h2 className="text-4xl sm:text-6xl font-bold font-mono text-primary">
                ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
              </h2>
              {change24h !== undefined && (
                <div className="flex items-center gap-2 mb-2">
                  {change24hData.isPositive ? (
                    <ArrowTrendingUpIcon className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-6 h-6 text-red-400" />
                  )}
                  <span
                    className={`text-xl font-bold font-mono ${
                      change24hData.isPositive ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {change24hData.value}
                  </span>
                  <span className="text-sm text-primary/60 font-mono">24h</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          {marketCap !== undefined && (
            <div className="p-4 border border-primary/20 bg-background rounded-none">
              <p className="text-xs text-primary/60 font-mono mb-2">{`>`} MARKET CAP</p>
              <p className="text-2xl font-bold font-mono text-primary">
                {formatNumber(marketCap)}
              </p>
            </div>
          )}
          {volume !== undefined && (
            <div className="p-4 border border-primary/20 bg-background rounded-none">
              <p className="text-xs text-primary/60 font-mono mb-2">{`>`} VOLUME 24H</p>
              <p className="text-2xl font-bold font-mono text-primary">
                {formatNumber(volume)}
              </p>
            </div>
          )}
          {change7d !== undefined && (
            <div className="p-4 border border-primary/20 bg-background rounded-none">
              <p className="text-xs text-primary/60 font-mono mb-2">{`>`} CHANGE 7D</p>
              <p
                className={`text-2xl font-bold font-mono ${
                  change7dData.isPositive ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {change7dData.value}
              </p>
            </div>
          )}
          {high24h !== undefined && (
            <div className="p-4 border border-emerald-500/20 bg-background rounded-none">
              <p className="text-xs text-emerald-400/60 font-mono mb-2">{`>`} HIGH 24H</p>
              <p className="text-2xl font-bold font-mono text-emerald-400">
                ${high24h.toLocaleString()}
              </p>
            </div>
          )}
          {low24h !== undefined && (
            <div className="p-4 border border-red-500/20 bg-background rounded-none">
              <p className="text-xs text-red-400/60 font-mono mb-2">{`>`} LOW 24H</p>
              <p className="text-2xl font-bold font-mono text-red-400">
                ${low24h.toLocaleString()}
              </p>
            </div>
          )}
          {circulatingSupply !== undefined && (
            <div className="p-4 border border-primary/20 bg-background rounded-none">
              <p className="text-xs text-primary/60 font-mono mb-2">{`>`} CIRCULATING SUPPLY</p>
              <p className="text-2xl font-bold font-mono text-primary">
                {circulatingSupply.toLocaleString()} {coin.symbol.toUpperCase()}
              </p>
            </div>
          )}
        </motion.div>

        {(totalSupply !== undefined || maxSupply !== undefined) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 p-6 border border-primary/20 bg-background rounded-none"
          >
            <p className="text-sm text-primary/60 font-mono mb-4">{`>`} SUPPLY INFORMATION</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {circulatingSupply !== undefined && (
                <div>
                  <p className="text-xs text-primary/50 font-mono mb-1">Circulating</p>
                  <p className="text-lg font-mono text-primary">
                    {circulatingSupply.toLocaleString()}
                  </p>
                </div>
              )}
              {totalSupply !== undefined && (
                <div>
                  <p className="text-xs text-primary/50 font-mono mb-1">Total</p>
                  <p className="text-lg font-mono text-primary">
                    {totalSupply.toLocaleString()}
                  </p>
                </div>
              )}
              {maxSupply !== undefined && (
                <div>
                  <p className="text-xs text-primary/50 font-mono mb-1">Max</p>
                  <p className="text-lg font-mono text-primary">
                    {maxSupply.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {coin.description?.en && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 p-6 border border-primary/20 bg-background rounded-none"
          >
            <p className="text-sm text-primary/60 font-mono mb-4">{`>`} ABOUT {coin.name.toUpperCase()}</p>
            <div
              className="text-primary/80 font-mono text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: coin.description.en.split('. ').slice(0, 3).join('. ') + '.',
              }}
            />
          </motion.div>
        )}

        {(homepage || coin.links) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 border border-primary/20 bg-background rounded-none"
          >
            <p className="text-sm text-primary/60 font-mono mb-4">{`>`} LINKS</p>
            <div className="flex flex-wrap gap-3">
              {homepage && (
                <a
                  href={homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 text-primary font-mono hover:bg-[#00ff00]/10 transition-all rounded-none"
                >
                  <GlobeAltIcon className="w-5 h-5" />
                  Website
                </a>
              )}
              {coin.links?.blockchain_site && coin.links.blockchain_site[0] && (
                <a
                  href={coin.links.blockchain_site[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 text-primary font-mono hover:bg-[#00ff00]/10 transition-all rounded-none"
                >
                  <ChartBarIcon className="w-5 h-5" />
                  Explorer
                </a>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal de Portafolio */}
      <AddToPortfolioModal
        isOpen={showPortfolioModal}
        onClose={() => setShowPortfolioModal(false)}
        onAdd={handleAddToPortfolio}
        coinName={coin.name}
        coinSymbol={coin.symbol}
        coinImage={coin.image?.thumb || coin.image?.small}
        currentPrice={price}
      />
    </main>
  );
}
