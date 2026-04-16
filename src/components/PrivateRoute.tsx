import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, profile, profileLoaded } = useAuth();
  const location = useLocation();

  // Enquanto estiver carregando a sessão ou o perfil, mostra o spinner global
  if (loading || (isAuthenticated && !profileLoaded)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium">Autenticando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Validação rigorosa de status
  if (profile?.status === "pendente") {
    return <Navigate to="/aguardando-aprovacao" replace />;
  }

  if (profile?.status === "recusado" || profile?.status === "inativo") {
    // Para perfis sem acesso, forçamos o logout para limpar a sessão
    return <Navigate to="/login" replace />;
  }

  // Só aqui os filhos (DashboardLayout, etc) são montados
  return <>{children}</>;
};