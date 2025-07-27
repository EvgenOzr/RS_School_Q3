import { Link } from 'react-router';
import styles from './Navigation.module.scss';

const Navigation = () => {
  return (
    <div className={styles.navigation}>
      <Link to="/" className={styles.item}>
        Main page
      </Link>
      <Link to="/about" className={styles.item}>
        About
      </Link>
    </div>
  );
};

export default Navigation;
