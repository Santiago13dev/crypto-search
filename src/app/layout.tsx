import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Buscador de Criptomonedas',
  description: 'Busca información sobre cualquier criptomoneda',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-mono bg-[#2759ee]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
