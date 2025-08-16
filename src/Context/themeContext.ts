'use client';
import { createContext } from 'react';
import { Theme } from '../types/types';

export type ThemeContextType = {
  theme: Theme;
  setTheme: (newTheme: Theme) => void;
};
const initialContext: ThemeContextType = {
  theme: Theme.LIGHT,
  setTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(initialContext);
