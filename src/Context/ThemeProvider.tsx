import type React from 'react';
import { ThemeContext } from './themeContext';
import { useState } from 'react';
import { Theme } from '../types/types';
import { LSTheme_Key } from '../types/constants';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState(() => {
    return (localStorage.getItem(LSTheme_Key) as Theme) || Theme.LIGHT;
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
