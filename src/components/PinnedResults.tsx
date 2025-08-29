'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppContext } from '@/contexts/AppContext';
import type { SearchResult, Location } from '@/components/SearchResults';
import type { Photo } from '@/components/SearchResults';
import { getPhotoImageUrl, getAttractions } from '@/lib/actions';
import {
  getAverageRating,
  formatCategory,
  getBackgroundBlurText,
} from '@/lib/util';

export type Attraction = {
  displayName: {
    languageCode: string;
    text: string;
  };
  formattedAddress: string;
  id: string;
  location: Location;
  name: string;
  photos: Photo[];
  rating: number;
  websiteUri: string;
};

function PinnedResultItem({
  result,
  removePinHandler,
}: {
  result: SearchResult;
  removePinHandler?: (id: string) => void;
}) {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [attractions, setAttractions] = useState<Record<string, Attraction[]>>(
    {}
  );
  const { setDetails } = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pendingNav, setPendingNav] = useState(false);

  // Fetch background image first, then fetch ratings.
  useEffect(() => {
    async function fetchBackgroundImage() {
      if (result.photos && result.photos.length > 0) {
        const first = await getPhotoImageUrl(result.photos[0]);
        setBackgroundImage(first);
      }
    }

    async function fetchAttractions() {
      setLoading(true);
      const ratings = await getAttractions(result.location);
      setAttractions(ratings);
      setLoading(false);
    }

    fetchBackgroundImage();
    fetchAttractions();
  }, [result]);

  const doNav = useCallback(() => {
    setPendingNav(false);
    setDetails({ result, attractions, backgroundImage });
    router.push('/details');
  }, [result, attractions, setDetails, router, backgroundImage]);

  useEffect(() => {
    if (!loading && pendingNav) doNav();
  }, [loading, pendingNav, doNav]);

  // Wait until attractions are loaded before navigating.
  const handleClick = useCallback(() => {
    if (loading) setPendingNav(true);
    else doNav();
  }, [loading, doNav]);

  const attractionRatings = useMemo(() => {
    if (!attractions || Object.keys(attractions).length === 0) return [];
    return Object.entries(attractions).map(([category, items]) => (
      <div key={category}>
        {getBackgroundBlurText(
          `${formatCategory(category)}: ${getAverageRating(items)} ⭐`
        )}
      </div>
    ));
  }, [attractions]);

  return (
    <div
      className='relative bg-gray-300 cursor-pointer p-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-101 hover:shadow-lg min-h-[212px]'
      onClick={handleClick}
    >
      {/* Background image */}
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt='Background image'
          fill
          priority
          className='object-cover rounded-lg'
        />
      )}
      {/* Destination heading */}
      <div className='flex justify-between items-start pb-2 z-10 relative'>
        <h2 className='font-bold text-2xl px-2 text-shadow-black text-shadow-sm text-white'>
          {result.formattedAddress}
        </h2>
        {removePinHandler && (
          <button
            className='cursor-pointer border rounded p-1 text-xs hover:shadow-md hover:bg-gray-100 transition bg-white text-rose-700 font-medium shadow min-w-[72px]'
            onClick={(e) => {
              e.stopPropagation();
              removePinHandler(result.id);
            }}
            aria-label='Remove pin'
          >
            📌 Remove
          </button>
        )}
      </div>
      {/* Attraction ratings */}
      <div className='flex flex-col gap-2 text-sm'>
        {attractionRatings}
        {/* NYI */}
        {/* <div>
          {getBackgroundBlurText(
            'Best Travel Months: SEPT - OCT (X months away)'
          )}
        </div>
        <div>
          {getBackgroundBlurText(
            'Currency: 1 USD = 0.92 EUR (weak/strong/neutral)'
          )}
        </div> */}
      </div>
    </div>
  );
}

export function PinnedResults({
  results,
  removePinHandler,
}: {
  results: SearchResult[];
  removePinHandler?: (id: string) => void;
}) {
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
