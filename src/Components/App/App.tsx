import { memo, Suspense } from 'react';
import ViewList from '../ViewList/ViewList';
import './App.css';
import Spinner from '../Spinner/Spinner';
import type { CO2Dataset } from '../../types/types';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

interface Resource<T> {
  read(): T;
}

function createResource<T>(promise: Promise<T>): Resource<T> {
  let status = 'pending';
  let result: T | Error;

  const suspender = promise.then(
    (value: T) => {
      status = 'success';
      result = value;
    },
    (error: Error) => {
      status = 'error';
      result = error;
    }
  );

  return {
    read(): T {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      }
      return result as T;
    },
  };
}

const fetchCO2Data = async (): Promise<CO2Dataset> => {
  const response = await fetch(
    'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json'
  );
  if (!response.ok) {
    throw new Error('Failed to fetch CO2 data');
  }
  return response.json();
};

const co2DataResource = createResource(fetchCO2Data());

interface ViewListWrapperProps {
  resource: Resource<CO2Dataset>;
}

const ViewListWrapper = memo(({ resource }: ViewListWrapperProps) => {
  const co2List = resource.read();
  return <ViewList data={co2List} />;
});

ViewListWrapper.displayName = 'ViewListWrapper';

const LoadingFallback = () => (
  <div className="loading-container">
    <div>Loading CO2 data...</div>
    <Spinner />
  </div>
);

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="error-container">
    <h2>Ошибка загрузки данных</h2>
    <p>{error.message}</p>
    <button onClick={() => window.location.reload()}>Попробовать снова</button>
  </div>
);

const App = memo(() => {
  return (
    <div className="app-container">
      <div className="sidebar">
        <ErrorBoundary
          fallback={<ErrorFallback error={new Error('Error loading data')} />}
        >
          <Suspense fallback={<LoadingFallback />}>
            <ViewListWrapper resource={co2DataResource} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
});

App.displayName = 'App';
export default App;
