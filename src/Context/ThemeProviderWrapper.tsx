'use client';

import { ThemeProvider } from '../Context/ThemeProvider';

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
