'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, MagnifyingGlassIcon, XMarkIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { coingeckoService } from '@/lib/services/coingecko';
import { formatNumber, formatPercentage } from '@/lib/utils/helpers';
import Loading from '@/components/ui/Loading';
import Image from 'next/image';
import Link from 'next/link';
import { Coin } from '@/types/coin';
import { toast } from 'react-hot-toast';

interface TopCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

export default function ChartsPage() {
  const [topCoins, setTopCoins] = useState<TopCoin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<TopCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'price' | 'market_cap' | 'volume'>('market_cap');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Coin[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        setLoading(true);
        const data = await coingeckoService.getTopCoins(50);
        setTopCoins(data);
        setFilteredCoins(data.slice(0, 20));
      } catch (error) {
        console.error('Error fetching top coins:', error);
        toast.error('Error al cargar las gráficas');
      } finally {
        setLoading(false);
      }
    };
    fetchTopCoins();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setFilteredCoins(topCoins.slice(0, 20));
      return;
    }
    setIsSearching(true);
    setShowSearchResults(true);
    try {
      const data = await coingeckoService.searchCoins(query);
      setSearchResults(data.coins || []);
    } catch (error) {
      console.error('Error searching coins:', error);
      toast.error('Error al buscar');
    } finally {
      setIsSearching(false);
    }
  };

  const getMetricValue = (coin: TopCoin) => {
    switch (selectedMetric) {
      case 'price': return coin.current_price;
      case 'market_cap': return coin.market_cap;
      case 'volume': return coin.total_volume;
    }
  };

  const getMaxValue = () => {
    if (filteredCoins.length === 0) return 1;
    return Math.max(...filteredCoins.map(getMetricValue));
  };

  const maxValue = getMaxValue();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <Loading message="Cargando datos de mercado..." />
      </main>
    );
  }

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
            <ChartBarIcon className="w-10 h-10 text-[#00ff00]" />
            <div>
              <h1 className="text-4xl font-bold font-mono text-[#00ff00]">{`>`} GRÁFICAS DE MERCADO</h1>
              <p className="text-[#00ff00]/60 font-mono mt-1">Visualiza y compara criptomonedas</p>
            </div>
          </div>
          <div className="mb-6 relative">
            <div className="flex gap-2 max-w-2xl">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00ff00]/50" />
                <input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Buscar criptomoneda..." className="w-full bg-[#0a0f1e] border border-[#00ff00]/40 text-[#00ff00] placeholder-[#00ff00]/50 px-4 py-3 pl-12 pr-10 focus:outline-none focus:border-[#00ff00] rounded-none font-mono" />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setSearchResults([]); setShowSearchResults(false); setFilteredCoins(topCoins.slice(0, 20)); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00ff00]/50 hover:text-[#00ff00]">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button onClick={() => setFilteredCoins(topCoins.slice(0, 20))} className="px-4 py-3 bg-[#00ff00]/10 border border-[#00ff00]/20 text-[#00ff00] font-mono hover:bg-[#00ff00]/20 transition-all rounded-none whitespace-nowrap">Reset Top 20</button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[{ key: 'market_cap' as const, label: 'Market Cap' }, { key: 'price' as const, label: 'Precio' }, { key: 'volume' as const, label: 'Volumen 24h' }].map((metric) => (
              <button key={metric.key} onClick={() => setSelectedMetric(metric.key)} className={`px-4 py-2 font-mono text-sm transition-all rounded-none ${selectedMetric === metric.key ? 'bg-[#00ff00] text-black font-bold' : 'bg-[#0a0f1e] border border-[#00ff00]/20 text-[#00ff00] hover:bg-[#00ff00]/10'}`}>{metric.label}</button>
            ))}
          </div>
          <p className="text-[#00ff00]/50 font-mono text-sm mt-4">{`>`} Mostrando {filteredCoins.length} {filteredCoins.length === 1 ? 'criptomoneda' : 'criptomonedas'}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
          {filteredCoins.length === 0 ? (
            <div className="text-center py-12"><p className="text-[#00ff00]/60 font-mono">No hay monedas para mostrar</p></div>
          ) : (
            filteredCoins.map((coin, index) => {
              const value = getMetricValue(coin);
              const percentage = (value / maxValue) * 100;
              const change24h = formatPercentage(coin.price_change_percentage_24h);
              return (
                <motion.div key={coin.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }} className="group relative">
                  <Link href={`/coin/${coin.id}`} className="block p-4 border border-[#00ff00]/20 bg-[#0a0f1e] hover:border-[#00ff00]/40 transition-all rounded-none">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-8 text-center"><span className="text-[#00ff00]/50 font-mono font-bold">#{coin.market_cap_rank || index + 1}</span></div>
                      <div className="relative w-8 h-8 flex-shrink-0"><Image src={coin.image} alt={coin.name} width={32} height={32} className="rounded-full" unoptimized /></div>
                      <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><h3 className="text-lg font-bold text-[#00ff00] font-mono truncate">{coin.name}</h3><span className="text-sm text-[#00ff00]/60 font-mono uppercase">{coin.symbol}</span></div></div>
                      <div className="text-right"><p className="text-lg font-bold text-[#00ff00] font-mono">{selectedMetric === 'price' ? `$${value.toLocaleString()}` : formatNumber(value)}</p></div>
                      <div className="flex items-center gap-1 min-w-[80px] justify-end">{change24h.isPositive ? (<ArrowTrendingUpIcon className="w-4 h-4 text-emerald-400" />) : (<ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />)}<span className={`text-sm font-mono font-bold ${change24h.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>{change24h.value}</span></div>
                    </div>
                    <div className="relative h-2 bg-[#00ff00]/10 rounded-none overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.8, delay: index * 0.03 }} className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00ff00] to-emerald-400 group-hover:brightness-125 transition-all" /></div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </main>
  );
}