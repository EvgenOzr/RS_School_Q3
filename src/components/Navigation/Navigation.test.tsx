import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Navigation from './Navigation';
import styles from './Navigation.module.scss';

describe('Navigation Component', () => {
  it('renders navigation links correctly', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    const mainLink = screen.getByRole('link', { name: 'Main page' });
    expect(mainLink).toBeInTheDocument();
    expect(mainLink).toHaveAttribute('href', '/');
    expect(mainLink).toHaveClass(styles.item);

    const aboutLink = screen.getByRole('link', { name: 'About' });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(aboutLink).toHaveClass(styles.item);
  });

  it('has correct structure and classes', () => {
    const { container } = render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    const navElement = container.firstChild;
    expect(navElement).toHaveClass(styles.navigation);
    expect(navElement?.childNodes.length).toBe(2);
  });
});
