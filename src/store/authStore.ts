import { create } from 'zustand';
import { supabase } from '../supabase/client';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  signup: (email: string, password: string, name: string) => Promise<{ error: any | null, user: any | null }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      // Check if user is an admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      set({
        user: {
          id: data.user.id,
          email: data.user.email || '',
          role: userData?.role || 'user',
        },
        isAdmin: userData?.role === 'admin',
        isLoading: false,
      });
    }

    return { error };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAdmin: false });
  },

  signup: async (email: string, password: string, name: string) => {
    try {
      // Create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        return { error, user: null };
      }

      if (data.user) {
        // Create a record in the users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            { 
              id: data.user.id,
              email: email,
              name: name,
              role: 'user' // Default role
            }
          ]);
          
        if (profileError) {
          return { error: profileError, user: null };
        }
        
        return { error: null, user: data.user };
      }
      
      return { error: new Error('User creation failed'), user: null };
    } catch (err) {
      return { error: err, user: null };
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
      // Check if user is an admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      set({
        user: {
          id: data.session.user.id,
          email: data.session.user.email || '',
          role: userData?.role || 'user',
        },
        isAdmin: userData?.role === 'admin',
      });
    }
    
    set({ isLoading: false });
  },
}));