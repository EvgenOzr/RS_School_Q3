import { useState, useEffect } from 'react';

const useRestoreSearch = (
  defaultValue = ''
): [string, (value: string) => void] => {
  const [searchValue, setSearchValue] = useState(defaultValue);

  useEffect(() => {
    const savedSearch = localStorage.getItem('search');
    if (savedSearch) {
      setSearchValue(savedSearch);
    }
  }, []);

  const updateSearchValue = (value: string) => {
    const trimmedValue = value.trim();
    setSearchValue(trimmedValue);
    localStorage.setItem('search', trimmedValue);
  };

  return [searchValue, updateSearchValue];
};

export default useRestoreSearch;
