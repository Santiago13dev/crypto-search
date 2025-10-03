import { useState, FormEvent, ChangeEvent } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function SearchBar({ 
  onSearch, 
  isLoading = false,
  placeholder = "e.g. bitcoin, ethereum, solana..."
}: SearchBarProps) {
  const [query, setQuery] = useState('');

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

  return (
    <form onSubmit={handleSubmit} className="w-full font-mono">
      <div className="flex w-full max-w-2xl mx-auto relative group">
        {/* Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full bg-[#0a0f1e] border border-[#00ff00]/40 text-[#00ff00] placeholder-[#00ff00]/50 px-4 py-3 pl-12 focus:outline-none focus:border-[#00ff00] rounded-l-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          {/* Icono de búsqueda */}
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-[#00ff00]/50" />
          
          {/* Botón limpiar */}
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00ff00]/50 hover:text-[#00ff00] transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Botón de búsqueda */}
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="bg-[#00ff00] text-black px-8 py-3 font-bold rounded-r-md hover:brightness-125 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 relative overflow-hidden group"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              Buscando...
            </span>
          ) : (
            <span className="relative z-10">{`>`} BUSCAR</span>
          )}
          
          {/* Efecto hover */}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>

      {/* Línea decorativa inferior */}
      <div className="mt-2 max-w-2xl mx-auto h-px bg-gradient-to-r from-transparent via-[#00ff00]/30 to-transparent"></div>
    </form>
  );
}
