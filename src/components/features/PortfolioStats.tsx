import { motion } from 'framer-motion';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ChartPieIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';
import { PortfolioItem } from '@/hooks/usePortfolio';
import { formatNumber } from '@/lib/utils/helpers';

interface PortfolioStatsProps {
  portfolio: PortfolioItem[];
  totalInvestment: number;
  currentValue: number;
}

export default function PortfolioStats({ 
  portfolio, 
  totalInvestment,
  currentValue,
}: PortfolioStatsProps) {
  const profitLoss = currentValue - totalInvestment;
  const profitLossPercentage = totalInvestment > 0 
    ? ((profitLoss / totalInvestment) * 100) 
    : 0;
  const isProfit = profitLoss >= 0;

  // Calcular diversificación
  const topHolding = portfolio.length > 0
    ? portfolio.reduce((max, item) => {
        const value = item.amount * item.buyPrice;
        const maxValue = max.amount * max.buyPrice;
        return value > maxValue ? item : max;
      })
    : null;

  const topHoldingPercentage = topHolding && totalInvestment > 0
    ? ((topHolding.amount * topHolding.buyPrice) / totalInvestment) * 100
    : 0;

  const stats = [
    {
      label: 'Inversión Total',
      value: formatNumber(totalInvestment),
      icon: BanknotesIcon,
      color: 'text-[#00ff00]',
      bgColor: 'bg-[#00ff00]/10',
      borderColor: 'border-[#00ff00]/20',
    },
    {
      label: 'Valor Actual',
      value: formatNumber(currentValue),
      icon: ChartPieIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
    },
    {
      label: isProfit ? 'Ganancia' : 'Pérdida',
      value: formatNumber(Math.abs(profitLoss)),
      subValue: `${isProfit ? '+' : ''}${profitLossPercentage.toFixed(2)}%`,
      icon: isProfit ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
      color: isProfit ? 'text-emerald-400' : 'text-red-400',
      bgColor: isProfit ? 'bg-emerald-400/10' : 'bg-red-400/10',
      borderColor: isProfit ? 'border-emerald-400/20' : 'border-red-400/20',
    },
    {
      label: 'Diversificación',
      value: `${portfolio.length} ${portfolio.length === 1 ? 'activo' : 'activos'}`,
      subValue: topHolding ? `Top: ${topHoldingPercentage.toFixed(1)}%` : '',
      icon: ScaleIcon,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 border ${stat.borderColor} ${stat.bgColor} rounded-none`}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-[#00ff00]/60 font-mono uppercase">
                {stat.label}
              </p>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            
            <p className={`text-2xl font-bold font-mono ${stat.color} mb-1`}>
              {stat.value}
            </p>
            
            {stat.subValue && (
              <p className={`text-sm font-mono ${stat.color} opacity-80`}>
                {stat.subValue}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
 feature/widgets-personalizables
}
=======
}
 main
