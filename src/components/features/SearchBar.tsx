'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useTranslation } from '@/components/language/I18nProvider';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function SearchBar({ 
  onSearch, 
  isLoading = false,
  placeholder
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const { t, currentLanguage } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
  };

  if (!mounted) {
    return null;
  }

  const displayPlaceholder = placeholder || t('home.searchPlaceholder');

  return (
    <form onSubmit={handleSubmit} className="w-full font-mono" key={currentLanguage}>
      <div className="flex w-full max-w-2xl mx-auto relative group">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={displayPlaceholder}
            disabled={isLoading}
            style={{
              backgroundColor: 'var(--color-background-secondary)',
              borderColor: 'var(--color-primary)',
              color: 'var(--color-text)',
            }}
            className="w-full border-2 placeholder-text-secondary/50 px-4 py-3 pl-12 focus:outline-none focus:border-primary-light rounded-l-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          <MagnifyingGlassIcon 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6" 
            style={{ color: 'var(--color-primary)' }}
          />
          
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/50 hover:text-primary transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-background)',
          }}
          className="px-8 py-3 font-bold rounded-r-md hover:brightness-125 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 relative overflow-hidden group"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span 
                className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: 'var(--color-background)' }}
              ></span>
              {t('home.searching')}
            </span>
          ) : (
            <span className="relative z-10">{t('home.searchButton')}</span>
          )}
          
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>

      <div 
        className="mt-2 max-w-2xl mx-auto h-px bg-gradient-to-r from-transparent to-transparent"
        style={{
          backgroundImage: `linear-gradient(to right, transparent, var(--color-primary), transparent)`,
          opacity: 0.3,
        }}
      ></div>
    </form>
  );
}
