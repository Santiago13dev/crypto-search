'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

import CoinCard from './components/CoinCard';
import { searchCoins } from './lib/coingecko';
import { Coin } from './types/coin';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [results, setResults] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setResults([]);

    try {
      const data = await searchCoins(query);
      if (data && Array.isArray(data.coins)) {
        setResults(data.coins);
      } else {
        console.error('Formato de datos inesperado:', data);
        toast.error('Error en el formato de datos');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Error al buscar criptomonedas. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-[#00ff00] relative overflow-hidden">
      <div className="fixed inset-0 opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute w-full h-px bg-[#00ff00]" style={{ top: `${i * 5}%` }}></div>
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute h-full w-px bg-[#00ff00]" style={{ left: `${i * 5}%` }}></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <div className="relative mb-8">
            <div className="flex items-center justify-center gap-3">
              <span className="text-[#00ff00] text-2xl md:text-3xl">{">"}</span>
              <span className="text-[#00ff00] text-2xl md:text-3xl">{"-"}</span>
              <h1 className="text-4xl md:text-6xl font-bold text-[#00ff00] font-mono tracking-wider">CRYPTO SEARCH</h1>
            </div>
            <p className="text-[#00ff00]/90 text-lg md:text-xl mb-2 mt-4 font-mono">{"> Advanced cryptocurrency indexing system"}</p>
            <p className="text-[#00ff00]/60 text-sm font-mono">Real-time blockchain data at your fingertips</p>
          </div>

          <div className="max-w-2xl mx-auto p-6">
            <form
  onSubmit={(e) => {
    e.preventDefault();
    handleSearch(query);
  }}
  className="w-full font-mono"
>
  <div className="flex w-full max-w-2xl mx-auto">
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="e.g. bitcoin, ethereum, solana..."
      className="flex-1 bg-[#0a0f1e] border border-[#00ff00] text-[#00ff00] placeholder-[#00ff00]/50 px-4 py-2 focus:outline-none rounded-l-md"
    />
    <button
      type="submit"
      className="bg-[#00ff00] text-black px-6 py-2 font-bold rounded-r-md hover:brightness-125 transition"
    >
      Buscar
    </button>
  </div>
</form>
          </div>
        </motion.div>

        <div className="mt-16">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
                <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 bg-white/20"></div>
              </div>
              <p className="mt-6 text-white/60 text-lg font-mono">{`>`} searching cryptocurrency data...</p>
            </div>
          ) : results.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {results.map((coin, index) => (
                <motion.div
                  key={coin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CoinCard coin={coin} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-white/60 text-lg font-mono">
                {`>`} Enter a cryptocurrency name to start searching...
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
