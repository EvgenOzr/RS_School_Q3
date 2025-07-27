import type { cardListProps } from '../types/types';
import styles from './CardList.module.scss';

const CardList = ({ data, onItemSelected }: cardListProps) => {
  return (
    <div className={styles.card_list}>
      {data &&
        data.map((item) => (
          <div
            key={item.id}
            className={styles.list_item}
            onClick={() => onItemSelected(item)}
          >
            {item.name}
          </div>
        ))}
    </div>
  );
};

export default CardList;
