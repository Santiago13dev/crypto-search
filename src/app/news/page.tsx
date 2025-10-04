'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  NewspaperIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { coingeckoService } from '@/lib/services/coingecko';
import Loading from '@/components/ui/Loading';
import Image from 'next/image';
import Link from 'next/link';

interface TrendingCoinData {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank: number;
  price_btc: number;
}

export default function NewsPage() {
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const data = await coingeckoService.getTrendingCoins();
        // Extraer el array de coins del formato {coins: [{item: {...}}]}
        const coins = data.coins.map((c: any) => c.item);
        setTrendingCoins(coins);
      } catch (error) {
        console.error('Error fetching trending:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  // Noticias simuladas (en producción conectarías con una API de noticias real)
  const newsItems = [
    {
      id: 1,
      title: 'Bitcoin alcanza nuevo máximo histórico',
      excerpt: 'El precio de Bitcoin ha superado los $70,000, marcando un hito importante en el mercado de criptomonedas.',
      category: 'Bitcoin',
      time: 'Hace 2 horas',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    },
    {
      id: 2,
      title: 'Ethereum 2.0: La actualización que revoluciona la red',
      excerpt: 'La transición completa a Proof of Stake mejora significativamente la escalabilidad y sostenibilidad de Ethereum.',
      category: 'Ethereum',
      time: 'Hace 5 horas',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    },
    {
      id: 3,
      title: 'Regulación cripto: Nuevas leyes en Estados Unidos',
      excerpt: 'El gobierno de EE.UU. anuncia un marco regulatorio más claro para las criptomonedas y exchanges.',
      category: 'Regulación',
      time: 'Hace 8 horas',
      image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    },
    {
      id: 4,
      title: 'DeFi continúa su expansión global',
      excerpt: 'Las finanzas descentralizadas alcanzan $100 mil millones en valor total bloqueado.',
      category: 'DeFi',
      time: 'Hace 12 horas',
      image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
    },
    {
      id: 5,
      title: 'NFTs: El mercado se estabiliza después del boom',
      excerpt: 'Los tokens no fungibles encuentran casos de uso más allá del arte digital.',
      category: 'NFTs',
      time: 'Hace 1 día',
      image: 'https://assets.coingecko.com/coins/images/13442/large/steth_logo.png',
    },
    {
      id: 6,
      title: 'Solana supera las 400,000 transacciones por segundo',
      excerpt: 'La red demuestra su capacidad de escalabilidad con récord de transacciones simultáneas.',
      category: 'Solana',
      time: 'Hace 1 día',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    },
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loading message="Loading latest news..." />
      </main>
    );
  }

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <NewspaperIcon className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold font-mono text-primary">
                {`>`} NOTICIAS CRIPTO
              </h1>
              <p className="text-primary/60 font-mono mt-1">
                Mantente actualizado con las últimas novedades del mercado
              </p>
            </div>
          </div>
        </motion.div>

        {/* Trending Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <FireIcon className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-bold font-mono text-primary">
              {`>`} TRENDING NOW
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {trendingCoins.slice(0, 7).map((coin, index) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/coin/${coin.id}`}
                  className="block p-3 border border-primary/20 bg-background hover:border-orange-400/40 hover:bg-orange-400/5 transition-all rounded-none group"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-12 h-12">
                      <Image
                        src={coin.thumb}
                        alt={coin.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                        unoptimized
                      />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 text-black rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-primary font-mono truncate w-full">
                        {coin.symbol.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* News Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {newsItems.map((news, index) => (
            <motion.article
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="group border border-primary/20 bg-background hover:border-primary/40 transition-all rounded-none overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 bg-[#00ff00]/5 overflow-hidden">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-contain p-8 group-hover:scale-110 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-[#00ff00]/90 text-black text-xs font-mono font-bold">
                    {news.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-primary/50 font-mono mb-3">
                  <ClockIcon className="w-4 h-4" />
                  <span>{news.time}</span>
                </div>

                <h3 className="text-lg font-bold text-primary font-mono mb-2 group-hover:text-primary/80 transition-colors">
                  {news.title}
                </h3>

                <p className="text-sm text-primary/70 font-mono leading-relaxed mb-4">
                  {news.excerpt}
                </p>

                <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-mono text-sm">
                  <span>Leer más</span>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 p-6 border border-primary/20 bg-[#00ff00]/5 rounded-none text-center"
        >
          <p className="text-primary/80 font-mono">
            {`>`} Las noticias se actualizan automáticamente desde múltiples fuentes
          </p>
          <p className="text-primary/50 font-mono text-sm mt-2">
            Próximamente: Integración con APIs de noticias en tiempo real
          </p>
        </motion.div>
      </div>
    </main>
  );
}
