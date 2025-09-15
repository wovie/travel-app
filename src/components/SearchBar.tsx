'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchResults } from '@/components/SearchResults';
import { doSearch } from '@/lib/actions';
import type { SearchResult } from '@/lib/types';

export function SearchBar() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLInputElement>(null);

  // Hides search results dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClick = async () => {
    if (!searchTerm || searchTerm.length === 0) return;
    const results = await doSearch(searchTerm);
    setSearchResults(results);
    setShowSearchResults(true);
  };

  return (
    <div className='relative w-full flex gap-1'>
      <label htmlFor='search' className='sr-only'>
        Search
      </label>
      <input
        ref={inputRef}
        id='search'
        type='text'
        className='w-full border border-sky-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-900 transition'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder='Find a travel destination...'
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearchClick();
        }}
      ></input>
      <button
        type='button'
        className='text-sky-700 border-sky-700 rounded px-4 py-2 font-medium transition border cursor-pointer hover:bg-gray-100 hover:shadow-md'
        onClick={handleSearchClick}
      >
        Search
      </button>
      {/* Search results */}
      {showSearchResults && (
        <div
          ref={searchResultsRef}
          className='border-sky-700 absolute left-0 right-0 top-[50px] z-20 bg-white border-2 rounded shadow-lg max-h-80 overflow-y-auto'
        >
          {searchResults && searchResults.length > 0 ? (
            <SearchResults results={searchResults} />
          ) : (
            <div className='p-2'>No results found.</div>
          )}
        </div>
      )}
    </div>
  );
}
