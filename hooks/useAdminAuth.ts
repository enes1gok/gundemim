import { useEffect } from 'react';
import { useAdminStore } from '../stores/adminStore';

export function useAdminAuth() {
  const { isAdmin, adminEmail, loading, error, signIn, signOut, checkSession } = useAdminStore();

  useEffect(() => {
    checkSession();
  }, []);

  return { isAdmin, adminEmail, loading, error, signIn, signOut };
}
