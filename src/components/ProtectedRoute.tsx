import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';

export default function ProtectedRoute() {
  const session = useSession();

  if (session === undefined) return null;          // ⏳ still resolving
  if (session)             return <Outlet />;      // ✅ signed-in user
  return <Navigate to="/signin" replace />;        // 🚫 unauthenticated
}

