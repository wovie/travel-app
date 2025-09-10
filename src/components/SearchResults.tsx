import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getPhotoImageUrl } from '@/lib/actions';
import { useAppContext } from '@/contexts/AppContext';
import { Photo, SearchResult } from '@/lib/types';

function Thumbnail({ photo }: { photo: Photo }) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    async function fetchImage() {
      if (!photo) return;
      const url = await getPhotoImageUrl({
        ...photo,
        widthPx: 60,
        heightPx: 60,
      });
      setImageUrl(url);
    }
    fetchImage();
  }, [photo]);

  if (!imageUrl) return null;

  return (
    <Image
      src={imageUrl}
      fill
      alt={`Thumbnail ${photo.name}`}
      className='object-cover rounded-lg'
    />
  );
}

export function SearchResults({ results }: { results: SearchResult[] }) {
  const { pinnedResults, setPinnedResults } = useAppContext();

  // Clicking a result should pin it and hide the results component (handled by parent for now)
  const handleClick = useCallback(
    (result: SearchResult) => {
      const pinned = pinnedResults.some((r) => r.id === result.id);
      if (!pinned) setPinnedResults([result, ...pinnedResults]);
    },
    [pinnedResults, setPinnedResults]
  );

  if (!results || results.length === 0) return null;

  return (
    <ul>
      {results.map((result) => (
        <li
          key={result.id}
          className='p-2 cursor-pointer hover:bg-slate-50 flex items-center gap-2'
          onClick={() => handleClick(result)}
          aria-label={`Pin ${result.displayName.text}`}
        >
          <div className='size-16 relative shrink-0 bg-gray-100 rounded-lg'>
            <Thumbnail photo={result.photos?.[0]} />
          </div>
          {result.formattedAddress}
        </li>
      ))}
    </ul>
  );
}
