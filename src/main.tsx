// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@/App';      // make sure "@" is aliased to /src in your Vite/tsconfig
import './index.css';         // keep or remove if you don’t use a global stylesheet

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);











