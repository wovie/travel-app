import type { Destination, Attraction } from '@/lib/types';

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
