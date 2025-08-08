import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeContext } from '../../Context/themeContext';
import { Theme } from '../../types/types';
import Search from './Search';
import { configureStore } from '@reduxjs/toolkit';
import saveCharactersSlice from '../../store/saveCharactersSlice';

const mockOnUpdateSearch = vi.fn();

const store = configureStore({
  reducer: {
    saveCharacters: saveCharactersSlice,
  },
});

describe('Search Component', () => {
  const renderWithProviders = (theme = Theme.LIGHT) => {
    return render(
      <Provider store={store}>
        <ThemeContext.Provider value={{ theme, setTheme: () => {} }}>
          <Search onUpdateSearch={mockOnUpdateSearch} />
        </ThemeContext.Provider>
      </Provider>
    );
  };

  it('renders correctly', () => {
    renderWithProviders();
    expect(
      screen.getByPlaceholderText('Type something...')
    ).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('updates search input value', () => {
    renderWithProviders();
    const input = screen.getByPlaceholderText('Type something...');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
  });

  it('calls onUpdateSearch when search button is clicked', () => {
    renderWithProviders();
    const input = screen.getByPlaceholderText('Type something...');
    const button = screen.getByText('Search');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    expect(mockOnUpdateSearch).toHaveBeenCalledWith('test');
  });

  it('calls onUpdateSearch when Enter key is pressed', () => {
    renderWithProviders();
    const input = screen.getByPlaceholderText('Type something...');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockOnUpdateSearch).toHaveBeenCalledWith('test');
  });
});
