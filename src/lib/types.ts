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

export type Destination = {
  rank?: number;
  city: string;
  country: string;
};

export type Location = {
  latitude: number;
  longitude: number;
};

export type Photo = {
  authorAttributions: [];
  flagContentUri: string;
  heightPx: number;
  name: string;
  widthPx: number;
};

export type SearchResult = {
  displayName: {
    languageCode: string;
    text: string;
  };
  formattedAddress: string;
  id: string;
  location: Location;
  name: string;
  photos: Photo[];
};
