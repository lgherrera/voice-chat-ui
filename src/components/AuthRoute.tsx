import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';

export default function AuthRoute() {
  const session = useSession();

  if (session === undefined) return null;          // ⏳ still resolving
  if (session)             return <Navigate to="/" replace />; // already signed in
  return <Outlet />;                               // 🚪 guest → show /signin
}

