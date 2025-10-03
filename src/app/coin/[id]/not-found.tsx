import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-[#00ff00] flex items-center justify-center relative overflow-hidden">
      {/* Grid de fondo */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full h-px bg-[#00ff00]"
            style={{ top: `${i * 5}%` }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-full w-px bg-[#00ff00]"
            style={{ left: `${i * 5}%` }}
          />
        ))}
      </div>

      <div className="text-center p-8 max-w-md relative z-10">
        <div className="mb-8">
          <h1 className="text-9xl font-bold font-mono text-[#00ff00] mb-4">404</h1>
          <div className="text-2xl font-mono text-[#00ff00]/80 mb-2">
            {`>`} CRYPTOCURRENCY NOT FOUND
          </div>
          <p className="text-[#00ff00]/60 font-mono text-sm">
            The cryptocurrency you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff00] text-black font-bold font-mono rounded-none hover:brightness-125 transition-all"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          {`>`} RETURN HOME
        </Link>

        {/* Efecto de glitch */}
        <div className="mt-8 font-mono text-xs text-[#00ff00]/30">
          ERROR_CODE: COIN_NOT_FOUND_404
        </div>
      </div>
    </main>
  );
}
