import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider } from './ThemeProvider';
import { ThemeContext } from './themeContext';
import { Theme } from '../types/types';
import { LSTheme_Key } from '../types/constants';

describe('ThemeProvider', () => {
  const mockLocalStorage = (() => {
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

  beforeEach(() => {
    vi.stubGlobal('localStorage', mockLocalStorage);
    mockLocalStorage.clear();
  });

  it('provides light theme by default', () => {
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {({ theme }) => <div data-testid="theme-value">{theme}</div>}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value').textContent).toBe(Theme.LIGHT);
  });

  it('reads theme from localStorage if available', () => {
    mockLocalStorage.setItem(LSTheme_Key, Theme.DARK);

    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {({ theme }) => <div data-testid="theme-value">{theme}</div>}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value').textContent).toBe(Theme.DARK);
  });
});
