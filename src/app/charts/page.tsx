'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { coingeckoService } from '@/lib/services/coingecko';
import { formatNumber, formatPercentage } from '@/lib/utils/helpers';
import Loading from '@/components/ui/Loading';
import Image from 'next/image';
import Link from 'next/link';
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

  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        const data = await coingeckoService.getTopCoins(50);
        setTopCoins(data);
        setFilteredCoins(data.slice(0, 20));
      } catch (error) {
        toast.error('Error al cargar las gráficas');
      } finally {
        setLoading(false);
      }
    };
    fetchTopCoins();
  }, []);

  if (loading) return <Loading message="Cargando datos..." />;

  return (<main className="min-h-screen bg-[#0a0f1e] text-[#00ff00]"><div className="max-w-7xl mx-auto px-4 py-12"><h1 className="text-4xl font-bold font-mono">{`>`} GRÁFICAS</h1></div></main>);
}