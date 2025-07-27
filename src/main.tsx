import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App/App.tsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import About from './components/About/About.tsx';
import Navigation from './components/Navigation/Navigation.tsx';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route
            path="*"
            element={<div className="notfound">Page not found</div>}
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
