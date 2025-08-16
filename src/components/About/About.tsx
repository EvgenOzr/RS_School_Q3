'use client';
import styles from './About.module.scss';
import themeStyles from '../../Context/themeColor.module.scss';
import { Theme } from '../../types/types';
import { useContext } from 'react';
import { ThemeContext } from '../../Context/themeContext';

const About = () => {
  const { theme } = useContext(ThemeContext);
  const newTheme =
    theme === Theme.LIGHT ? `${themeStyles.light}` : `${themeStyles.dark}`;

  return (
    <div className={`${styles.about} ${newTheme}`}>
      <div>Autor: Evgeny A</div>
      <div>
        <a
          href="https://github.com/EvgenOzr"
          className={`${styles.git} ${newTheme}`}
        >
          GitHub
        </a>
      </div>
      <a href="https://app.rs.school/" className={styles.school}></a>
    </div>
  );
};

export default About;
