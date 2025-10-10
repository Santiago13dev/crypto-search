import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { coingeckoService } from '@/lib/services/coingecko';
import { Coin } from '@/types/coin';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface DCAResult {
  totalInvested: number;
  totalCoins: number;
  averagePrice: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
}

export default function DCACalculator() {
  const [coin, setCoin] = useState<Coin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Coin[]>([]);
  const [amount, setAmount] = useState('100');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [duration, setDuration] = useState('365');
  const [result, setResult] = useState<DCAResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const data = await coingeckoService.searchCoins(query);
      setSearchResults(data.coins || []);
    } catch (error) {
      toast.error('Error al buscar');
    }
  };

  const handleCalculate = async (e: FormEvent) => {
    e.preventDefault();
    if (!coin) {
      toast.error('Selecciona una criptomoneda');
      return;
    }

    setLoading(true);
    try {
      const details = await coingeckoService.getCoinDetails(coin.id);
      const currentPrice = details.market_data?.current_price?.usd || 0;

      const intervals = { daily: 1, weekly: 7, monthly: 30 };
      const intervalDays = intervals[frequency];
      const numberOfPurchases = Math.floor(parseInt(duration) / intervalDays);
      
      let totalInvested = 0;
      let totalCoins = 0;

      for (let i = 0; i < numberOfPurchases; i++) {
        const simulatedPrice = currentPrice * (0.7 + Math.random() * 0.6);
        const coins = parseFloat(amount) / simulatedPrice;
        totalInvested += parseFloat(amount);
        totalCoins += coins;
      }

      const averagePrice = totalInvested / totalCoins;
      const currentValue = totalCoins * currentPrice;
      const profit = currentValue - totalInvested;
      const profitPercentage = (profit / totalInvested) * 100;

      setResult({ totalInvested, totalCoins, averagePrice, currentValue, profit, profitPercentage });
      toast.success('Cálculo realizado');
    } catch (error) {
      toast.error('Error al calcular');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-primary/20 bg-background rounded-none">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-primary font-mono mb-2">{`>`} Dollar Cost Averaging (DCA)</h3>
        <p className="text-sm text-primary/60 font-mono">Calcula el rendimiento de inversiones periódicas</p>
      </div>

      <form onSubmit={handleCalculate} className="space-y-6">
        <div>
          <label className="block text-sm text-primary/80 font-mono mb-2">{`>`} Criptomoneda</label>
          {coin ? (
            <div className="flex items-center gap-3 p-3 border border-primary/20 rounded-none">
              {coin.thumb && <Image src={coin.thumb} alt={coin.name} width={24} height={24} className="rounded-full" unoptimized />}
              <span className="font-mono text-primary">{coin.name}</span>
              <button type="button" onClick={() => setCoin(null)} className="ml-auto text-primary/60 hover:text-primary text-sm font-mono underline">Cambiar</button>
            </div>
          ) : (
            <div className="relative">
              <input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Buscar criptomoneda..." className="w-full bg-background border border-primary/40 text-primary px-4 py-3 font-mono focus:outline-none rounded-none" />
              {searchQuery && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-primary/40 rounded-none max-h-60 overflow-y-auto z-50">
                  {searchResults.slice(0, 5).map((c) => (
                    <button key={c.id} type="button" onClick={() => { setCoin(c); setSearchQuery(''); setSearchResults([]); }} className="w-full p-3 hover:bg-[#00ff00]/10 flex items-center gap-3 text-left">
                      {c.thumb && <Image src={c.thumb} alt={c.name} width={24} height={24} className="rounded-full" unoptimized />}
                      <span className="font-mono text-primary">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-primary/80 font-mono mb-2">{`>`} Monto por compra (USD)</label>
          <input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-background border border-primary/40 text-primary px-4 py-3 font-mono focus:outline-none rounded-none" required />
        </div>

        <div>
          <label className="block text-sm text-primary/80 font-mono mb-2">{`>`} Frecuencia</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ value: 'daily' as const, label: 'Diario' }, { value: 'weekly' as const, label: 'Semanal' }, { value: 'monthly' as const, label: 'Mensual' }].map((freq) => (
              <button key={freq.value} type="button" onClick={() => setFrequency(freq.value)} className={`px-4 py-2 font-mono text-sm transition-all rounded-none ${frequency === freq.value ? 'bg-[#00ff00] text-black font-bold' : 'bg-background border border-primary/20 text-primary'}`}>{freq.label}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-primary/80 font-mono mb-2">{`>`} Duración (días)</label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-background border border-primary/40 text-primary px-4 py-3 font-mono focus:outline-none rounded-none" required />
        </div>

        <button type="submit" disabled={loading || !coin} className="w-full px-4 py-3 bg-[#00ff00] text-black font-bold font-mono hover:brightness-125 transition-all rounded-none disabled:opacity-50">
          {loading ? 'Calculando...' : 'Calcular DCA'}
        </button>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 border border-primary/20 rounded-none">
              <p className="text-xs text-primary/60 font-mono mb-1">Total Invertido</p>
              <p className="text-2xl font-bold text-primary font-mono">${result.totalInvested.toLocaleString()}</p>
            </div>
            <div className="p-4 border border-primary/20 rounded-none">
              <p className="text-xs text-primary/60 font-mono mb-1">Valor Actual</p>
              <p className="text-2xl font-bold text-blue-400 font-mono">${result.currentValue.toLocaleString()}</p>
            </div>
            <div className="p-4 border border-primary/20 rounded-none">
              <p className="text-xs text-primary/60 font-mono mb-1">Ganancia/Pérdida</p>
              <p className={`text-2xl font-bold font-mono ${result.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>${Math.abs(result.profit).toLocaleString()}</p>
              <p className={`text-sm font-mono ${result.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{result.profit >= 0 ? '+' : ''}{result.profitPercentage.toFixed(2)}%</p>
            </div>
            <div className="p-4 border border-primary/20 rounded-none">
              <p className="text-xs text-primary/60 font-mono mb-1">Total Monedas</p>
              <p className="text-2xl font-bold text-primary font-mono">{result.totalCoins.toFixed(6)}</p>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}
