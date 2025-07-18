import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
  const mockCharacter = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
  };

  beforeEach(() => {
    vi.spyOn(window, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      } as Response)
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows spinner when loading', async () => {
    vi.spyOn(window, 'fetch').mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ results: [mockCharacter] }),
              } as Response),
            200
          )
        )
    );

    render(<App />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'luke');

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });

  it('displays search results', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [mockCharacter] }),
    } as Response);

    render(<App />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'luke');

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });

  it('shows "Nothing found!" when no results', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    } as Response);

    render(<App />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('Nothing found!')).toBeInTheDocument();
      expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument();
    });
  });

  it('displays character details when item is selected', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [mockCharacter] }),
    } as Response);

    render(<App />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'luke');

    await waitFor(async () => {
      const character = await screen.findByText('Luke Skywalker');
      fireEvent.click(character);

      expect(
        screen.getByText(`Gender - ${mockCharacter.gender}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Birth year - ${mockCharacter.birth_year}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Height - ${mockCharacter.height}`)
      ).toBeInTheDocument();
    });
  });

  it('throws error when trigger button is clicked', async () => {
    const originalError = console.error;
    console.error = vi.fn();

    render(<App />);
    const button = screen.getByText('Throw Error');

    await expect(async () => {
      await userEvent.click(button);
    }).rejects.toThrow('Это тестовая ошибка из компонента App!');

    console.error = originalError;
  });

  it('handles empty search', async () => {
    const fetchSpy = vi.spyOn(window, 'fetch');

    render(<App />);
    const input = screen.getByRole('textbox');
    await userEvent.clear(input);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://swapi.py4e.com/api/people/'
      );
    });
  });

  it('handles API response with not ok status', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    } as Response);

    render(<App />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'badrequest');

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      expect(
        screen.getByText('Welcome to search App(Star Wars)')
      ).toBeInTheDocument();
    });
  });
});
