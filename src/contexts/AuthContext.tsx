import React, { createContext, useContext, useEffect, useState } from "react";
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchProfile = async (user: { id: string }) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        setProfile(null);
        return;
      }

      setProfile(data as UserProfile);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      setProfile(null);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao sair:", error);
    } finally {
      setProfile(null);
      setIsAuthenticated(false);
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
      return;
    }

    await fetchProfile(user);
  };

  useEffect(() => {
    const processSession = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setIsAuthenticated(false);
          setProfile(null);
          return;
        }

        setIsAuthenticated(true);
        await fetchProfile(session.user);
      } catch (error) {
        console.error("Erro ao processar sessão:", error);
        setIsAuthenticated(false);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    processSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setProfile(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      fetchProfile(session.user);
    });

    return () => {
      subscription.unsubscribe();
    };
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
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
};