import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';

describe('Search Component', () => {
  const mockOnUpdateSearch = vi.fn();
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<Search onUpdateSearch={mockOnUpdateSearch} />);

    expect(
      screen.getByPlaceholderText('Type something...')
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('updates input value when typing', async () => {
    const user = userEvent.setup();
    render(<Search onUpdateSearch={mockOnUpdateSearch} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Luke');

    expect(input).toHaveValue('Luke');
  });

  it('calls onUpdateSearch and saves to localStorage when button clicked', async () => {
    const user = userEvent.setup();
    render(<Search onUpdateSearch={mockOnUpdateSearch} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'Skywalker');
    await user.click(button);

    expect(mockOnUpdateSearch).toHaveBeenCalledWith('Skywalker');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'search',
      'Skywalker'
    );
  });

  it('trims whitespace when saving search', async () => {
    const user = userEvent.setup();
    render(<Search onUpdateSearch={mockOnUpdateSearch} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, '   Luke   ');
    await user.click(button);

    expect(mockOnUpdateSearch).toHaveBeenCalledWith('Luke');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('search', 'Luke');
  });

  it('loads saved search from localStorage on mount', () => {
    mockLocalStorage.getItem.mockReturnValueOnce('SavedSearch');

    render(<Search onUpdateSearch={mockOnUpdateSearch} />);

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('search');
    expect(mockOnUpdateSearch).toHaveBeenCalledWith('SavedSearch');
    expect(screen.getByRole('textbox')).toHaveValue('SavedSearch');
  });

  it('handles empty saved search in localStorage', () => {
    mockLocalStorage.getItem.mockReturnValueOnce(null);

    render(<Search onUpdateSearch={mockOnUpdateSearch} />);

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('search');
    expect(mockOnUpdateSearch).toHaveBeenCalledWith('');
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('calls onUpdateSearch on mount with empty string if no saved search', () => {
    mockLocalStorage.getItem.mockReturnValueOnce(null);

    render(<Search onUpdateSearch={mockOnUpdateSearch} />);

    expect(mockOnUpdateSearch).toHaveBeenCalledWith('');
  });
});
