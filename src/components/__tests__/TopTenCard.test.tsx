import { render, screen, fireEvent } from '@testing-library/react';
import { TopTenCard, Destination } from '../TopTenCard';

const destinations: Destination[] = [
  { rank: 1, city: 'Paris', country: 'France' },
  { rank: 2, city: 'Rome', country: 'Italy' },
];

describe('TopTenCard', () => {
  it('renders the title', () => {
    render(
      <TopTenCard
        title='Europe'
        destinations={destinations}
        source='https://tripadvisor.com'
        onClick={() => {}}
      />
    );
    const link = screen.getByRole('link', {
      name: "Tripadvisor Travelers' Choice Awards - Europe",
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://tripadvisor.com');
  });

  it('renders destinations', () => {
    render(
      <TopTenCard
        title='Europe'
        destinations={destinations}
        onClick={() => {}}
      />
    );
    expect(screen.getByText('1. Paris, France')).toBeInTheDocument();
    expect(screen.getByText('2. Rome, Italy')).toBeInTheDocument();
  });

  it('calls onClick', () => {
    const handleClick = jest.fn();
    render(
      <TopTenCard
        title='Europe'
        destinations={destinations}
        onClick={handleClick}
      />
    );
    fireEvent.click(screen.getByText('1. Paris, France'));
    expect(handleClick).toHaveBeenCalledWith(destinations[0]);
  });

  it('renders highlights', () => {
    render(
      <TopTenCard
        title='Europe'
        destinations={destinations}
        highlights={['Paris, France']}
        onClick={() => {}}
      />
    );
    const highlighted = screen.getByText('1. Paris, France');
    expect(highlighted).toHaveClass('font-bold');
  });
});
