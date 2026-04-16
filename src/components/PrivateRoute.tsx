import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, profile, profileLoaded } = useAuth();
  const location = useLocation();

  // Carregamento inicial da sessão (Supabase verificando se há token)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, volta para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado mas o perfil ainda está carregando
  if (!profileLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // Verificações de status do perfil (após carregado)
  if (profile?.status === "pendente") {
    return <Navigate to="/aguardando-aprovacao" replace />;
  }

  if (profile?.status === "recusado" || profile?.status === "inativo") {
    // Se o perfil foi recusado, desloga o usuário para ele não ficar preso
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};