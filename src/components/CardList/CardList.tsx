import { useContext, type ChangeEvent } from 'react';
import { Theme, type cardListProps, type character } from '../../types/types';
import styles from './CardList.module.scss';
import themeStyles from '../../Context/themeColor.module.scss';
import { ThemeContext } from '../../Context/themeContext';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import {
  addCharacter,
  deleteAll,
  deleteCharacter,
} from '../../store/saveCharactersSlice';

const CardList = ({ data, onItemSelected }: cardListProps) => {
  const { theme } = useContext(ThemeContext);
  const checkedCharacters = useSelector(
    (state: RootState) => state.favorites.characters
  );
  const dispatch = useDispatch();

  const handleChecked = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target.dataset.id !== undefined) {
      const id = +target.dataset.id;
      if (target.checked) {
        dispatch(addCharacter(data[id]));
      } else {
        dispatch(deleteCharacter(data[id]));
      }
    }
  };

  const downloadCSV = () => {
    const headers = Object.keys(checkedCharacters[0]).join(',');
    const csvRows = checkedCharacters.map((item: character) =>
      Object.values(item)
        .map((value) => `"${value}"`)
        .join(',')
    );
    const csvContent = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const fileName = `${checkedCharacters.length}_items.csv`;
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const deleteAllItems = () => {
    dispatch(deleteAll());
  };

  const newTheme =
    theme === Theme.LIGHT ? `${themeStyles.light}` : `${themeStyles.dark}`;

  return (
    <>
      <div
        className={`${styles.card_list} ${newTheme}`}
        data-testid="card-list"
      >
        {data &&
          data.map((item, idx) => {
            const favChecked: boolean = !!checkedCharacters.find(
              (checkedItem: character) => checkedItem.name === item.name
            );
            return (
              <div
                key={item.id}
                className={`${styles.card_checked} ${newTheme}`}
              >
                <input
                  type="checkbox"
                  data-id={idx}
                  className={styles.card_checked}
                  onChange={handleChecked}
                  checked={favChecked}
                />
                <div
                  className={styles.list_item}
                  onClick={() => onItemSelected(item)}
                >
                  {item.name}
                </div>
              </div>
            );
          })}
      </div>
      {checkedCharacters.length > 0 && (
        <div className={styles.constainer_checked}>
          <div className={styles.checked}>
            {checkedCharacters.length} items are selected
          </div>
          <div className={styles.checked_buttons}>
            <button
              className={`${styles.button} ${newTheme}`}
              onClick={deleteAllItems}
            >
              Unselect all
            </button>
            <a>
              <button
                className={`${styles.button} ${newTheme}`}
                onClick={downloadCSV}
              >
                Download
              </button>
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default CardList;
