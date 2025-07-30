// import { describe, it, expect } from 'vitest';
// import { render, screen } from '@testing-library/react';
// import { MemoryRouter } from 'react-router';
// import Navigation from './Navigation';
// import styles from './Navigation.module.scss';

// describe('Navigation Component', () => {
//   it('renders navigation links correctly', () => {
//     render(
//       <MemoryRouter>
//         <Navigation />
//       </MemoryRouter>
//     );

//     const mainLink = screen.getByRole('link', { name: 'Main page' });
//     expect(mainLink).toBeInTheDocument();
//     expect(mainLink).toHaveAttribute('href', '/');
//     expect(mainLink).toHaveClass(styles.item);

//     const aboutLink = screen.getByRole('link', { name: 'About' });
//     expect(aboutLink).toBeInTheDocument();
//     expect(aboutLink).toHaveAttribute('href', '/about');
//     expect(aboutLink).toHaveClass(styles.item);
//   });

//   it('has correct structure and classes', () => {
//     const { container } = render(
//       <MemoryRouter>
//         <Navigation />
//       </MemoryRouter>
//     );

//     const navElement = container.firstChild;
//     expect(navElement).toHaveClass(styles.navigation);
//     expect(navElement?.childNodes.length).toBe(3);
//   });
// });
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import Navigation from './Navigation';
import { ThemeContext } from '../../Context/themeContext';
import { Theme } from '../../types/types';
import styles from './Navigation.module.scss';
import themeStyles from '../../Context/themeColor.module.scss';

describe('Navigation Component', () => {
  const mockSetTheme = vi.fn();

  const renderNavigation = (initialTheme: Theme = Theme.LIGHT) => {
    return render(
      <MemoryRouter>
        <ThemeContext.Provider
          value={{ theme: initialTheme, setTheme: mockSetTheme }}
        >
          <Navigation />
        </ThemeContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation links with correct text', () => {
    renderNavigation();

    expect(screen.getByText('Main page')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Change to Dark')).toBeInTheDocument();
  });

  it('applies light theme classes when theme is light', () => {
    renderNavigation(Theme.LIGHT);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass(styles.navigation);
    expect(nav).toHaveClass(themeStyles.light);
  });

  it('applies dark theme classes when theme is dark', () => {
    renderNavigation(Theme.DARK);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass(styles.navigation);
    expect(nav).toHaveClass(themeStyles.dark);
  });

  it('calls setTheme with DARK when clicking button in light mode', () => {
    renderNavigation(Theme.LIGHT);

    fireEvent.click(screen.getByText('Change to Dark'));
    expect(mockSetTheme).toHaveBeenCalledWith(Theme.DARK);
  });

  it('calls setTheme with LIGHT when clicking button in dark mode', () => {
    renderNavigation(Theme.DARK);

    fireEvent.click(screen.getByText('Change to Light'));
    expect(mockSetTheme).toHaveBeenCalledWith(Theme.LIGHT);
  });

  it('renders links with correct href attributes', () => {
    renderNavigation();

    expect(screen.getByText('Main page').closest('a')).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByText('About').closest('a')).toHaveAttribute(
      'href',
      '/about'
    );
  });

  it('applies theme classes to all interactive elements', () => {
    renderNavigation(Theme.LIGHT);

    const links = screen.getAllByRole('link');
    const button = screen.getByRole('button');

    links.forEach((link) => {
      expect(link).toHaveClass(styles.item);
      expect(link).toHaveClass(themeStyles.light);
    });

    expect(button).toHaveClass(styles.toggleTheme);
    expect(button).toHaveClass(themeStyles.light);
  });
});
