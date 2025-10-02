'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScaleIcon, MagnifyingGlassIcon, XMarkIcon, TrophyIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
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
    if (coin.market_cap_rank) {
      if (coin.market_cap_rank <= 10) score += 30;
      else if (coin.market_cap_rank <= 50) score += 20;
      else if (coin.market_cap_rank <= 100) score += 10;
      else score += 5;
    }
    const change24h = coin.market_data?.price_change_percentage_24h || 0;
    if (change24h > 10) score += 20;
    else if (change24h > 5) score += 15;
    else if (change24h > 0) score += 10;
    else if (change24h > -5) score += 5;
    const change7d = coin.market_data?.price_change_percentage_7d || 0;
    if (change7d > 20) score += 20;
    else if (change7d > 10) score += 15;
    else if (change7d > 0) score += 10;
    else if (change7d > -10) score += 5;
    const volume = coin.market_data?.total_volume?.usd || 0;
    if (volume > 1000000000) score += 15;
    else if (volume > 500000000) score += 10;
    else if (volume > 100000000) score += 5;
    const marketCap = coin.market_data?.market_cap?.usd || 0;
    if (marketCap > 10000000000) score += 15;
    else if (marketCap > 1000000000) score += 10;
    else if (marketCap > 100000000) score += 5;
    return score;
  };

  const bestCoin = selectedCoins.length > 0
    ? selectedCoins.reduce((best, current) => current.score > best.score ? current : best)
    : null;

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-[#00ff00] relative overflow-hidden">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full h-px bg-[#00ff00]" style={{ top: `${i * 5}%` }} />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full w-px bg-[#00ff00]" style={{ left: `${i * 5}%` }} />
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <ScaleIcon className="w-10 h-10 text-[#00ff00]" />
            <div>
              <h1 className="text-4xl font-bold font-mono text-[#00ff00]">{`>`} COMPARADOR DE CRIPTOMONEDAS</h1>
              <p className="text-[#00ff00]/60 font-mono mt-1">Compara hasta 4 criptomonedas lado a lado</p>
            </div>
          </div>
          <div className="relative max-w-2xl">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00ff00]/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar criptomoneda para comparar..."
              disabled={selectedCoins.length >= 4}
              className="w-full bg-[#0a0f1e] border border-[#00ff00]/40 text-[#00ff00] placeholder-[#00ff00]/50 px-4 py-3 pl-12 focus:outline-none focus:border-[#00ff00] rounded-none font-mono disabled:opacity-50"
            />
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0f1e] border border-[#00ff00]/40 rounded-none max-h-96 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-[#00ff00]/60 font-mono text-sm">Buscando...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-[#00ff00]/60 font-mono text-sm">No se encontraron resultados</div>
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
                          <Image src={coin.thumb || coin.large || ''} alt={coin.name} width={32} height={32} className="rounded-full" unoptimized />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[#00ff00] font-mono font-bold truncate">{coin.name}</p>
                          <p className="text-[#00ff00]/60 font-mono text-sm uppercase">{coin.symbol}</p>
                        </div>
                        {coin.market_cap_rank && <span className="text-[#00ff00]/50 font-mono text-sm">#{coin.market_cap_rank}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-[#00ff00]/50 font-mono text-sm mt-4">{selectedCoins.length}/4 criptomonedas seleccionadas</p>
        </motion.div>
        {loading && <Loading message="Cargando datos de comparación..." />}
        {selectedCoins.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-3 mb-8">
            {selectedCoins.map((coin) => (
              <div key={coin.id} className="flex items-center gap-2 px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/20 rounded-none">
                {coin.image && <Image src={coin.image.thumb} alt={coin.name} width={24} height={24} className="rounded-full" unoptimized />}
                <span className="font-mono text-[#00ff00] font-bold">{coin.name}</span>
                <button onClick={() => handleRemoveCoin(coin.id)} className="text-[#00ff00]/60 hover:text-red-400 transition-colors">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
        {selectedCoins.length === 0 && (
          <div className="text-center py-12">
            <ScaleIcon className="w-20 h-20 text-[#00ff00]/20 mx-auto mb-4" />
            <p className="text-[#00ff00]/60 font-mono mb-2">Selecciona al menos 2 criptomonedas para comparar</p>
            <p className="text-[#00ff00]/40 font-mono text-sm">Usa el buscador para agregar monedas</p>
          </div>
        )}
      </div>
    </main>
  );
}