'use client';
import styles from './Navigation.module.scss';
import themeStyles from '../../Context/themeColor.module.scss';
import { useContext } from 'react';
import { ThemeContext } from '../../Context/themeContext';
import { Theme } from '../../types/types';
import Link from 'next/link';

const Navigation = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const handlToggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  const newTheme =
    theme === Theme.LIGHT ? `${themeStyles.light}` : `${themeStyles.dark}`;

  return (
    <nav className={`${styles.navigation} ${newTheme}`} role="navigation">
      <Link href="/" className={`${styles.item} ${newTheme}`}>
        Main page
      </Link>
      <Link href="/about" className={`${styles.item} ${newTheme}`}>
        About
      </Link>
      <button
        className={`${styles.toggleTheme} ${newTheme}`}
        onClick={handlToggleTheme}
      >
        {theme === Theme.LIGHT ? 'Change to Dark' : 'Change to Light'}
      </button>
    </nav>
  );
};

export default Navigation;
