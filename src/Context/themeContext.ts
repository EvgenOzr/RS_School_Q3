import { createContext } from 'react';
import { Theme } from '../types/types';

export type themeContextType = {
  theme: Theme;
  setTheme: (newTheme: Theme) => void;
};
const initialContext: themeContextType = {
  theme: Theme.LIGHT,
  setTheme: () => {},
};

export const ThemeContext = createContext(initialContext);
