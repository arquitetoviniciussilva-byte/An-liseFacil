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

  const fetchProfile = async (userId: string, retries = 3) => {
    try {
      for (let i = 0; i < retries; i++) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (data) {
          setProfile(data as UserProfile);
          setProfileLoaded(true);
          return;
        }

        if (i < retries - 1) {
          // Aguarda 1 segundo antes de tentar novamente (esperando o trigger do banco)
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    } finally {
      setProfile(null);
      setProfileLoaded(true);
    }
  };

  const signOut = async () => {
    try {
      // Limpamos os estados locais primeiro para uma resposta visual imediata
      setProfile(null);
      setIsAuthenticated(false);
      setProfileLoaded(true);
      setLoading(false);
      
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error);
    }
  };

  const refreshProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (session?.user) {
          setIsAuthenticated(true);
          await fetchProfile(session.user.id);
        } else {
          setIsAuthenticated(false);
          setProfile(null);
          setProfileLoaded(true);
        }
      } catch (error) {
        console.error("Erro na inicialização auth:", error);
        setProfileLoaded(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setProfile(null);
        setProfileLoaded(true);
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
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};