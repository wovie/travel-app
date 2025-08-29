import { getFormattedDestination } from '@/lib/util';

export type Destination = {
  rank?: number;
  city: string;
  country: string;
};

type TopTenCardProps = {
  title: string;
  destinations: Destination[];
  source?: string;
  onClick: (destination: Destination) => void;
  highlights?: string[];
};

export function TopTenCard({
  title,
  destinations,
  source,
  onClick,
  highlights = [],
}: TopTenCardProps) {
  // Indicates when a destination is already pinned
  const showHighlight = (destination: Destination) => {
    if (!highlights || highlights.length === 0) return false;

    return highlights.some((highlight) =>
      getFormattedDestination(destination).includes(highlight)
    );
  };

  return (
    <div className='p-0'>
      {/* Title */}
      <h3 className='font-semibold text-sky-700'>
        {source ? (
          <a
            href={source}
            target='_blank'
            className='cursor-pointer'
            aria-label={`Tripadvisor Travelers' Choice Awards - ${title}`} rel="noreferrer"
          >{`Tripadvisor Travelers' Choice Awards - ${title}`}</a>
        ) : (
          `Tripadvisor Travelers' Choice Awards - ${title}`
        )}
      </h3>
      {/* Destinations list */}
      <ul className='text-md md:text-sm'>
        {destinations.map((destination) => (
          <li
            key={destination.rank}
            className={
              `cursor-pointer hover:text-sky-600 transition-colors ` +
              (showHighlight(destination) ? 'font-bold' : '')
            }
            onClick={() => onClick(destination)}
            aria-label={getFormattedDestination(destination)}
          >
            {`${destination.rank}. ${getFormattedDestination(destination)}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
