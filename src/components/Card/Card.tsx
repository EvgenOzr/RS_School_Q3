import type { cardProps } from '../types/types';
import styles from './Card.module.scss';

const Card = ({ card, isClosed, onClose }: cardProps) => {
  if (!card || isClosed) return null;
  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <img src={card.image} alt="image" />
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
