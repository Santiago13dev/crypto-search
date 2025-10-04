import { motion } from 'framer-motion';
import { PortfolioItem } from '@/hooks/usePortfolio';

interface PortfolioChartProps {
  portfolio: PortfolioItem[];
  totalInvestment: number;
}

export default function PortfolioChart({ portfolio, totalInvestment }: PortfolioChartProps) {
  if (portfolio.length === 0) {
    return (
      <div className="p-8 border border-[#00ff00]/20 bg-[#0a0f1e] rounded-none text-center">
        <p className="text-[#00ff00]/60 font-mono">
          No hay datos para mostrar
        </p>
      </div>
    );
  }

  // Calcular distribución
  const distribution = portfolio.map(item => {
    const value = item.amount * item.buyPrice;
    const percentage = (value / totalInvestment) * 100;
    
    return {
      ...item,
      value,
      percentage,
    };
  }).sort((a, b) => b.value - a.value);

  // Colores para las barras
  const colors = [
    '#00ff00',
    '#00dd00',
    '#00bb00',
    '#009900',
    '#007700',
    '#005500',
  ];

  return (
    <div className="p-6 border border-[#00ff00]/20 bg-[#0a0f1e] rounded-none">
      <h3 className="text-lg font-bold text-[#00ff00] font-mono mb-4">
        {`>`} Distribución del Portafolio
      </h3>

      <div className="space-y-4">
        {distribution.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-[#00ff00] font-bold">
                  {item.name}
                </span>
                <span className="text-xs font-mono text-[#00ff00]/60 uppercase">
                  {item.symbol}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono text-[#00ff00]">
                  ${item.value.toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </p>
                <p className="text-xs font-mono text-[#00ff00]/60">
                  {item.percentage.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="relative h-3 bg-[#00ff00]/10 rounded-none overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className="absolute inset-y-0 left-0 rounded-none"
                style={{ 
                  backgroundColor: colors[index % colors.length],
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leyenda de totales */}
      <div className="mt-6 pt-4 border-t border-[#00ff00]/20">
        <div className="flex justify-between items-center">
          <span className="text-sm font-mono text-[#00ff00]/60">
            Total Portfolio
          </span>
          <span className="text-lg font-bold font-mono text-[#00ff00]">
            ${totalInvestment.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
 feature/widgets-personalizables
}
=======
}
 main
