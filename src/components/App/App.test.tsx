import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router';
import App from './App';
import type { character } from '../../types/types';
import styles from './App.module.scss';

vi.mock('../Search/Search', () => ({
  default: ({
    onUpdateSearch,
  }: {
    onUpdateSearch: (search: string) => void;
  }) => (
    <div>
      <input
        data-testid="search-input"
        onChange={(e) => onUpdateSearch(e.target.value)}
      />
      <button data-testid="search-button">Search</button>
    </div>
  ),
}));

vi.mock('../Spinner/Spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('../CardList/CardList', () => ({
  default: ({
    data,
    onItemSelected,
  }: {
    data: character[];
    onItemSelected: (item: character) => void;
  }) => (
    <div data-testid="card-list">
      {data.map((item) => (
        <div
          key={item.id}
          data-testid={`character-${item.id}`}
          onClick={() => onItemSelected(item)}
        >
          {item.name}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../Card/Card', () => ({
  default: ({
    card,
    isClosed,
    onClose,
  }: {
    card: character;
    isClosed: boolean;
    onClose: () => void;
  }) => (
    <div data-testid="card">
      {!isClosed && card && (
        <>
          <div>{card.name}</div>
          <button data-testid="close-card" onClick={onClose}>
            Close
          </button>
        </>
      )}
    </div>
  ),
}));

vi.mock('../MessageField/MessageField', () => ({
  default: ({ title, text }: { title: string; text: string }) => (
    <div data-testid="message-field">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  ),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

vi.mock('./App.module.scss', () => ({
  default: {
    pagination: 'mock_pagination',
    pagination_button: 'mock_pagination_button',
    pagination_button_disabled: 'mock_pagination_button_disabled',
    pagination_page: 'mock_pagination_page',
  },
}));

vi.mock('../../Context/themeColor.module.scss', () => ({
  default: {
    light: 'mock_light',
    dark: 'mock_dark',
  },
}));
globalThis.fetch = vi.fn();

describe('App Component', () => {
  const mockNavigate = vi.fn();
  const mockLocation = {
    search: '',
    pathname: '/',
    state: null,
    key: '',
    hash: '',
  };

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useLocation).mockReturnValue(mockLocation);
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    vi.spyOn(Storage.prototype, 'setItem').mockReturnValue();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('RS School. Task 3')).toBeInTheDocument();
  });

  it('shows spinner when loading', async () => {
    vi.mocked(fetch).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(new Response()), 100);
        })
    );

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays no results message when no data', async () => {
    const mockData = {
      results: null,
      info: { count: 0 },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    } as Response);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('message-field')).toBeInTheDocument();
      expect(screen.getByText('Nothing found!')).toBeInTheDocument();
    });
  });

  it('fetches and displays data correctly', async () => {
    const mockData = {
      results: [
        { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human' },
        { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human' },
      ],
      info: {
        count: 2,
        prev: null,
        next: 'https://rickandmortyapi.com/api/character/?page=2',
      },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    } as Response);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('card-list')).toBeInTheDocument();
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });
  });

  it('handles character selection', async () => {
    const mockData = {
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          image: '',
          gender: 'Male',
        },
      ],
      info: { count: 1, prev: null, next: null },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    } as Response);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Rick Sanchez'));
      expect(mockNavigate).toHaveBeenCalledWith('/?search=&page=1&details=1');
    });

    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('loads saved search from localStorage on mount', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('rick');

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/?search=rick&page=1');
    });
  });

  it('handles fetch error gracefully', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('API error'));

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('message-field')).toBeInTheDocument();
      expect(screen.getByText('Nothing found!')).toBeInTheDocument();
    });
  });

  it('updates search params when search is triggered', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'morty' },
    });
    fireEvent.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/?search=morty&page=1');
    });
  });

  it('disables previous button on first page', async () => {
    const mockData = {
      results: [{ id: 1, name: 'Rick Sanchez' }],
      info: { count: 1, prev: null, next: null },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    } as Response);

    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      const prevButton = screen.getByText('Previous');
      expect(prevButton).toBeDisabled();
      expect(prevButton).toHaveClass(styles.pagination_button_disabled);
    });
  });

  it('disables next button when no more pages', async () => {
    const mockData = {
      results: [{ id: 1, name: 'Rick Sanchez' }],
      info: { count: 1, prev: null, next: null },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    } as Response);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();
      expect(nextButton).toHaveClass(styles.pagination_button_disabled);
    });
  });
});
