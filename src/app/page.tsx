'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { TopTenCard, type Destination } from '@/components/TopTenCard';
import { SearchResults, type SearchResult } from '@/components/SearchResults';
import { PinnedResults } from '@/components/PinnedResults';
import { getFormattedDestination } from '@/lib/util';
import { doSearch } from '@/lib/actions';
import tripadvisorAwards from './tripadvisor-travelers-choice-awards.json';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cardHighlights, setCardHighlights] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLInputElement>(null);
  const { pinnedResults, setPinnedResults } = useAppContext();
  const [showSidebar, setShowSidebar] = useState(false);

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

  // Updates destination highlights
  useEffect(() => {
    setCardHighlights(
      pinnedResults
        .map((r) => {
          // Handle edge case
          if (r.displayName?.text === 'Federal Territory of Kuala Lumpur')
            return 'Kuala Lumpur';
          return r.displayName?.text;
        })
        .filter(Boolean)
    );

    // Hacky way to hide results (when a result is clicked,
    // it is pinned and the results dropdown should be hidden).
    // This could be better handled using AppContext.
    setShowSearchResults(false);
    setSearchTerm('');
  }, [pinnedResults]);

  const handleSearchClick = async () => {
    if (!searchTerm || searchTerm.length === 0) return;
    const results = await doSearch(searchTerm);
    setSearchResults(results);
    setShowSearchResults(true);
  };

  // When destination is clicked from sidebar, skip showing search results and pin it.
  const handleDestinationClick = useCallback(
    async (destination: Destination) => {
      setShowSidebar(false);
      const formattedDestination = getFormattedDestination(destination);

      // Check if destination is already pinned
      const displayNamesArr = pinnedResults
        .map((result) => result.displayName?.text)
        .filter(Boolean);
      if (displayNamesArr.some((name) => formattedDestination.includes(name)))
        return;

      // The search query should be specific enough to only have 1 result,
      // but probably should handle it somehow.
      const results: SearchResult[] = await doSearch(formattedDestination);
      if (results.length > 1) console.warn('Should handle more than 1 result');
      setPinnedResults([results[0], ...pinnedResults]);
    },
    [pinnedResults, setPinnedResults]
  );

  const removePinHandler = useCallback(
    (id: string) => {
      setPinnedResults(pinnedResults.filter((r) => r.id !== id));
    },
    [pinnedResults, setPinnedResults]
  );

  return (
    <main className='min-h-screen grid md:grid-cols-[270px_1fr] grid-cols-1'>
      {/* Left column (sidebar) */}
      <div
        className={`fixed bg-white p-4 border-r border-slate-300 overflow-y-auto max-h-dvh md:static md:block h-full w-full z-20 transition-transform duration-300 md:translate-x-0 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
        role='dialog'
        aria-modal='true'
      >
        {/* Heading */}
        <div className='flex justify-between items-center'>
          <h2 className='font-semibold text-xl'>Explore Top Spots</h2>
          <button
            className='md:hidden bg-white border border-sky-500 rounded px-3 py-1 ml-2 text-md text-sky-500 font-extrabold'
            onClick={() => setShowSidebar((v) => !v)}
            aria-label='Open sidebar'
          >
            ✕
          </button>
        </div>
        {/* Destinations lists */}
        <div className='flex flex-col gap-4 mt-5'>
          {tripadvisorAwards.map((category, idx) => (
            <TopTenCard
              key={idx}
              title={category.title}
              destinations={category.destinations}
              source={category.source}
              onClick={handleDestinationClick}
              highlights={cardHighlights}
            />
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className='p-4 flex flex-col gap-2 overflow-y-auto max-h-dvh'>
        {/* Search input */}
        <div className='flex flex-col'>
          <div className='flex gap-2 justify-center'>
            {/* Hamburger for mobile */}
            <button
              className='md:hidden bg-white border border-sky-500 rounded p-2 cursor-pointer'
              onClick={() => setShowSidebar((v) => !v)}
              aria-label='Open sidebar'
            >
              <span className='block w-6 h-0.5 bg-sky-500 mb-1'></span>
              <span className='block w-6 h-0.5 bg-sky-500 mb-1'></span>
              <span className='block w-6 h-0.5 bg-sky-500'></span>
            </button>
            {/* Search bar */}
            <div className='relative w-full'>
              <label htmlFor='search' className='sr-only'>
                Search
              </label>
              <input
                ref={inputRef}
                id='search'
                type='text'
                className='w-full border border-sky-500 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-300 transition'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Find a travel destination...'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchClick();
                }}
              ></input>
              {/* Search results */}
              {showSearchResults && (
                <div
                  ref={searchResultsRef}
                  className='absolute left-0 right-0 z-20 bg-white border-x border-b border-sky-200 rounded shadow-lg max-h-80 overflow-y-auto'
                >
                  {searchResults && searchResults.length > 0 ? (
                    <SearchResults results={searchResults} />
                  ) : (
                    <div className='p-2'>No results found.</div>
                  )}
                </div>
              )}
            </div>
            {/* Search button */}
            <button
              type='button'
              className='text-sky-500 rounded px-4 py-2 font-medium transition border border-sky-500 cursor-pointer hover:bg-gray-100 hover:shadow-md'
              onClick={handleSearchClick}
            >
              Search
            </button>
          </div>
        </div>
        {/* Pinned results */}
        <PinnedResults
          results={pinnedResults}
          removePinHandler={removePinHandler}
        />
      </div>
    </main>
  );
}
