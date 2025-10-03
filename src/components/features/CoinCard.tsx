import { Coin } from '@/types/coin';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { memo } from 'react';
import FavoriteButton from '@/components/ui/FavoriteButton';

interface CoinCardProps {
  coin: Coin;
  index?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const CoinCard = memo(function CoinCard({ 
  coin, 
  index = 0,
  isFavorite = false,
  onToggleFavorite,
}: CoinCardProps) {
  return (
    <div className="relative">
      <Link href={`/coin/${coin.id}`} className="block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          className="group p-5 border border-[#00ff00]/20 rounded-none bg-[#0a0f1e] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:border-[#00ff00]/40"
        >
          <div className="flex items-center gap-4">
            {/* Imagen */}
            {(coin.thumb || coin.large) && (
              <div className="relative w-12 h-12 flex-shrink-0">
                <div className="absolute inset-0 bg-[#00ff00]/10 rounded-full blur-md group-hover:bg-[#00ff00]/20 transition-colors"></div>
                <Image
                  src={coin.thumb || coin.large || ''}
                  alt={coin.name || 'Cryptocurrency'}
                  width={48}
                  height={48}
                  className="rounded-full object-cover relative z-10 border border-[#00ff00]/20 group-hover:border-[#00ff00]/40 transition-colors"
                  unoptimized
                />
              </div>
            )}

            {/* Info principal */}
            <div className="flex-grow min-w-0">
              <h2 className="font-bold text-[#00ff00] font-mono text-lg truncate group-hover:text-[#00ff00]/90 transition-colors">
                {coin.name || 'Unknown'}
              </h2>
              <p className="text-sm text-[#00ff00]/70 font-mono uppercase">
                {coin.symbol || 'N/A'}
              </p>
            </div>

            {/* Ranking */}
            {typeof coin.market_cap_rank === 'number' && (
              <div className="text-right font-mono flex-shrink-0">
                <span className="text-[#00ff00]/50 text-xs block">{`>`} rank</span>
                <p className="text-base text-[#00ff00] font-bold">
                  #{coin.market_cap_rank}
                </p>
              </div>
            )}
          </div>

          {/* Stats inferiores */}
          <div className="mt-4 flex items-center justify-between gap-2 text-sm font-mono">
            {/* Score */}
            <div className="bg-[#00ff00]/10 px-3 py-1.5 rounded-none border border-[#00ff00]/20 group-hover:bg-[#00ff00]/15 transition-colors flex-1">
              <span className="text-[#00ff00]/60 text-xs">{`>`} score: </span>
              <span className="text-[#00ff00] font-bold">
                {coin.score !== undefined ? coin.score.toFixed(2) : 'N/A'}
              </span>
            </div>

            {/* Price BTC */}
            {coin.price_btc !== undefined && (
              <div className="bg-emerald-500/10 px-3 py-1.5 rounded-none border border-emerald-500/20 group-hover:bg-emerald-500/15 transition-colors flex-1">
                <span className="text-emerald-400/60 text-xs">{`>`} btc: </span>
                <span className="text-emerald-400 font-bold">
                  {coin.price_btc.toFixed(8)}
                </span>
              </div>
            )}
          </div>

          {/* Indicador hover */}
          <div className="mt-3 text-center">
            <span className="text-[#00ff00]/0 group-hover:text-[#00ff00]/70 text-xs font-mono transition-colors">
              {`>`} Click para ver detalles {`<`}
            </span>
          </div>
        </motion.div>
      </Link>

      {/* Botón de favorito (posicionado absolutamente) */}
      {onToggleFavorite && (
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            size="md"
          />
        </div>
      )}
    </div>
  );
});

export default CoinCard;
