import type { Destination } from '@/components/TopTenCard';
import type { Attraction } from '@/components/PinnedResults';

/**
 * Formats a destination as "City, Country".
 */
export const getFormattedDestination = (dest: Destination): string => {
  if (!dest) return '';
  return `${dest.city}${dest.country && ', ' + dest.country}`;
};

/**
 * Calculates average rating of attractions, ignoring if missing.
 * Returns a number rounded to 1 decimal place.
 */
export const getAverageRating = (attractions: Attraction[]): number => {
  if (!attractions || attractions.length === 0) return 0;
  const ratings = attractions.map((a) => a.rating).filter(Boolean);
  if (ratings.length === 0) return 0;
  const total = ratings.reduce((sum, r) => sum + r, 0);
  return Math.round((total / ratings.length) * 10) / 10;
};

/**
 * Formats category into sentence casing (FOOD_AND_DRINK > Food & Drink)
 */
export const formatCategory = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\band\b/g, '&')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// Help improve text readability over background image
export const getBackgroundBlurText = (text: string | undefined) => {
  return (
    <span className='backdrop-blur-sm bg-black/60 rounded-lg px-2 py-1 capitalize text-white text-shadow-sm text-shadow-black'>
      {text}
    </span>
  );
};

/**
 * Industry types used in Google Places request.
 */
export const INDUSTRY_TYPES = {
  CULTURE: [
    'art_gallery',
    'art_studio',
    'cultural_landmark',
    'historical_place',
    'monument',
    'museum',
  ],
  ENTERTAINMENT_AND_RECREATION: [
    'amusement_center',
    'amusement_park',
    'aquarium',
    'casino',
    'comedy_club',
    'dance_hall',
    'event_venue',
    'ferris_wheel',
    'garden',
    'hiking_area',
    'historical_landmark',
    'karaoke',
    'national_park',
    'night_club',
    'observation_deck',
    'opera_house',
    'park',
    'planetarium',
    'plaza',
    'roller_coaster',
    'state_park',
    'tourist_attraction',
    'zoo',
  ],
  FOOD_AND_DRINK: [
    'bakery',
    'bar',
    'cafe',
    'coffee_shop',
    'food_court',
    'ice_cream_shop',
    'pub',
    'restaurant',
    'sandwich_shop',
    'steak_house',
    'tea_house',
    'wine_bar',
  ],
  LODGING: [
    'bed_and_breakfast',
    'hostel',
    'hotel',
    'inn',
    'lodging',
    'motel',
    'resort_hotel',
  ],
  SHOPPING: [
    'book_store',
    'clothing_store',
    'convenience_store',
    'department_store',
    'discount_store',
    'electronics_store',
    'gift_shop',
    'home_goods_store',
    'jewelry_store',
    'market',
    'shopping_mall',
    'store',
    'supermarket',
  ],
  TRANSPORTATION: [
    'airport',
    'bus_station',
    'bus_stop',
    'ferry_terminal',
    'subway_station',
    'taxi_stand',
    'train_station',
    'transit_depot',
    'transit_station',
  ],
};
