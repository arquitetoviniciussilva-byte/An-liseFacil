import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { UserProfile } from "@/types";

interface AuthContextProps {
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  profileLoaded: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchProfile = async (user: { id: string }) => {
    try {
      setProfileLoaded(false);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        setProfile(null);
        return;
      }

      setProfile(data as UserProfile);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      setProfile(null);
    } finally {
      setProfileLoaded(true);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setProfile(null);
      setIsAuthenticated(false);
      setProfileLoaded(true);
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      setProfile(null);
      setIsAuthenticated(false);
      setProfileLoaded(true);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);
    await fetchProfile(user);
  };

  useEffect(() => {
    let isMounted = true;
    
    const processSession = async () => {
      try {
        setLoading(true);
        setProfileLoaded(false);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (isMounted) {
            setIsAuthenticated(false);
            setProfile(null);
            setProfileLoaded(true);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setIsAuthenticated(true);
          await fetchProfile(session.user);
        }
      } catch (error) {
        console.error("Erro ao processar sessão:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          setProfile(null);
          setProfileLoaded(true);
          setLoading(false);
        }
      }
    };

    processSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      
      if (!session?.user) {
        setProfile(null);
        setIsAuthenticated(false);
        setProfileLoaded(true);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      try {
        await fetchProfile(session.user);
      } finally {
        // Always set loading to false, even if fetchProfile fails
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        profile,
        loading,
        isAuthenticated,
        profileLoaded,
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

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
};