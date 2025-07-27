import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import { Component } from 'react';

class ErrorComponent extends Component {
  render() {
    throw new Error('Test Error');
    return null;
  }
}
const ErrorFunctionalComponent = () => {
  throw new Error('Functional Component Error');
  return null;
};

const GoodComponent = () => <div>Everything works fine</div>;

describe('ErrorBoundary Component', () => {
  const originalConsoleError = console.error;
  const originalConsoleLog = console.log;

  beforeEach(() => {
    console.error = vi.fn();
    console.log = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Everything works fine')).toBeInTheDocument();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('catches error and displays fallback UI', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });

  it('catches error from functional component', () => {
    render(
      <ErrorBoundary>
        <ErrorFunctionalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('uses custom fallback when provided', () => {
    const customFallback = <div>Custom Error Message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error Message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument();
  });

  it('calls getDerivedStateFromError and componentDidCatch', () => {
    const mockGetDerivedStateFromError = vi.spyOn(
      ErrorBoundary,
      'getDerivedStateFromError'
    );
    const mockComponentDidCatch = vi.spyOn(
      ErrorBoundary.prototype,
      'componentDidCatch'
    );

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(mockGetDerivedStateFromError).toHaveBeenCalled();
    expect(mockComponentDidCatch).toHaveBeenCalled();

    expect(mockGetDerivedStateFromError).toHaveBeenCalledWith(
      expect.any(Error)
    );
    expect(mockComponentDidCatch).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );

    mockGetDerivedStateFromError.mockRestore();
    mockComponentDidCatch.mockRestore();
  });

  it('logs errors to console', () => {
    vi.mocked(console.error).mockClear();

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalledWith(
      'Error caught:',
      expect.any(Error)
    );
    expect(console.error).toHaveBeenCalledWith(
      'Error caught by Error Boundary:',
      expect.any(Error),
      expect.any(Object)
    );
  });
});
