import { useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { PinnedResultItem } from '@/components/PinnedResultItem';
import type { SearchResult } from '@/lib/types';

export function PinnedResults({
  results,
  removePinHandler,
}: {
  results: SearchResult[];
  removePinHandler?: (id: string) => void;
}) {
  const { setCardHighlights } = useAppContext();

  // Updates destination highlights
  useEffect(() => {
    setCardHighlights(
      results
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
    // setShowSearchResults(false);
    // setSearchTerm('');
  }, [results, setCardHighlights]);

  return (
    <>
      {results.map((result) => (
        <PinnedResultItem
          result={result}
          key={result.id}
          removePinHandler={removePinHandler}
        />
      ))}
    </>
  );
}
