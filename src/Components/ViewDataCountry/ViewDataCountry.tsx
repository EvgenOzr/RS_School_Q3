import { useMemo } from 'react';
import type { SelectedCountry } from '../../types/types';
import styles from './ViewDataCountry.module.css';

interface ViewDataCountryProps {
  country: SelectedCountry;
}

const ViewDataCountry = ({ country }: ViewDataCountryProps) => {
  const { name, data } = country;
  const sortedData = useMemo(() => {
    return [...data.data].sort((a, b) => b.year - a.year);
  }, [data.data]);

  return (
    <div className={styles.country_details}>
      <h2>
        {name} {data.iso_code && `(${data.iso_code})`}
      </h2>
      <p>Данные за {data.data.length} лет</p>

      <div className={styles.data_table}>
        <h3>Данные по CO2 выбросам</h3>
        <div className={styles.table_container}>
          <table>
            <thead>
              <tr>
                <th>Год</th>
                <th>Население</th>
                <th>CO2 (млн тонн)</th>
                <th>CO2 на душу населения</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.slice(0, 20).map((item) => (
                <tr key={item.year}>
                  <td>{item.year}</td>
                  <td>
                    {item.population !== undefined
                      ? Math.round(item.population).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td>
                    {item.co2 !== undefined ? item.co2.toFixed(2) : 'N/A'}
                  </td>
                  <td>
                    {item.co2_per_capita !== undefined
                      ? item.co2_per_capita.toFixed(2)
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedData.length > 20 && (
          <p className={styles.show_more}>
            Показаны последние 20 лет из {sortedData.length}
          </p>
        )}
        <div>
          <button>123</button>
        </div>
      </div>
    </div>
  );
};

export default ViewDataCountry;
