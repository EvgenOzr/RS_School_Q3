import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Search from './Search';
import userEvent from '@testing-library/user-event';

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Search Component', () => {
  const mockUpdateSearch = vi.fn();

  beforeEach(() => {
    window.localStorage.clear();
    mockUpdateSearch.mockClear();
  });

  test('renders correctly with initial state', () => {
    render(<Search onUpdateSearch={mockUpdateSearch} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('updates input value when typing', () => {
    render(<Search onUpdateSearch={mockUpdateSearch} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Rick' } });
    expect(input).toHaveValue('Rick');
  });

  test('calls onUpdateSearch with trimmed value when button clicked', () => {
    render(<Search onUpdateSearch={mockUpdateSearch} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '  Rick  ' } });
    fireEvent.click(button);

    expect(mockUpdateSearch).toHaveBeenCalledWith('Rick');
    expect(localStorage.getItem('search')).toBe('Rick');
  });

  test('loads saved search from localStorage on mount', () => {
    localStorage.setItem('search', 'Morty');
    render(<Search onUpdateSearch={mockUpdateSearch} />);

    expect(screen.getByRole('textbox')).toHaveValue('Morty');
  });

  test('triggers search on Enter key press', () => {
    render(<Search onUpdateSearch={mockUpdateSearch} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Rick' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockUpdateSearch).toHaveBeenCalledWith('Rick');
  });

  test('updates input and submits with userEvent', async () => {
    const user = userEvent.setup();
    render(<Search onUpdateSearch={mockUpdateSearch} />);

    await user.type(screen.getByRole('textbox'), 'Rick{enter}');

    expect(mockUpdateSearch).toHaveBeenCalledWith('Rick');
  });
});
