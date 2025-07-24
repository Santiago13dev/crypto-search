import { Coin } from '../types/coin';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CoinCardProps {
  coin: Coin;
}

export default function CoinCard({ coin }: CoinCardProps) {
  return (
    <Link href={`/coin/${coin.id}`} className="block">
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="p-4 border border-[#00ff00]/20 rounded-none bg-[#0a0f1e] backdrop-blur-sm transition-all hover:shadow-[0_0_15px_rgba(0,255,0,0.2)]"
      >
        <div className="flex items-center gap-4">
          {(coin.thumb || coin.large) && (
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-[#00ff00]/10 rounded-full blur-md"></div>
              <Image
                src={coin.thumb || coin.large}
                alt={coin.name}
                width={40}
                height={40}
                className="rounded-full object-cover relative z-10 border border-[#00ff00]/20"
                unoptimized
              />
            </div>
          )}
          <div className="flex-grow">
            <h2 className="font-bold text-[#00ff00] font-mono">{coin.name || 'Unknown'}</h2>
            <p className="text-sm text-[#00ff00]/80 font-mono">
              {coin.symbol ? coin.symbol.toUpperCase() : 'N/A'}
            </p>
          </div>
          {typeof coin.market_cap_rank === 'number' && (
            <div className="text-right font-mono">
              <span className="text-[#00ff00]/60 text-xs">{`>`} rank</span>
              <p className="text-sm text-[#00ff00]">#{coin.market_cap_rank}</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm font-mono">
          <div className="bg-[#00ff00]/10 px-2 py-1 rounded-none border border-[#00ff00]/20">
            <span className="text-[#00ff00]/60">{`>`} score: </span>
            <span className="text-[#00ff00]">{coin.score?.toFixed(2) || 'N/A'}</span>
          </div>
          <div className="bg-emerald-500/10 px-2 py-1 rounded-none border border-emerald-500/20">
            <span className="text-emerald-400/60">{`>`} btc: </span>
            <span className="text-emerald-400">{coin.price_btc?.toFixed(8) || 'N/A'}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
