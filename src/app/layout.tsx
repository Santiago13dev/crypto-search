import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/features/Navbar';

export const metadata: Metadata = {
  title: 'Crypto Terminal - Buscador de Criptomonedas',
  description: 'Busca información sobre cualquier criptomoneda, gestiona tu portafolio y mantente al día con las últimas noticias',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-mono bg-[#0a0f1e]">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
