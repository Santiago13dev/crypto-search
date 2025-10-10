import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowsUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { coingeckoService } from '@/lib/services/coingecko';
import { Coin } from '@/types/coin';
import { toast } from 'react-hot-toast';

export default function ConverterForm() {
  const [amount, setAmount] = useState('1');
  const [fromCoin, setFromCoin] = useState<Coin | null>(null);
  const [toCoin, setToCoin] = useState<Coin | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fromResults, setFromResults] = useState<Coin[]>([]);
  const [toResults, setToResults] = useState<Coin[]>([]);
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fee, setFee] = useState('0.1');

  const handleConvert = async (e: FormEvent) => {
    e.preventDefault();
    if (!fromCoin || !toCoin || !amount) {
      toast.error('Completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const [fromDetails, toDetails] = await Promise.all([
        coingeckoService.getCoinDetails(fromCoin.id),
        coingeckoService.getCoinDetails(toCoin.id)
      ]);

      const fromPrice = fromDetails.market_data?.current_price?.usd || 0;
      const toPrice = toDetails.market_data?.current_price?.usd || 0;

      if (fromPrice && toPrice) {
        const rate = fromPrice / toPrice;
        const converted = parseFloat(amount) * rate;
        const feeAmount = converted * (parseFloat(fee) / 100);
        const final = converted - feeAmount;
        setResult(final);
        toast.success('Conversión realizada');
      }
    } catch (error) {
      toast.error('Error al convertir');
    } finally {
      setLoading(false);
    }
  };

  const searchCoins = async (query: string, isFrom: boolean) => {
    if (!query.trim()) {
      if (isFrom) setFromResults([]);
      else setToResults([]);
      return;
    }

    try {
      const data = await coingeckoService.searchCoins(query);
      if (isFrom) setFromResults(data.coins || []);
      else setToResults(data.coins || []);
    } catch (error) {
      toast.error('Error al buscar');
    }
  };

  const swapCoins = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
    setResult(null);
  };

  return (
    <div className="p-6 border border-primary/20 bg-background rounded-none">
      <form onSubmit={handleConvert} className="space-y-6">
        <div>
          <label className="block text-sm text-primary/80 font-mono mb-2">{`>`} Cantidad</label>
          <input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-background border border-primary/40 text-primary px-4 py-3 font-mono focus:outline-none focus:border-primary rounded-none" required />
        </div>

        <div>
          <label className="block text-sm text-primary/80 font-mono mb-2">{`>`} Desde</label>
          {fromCoin ? (
            <div className="flex items-center gap-3 p-3 border border-primary/20 rounded-none">
              {fromCoin.thumb && <Image src={fromCoin.thumb} alt={fromCoin.name} width={24} height={24} className="rounded-full" unoptimized />}
              <span className="font-mono text-primary">{fromCoin.name}</span>
              <button type="button" onClick={() => setFromCoin(null)} className="ml-auto text-primary/60 hover:text-primary text-sm font-mono underline">Cambiar</button>
            </div>
          ) : (
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
              <input type="text" value={fromQuery} onChange={(e) => { setFromQuery(e.target.value); searchCoins(e.target.value, true); }} placeholder="Buscar..." className="w-full bg-background border border-primary/40 text-primary px-4 py-3 pl-12 font-mono focus:outline-none rounded-none" />
              {fromQuery && fromResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-primary/40 rounded-none max-h-60 overflow-y-auto z-50">
                  {fromResults.slice(0, 5).map((coin) => (
                    <button key={coin.id} type="button" onClick={() => { setFromCoin(coin); setFromQuery(''); setFromResults([]); }} className="w-full p-3 hover:bg-[#00ff00]/10 flex items-center gap-3 text-left">
                      {coin.thumb && <Image src={coin.thumb} alt={coin.name} width={24} height={24} className="rounded-full" unoptimized />}
                      <span className="font-mono text-primary">{coin.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button type="button" onClick={swapCoins} className="p-3 bg-[#00ff00]/10 border border-primary/20 text-primary hover:bg-[#00ff00]/20 transition-all rounded-none">
            <ArrowsUpDownIcon className="w-6 h-6" />
          </button>
        </div>

        <div>
          <label className="block text-sm text-primary/80 font-mono mb-2">{`>`} Hasta</label>
          {toCoin ? (
            <div className="flex items-center gap-3 p-3 border border-primary/20 rounded-none">
              {toCoin.thumb && <Image src={toCoin.thumb} alt={toCoin.name} width={24} height={24} className="rounded-full" unoptimized />}
              <span className="font-mono text-primary">{toCoin.name}</span>
              <button type="button" onClick={() => setToCoin(null)} className="ml-auto text-primary/60 hover:text-primary text-sm font-mono underline">Cambiar</button>
            </div>
          ) : (
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
              <input type="text" value={toQuery} onChange={(e) => { setToQuery(e.target.value); searchCoins(e.target.value, false); }} placeholder="Buscar..." className="w-full bg-background border border-primary/40 text-primary px-4 py-3 pl-12 font-mono focus:outline-none rounded-none" />
              {toQuery && toResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-primary/40 rounded-none max-h-60 overflow-y-auto z-50">
                  {toResults.slice(0, 5).map((coin) => (
                    <button key={coin.id} type="button" onClick={() => { setToCoin(coin); setToQuery(''); setToResults([]); }} className="w-full p-3 hover:bg-[#00ff00]/10 flex items-center gap-3 text-left">
                      {coin.thumb && <Image src={coin.thumb} alt={coin.name} width={24} height={24} className="rounded-full" unoptimized />}
                      <span className="font-mono text-primary">{coin.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-primary/80 font-mono mb-2">{`>`} Comisión (%)</label>
          <input type="number" step="0.01" value={fee} onChange={(e) => setFee(e.target.value)} className="w-full bg-background border border-primary/40 text-primary px-4 py-3 font-mono focus:outline-none focus:border-primary rounded-none" />
        </div>

        <button type="submit" disabled={loading || !fromCoin || !toCoin} className="w-full px-4 py-3 bg-[#00ff00] text-black font-bold font-mono hover:brightness-125 transition-all rounded-none disabled:opacity-50">
          {loading ? 'Convirtiendo...' : 'Convertir'}
        </button>

        {result !== null && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 border-2 border-primary bg-[#00ff00]/10 rounded-none">
            <p className="text-xs text-primary/60 font-mono mb-2">Resultado</p>
            <p className="text-4xl font-bold text-primary font-mono mb-2">{result.toFixed(8)}</p>
            <p className="text-sm text-primary/80 font-mono">{toCoin?.symbol.toUpperCase()}</p>
          </motion.div>
        )}
      </form>
    </div>
  );
}
