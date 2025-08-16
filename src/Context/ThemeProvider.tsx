'use client';
import type React from 'react';
import { ThemeContext } from './themeContext';
import { Theme } from '../types/types';
import { LSTheme_Key } from '../types/constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useLocalStorage<Theme>(LSTheme_Key, Theme.LIGHT);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
