import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LandingPage } from './components/LandingPage';
import './index.css';

/**
 * Root component that shows the LandingPage first,
 * then swaps to <App /> after the user clicks “Start Chat”.
 */
function Root() {
  const [started, setStarted] = useState(false);
  return started ? <App /> : <LandingPage onStart={() => setStarted(true)} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);


