'use client';

import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { currentTheme } = useTheme();

  useEffect(() => {
    if (!currentTheme) return;

    const root = document.documentElement;
    const colors = currentTheme.colors;

    // Aplicar variables CSS
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-dark', colors.primaryDark);
    root.style.setProperty('--color-primary-light', colors.primaryLight);
    
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-background-secondary', colors.backgroundSecondary);
    root.style.setProperty('--color-background-tertiary', colors.backgroundTertiary);
    
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-text-tertiary', colors.textTertiary);
    
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-accent-secondary', colors.accentSecondary);
    
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-error', colors.error);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-info', colors.info);
    
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-border-light', colors.borderLight);
    root.style.setProperty('--color-border-dark', colors.borderDark);

    // Forzar actualización del body
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
  }, [currentTheme]);

  return <>{children}</>;
}
