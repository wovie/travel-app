import { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PinnedResults } from '../PinnedResults';
import type { SearchResult } from '../SearchResults';

const pushMock = jest.fn();

jest.mock('@/contexts/AppContext', () => ({
  useAppContext: () => ({
    setDetails: jest.fn(),
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock('@/lib/actions', () => ({
  getPhotoImageUrl: jest.fn().mockResolvedValue('https://test.com/mock.jpg'),
  getAttractions: jest.fn().mockResolvedValue({
    FOOD_AND_DRINK: [
      {
        id: '1',
        displayName: { languageCode: 'en', text: 'Mockdonalds' },
        formattedAddress: '123 Mock St',
        location: { latitude: 10, longitude: 20 },
        name: '',
        photos: [],
        rating: 4.9,
        websiteUri: 'https://mockdonalds.com',
      },
    ],
  }),
}));

const mockResults: SearchResult[] = [
  {
    displayName: { languageCode: 'en', text: 'Mockton' },
    formattedAddress: 'Mockton, Mockland',
    id: '1',
    location: { latitude: 10, longitude: 20 },
    name: '',
    photos: [
      {
        authorAttributions: [],
        flagContentUri: '',
        heightPx: 100,
        name: 'mockphoto1',
        widthPx: 100,
      },
    ],
  },
];

describe('PinnedResults', () => {
  it('renders pinned results', async () => {
    await act(async () => {
      render(<PinnedResults results={mockResults} />);
    });
    expect(screen.getByText('Mockton, Mockland')).toBeInTheDocument();
  });

  it('renders attraction ratings', async () => {
    await act(async () => {
      render(<PinnedResults results={mockResults} />);
    });
    await waitFor(() => {
      expect(screen.getByText(/Food & Drink: 4.9/i)).toBeInTheDocument();
    });
  });

  it('calls removePinHandler', async () => {
    const removePinHandler = jest.fn();
    await act(async () => {
      render(
        <PinnedResults
          results={mockResults}
          removePinHandler={removePinHandler}
        />
      );
    });
    fireEvent.click(screen.getByText(/Remove/i));
    expect(removePinHandler).toHaveBeenCalledWith('1');
  });

  it('navigates to details page', async () => {
    await act(async () => {
      render(<PinnedResults results={mockResults} />);
    });
    fireEvent.click(screen.getByText('Mockton, Mockland'));
    expect(pushMock).toHaveBeenCalledWith('/details');
  });
});
