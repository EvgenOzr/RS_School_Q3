import { memo, useEffect, useState } from 'react';
import ViewList from '../ViewList/ViewList';
import './App.css';
import Spinner from '../Spinner/Spinner';
import type { CO2Dataset } from '../../types/types';

const App = memo(() => {
  const [co2List, setCo2List] = useState<CO2Dataset>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCO2 = async () => {
      try {
        const response = await fetch(
          'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json'
        );
        const data: CO2Dataset = await response.json();
        setCo2List(data);
        console.log(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };
    fetchCO2();
  }, []);

  if (loading) {
    return (
      <div>
        <div>Loading...</div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }
  return (
    <div className="app-container">
      <div className="sidebar">
        <ViewList data={co2List} />
      </div>
    </div>
  );
});
App.displayName = 'App';
export default App;
