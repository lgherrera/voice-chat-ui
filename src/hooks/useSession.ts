import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

/**
 * session === undefined  →  still loading
 * session === null       →  unauthenticated
 * session === Session    →  authenticated
 */
export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    // 1️⃣ Get any cached session (or null) on first render
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    // 2️⃣ Stay in sync with future login / logout / refresh events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    );
    return () => subscription.unsubscribe();
  }, []);

  return session;
}

