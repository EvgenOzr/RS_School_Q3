import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CardList from './CardList';
import { ThemeContext } from '../../Context/themeContext';
import { Theme } from '../../types/types';
import saveCharactersReducer from '../../store/saveCharactersSlice';
import type { RootState } from '../../store/store';
import themeStyles from '../../Context/themeColor.module.scss';
import styles from './CardList.module.scss';

const mockCharacters = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    url: 'https://rickandmortyapi.com/api/character/1',
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    url: 'https://rickandmortyapi.com/api/character/2',
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
  },
];

describe('CardList Component', () => {
  const mockOnItemSelected = vi.fn();
  const mockSetTheme = vi.fn();
  let mockStore: ReturnType<typeof configureStore>;

  beforeEach(() => {
    mockStore = configureStore({
      reducer: {
        favorites: saveCharactersReducer,
      },
      preloadedState: {
        favorites: {
          characters: [mockCharacters[0]],
        },
      },
    });

    globalThis.URL.createObjectURL = vi.fn();
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const renderCardList = (theme: Theme = Theme.LIGHT) => {
    return render(
      <Provider store={mockStore}>
        <ThemeContext.Provider value={{ theme, setTheme: mockSetTheme }}>
          <CardList data={mockCharacters} onItemSelected={mockOnItemSelected} />
        </ThemeContext.Provider>
      </Provider>
    );
  };

  it('renders character list with correct items', () => {
    renderCardList();

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('shows pre-selected characters as checked', () => {
    renderCardList();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('toggles character selection on checkbox click', () => {
    renderCardList();

    const [rickCheckbox, mortyCheckbox] = screen.getAllByRole('checkbox');

    fireEvent.click(rickCheckbox);
    expect(rickCheckbox).not.toBeChecked();

    fireEvent.click(mortyCheckbox);
    expect(mortyCheckbox).toBeChecked();
  });

  it('calls onItemSelected when character name is clicked', () => {
    renderCardList();

    fireEvent.click(screen.getByText('Morty Smith'));
    expect(mockOnItemSelected).toHaveBeenCalledWith(mockCharacters[1]);
  });

  it('displays selected count and buttons when items are selected', () => {
    renderCardList();

    expect(screen.getByText('1 items are selected')).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('clears all selections when "Unselect all" is clicked', () => {
    renderCardList();

    fireEvent.click(screen.getByText('Unselect all'));
    const state = mockStore.getState() as RootState;
    expect(state.favorites.characters).toEqual([]);
  });

  it('generates correct CSV content', () => {
    renderCardList();

    fireEvent.click(screen.getByText('Download'));

    expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'text/csv;charset=utf-8;',
      })
    );
  });

  it('applies light theme classes correctly', () => {
    renderCardList(Theme.LIGHT);

    const cardList = screen.getByTestId('card-list');
    expect(cardList).toHaveClass(themeStyles.light);
    expect(cardList).toHaveClass(styles.card_list);
  });

  it('applies dark theme classes correctly', () => {
    renderCardList(Theme.DARK);

    const cardList = screen.getByTestId('card-list');
    expect(cardList).toHaveClass(themeStyles.dark);
    expect(cardList).toHaveClass(styles.card_list);
  });
});
