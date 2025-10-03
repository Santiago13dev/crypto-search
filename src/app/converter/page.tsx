'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowsRightLeftIcon, CalculatorIcon, ChartBarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import ConverterForm from '@/components/features/ConverterForm';
import DCACalculator from '@/components/features/DCACalculator';
import FeeCalculator from '@/components/features/FeeCalculator';

type Tab = 'converter' | 'dca' | 'fees';

export default function ConverterPage() {
  const [activeTab, setActiveTab] = useState<Tab>('converter');

  const tabs = [
    { id: 'converter' as Tab, label: 'Convertidor', icon: ArrowsRightLeftIcon },
    { id: 'dca' as Tab, label: 'DCA Calculator', icon: ChartBarIcon },
    { id: 'fees' as Tab, label: 'Comisiones', icon: CurrencyDollarIcon },
  ];

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-[#00ff00] relative overflow-hidden">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full h-px bg-[#00ff00]" style={{ top: `${i * 5}%` }} />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full w-px bg-[#00ff00]" style={{ left: `${i * 5}%` }} />
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <CalculatorIcon className="w-10 h-10 text-[#00ff00]" />
            <div>
              <h1 className="text-4xl font-bold font-mono text-[#00ff00]">{`>`} CALCULADORA DE CONVERSIÓN</h1>
              <p className="text-[#00ff00]/60 font-mono mt-1">Convierte, calcula DCA y estima comisiones</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-mono transition-all rounded-none flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-[#00ff00] text-black font-bold'
                      : 'bg-[#0a0f1e] border border-[#00ff00]/20 text-[#00ff00] hover:bg-[#00ff00]/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            {activeTab === 'converter' && <ConverterForm />}
            {activeTab === 'dca' && <DCACalculator />}
            {activeTab === 'fees' && <FeeCalculator />}
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
