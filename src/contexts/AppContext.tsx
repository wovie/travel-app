'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';
import type { SearchResult, Attraction } from '@/lib/types';

type DetailsType = {
  result: SearchResult;
  attractions: Record<string, Attraction[]>;
  backgroundImage: string;
} | null;

/*
 * Defines shape of global app context.
 * - details: used in routing to show destination details
 * - pinnedResults: used on main page to show destination summary
 */
type AppContextType = {
  details: DetailsType;
  setDetails: (details: DetailsType) => void;
  pinnedResults: SearchResult[];
  setPinnedResults: (results: SearchResult[]) => void;
  cardHighlights: string[];
  setCardHighlights: (highlights: string[]) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [details, setDetails] = useState<DetailsType>(null);
  const [pinnedResults, setPinnedResults] = useState<SearchResult[]>([]);
  const [cardHighlights, setCardHighlights] = useState<string[]>([]);

  // Memoize context value for performance
  const value = useMemo(
    () => ({
      details,
      setDetails,
      pinnedResults,
      setPinnedResults,
      cardHighlights,
      setCardHighlights,
    }),
    [details, pinnedResults, cardHighlights, setCardHighlights]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('AppContext not found!');
  return context;
}
