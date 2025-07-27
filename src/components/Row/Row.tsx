import type { rowProps } from '../types/types';
import styles from './Row.module.css';

const Row = ({ left, right }: rowProps) => {
  return (
    <div className={styles.row}>
      <div className="row-left">{left}</div>
      <div className="row-right">{right}</div>
    </div>
  );
};

export default Row;
