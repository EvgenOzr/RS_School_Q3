import React from 'react';
import type { searchProps } from '../types/types';
import styles from './Search.module.scss';
import useRestoreSearch from '../../hooks/useRestoreSearch';

const Search = ({ onUpdateSearch }: searchProps) => {
  const [search, setSearch] = useRestoreSearch('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleUpdateSearch = () => {
    onUpdateSearch(search);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdateSearch();
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Type something..."
        onKeyDown={handleKeyDown}
        className={styles.field}
        value={search}
        onChange={handleSearchChange}
      ></input>
      <button className={styles.button} onClick={handleUpdateSearch}>
        Search
      </button>
    </div>
  );
};

export default Search;
