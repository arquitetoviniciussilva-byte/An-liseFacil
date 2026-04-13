import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { showError } from "@/utils/toast";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erro detalhado do Supabase:", error);
      showError(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos" : error.message);
      setLoading(false);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white mb-4 shadow-lg shadow-indigo-200">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h1>
          <p className="text-slate-500 mt-2">Acesse sua conta para gerenciar as análises</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail Institucional</Label>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button type="button" className="text-xs font-medium text-indigo-600 hover:underline">Esqueceu a senha?</button>
              </div>
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
            <Button type="submit" disabled={loading} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-base font-semibold">
              {loading ? <Loader2 className="animate-spin" /> : "Entrar no Sistema"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Não tem uma conta?{" "}
              <Link to="/cadastro" className="font-semibold text-indigo-600 hover:underline">
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