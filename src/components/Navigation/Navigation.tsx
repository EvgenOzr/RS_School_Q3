import { Link } from 'react-router';
import styles from './Navigation.module.scss';
import themeStyles from '../../Context/themeColor.module.scss';
import { useContext } from 'react';
import { ThemeContext } from '../../Context/themeContext';
import { Theme } from '../../types/types';

const Navigation = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const handlToggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  const newTheme =
    theme === Theme.LIGHT ? `${themeStyles.light}` : `${themeStyles.dark}`;

  return (
    <div className={`${styles.navigation} ${newTheme}`}>
      <Link to="/" className={`${styles.item} ${newTheme}`}>
        Main page
      </Link>
      <Link to="/about" className={`${styles.item} ${newTheme}`}>
        About
      </Link>
      <button
        className={`${styles.toggleTheme} ${newTheme}`}
        onClick={handlToggleTheme}
      >
        {theme === Theme.LIGHT ? 'Change to Dark' : 'Change to Light'}
      </button>
    </div>
  );
};

export default Navigation;
