import { Link, useNavigate, useLocation } from "react-router-dom";
import supabase from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { showError } from "@/utils/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logoUrl = "dyad-media://media/An%C3%A1liseF%C3%A1cil/.dyad/media/59a59dd7a0368dd81e5d625bba7fca6c.png";

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingBtn(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showError(
        error.message === "Invalid login credentials"
          ? "E‑mail ou senha incorretos"
          : error.message,
      );
      setLoadingBtn(false);
    } else {
      setLoadingBtn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src={logoUrl} 
              alt="Análise Fácil Logo" 
              className="w-24 h-24 object-contain drop-shadow-sm"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Bem‑vindo de volta</h1>
          <p className="text-slate-500 mt-2">Acesse sua conta para gerenciar as análises</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-900">E‑mail Institucional</label>
              <Input
                id="email"
                type="email"
                placeholder="nome@sistema.gov.br"
                required
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-900">Senha</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={loadingBtn}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-base font-semibold"
            >
              {loadingBtn ? "Carregando..." : "Entrar no Sistema"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Não tem uma conta?{" "}
              <Link
                to="/cadastro"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Solicitar acesso
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;