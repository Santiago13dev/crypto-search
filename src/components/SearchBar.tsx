'use client';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex rounded-md shadow overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar criptomoneda..."
          className="flex-1 px-4 py-3 text-sm sm:text-base text-gray-800 placeholder-gray-500 bg-white font-mono focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-3 text-sm sm:text-base text-gray-800 text-white font-bold font-mono hover:bg-blue-700 transition-all"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
