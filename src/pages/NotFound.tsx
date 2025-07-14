import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <h1>404 – Not foundx</h1>
      <Link to="/">← Back to home</Link>
    </div>
  );
}
