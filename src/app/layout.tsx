import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/features/Navbar';
import { ThemeButton } from '@/components/theme';
import { LanguageButton, I18nProvider } from '@/components/language';
import { ThemeProvider } from '@/contexts/ThemeContext';

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
      <body className="font-mono">
        <Providers>
          <I18nProvider>
            <ThemeProvider>
              <Navbar />
              {children}
              <ThemeButton />
              <LanguageButton />
            </ThemeProvider>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
