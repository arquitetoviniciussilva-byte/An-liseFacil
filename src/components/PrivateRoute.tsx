import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, profile, profileLoaded } = useAuth();
  const location = useLocation();

  // Enquanto estiver carregando a sessão inicial, mostra o spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium">Autenticando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, vai para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se autenticado mas o perfil ainda não carregou (ex: delay no trigger), aguarda um pouco mais
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

  // Se o perfil carregou mas é nulo (erro grave ou usuário deletado do banco de perfis)
  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // Validação de status
  if (profile.status === "pendente") {
    return <Navigate to="/aguardando-aprovacao" replace />;
  }

  if (profile.status === "recusado" || profile.status === "inativo") {
    return <Navigate to="/login" replace />;
  }

  // Acesso liberado (status ativo)
  return <>{children}</>;
};