'use client';
import React, { useContext } from 'react';
import { Theme, type searchProps } from '../../types/types';
import styles from './Search.module.scss';
import themeStyles from '../../Context/themeColor.module.scss';
import useRestoreSearch from '../../hooks/useRestoreSearch';
import { ThemeContext } from '../../Context/themeContext';
import { useDispatch } from 'react-redux';
import { deleteAll } from '../../store/saveCharactersSlice';

const Search = ({ onUpdateSearch }: searchProps) => {
  const [search, setSearch] = useRestoreSearch('');
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleUpdateSearch = () => {
    onUpdateSearch(search);
    dispatch(deleteAll());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdateSearch();
    }
  };

  const newTheme =
    theme === Theme.LIGHT ? `${themeStyles.light}` : `${themeStyles.dark}`;

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Type something..."
        onKeyDown={handleKeyDown}
        className={`${styles.field} ${newTheme}`}
        value={search}
        onChange={handleSearchChange}
      ></input>
      <button
        className={`${styles.button} ${newTheme}`}
        onClick={handleUpdateSearch}
      >
        Search
      </button>
    </div>
  );
};

export default Search;
