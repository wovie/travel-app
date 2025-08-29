'use server';

import type { Attraction } from '@/components/PinnedResults';
import type { Location } from '@/components/SearchResults';
import type { Photo } from '@/components/SearchResults';
import { INDUSTRY_TYPES } from '@/lib/util';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  throw new Error('Missing GOOGLE_API_KEY');
}

/**
 * Search for places by text.
 * Returns an array of place objects.
 * In most cases, the first item is the most relevant result.
 */
export const doSearch = async (textQuery: string) => {
  if (!textQuery) return null;

  const body = JSON.stringify({ textQuery });
  const url = `https://places.googleapis.com/v1/places:searchText`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': [
        'places.displayName',
        'places.formattedAddress',
        // 'places.googleMapsLinks',
        // 'places.googleMapsUri',
        'places.id',
        'places.location',
        'places.name',
        'places.photos',
        // 'places.timeZone',
      ].join(','),
    },
    body,
  });

  if (!response.ok) {
    console.error('Failed: doSearch', response);
    return null;
  }

  const data = await response.json();
  return data.places;
};

/**
 * Gets photo image URL.
 */
export const getPhotoImageUrl = async (photo: Photo) => {
  if (!photo) return '';

  const { name, heightPx, widthPx } = photo;

  const url = `https://places.googleapis.com/v1/${name}/media?key=${GOOGLE_API_KEY}&maxWidthPx=${widthPx}&maxHeightPx=${heightPx}`;

  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
  });

  if (!response.ok) {
    console.error('Failed: getPhotoImageUrl', response);
    return '';
  }

  return response.url;
};

/**
 * Finds attractions around a location (longitude, latitude).
 * Runs parallel requests for each industry type in INDUSTRY_TYPES.
 * Returns an object mapping each category to its array of places.
 */
export const getAttractions = async (location: Location) => {
  const { latitude, longitude } = location;

  // Helper to fetch places for a given category
  const fetchPlaces = async (includedPrimaryTypes: string[]) => {
    const radius = 8000; // 8 km ~= 5 miles

    const body = {
      includedPrimaryTypes,
      rankPreference: 'POPULARITY',
      maxResultCount: 10,
      locationRestriction: {
        circle: { center: { latitude, longitude }, radius },
      },
    };

    const response = await fetch(
      'https://places.googleapis.com/v1/places:searchNearby',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': [
            'places.id',
            'places.displayName',
            'places.formattedAddress',
            // 'places.shortFormattedAddress',
            'places.location',
            'places.rating',
            // 'places.userRatingCount',
            // 'places.types',
            // 'places.reviewSummary',
            // 'places.primaryType',
            // 'places.editorialSummary',
            // 'places.currentOpeningHours',
            // 'places.regularOpeningHours',
            // 'places.googleMapsUri',
            'places.name',
            'places.photos',
            // 'places.priceLevel',
            // 'places.priceRange',
            'places.websiteUri',
          ].join(','),
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      console.error('Failed: getAttractions', response);
      return [];
    }

    const data = await response.json();
    return data.places || [];
  };

  // Run requests in parallel
  const results = await Promise.all(
    Object.entries(INDUSTRY_TYPES).map(([, types]) => fetchPlaces(types))
  );

  // Build the result object
  const ratings: Record<string, Attraction[]> = {};
  Object.keys(INDUSTRY_TYPES).forEach((key, idx) => {
    ratings[key] = results[idx];
  });

  return ratings;
};

/**
const getStaticMap = async (location: Location, zoom = '5') => {
  if (!location) return null;

  const width = 300;
  const height = 200;

  const params = new URLSearchParams({
    center: `${location.latitude},${location.longitude}`,
    zoom,
    size: `${width}x${height}`,
    key: GOOGLE_API_KEY,
  });

  const url = `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
  });

  const blob = await response.blob();
  const imageUrl = URL.createObjectURL(blob);

  return (
    <Image
      src={imageUrl}
      alt={`${location.latitude},${location.longitude}`}
      width={width}
      height={height}
    />
  );
};
*/
