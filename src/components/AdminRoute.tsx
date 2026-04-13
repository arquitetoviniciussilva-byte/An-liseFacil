import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/permissions";

/**
 * Envolve rotas que só podem ser acessadas por administradores.
 * Usuários não admin são redirecionados para o dashboard.
 */
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (profile?.status === "pendente") {
    return <Navigate to="/aguardando-aprovacao" replace />;
  }

  if (!isAdmin(profile)) {
    // Usuário autenticado, mas não admin → volta ao dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};