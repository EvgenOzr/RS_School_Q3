import { memo, useMemo, useState } from 'react';
import type { CO2Dataset } from '../../types/types';
import styles from './ViewList.module.css';

interface ViewListProps {
  data: CO2Dataset;
}

const ViewList = memo(({ data }: ViewListProps) => {
  const countries = Object.entries(data);
  console.log('ViewList rendered');

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = useMemo(() => {
    return countries.filter(([countryName]) =>
      countryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  return (
    <div className={styles.view_list}>
      <h2>CO2 country data</h2>
      <input
        type="text"
        placeholder="Search country..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.search_input}
      />
      <div className={styles.countries_container}>
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Iso code</th>
              <th>Year</th>
              <th>Population</th>
              <th>CO2 (billion tons)</th>
              <th>CO2 per captiva</th>
            </tr>
          </thead>
          <tbody>
            {filteredCountries.map(([countryName, countryData]) => {
              const yearData = countryData.data[countryData.data.length - 1];
              return (
                <tr key={countryName}>
                  <td>{countryName}</td>
                  <td>{countryData.iso_code || `N/A`}</td>
                  <td>{yearData.year}</td>
                  <td>
                    {yearData.population !== undefined
                      ? Math.round(yearData.population).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td>
                    {yearData.co2 !== undefined
                      ? yearData.co2.toFixed(2)
                      : 'N/A'}
                  </td>
                  <td>
                    {yearData.co2_per_capita !== undefined
                      ? yearData.co2_per_capita.toFixed(2)
                      : 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

ViewList.displayName = 'ViewList';

export default ViewList;
