'use client';

import { useContext } from 'react';
import { ThemeContext } from '../Context/themeContext';

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
