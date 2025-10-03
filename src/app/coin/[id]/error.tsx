'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Coin page error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-[#00ff00] flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold font-mono mb-4 text-[#00ff00]">
            {`>`} ERROR
          </h1>
          <p className="text-[#00ff00]/70 font-mono mb-2">
            {error.message || 'Something went wrong loading this cryptocurrency'}
          </p>
          <p className="text-[#00ff00]/50 font-mono text-sm">
            Please try again or return to home
          </p>
        </motion.div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff00]/10 border border-[#00ff00]/20 text-[#00ff00] font-bold font-mono rounded-none hover:bg-[#00ff00]/20 transition-all"
          >
            {`>`} TRY AGAIN
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff00] text-black font-bold font-mono rounded-none hover:brightness-125 transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            GO HOME
          </Link>
        </div>
      </div>
    </main>
  );
}
