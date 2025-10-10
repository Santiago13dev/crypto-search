import Loading from '@/components/ui/Loading';

export default function LoadingCoinPage() {
  return (
    <main className="min-h-screen bg-background text-primary flex items-center justify-center">
      <Loading message="Loading cryptocurrency details..." />
    </main>
  );
}
