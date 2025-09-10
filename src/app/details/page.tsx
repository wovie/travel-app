'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';
import { AttractionsCard } from '@/components/AttractionsCard';
import { BackgroundBlurText } from '@/components/BackgroundBlurText';
import { getPhotoImageUrl } from '@/lib/actions';

export default function DetailsPage() {
  const { details } = useAppContext();
  const router = useRouter();
  const [cardBackgrounds, setCardBackgrounds] =
    useState<Record<string, string>>();

  const result = details?.result;
  const attractions = details?.attractions;
  const backgroundImage = details?.backgroundImage;

  // Redirects to main page if context is missing (on refresh)
  useEffect(() => {
    if (details === null) router.push('/');
  }, [details, router]);

  const categories = useMemo(
    () => Object.keys(attractions || {}),
    [attractions]
  );

  // Build map of background images for each of the 6 attractions cards.
  // Generally there are 10 photos so there will not be any duplicates.
  useEffect(() => {
    if (!result || !attractions || !result.photos || result.photos.length === 0)
      return;

    async function fetchCardBackgrounds() {
      if (!result) return;

      const newCardBackgrounds: Record<string, string> = {};

      // Omit first photo (used in heading), unless it's the only one.
      const slicedPhotos =
        result.photos.length > 1 ? result.photos.slice(1) : result.photos;

      for (let i = 0; i < categories.length; i++) {
        const photo = slicedPhotos[i % slicedPhotos.length];
        newCardBackgrounds[categories[i]] = await getPhotoImageUrl(photo);
      }
      setCardBackgrounds(newCardBackgrounds);
    }

    fetchCardBackgrounds();
  }, [result, attractions, categories]);

  if (!details) return null;

  return (
    <div className='w-full p-4 rounded-lg shadow'>
      {/* Hero */}
      <div className='rounded-lg p-2 relative mb-4 h-[600px]'>
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
        <button
          onClick={() => router.push('/')}
          className='relative bg-white mb-4 px-2 py-1 cursor-pointer border rounded hover:bg-gray-100 transition border-sky-400 text-sky-400 font-semibold'
          aria-label='Back'
        >
          ← Back
        </button>
        {/* Heading */}
        <div className='flex flex-col items-center justify-center h-full w-full'>
          <h1 className='relative text-4xl font-bold mb-6 text-center text-shadow-sm text-shadow-black text-white'>
            {result?.displayName.text}
          </h1>
          <p className='mb-16 text-center'>
            <BackgroundBlurText text={result?.formattedAddress} />
          </p>
        </div>
      </div>
      {/* Attractions */}
      {attractions && categories.length > 0 && (
        <div className='grid grid-cols-1 gap-4'>
          {Object.entries(attractions).map(([category, items]) => (
            <AttractionsCard
              key={category}
              category={category}
              items={items}
              backgroundImage={cardBackgrounds?.[category]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
