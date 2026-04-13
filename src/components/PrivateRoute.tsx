import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Envolve rotas que requerem autenticação.
 * Redireciona usuários não autenticados para login,
 * usuários pendentes para página de aguardando aprovação.
 */
export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (profile?.status === "pendente") {
    return <Navigate to="/aguardando-aprovacao" replace />;
  }

  return <>{children}</>;
};