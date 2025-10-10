'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/language/I18nProvider';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  BriefcaseIcon,
  ChartBarIcon,
  NewspaperIcon,
  BellAlertIcon,
  ScaleIcon,
  Bars3Icon,
  XMarkIcon,
  StarIcon,
  CalculatorIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline';
import { useFavorites } from '@/hooks/useFavorites';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { favoritesCount } = useFavorites();
  const { t, currentLanguage } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const navItems = [
    {
      name: t('nav.search'),
      href: '/',
      icon: MagnifyingGlassIcon,
    },
    {
      name: t('nav.dashboard'),
      href: '/dashboard',
      icon: ViewColumnsIcon,
    },
    {
      name: t('nav.portfolio'),
      href: '/portfolio',
      icon: BriefcaseIcon,
    },
    {
      name: t('nav.calculator'),
      href: '/converter',
      icon: CalculatorIcon,
    },
    {
      name: t('nav.alerts'),
      href: '/alerts',
      icon: BellAlertIcon,
    },
    {
      name: t('nav.compare'),
      href: '/compare',
      icon: ScaleIcon,
    },
    {
      name: t('nav.charts'),
      href: '/charts',
      icon: ChartBarIcon,
    },
    {
      name: t('nav.news'),
      href: '/news',
      icon: NewspaperIcon,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/20" key={currentLanguage}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.span
              className="text-primary text-xl font-mono"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {'>'}
            </motion.span>
            <span className="text-xl font-bold font-mono text-primary group-hover:text-primary/80 transition-colors">
              CRYPTO TERMINAL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 font-mono text-sm transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-primary/60 hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {favoritesCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-2 flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full"
              >
                <StarIcon className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-primary font-bold">
                  {favoritesCount}
                </span>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-primary hover:bg-primary/10 transition-colors rounded-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-64 bg-background border-l border-primary/20 z-50 md:hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-bold font-mono text-primary">
                    MENU
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-primary hover:bg-primary/10 transition-colors"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 font-mono rounded-none transition-colors ${
                            isActive
                              ? 'bg-primary/20 text-primary border-l-2 border-primary'
                              : 'text-primary/60 hover:bg-primary/10 hover:text-primary'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {favoritesCount > 0 && (
                  <div className="mt-6 p-4 border border-primary/20 bg-primary/5 rounded-none">
                    <div className="flex items-center gap-2 text-primary font-mono text-sm">
                      <StarIcon className="w-5 h-5" />
                      <span>
                        {favoritesCount} {t('favorites.count', { count: favoritesCount })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
