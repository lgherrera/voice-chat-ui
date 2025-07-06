import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LandingPage } from './components/LandingPage';
import './index.css';

/**
 * Root component:
 * ─ shows <LandingPage> first
 * ─ swaps to <App> when user taps “Start Chat”
 * ─ lets <App> return via onBack()
 */
function Root() {
  const [started, setStarted] = useState(false);

  return started ? (
    <App onBack={() => setStarted(false)} />
  ) : (
    <LandingPage onStart={() => setStarted(true)} />
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);




