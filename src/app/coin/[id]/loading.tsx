import Loading from '@/components/ui/Loading';

export default function LoadingCoinPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-[#00ff00] flex items-center justify-center">
      <Loading message="Loading cryptocurrency details..." />
    </main>
  );
}
