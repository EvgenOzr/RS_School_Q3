import Search from '../Search/Search';
import Spinner from '../Spinner/Spinner';
import CardList from '../CardList/CardList';
import { Theme, type appState, type character } from '../../types/types';
import Row from '../Row/Row';
import Card from '../Card/Card';
import MessageField from '../MessageField/MessageField';
import { useContext, useEffect, useState } from 'react';
import { apiBase, appStateInitial } from '../../types/constants';
import { useLocation, useNavigate } from 'react-router';
import styles from './App.module.scss';
import themeStyles from '../../Context/themeColor.module.scss';
import { ThemeContext } from '../../Context/themeContext';

const App = () => {
  const [appState, setAppState] = useState<appState>(appStateInitial);
  const [isClosedCard, setIsClosedCard] = useState(false);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const pageQuery = searchParams.get('page') || '1';

  useEffect(() => {
    const saveSearch = localStorage.getItem('search');
    if (saveSearch) {
      navigate(`/?search=${saveSearch}&page=1`);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAppState((prev) => ({ ...prev, loading: true }));

        const listResponse = await fetch(
          `${apiBase}?page=${pageQuery}&name=${searchQuery}`
        );
        const listData = await listResponse.json();
        if (listData) {
          setAppState((prev) => ({
            ...prev,
            data: listData.results || [],
            count: listData.info?.count || 0,
            previous: listData.info?.prev || null,
            next: listData.info?.next || null,
            itemSelected: null,
            noResults: !listData.results?.length,
            loading: false,
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setAppState((prev) => ({
          ...prev,
          loading: false,
          noResults: true,
        }));
      }
    };

    fetchData();
  }, [searchQuery, pageQuery]);

  const onUpdateSearch = (search: string) => {
    navigate(`/?search=${search}&page=1`);
  };

  const handelClodedCard = () => {
    setIsClosedCard(true);
  };

  const onItemSelected = (character: character) => {
    setIsClosedCard(false);
    setAppState((prev) => ({
      ...prev,
      itemSelected: character,
    }));
    navigate(
      `/?search=${searchQuery}&page=${pageQuery}&details=${character.id}`
    );
  };
  const newTheme =
    theme === Theme.LIGHT ? `${themeStyles.light}` : `${themeStyles.dark}`;
  return (
    <>
      <h1 className="header">RS School. Task 3</h1>
      <Search onUpdateSearch={onUpdateSearch} />

      {appState.noResults && (
        <MessageField title={'Sorry'} text={'Nothing found!'} />
      )}

      {!appState.loading && appState.count > 0 && (
        <Row
          left={
            <CardList data={appState.data} onItemSelected={onItemSelected} />
          }
          right={
            appState.itemSelected && (
              <Card
                card={appState.itemSelected}
                isClosed={isClosedCard}
                onClose={handelClodedCard}
              />
            )
          }
        />
      )}

      {appState.loading && <Spinner />}

      {appState.count > 0 && (
        <div className={styles.pagination} data-testid="pagination">
          <button
            onClick={() =>
              navigate(
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
              navigate(
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
