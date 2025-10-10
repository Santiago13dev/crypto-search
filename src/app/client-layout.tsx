'use client';

import { I18nProvider } from '@/components/language/I18nProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from '@/components/features/Navbar';
import { ThemeButton } from '@/components/theme';
import { LanguageButton } from '@/components/language';
import SocialNavButton from '@/components/navigation/SocialNavButton';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <Navbar />
        <SocialNavButton />
        {children}
        <ThemeButton />
        <LanguageButton />
      </ThemeProvider>
    </I18nProvider>
  );
}
