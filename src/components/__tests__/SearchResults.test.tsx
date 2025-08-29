import { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchResults, SearchResult } from '../SearchResults';
import { useAppContext } from '@/contexts/AppContext';

jest.mock('@/contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('@/lib/actions', () => ({
  getPhotoImageUrl: jest.fn().mockResolvedValue('https://test.com/mock.jpg'),
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

afterEach(() => {
  jest.clearAllMocks();
});

describe('SearchResults', () => {
  beforeEach(() => {
    // Default mock for context
    (useAppContext as jest.Mock).mockReturnValue({
      pinnedResults: [],
      setPinnedResults: jest.fn(),
    });
  });

  it('renders search results', async () => {
    await act(async () => {
      render(<SearchResults results={mockResults} />);
    });
    expect(screen.getByText('Mockton, Mockland')).toBeInTheDocument();
  });

  it('renders thumbnails', async () => {
    await act(async () => {
      render(<SearchResults results={mockResults} />);
    });
    const images = await screen.findAllByRole('img');
    expect(images.length).toBe(1);
    expect((images[0] as HTMLImageElement).src).toContain(
      encodeURIComponent('https://test.com/mock.jpg')
    );
  });

  it('calls setPinnedResults', async () => {
    const setPinnedResults = jest.fn();
    (useAppContext as jest.Mock).mockReturnValue({
      pinnedResults: [],
      setPinnedResults,
    });

    await act(async () => {
      render(<SearchResults results={mockResults} />);
    });
    fireEvent.click(screen.getByText('Mockton, Mockland'));
    expect(setPinnedResults).toHaveBeenCalledWith([mockResults[0]]);
  });

  it('returns null if no results', () => {
    const { container } = render(<SearchResults results={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
