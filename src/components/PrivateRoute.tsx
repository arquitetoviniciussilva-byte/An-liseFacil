import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Envolve uma rota que só pode ser acessada por usuários autenticados.
 * Caso o usuário não esteja autenticado, redireciona para a página de login,
 * preservando a URL original para possível retorno após o login.
 */
export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Enquanto o estado de carregamento da autenticação está em andamento,
  // não renderiza nada (evita flash de conteúdo protegido).
  if (loading) return null;

  // Usuário não autenticado → redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Usuário autenticado → permite acesso ao conteúdo
  return children;
};