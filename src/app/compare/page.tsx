'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ScaleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  TrophyIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { coingeckoService } from '@/lib/services/coingecko';
import { CoinDetails } from '@/types/coin';
import { formatNumber, formatPercentage } from '@/lib/utils/helpers';
import { toast } from 'react-hot-toast';
import Loading from '@/components/ui/Loading';
import { Coin } from '@/types/coin';

interface ComparisonCoin extends CoinDetails {
  score: number;
}

export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Coin[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCoins, setSelectedCoins] = useState<ComparisonCoin[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const data = await coingeckoService.searchCoins(query);
      setSearchResults(data.coins || []);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Error al buscar');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCoin = async (coinId: string) => {
    if (selectedCoins.length >= 4) {
      toast.error('Máximo 4 criptomonedas para comparar');
      return;
    }

    if (selectedCoins.some((c) => c.id === coinId)) {
      toast.error('Esta moneda ya está seleccionada');
      return;
    }

    setLoading(true);

    try {
      const details = await coingeckoService.getCoinDetails(coinId);
      const score = calculateScore(details);
      
      setSelectedCoins([...selectedCoins, { ...details, score }]);
      setSearchQuery('');
      setSearchResults([]);
      toast.success(`${details.name} agregado al comparador`, { icon: '✅' });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al obtener detalles');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoin = (coinId: string) => {
    setSelectedCoins(selectedCoins.filter((c) => c.id !== coinId));
  };

  const calculateScore = (coin: CoinDetails): number => {
    let score = 0;
    
    // Market Cap Rank (0-30 points)
    if (coin.market_cap_rank) {
      if (coin.market_cap_rank <= 10) score += 30;
      else if (coin.market_cap_rank <= 50) score += 20;
      else if (coin.market_cap_rank <= 100) score += 10;
      else score += 5;
    }

    // Price Change 24h (0-20 points)
    const change24h = coin.market_data?.price_change_percentage_24h || 0;
    if (change24h > 10) score += 20;
    else if (change24h > 5) score += 15;
    else if (change24h > 0) score += 10;
    else if (change24h > -5) score += 5;

    // Price Change 7d (0-20 points)
    const change7d = coin.market_data?.price_change_percentage_7d || 0;
    if (change7d > 20) score += 20;
    else if (change7d > 10) score += 15;
    else if (change7d > 0) score += 10;
    else if (change7d > -10) score += 5;

    // Volume (0-15 points)
    const volume = coin.market_data?.total_volume?.usd || 0;
    if (volume > 1000000000) score += 15;
    else if (volume > 500000000) score += 10;
    else if (volume > 100000000) score += 5;

    // Market Cap (0-15 points)
    const marketCap = coin.market_data?.market_cap?.usd || 0;
    if (marketCap > 10000000000) score += 15;
    else if (marketCap > 1000000000) score += 10;
    else if (marketCap > 100000000) score += 5;

    return score;
  };

  const getMetricWinner = (metric: keyof CoinDetails['market_data'], higher: boolean = true) => {
    if (selectedCoins.length < 2) return null;

    let bestCoin = selectedCoins[0];
    let bestValue = getMetricValue(selectedCoins[0], metric);

    selectedCoins.forEach((coin) => {
      const value = getMetricValue(coin, metric);
      if (higher ? value > bestValue : value < bestValue) {
        bestValue = value;
        bestCoin = coin;
      }
    });

    return bestCoin.id;
  };

  const getMetricValue = (coin: ComparisonCoin, metric: string): number => {
    const parts = metric.split('.');
    let value: any = coin.market_data;
    
    for (const part of parts) {
      value = value?.[part];
    }

    if (typeof value === 'object' && value !== null) {
      value = value.usd;
    }

    return typeof value === 'number' ? value : 0;
  };

  const metrics = [
    { key: 'current_price.usd', label: 'Precio Actual', format: 'currency', higher: false },
    { key: 'market_cap.usd', label: 'Market Cap', format: 'number', higher: true },
    { key: 'total_volume.usd', label: 'Volumen 24h', format: 'number', higher: true },
    { key: 'price_change_percentage_24h', label: 'Cambio 24h', format: 'percentage', higher: true },
    { key: 'price_change_percentage_7d', label: 'Cambio 7d', format: 'percentage', higher: true },
    { key: 'price_change_percentage_30d', label: 'Cambio 30d', format: 'percentage', higher: true },
    { key: 'high_24h.usd', label: 'Máximo 24h', format: 'currency', higher: true },
    { key: 'low_24h.usd', label: 'Mínimo 24h', format: 'currency', higher: false },
    { key: 'circulating_supply', label: 'Suministro Circulante', format: 'supply', higher: false },
  ];

  const formatMetricValue = (value: number, format: string, symbol?: string) => {
    if (format === 'currency') {
      return `$${value.toLocaleString()}`;
    } else if (format === 'number') {
      return formatNumber(value);
    } else if (format === 'percentage') {
      const data = formatPercentage(value);
      return data.value;
    } else if (format === 'supply') {
      return `${value.toLocaleString()} ${symbol || ''}`;
    }
    return value.toString();
  };

  const bestCoin = selectedCoins.length > 0
    ? selectedCoins.reduce((best, current) => current.score > best.score ? current : best)
    : null;

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
          <div className="flex items-center gap-3 mb-6">
            <ScaleIcon className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold font-mono text-primary">
                {`>`} COMPARADOR DE CRIPTOMONEDAS
              </h1>
              <p className="text-primary/60 font-mono mt-1">
                Compara hasta 4 criptomonedas lado a lado
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar criptomoneda para comparar..."
              disabled={selectedCoins.length >= 4}
              className="w-full bg-background border border-primary/40 text-primary placeholder-[#00ff00]/50 px-4 py-3 pl-12 focus:outline-none focus:border-primary rounded-none font-mono disabled:opacity-50"
            />

            {/* Search Results */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-primary/40 rounded-none max-h-96 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-primary/60 font-mono text-sm">
                    Buscando...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-primary/60 font-mono text-sm">
                    No se encontraron resultados
                  </div>
                ) : (
                  <div className="divide-y divide-[#00ff00]/10">
                    {searchResults.map((coin) => (
                      <button
                        key={coin.id}
                        onClick={() => handleSelectCoin(coin.id)}
                        disabled={selectedCoins.some((c) => c.id === coin.id)}
                        className="w-full p-3 hover:bg-[#00ff00]/10 transition-all flex items-center gap-3 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {(coin.thumb || coin.large) && (
                          <Image
                            src={coin.thumb || coin.large || ''}
                            alt={coin.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                            unoptimized
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-primary font-mono font-bold truncate">
                            {coin.name}
                          </p>
                          <p className="text-primary/60 font-mono text-sm uppercase">
                            {coin.symbol}
                          </p>
                        </div>
                        {coin.market_cap_rank && (
                          <span className="text-primary/50 font-mono text-sm">
                            #{coin.market_cap_rank}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-primary/50 font-mono text-sm mt-4">
            {selectedCoins.length}/4 criptomonedas seleccionadas
          </p>
        </motion.div>

        {loading && <Loading message="Cargando datos de comparación..." />}

        {/* Selected Coins Tags */}
        {selectedCoins.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {selectedCoins.map((coin) => (
              <div
                key={coin.id}
                className="flex items-center gap-2 px-4 py-2 bg-[#00ff00]/10 border border-primary/20 rounded-none"
              >
                {coin.image && (
                  <Image
                    src={coin.image.thumb}
                    alt={coin.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                    unoptimized
                  />
                )}
                <span className="font-mono text-primary font-bold">
                  {coin.name}
                </span>
                <button
                  onClick={() => handleRemoveCoin(coin.id)}
                  className="text-primary/60 hover:text-red-400 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Comparison Table */}
        {selectedCoins.length >= 2 ? (
          <>
            {/* Winner Banner */}
            {bestCoin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-6 border-2 border-primary bg-[#00ff00]/10 rounded-none"
              >
                <div className="flex items-center gap-4 justify-center flex-wrap">
                  <TrophyIcon className="w-12 h-12 text-primary" />
                  <div className="text-center">
                    <p className="text-sm text-primary/60 font-mono mb-1">
                      MEJOR PUNTUACIÓN GENERAL
                    </p>
                    <div className="flex items-center gap-3 justify-center">
                      {bestCoin.image && (
                        <Image
                          src={bestCoin.image.thumb}
                          alt={bestCoin.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                          unoptimized
                        />
                      )}
                      <h2 className="text-3xl font-bold text-primary font-mono">
                        {bestCoin.name}
                      </h2>
                      <span className="text-2xl font-bold text-primary font-mono">
                        {bestCoin.score}/100
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {selectedCoins.map((coin, index) => (
                <motion.div
                  key={coin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border rounded-none ${
                    coin.id === bestCoin?.id
                      ? 'border-primary bg-[#00ff00]/10'
                      : 'border-primary/20 bg-background'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {coin.image && (
                      <Image
                        src={coin.image.thumb}
                        alt={coin.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                        unoptimized
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-primary font-mono text-sm truncate">
                        {coin.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-primary/60 font-mono mb-1">Score</p>
                    <p className="text-3xl font-bold text-primary font-mono">
                      {coin.score}
                    </p>
                    <div className="mt-2 h-2 bg-[#00ff00]/10 rounded-none overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${coin.score}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-[#00ff00]"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Comparison Table */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="overflow-x-auto"
            >
              <table className="w-full border border-primary/20">
                <thead>
                  <tr className="border-b border-primary/20">
                    <th className="p-4 text-left font-mono text-primary bg-background">
                      Métrica
                    </th>
                    {selectedCoins.map((coin) => (
                      <th
                        key={coin.id}
                        className="p-4 text-center font-mono text-primary bg-background min-w-[150px]"
                      >
                        <div className="flex flex-col items-center gap-2">
                          {coin.image && (
                            <Image
                              src={coin.image.thumb}
                              alt={coin.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                              unoptimized
                            />
                          )}
                          <span className="text-sm">{coin.symbol.toUpperCase()}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, index) => {
                    const winner = getMetricWinner(metric.key as any, metric.higher);

                    return (
                      <motion.tr
                        key={metric.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="border-b border-primary/10 hover:bg-[#00ff00]/5 transition-colors"
                      >
                        <td className="p-4 font-mono text-primary/80">
                          {metric.label}
                        </td>
                        {selectedCoins.map((coin) => {
                          const value = getMetricValue(coin, metric.key);
                          const isWinner = coin.id === winner;
                          const isPercentage = metric.format === 'percentage';
                          const isPositive = value >= 0;

                          return (
                            <td
                              key={coin.id}
                              className={`p-4 text-center font-mono ${
                                isWinner
                                  ? 'bg-[#00ff00]/10 font-bold text-primary'
                                  : isPercentage
                                  ? isPositive
                                    ? 'text-emerald-400'
                                    : 'text-red-400'
                                  : 'text-primary/60'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                {isWinner && <TrophyIcon className="w-4 h-4" />}
                                {isPercentage && (
                                  isPositive ? (
                                    <ArrowTrendingUpIcon className="w-4 h-4" />
                                  ) : (
                                    <ArrowTrendingDownIcon className="w-4 h-4" />
                                  )
                                )}
                                <span>
                                  {formatMetricValue(value, metric.format, coin.symbol.toUpperCase())}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>

            {/* Analysis */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 p-6 border border-primary/20 bg-background rounded-none"
            >
              <h3 className="text-xl font-bold text-primary font-mono mb-4">
                {`>`} Análisis de Comparación
              </h3>
              <div className="space-y-3 text-primary/80 font-mono text-sm">
                <p>
                  • <strong>{bestCoin?.name}</strong> tiene la mejor puntuación general con{' '}
                  <strong>{bestCoin?.score}/100 puntos</strong>.
                </p>
                <p>
                  • Basado en: ranking de mercado, cambios de precio, volumen y capitalización.
                </p>
                <p>
                  • Las métricas con 🏆 indican el mejor valor en cada categoría.
                </p>
                <p className="pt-3 text-primary/50 text-xs">
                  ⚠️ Esta comparación es solo informativa. Siempre investiga antes de invertir.
                </p>
              </div>
            </motion.div>
          </>
        ) : selectedCoins.length === 1 ? (
          <div className="text-center py-12">
            <p className="text-primary/60 font-mono">
              Selecciona al menos una criptomoneda más para comenzar la comparación
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <ScaleIcon className="w-20 h-20 text-primary/20 mx-auto mb-4" />
            <p className="text-primary/60 font-mono mb-2">
              Selecciona al menos 2 criptomonedas para comparar
            </p>
            <p className="text-primary/40 font-mono text-sm">
              Usa el buscador para agregar monedas
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
