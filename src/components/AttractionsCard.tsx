import Image from 'next/image';
import type { Attraction } from '@/components/PinnedResults';
import { formatCategory, getBackgroundBlurText } from '@/lib/util';

export function AttractionsCard({
  category,
  items,
  backgroundImage,
}: {
  category: string;
  items: Attraction[];
  backgroundImage?: string;
}) {
  return (
    <div className='rounded-lg p-2 bg-gray-300/50 min-h-[376px] relative'>
      {/* Background image */}
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt='Background image'
          fill
          className='object-cover rounded-lg'
        />
      )}
      {/* Title */}
      <h3 className='relative font-medium text-white text-shadow text-shadow-sm text-shadow-black mb-3 ml-1 text-xl'>
        {formatCategory(category)}
      </h3>
      {/* List */}
      <ul>
        {items.map((a) => (
          <li key={a.id} className='mb-3 text-sm'>
            {a.websiteUri ? (
              <a
                href={a.websiteUri || '#'}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`Visit ${a.websiteUri}`}
                className='hover:underline hover:decoration-white'
              >
                {getBackgroundBlurText(
                  `${a.displayName.text}: ${a.rating ? a.rating : '0'} ⭐`
                )}
              </a>
            ) : (
              getBackgroundBlurText(
                `${a.displayName.text}: ${a.rating ? a.rating : '0'} ⭐`
              )
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
