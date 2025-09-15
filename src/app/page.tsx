'use client';

import { useState, useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { TopTenCard } from '@/components/TopTenCard';
import { PinnedResults } from '@/components/PinnedResults';
import { SearchBar } from '@/components/SearchBar';
import { getFormattedDestination } from '@/lib/util';
import { doSearch } from '@/lib/actions';
import type { SearchResult, Destination } from '@/lib/types';
import tripadvisorAwards from './tripadvisor-travelers-choice-awards.json';

export default function Home() {
  const { pinnedResults, setPinnedResults, cardHighlights } = useAppContext();
  const [showSidebar, setShowSidebar] = useState(true);

  // When destination is clicked from sidebar, skip showing search results and pin it.
  const handleDestinationClick = useCallback(
    async (destination: Destination) => {
      // setShowSidebar(false);
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
        aria-labelledby='sidebar-heading'
        inert={!showSidebar}
      >
        {/* Heading */}
        <div className='flex justify-between items-center'>
          <h2 id='sidebar-heading' className='font-semibold text-xl'>
            Explore Top Spots
          </h2>
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
            <SearchBar />
          </div>
        </div>
        <PinnedResults
          results={pinnedResults}
          removePinHandler={removePinHandler}
        />
      </div>
    </main>
  );
}
