'use client';
import type { cardProps } from '../../types/types';
import styles from './Card.module.scss';
import themeStyles from '../../Context/themeColor.module.scss';
import { useContext } from 'react';
import { ThemeContext } from '../../Context/themeContext';
import { Theme } from '../../types/types';
import Image from 'next/image';

const Card = ({ card, isClosed, onClose }: cardProps) => {
  const { theme } = useContext(ThemeContext);

  if (!card || isClosed) return null;

  const newTheme =
    theme === Theme.LIGHT ? `${themeStyles.light}` : `${themeStyles.dark}`;

  return (
    <div className={`${styles.card} ${newTheme}`} data-testid="character-card">
      <div className={styles.image}>
        <Image
          src={card.image}
          alt={`${card.name} image`}
          width={50}
          height={50}
        />
      </div>
      <div className={styles.card_info}>
        <div className={styles.field}>Name - {card.name}</div>
        <div className={styles.field} data-testid="birth-year-field">
          Status - {card.status}
        </div>
        <div className={styles.field}>Species - {card.species}</div>
        <div className={styles.field}>Gender - {card.gender}</div>
      </div>
      <button
        className={styles.close}
        onClick={onClose}
        aria-label="Close card"
        data-testid="close-card"
      ></button>
    </div>
  );
};

export default Card;
