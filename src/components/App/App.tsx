'use client';

import Search from '../Search/Search';
import Spinner from '../Spinner/Spinner';
import CardList from '../CardList/CardList';
import { Theme, type appState, type character } from '../../types/types';
import Row from '../Row/Row';
import Card from '../Card/Card';
import MessageField from '../MessageField/MessageField';
import { useContext, useEffect, useState } from 'react';
import { appStateInitial } from '../../types/constants';
import styles from './App.module.scss';
import themeStyles from '../../Context/themeColor.module.scss';
import { ThemeContext } from '../../Context/themeContext';
import { rimApi, useGetSearchQuery } from '../../store/rimService';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const App = () => {
  const [appState, setAppState] = useState<appState>(appStateInitial);
  const [isClosedCard, setIsClosedCard] = useState(false);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const pageQuery = searchParams.get('page') || '1';
  const { data, isFetching, isError } = useGetSearchQuery(
    `?page=${pageQuery}&name=${searchQuery}`
  );

  useEffect(() => {
    const saveSearch = localStorage.getItem('search');
    if (saveSearch) {
      router.push(`/?search=${saveSearch}&page=1`);
    }
  }, [router]);

  useEffect(() => {
    if (isError) {
      setAppState((prev) => ({
        ...prev,
        data: [],
        count: 0,
      }));
    }
    if (data) {
      setAppState((prev) => ({
        ...prev,
        data: data.results || [],
        count: data.info?.count || 0,
        previous: data.info?.prev || null,
        next: data.info?.next || null,
        itemSelected: null,
      }));
    }
  }, [isFetching, data, isError, searchQuery]);

  const onUpdateSearch = (search: string) => {
    router.push(`/?search=${search}&page=1`);
    dispatch(rimApi.util.invalidateTags(['SearchResults']));
  };

  const handleForceRefresh = () => {
    dispatch(rimApi.util.resetApiState());
  };
  const handelClosedCard = () => {
    setIsClosedCard(true);
  };

  const onItemSelected = (character: character) => {
    setIsClosedCard(false);
    setAppState((prev) => ({
      ...prev,
      itemSelected: character,
    }));
    router.push(
      `/?search=${searchQuery}&page=${pageQuery}&details=${character.id}`
    );
  };

  const newTheme =
    theme === Theme.LIGHT ? `${themeStyles.light}` : `${themeStyles.dark}`;
  return (
    <>
      <h1 className="header">RS School. Task 6. SSR</h1>
      <Search onUpdateSearch={onUpdateSearch} />
      {isFetching && <Spinner />}
      {isError && <MessageField title={'Sorry'} text={'Nothing found!'} />}
      <button
        onClick={handleForceRefresh}
        className={`${styles.triggerButton} ${newTheme}`}
      >
        Update data
      </button>
      {!isFetching && !isError && appState.data.length > 0 && (
        <Row
          left={
            <CardList data={appState.data} onItemSelected={onItemSelected} />
          }
          right={
            appState.itemSelected && (
              <Card
                card={appState.itemSelected}
                isClosed={isClosedCard}
                onClose={handelClosedCard}
              />
            )
          }
        />
      )}

      {appState.count > 0 && (
        <div className={styles.pagination} data-testid="pagination">
          <button
            onClick={() =>
              router.push(
                `/?search=${searchQuery}&page=${parseInt(pageQuery) - 1}`
              )
            }
            className={`${styles.pagination_button} ${parseInt(pageQuery) <= 1 ? `${styles.pagination_button_disabled}` : ''} ${newTheme}`}
            disabled={parseInt(pageQuery) <= 1}
            data-testid="prev-button"
          >
            Previous
          </button>
          <span className={styles.pagination_page}>Page {pageQuery}</span>
          <button
            onClick={() =>
              router.push(
                `/?search=${searchQuery}&page=${parseInt(pageQuery) + 1}`
              )
            }
            className={`${styles.pagination_button} ${!appState.next ? `${styles.pagination_button_disabled}` : ''} ${newTheme}`}
            disabled={!appState.next}
            data-testid="next-button"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default App;
