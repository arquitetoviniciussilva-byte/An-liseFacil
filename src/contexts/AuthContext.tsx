import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile, AuthState } from '@/types';
import { User } from '@supabase/supabase-js';

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    profile: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const processSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setState(prev => ({
        ...prev,
        loading: false,
        isAuthenticated: !!session?.user,
      }));

      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error) {
          setState(prev => ({
            ...prev,
            profile: data as UserProfile,
          }));
        } else {
          console.error('Error fetching profile:', error);
        }
      }
    };

    processSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      processSession();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setState(prev => ({
        ...prev,
        profile: data as UserProfile,
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await fetchProfile(user);
  };

  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};