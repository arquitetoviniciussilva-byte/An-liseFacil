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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sign‑out helper – returns void
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Refresh profile helper
  const refreshProfile = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      await fetchProfile(data.user);
    }
  };

  // Fetch profile from Supabase
  const fetchProfile = async (user: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!error) {
        setProfile(data as UserProfile);
      }
    } catch (e) {
      console.error('Error fetching profile:', e);
    }
  };

  // Initialise session on mount and listen for changes
  useEffect(() => {
    const processSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setLoading(false);
      setIsAuthenticated(!!session?.user);

      if (session?.user) {
        await fetchProfile(session.user);
      }
    };

    processSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      () => processSession(),
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        profile,
        loading,
        isAuthenticated,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};