import type { messageProps } from '../../types/types';
import styles from './MessageField.module.scss';

const MessageField = ({ title, text }: messageProps) => {
  return (
    <div className={styles.field} data-testid="message-field">
      <h3 className={styles.title} data-testid="message-title">
        {title}
      </h3>
      <div className={styles.text} data-testid="message-text">
        {text}
      </div>
    </div>
  );
};

export default MessageField;
