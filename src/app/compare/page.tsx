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
}