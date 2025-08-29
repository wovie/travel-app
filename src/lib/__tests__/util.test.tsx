import {
  getFormattedDestination,
  getAverageRating,
  formatCategory,
} from '../util';

const baseAttraction = {
  displayName: { languageCode: 'en', text: '' },
  formattedAddress: '',
  id: '',
  location: { latitude: 0, longitude: 0 },
  name: '',
  photos: [],
  rating: 4,
  websiteUri: '',
};

describe('getFormattedDestination', () => {
  it('formats city and country', () => {
    expect(getFormattedDestination({ city: 'Paris', country: 'France' })).toBe(
      'Paris, France'
    );
  });

  it('formats city only if country is missing', () => {
    expect(getFormattedDestination({ city: 'Tokyo', country: '' })).toBe(
      'Tokyo'
    );
  });
});

describe('getAverageRating', () => {
  it('returns 0 for empty array', () => {
    expect(getAverageRating([])).toBe(0);
  });

  it('returns 0 if no valid ratings', () => {
    expect(getAverageRating([{ ...baseAttraction, rating: undefined }])).toBe(
      0
    );
  });

  it('calculates average and rounds to 1 decimal', () => {
    expect(
      getAverageRating([
        { ...baseAttraction, rating: 4 },
        { ...baseAttraction, rating: 5 },
        { ...baseAttraction, rating: 3 },
      ])
    ).toBe(4);
    expect(
      getAverageRating([
        { ...baseAttraction, rating: 4.2 },
        { ...baseAttraction, rating: 4.8 },
      ])
    ).toBe(4.5);
  });
});

describe('formatCategory', () => {
  it('formats FOOD_AND_DRINK to Food & Drink', () => {
    expect(formatCategory('FOOD_AND_DRINK')).toBe('Food & Drink');
  });

  it('formats CULTURE to Culture', () => {
    expect(formatCategory('CULTURE')).toBe('Culture');
  });

  it('formats lodging to Lodging', () => {
    expect(formatCategory('lodging')).toBe('Lodging');
  });
});
