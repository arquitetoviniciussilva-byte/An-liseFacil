import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from "@/lib/supabase";
import { UserProfile } from "@/types";

interface AuthContextProps {
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthContextProps>({
    profile: null,
    loading: true,
    isAuthenticated: false,
    signOut: async () => await supabase.auth.signOut(),
    refreshProfile: async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        await fetchProfile(data.user);
      }
    }
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
          setState(prev => ({ ...prev, profile: data as UserProfile }));
        }
      }
    };

    processSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => processSession(),
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (user: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!error) {
        setState(prev => ({ ...prev, profile: data as UserProfile }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={state}>
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