import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './ErrorBoundary.tsx';
import './index.css';

// Suppress known benign ResizeObserver errors from Recharts/browser
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && (args[0].includes('ResizeObserver') || args[0] === 'Script error.')) {
    return;
  }
  originalError.call(console, ...args);
};

window.addEventListener('error', (e) => {
  if (e.message?.includes('ResizeObserver') || e.message === 'Script error.') {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}, true);
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason?.message?.includes('ResizeObserver') || e.reason?.message === 'Script error.') {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}, true);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
