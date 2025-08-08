import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import App from './App';
import { ThemeContext } from '../../Context/themeContext';
import { rimApi } from '../../store/rimService';
import { Theme, type character } from '../../types/types';

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-redux', async () => {
  const original = await vi.importActual('react-redux');
  return {
    ...original,
    Provider: original.Provider,
    useDispatch: () => mockDispatch,
  };
});

vi.mock('react-router', async () => {
  const original = await vi.importActual('react-router');
  return {
    ...original,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    }),
  };
});

vi.mock('../Search/Search', () => ({
  default: ({
    onUpdateSearch,
  }: {
    onUpdateSearch: (search: string) => void;
  }) => (
    <input
      data-testid="search-input"
      onChange={(e) => onUpdateSearch(e.target.value)}
    />
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
    onItemSelected: (char: character) => void;
  }) => (
    <div>
      {data.map((item) => (
        <button
          key={item.id}
          onClick={() => onItemSelected(item)}
          data-testid={`character-${item.id}`}
        >
          {item.name}
        </button>
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
    <div data-testid="character-card">
      {!isClosed && (
        <>
          <h2>{card.name}</h2>
          <button onClick={onClose} data-testid="close-card">
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

vi.mock('../Row/Row', () => ({
  default: ({
    left,
    right,
  }: {
    left: React.ReactNode;
    right: React.ReactNode;
  }) => (
    <div>
      <div data-testid="left-column">{left}</div>
      <div data-testid="right-column">{right}</div>
    </div>
  ),
}));

interface ApiResponse {
  results: character[];
  info: {
    count: number;
    prev: string | null;
    next: string | null;
  };
}

const mockCharacterRick: character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  url: 'https://rickandmortyapi.com/api/character/1',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
};

const mockCharacterMorty: character = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  url: 'https://rickandmortyapi.com/api/character/2',
  image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
};

const createMockApiResponse = (
  overrides: Partial<ReturnType<typeof rimApi.useGetSearchQuery>>
) => {
  const baseMock: ReturnType<typeof rimApi.useGetSearchQuery> = {
    data: undefined,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
    currentData: undefined,
    isUninitialized: false,
    isLoading: false,
    isSuccess: false,
    startedTimeStamp: 0,
    fulfilledTimeStamp: 0,
    status: 'fulfilled',
    error: undefined,
    endpointName: 'search',
    requestId: '',
    originalArgs: '',
    isStarted: false,
    isFinished: false,
    reset: vi.fn(),
  };

  return { ...baseMock, ...overrides };
};

const createTestStore = () => {
  return configureStore({
    reducer: {
      [rimApi.reducerPath]: rimApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(rimApi.middleware),
  });
};

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockReset();
    mockNavigate.mockReset();
  });

  const renderApp = (initialEntries = ['/']) => {
    return render(
      <Provider store={createTestStore()}>
        <ThemeContext.Provider
          value={{ theme: Theme.LIGHT, setTheme: vi.fn() }}
        >
          <MemoryRouter initialEntries={initialEntries}>
            <App />
          </MemoryRouter>
        </ThemeContext.Provider>
      </Provider>
    );
  };

  it('renders the header and search input', () => {
    vi.spyOn(rimApi, 'useGetSearchQuery').mockReturnValue(
      createMockApiResponse({ isFetching: true })
    );

    renderApp();

    expect(screen.getByText('RS School. Task 3')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('shows spinner when loading', () => {
    vi.spyOn(rimApi, 'useGetSearchQuery').mockReturnValue(
      createMockApiResponse({ isFetching: true })
    );

    renderApp();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays character list when data is loaded', async () => {
    const mockData: ApiResponse = {
      results: [mockCharacterRick, mockCharacterMorty],
      info: {
        count: 2,
        prev: null,
        next: null,
      },
    };

    vi.spyOn(rimApi, 'useGetSearchQuery').mockReturnValue(
      createMockApiResponse({
        data: mockData,
        isSuccess: true,
      })
    );

    renderApp();

    await waitFor(() => {
      expect(screen.getByTestId('left-column')).toBeInTheDocument();
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });
  });

  it('handles search updates', async () => {
    vi.spyOn(rimApi, 'useGetSearchQuery').mockReturnValue(
      createMockApiResponse({ isFetching: true })
    );

    renderApp();

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'rick' } });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/?search=rick&page=1');
    });
  });

  it('disables previous button on first page', async () => {
    const mockData: ApiResponse = {
      results: [mockCharacterRick],
      info: {
        count: 20,
        prev: null,
        next: 'https://api.example.com?page=2',
      },
    };

    vi.spyOn(rimApi, 'useGetSearchQuery').mockReturnValue(
      createMockApiResponse({
        data: mockData,
        isSuccess: true,
      })
    );

    renderApp(['/?search=rick&page=1']);

    await waitFor(() => {
      expect(screen.getByTestId('prev-button')).toBeDisabled();
      expect(screen.getByTestId('next-button')).toBeEnabled();
    });
  });

  it('handles force refresh button click', async () => {
    vi.spyOn(rimApi, 'useGetSearchQuery').mockReturnValue(
      createMockApiResponse({})
    );

    renderApp();

    const refreshButton = screen.getByText('Update data');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});
