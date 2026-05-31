import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AdminState {
  isAdmin: boolean;
  adminEmail: string | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAdmin: false,
  adminEmail: null,
  loading: false,
  error: null,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      set({ loading: false, error: 'Giriş başarısız. Bilgileri kontrol edin.' });
      return false;
    }
    set({ loading: false, isAdmin: true, adminEmail: email });
    return true;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ isAdmin: false, adminEmail: null });
  },

  checkSession: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      set({ isAdmin: true, adminEmail: data.session.user.email ?? null });
    }
  },
}));
