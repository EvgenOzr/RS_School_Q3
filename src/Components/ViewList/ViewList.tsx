import { memo, useMemo, useState, useEffect } from 'react';
import type { CO2Dataset, CountryCO2, YearlyCO2 } from '../../types/types';
import styles from './ViewList.module.css';

interface ViewListProps {
  data: CO2Dataset;
}

interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  formatter?: (value: number | string | undefined) => string;
}

const ViewList = memo(({ data }: ViewListProps) => {
  const countries = Object.entries(data);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(2020);
  const [sortBy, setSortBy] = useState<'name' | 'population'>('population');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [highlightUpdates, setHighlightUpdates] = useState(false);
  const [previousYear, setPreviousYear] = useState(selectedYear);

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'country', label: 'Country', visible: true },
    { key: 'iso_code', label: 'Iso code', visible: true },
    { key: 'year', label: 'Year', visible: true },
    {
      key: 'population',
      label: 'Population',
      visible: true,
      formatter: (val) =>
        val !== undefined ? Math.round(val as number).toLocaleString() : 'N/A',
    },
    {
      key: 'co2',
      label: 'CO2 (billion tons)',
      visible: true,
      formatter: (val) =>
        val !== undefined ? (val as number).toFixed(2) : 'N/A',
    },
    {
      key: 'co2_per_capita',
      label: 'CO2 per capita',
      visible: true,
      formatter: (val) =>
        val !== undefined ? (val as number).toFixed(2) : 'N/A',
    },
    {
      key: 'methane',
      label: 'Methane',
      visible: false,
      formatter: (val) =>
        val !== undefined ? (val as number).toFixed(2) : 'N/A',
    },
    {
      key: 'oil_co2',
      label: 'Oil CO2',
      visible: false,
      formatter: (val) =>
        val !== undefined ? (val as number).toFixed(2) : 'N/A',
    },
    {
      key: 'temperature_change_from_co2',
      label: 'Temp Change from CO2',
      visible: false,
      formatter: (val) =>
        val !== undefined ? (val as number).toFixed(3) : 'N/A',
    },
    {
      key: 'coal_co2',
      label: 'Coal CO2',
      visible: false,
      formatter: (val) =>
        val !== undefined ? (val as number).toFixed(2) : 'N/A',
    },
    {
      key: 'gas_co2',
      label: 'Gas CO2',
      visible: false,
      formatter: (val) =>
        val !== undefined ? (val as number).toFixed(2) : 'N/A',
    },
  ]);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    countries.forEach(([, countryData]) => {
      countryData.data.forEach((yearData) => {
        years.add(yearData.year);
      });
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [countries]);

  useEffect(() => {
    if (selectedYear !== previousYear) {
      setHighlightUpdates(true);
      setPreviousYear(selectedYear);

      const timer = setTimeout(() => {
        setHighlightUpdates(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [selectedYear, previousYear]);

  const filteredCountries = useMemo(() => {
    return countries
      .filter(([countryName]) =>
        countryName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(([countryName, countryData]) => {
        const yearData =
          countryData.data.find((d) => d.year === selectedYear) ||
          countryData.data[countryData.data.length - 1];
        return {
          countryName,
          countryData,
          yearData,
        };
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc'
            ? a.countryName.localeCompare(b.countryName)
            : b.countryName.localeCompare(a.countryName);
        } else {
          const aPop = a.yearData.population || 0;
          const bPop = b.yearData.population || 0;
          return sortOrder === 'desc' ? bPop - aPop : aPop - bPop;
        }
      });
  }, [countries, searchTerm, selectedYear, sortBy, sortOrder]);

  const toggleColumn = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const visibleColumns = columns.filter((col) => col.visible);

  const getCellValue = (
    col: ColumnConfig,
    countryName: string,
    countryData: CountryCO2,
    yearData: YearlyCO2
  ): string | number | undefined => {
    switch (col.key) {
      case 'country':
        return countryName;
      case 'iso_code':
        return countryData.iso_code || 'N/A';
      case 'year':
        return yearData.year;
      default:
        return yearData[col.key as keyof YearlyCO2];
    }
  };

  return (
    <div className={styles.view_list}>
      <h2>CO2 country data</h2>

      <div className={styles.controls}>
        <div className={styles.control_group}>
          <label htmlFor="year-select">Select Year: </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className={styles.select}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.control_group}>
          <label htmlFor="sort-select">Sort by: </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'population')}
            className={styles.select}
          >
            <option value="population">Population</option>
            <option value="name">Country Name</option>
          </select>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
            }
            className={styles.sort_button}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        <button
          onClick={() => setShowColumnModal(true)}
          className={styles.column_button}
        >
          Select Columns
        </button>
      </div>

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
              {visibleColumns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCountries.map(({ countryName, countryData, yearData }) => (
              <tr
                key={countryName}
                className={highlightUpdates ? styles.highlight : ''}
              >
                {visibleColumns.map((col) => {
                  const value = getCellValue(
                    col,
                    countryName,
                    countryData,
                    yearData
                  );

                  return (
                    <td key={col.key}>
                      {col.formatter ? col.formatter(value) : value || 'N/A'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showColumnModal && (
        <div
          className={styles.modal_overlay}
          onClick={() => setShowColumnModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.column_title}>Select Columns to Display</h3>
            <div className={styles.column_list}>
              {columns.map((col) => (
                <label key={col.key} className={styles.column_checkbox}>
                  <input
                    type="checkbox"
                    checked={col.visible}
                    onChange={() => toggleColumn(col.key)}
                  />
                  {col.label}
                </label>
              ))}
            </div>
            <button
              onClick={() => setShowColumnModal(false)}
              className={styles.modal_close}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

ViewList.displayName = 'ViewList';

export default ViewList;
