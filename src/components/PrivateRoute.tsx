import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // sessão existe, mas perfil ainda não carregou
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">Carregando perfil...</div>
      </div>
    );
  }

  if (profile.status === "pendente") {
    return <Navigate to="/aguardando-aprovacao" replace />;
  }

  if (profile.status === "recusado" || profile.status === "inativo") {
    return <Navigate to="/login" replace />;
  }

  if (profile.status !== "ativo") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};