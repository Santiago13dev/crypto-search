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

interface ComparisonCoin extends CoinDetails { score: number; }

export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Coin[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCoins, setSelectedCoins] = useState<ComparisonCoin[]>([]);
  const [loading, setLoading] = useState(false);

 feature/crypto-comparator
  const handleSearch = async (query: string) => { setSearchQuery(query); if (!query.trim()) { setSearchResults([]); return; } setIsSearching(true); try { const data = await coingeckoService.searchCoins(query); setSearchResults(data.coins || []); } catch (error) { console.error('Error searching:', error); toast.error('Error al buscar'); } finally { setIsSearching(false); } };
  const handleSelectCoin = async (coinId: string) => { if (selectedCoins.length >= 4) { toast.error('Máximo 4 criptomonedas'); return; } if (selectedCoins.some((c) => c.id === coinId)) { toast.error('Ya seleccionada'); return; } setLoading(true); try { const details = await coingeckoService.getCoinDetails(coinId); const score = calculateScore(details); setSelectedCoins([...selectedCoins, { ...details, score }]); setSearchQuery(''); setSearchResults([]); toast.success(`${details.name} agregado`, { icon: '✅' }); } catch (error) { toast.error('Error al obtener detalles'); } finally { setLoading(false); } };
  const handleRemoveCoin = (coinId: string) => { setSelectedCoins(selectedCoins.filter((c) => c.id !== coinId)); };
  const calculateScore = (coin: CoinDetails): number => { let score = 0; if (coin.market_cap_rank) { if (coin.market_cap_rank <= 10) score += 30; else if (coin.market_cap_rank <= 50) score += 20; else if (coin.market_cap_rank <= 100) score += 10; else score += 5; } const change24h = coin.market_data?.price_change_percentage_24h || 0; if (change24h > 10) score += 20; else if (change24h > 5) score += 15; else if (change24h > 0) score += 10; else if (change24h > -5) score += 5; const change7d = coin.market_data?.price_change_percentage_7d || 0; if (change7d > 20) score += 20; else if (change7d > 10) score += 15; else if (change7d > 0) score += 10; else if (change7d > -10) score += 5; const volume = coin.market_data?.total_volume?.usd || 0; if (volume > 1000000000) score += 15; else if (volume > 500000000) score += 10; else if (volume > 100000000) score += 5; const marketCap = coin.market_data?.market_cap?.usd || 0; if (marketCap > 10000000000) score += 15; else if (marketCap > 1000000000) score += 10; else if (marketCap > 100000000) score += 5; return score; };
  const getMetricWinner = (metric: keyof CoinDetails['market_data'], higher: boolean = true) => { if (selectedCoins.length < 2) return null; let bestCoin = selectedCoins[0]; let bestValue = getMetricValue(selectedCoins[0], metric); selectedCoins.forEach((coin) => { const value = getMetricValue(coin, metric); if (higher ? value > bestValue : value < bestValue) { bestValue = value; bestCoin = coin; } }); return bestCoin.id; };
  const getMetricValue = (coin: ComparisonCoin, metric: string): number => { const parts = metric.split('.'); let value: any = coin.market_data; for (const part of parts) { value = value?.[part]; } if (typeof value === 'object' && value !== null) { value = value.usd; } return typeof value === 'number' ? value : 0; };
  const metrics = [ { key: 'current_price.usd', label: 'Precio Actual', format: 'currency', higher: false }, { key: 'market_cap.usd', label: 'Market Cap', format: 'number', higher: true }, { key: 'total_volume.usd', label: 'Volumen 24h', format: 'number', higher: true }, { key: 'price_change_percentage_24h', label: 'Cambio 24h', format: 'percentage', higher: true }, { key: 'price_change_percentage_7d', label: 'Cambio 7d', format: 'percentage', higher: true }, { key: 'price_change_percentage_30d', label: 'Cambio 30d', format: 'percentage', higher: true }, { key: 'high_24h.usd', label: 'Máximo 24h', format: 'currency', higher: true }, { key: 'low_24h.usd', label: 'Mínimo 24h', format: 'currency', higher: false }, { key: 'circulating_supply', label: 'Suministro Circulante', format: 'supply', higher: false } ];
  const formatMetricValue = (value: number, format: string, symbol?: string) => { if (format === 'currency') { return `$${value.toLocaleString()}`; } else if (format === 'number') { return formatNumber(value); } else if (format === 'percentage') { const data = formatPercentage(value); return data.value; } else if (format === 'supply') { return `${value.toLocaleString()} ${symbol || ''}`; } return value.toString(); };
  const bestCoin = selectedCoins.length > 0 ? selectedCoins.reduce((best, current) => current.score > best.score ? current : best) : null;

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-[#00ff00] relative overflow-hidden">
      <div className="fixed inset-0 opacity-10 pointer-events-none">{Array.from({ length: 20 }).map((_, i) => (<div key={`h-${i}`} className="absolute w-full h-px bg-[#00ff00]" style={{ top: `${i * 5}%` }} />))}{Array.from({ length: 20 }).map((_, i) => (<div key={`v-${i}`} className="absolute h-full w-px bg-[#00ff00]" style={{ left: `${i * 5}%` }} />))}</div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-6"><ScaleIcon className="w-10 h-10 text-[#00ff00]" /><div><h1 className="text-4xl font-bold font-mono text-[#00ff00]">{`>`} COMPARADOR</h1><p className="text-[#00ff00]/60 font-mono mt-1">Compara hasta 4 criptomonedas</p></div></div>
          <div className="relative max-w-2xl"><MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00ff00]/50" /><input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Buscar..." disabled={selectedCoins.length >= 4} className="w-full bg-[#0a0f1e] border border-[#00ff00]/40 text-[#00ff00] px-4 py-3 pl-12 focus:outline-none rounded-none font-mono disabled:opacity-50" />{searchQuery && (<div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0f1e] border border-[#00ff00]/40 rounded-none max-h-96 overflow-y-auto z-50">{isSearching ? (<div className="p-4 text-center text-[#00ff00]/60 font-mono text-sm">Buscando...</div>) : searchResults.length === 0 ? (<div className="p-4 text-center text-[#00ff00]/60 font-mono text-sm">Sin resultados</div>) : (<div className="divide-y divide-[#00ff00]/10">{searchResults.map((coin) => (<button key={coin.id} onClick={() => handleSelectCoin(coin.id)} className="w-full p-3 hover:bg-[#00ff00]/10 flex items-center gap-3 text-left">{(coin.thumb || coin.large) && (<Image src={coin.thumb || coin.large || ''} alt={coin.name} width={32} height={32} className="rounded-full" unoptimized />)}<div className="flex-1"><p className="text-[#00ff00] font-mono font-bold">{coin.name}</p></div></button>))}</div>)}</div>)}</div></motion.div>
        {selectedCoins.length >= 2 && (<><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-6 border-2 border-[#00ff00] bg-[#00ff00]/10 rounded-none"><div className="flex items-center gap-4 justify-center"><TrophyIcon className="w-12 h-12 text-[#00ff00]" /><div className="text-center"><p className="text-sm text-[#00ff00]/60 font-mono mb-1">MEJOR PUNTUACIÓN</p><div className="flex items-center gap-3"><h2 className="text-3xl font-bold text-[#00ff00] font-mono">{bestCoin?.name}</h2><span className="text-2xl font-bold text-[#00ff00] font-mono">{bestCoin?.score}/100</span></div></div></div></motion.div><div className="overflow-x-auto"><table className="w-full border border-[#00ff00]/20"><thead><tr className="border-b border-[#00ff00]/20"><th className="p-4 text-left font-mono text-[#00ff00]">Métrica</th>{selectedCoins.map((coin) => (<th key={coin.id} className="p-4 text-center font-mono text-[#00ff00]"><span className="text-sm">{coin.symbol.toUpperCase()}</span></th>))}</tr></thead><tbody>{metrics.map((metric, index) => { const winner = getMetricWinner(metric.key as any, metric.higher); return (<tr key={metric.key} className="border-b border-[#00ff00]/10"><td className="p-4 font-mono text-[#00ff00]/80">{metric.label}</td>{selectedCoins.map((coin) => { const value = getMetricValue(coin, metric.key); const isWinner = coin.id === winner; return (<td key={coin.id} className={`p-4 text-center font-mono ${isWinner ? 'bg-[#00ff00]/10 font-bold text-[#00ff00]' : 'text-[#00ff00]/60'}`}><div className="flex items-center justify-center gap-1">{isWinner && <TrophyIcon className="w-4 h-4" />}<span>{formatMetricValue(value, metric.format, coin.symbol.toUpperCase())}</span></div></td>); })}</tr>); })}</tbody></table></div></>)}
      </div>
    </main>
  );
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) { setSearchResults([]); return; }
    setIsSearching(true);
    try {
      const data = await coingeckoService.searchCoins(query);
      setSearchResults(data.coins || []);
    } catch (error) {
      toast.error('Error al buscar');
    } finally {
      setIsSearching(false);
    }
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
    return score;
  };

  return (<main className="min-h-screen bg-[#0a0f1e] text-[#00ff00]"><div className="max-w-7xl mx-auto px-4 py-12"><h1 className="text-4xl font-bold font-mono">{`>`} COMPARADOR</h1></div></main>);
 main
}