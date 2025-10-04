'use client';

import BaseWidget from './BaseWidget';
import { NewspaperIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { WidgetProps } from '@/types/widget';

// Mock news data - en producción esto vendría de una API
const MOCK_NEWS = [
  {
    id: 1,
    title: 'Bitcoin alcanza nuevo máximo histórico',
    source: 'CryptoNews',
    time: '2h ago',
    category: 'Bitcoin',
  },
  {
    id: 2,
    title: 'Ethereum actualización completada exitosamente',
    source: 'CoinDesk',
    time: '4h ago',
    category: 'Ethereum',
  },
  {
    id: 3,
    title: 'Regulaciones crypto: nuevas propuestas en Europa',
    source: 'Bloomberg',
    time: '6h ago',
    category: 'Regulación',
  },
  {
    id: 4,
    title: 'Altcoins experimentan rally masivo',
    source: 'CryptoSlate',
    time: '8h ago',
    category: 'Altcoins',
  },
  {
    id: 5,
    title: 'Instituciones incrementan adopción de DeFi',
    source: 'The Block',
    time: '10h ago',
    category: 'DeFi',
  },
];

export default function NewsWidget({ id, size, onRemove, onResize }: WidgetProps) {
  const displayNews = size === 'compact' ? MOCK_NEWS.slice(0, 3) : MOCK_NEWS;

  return (
    <BaseWidget
      id={id}
      title="Noticias Cripto"
      size={size}
      onRemove={onRemove}
      onToggleSize={onResize ? () => onResize(size === 'compact' ? 'expanded' : 'compact') : undefined}
      icon={<NewspaperIcon className="w-5 h-5" />}
    >
      <div className="space-y-3">
        {displayNews.map((news) => (
          <div
            key={news.id}
            className="p-3 bg-[#00ff00]/5 border border-primary/20 rounded hover:border-primary/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-mono font-bold text-primary group-hover:text-primary/80 transition-colors line-clamp-2">
                {news.title}
              </h4>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-primary/60 font-mono">{news.source}</span>
              <div className="flex items-center gap-1 text-primary/50 font-mono">
                <ClockIcon className="w-3 h-3" />
                <span>{news.time}</span>
              </div>
            </div>

            <div className="mt-2">
              <span className="inline-block px-2 py-1 bg-[#00ff00]/10 border border-primary/30 rounded text-xs font-mono text-primary">
                {news.category}
              </span>
            </div>
          </div>
        ))}

        {size === 'compact' && MOCK_NEWS.length > 3 && (
          <button className="w-full text-center text-xs text-primary/60 hover:text-primary font-mono transition-colors">
            Ver más noticias →
          </button>
        )}
      </div>
    </BaseWidget>
  );
}
