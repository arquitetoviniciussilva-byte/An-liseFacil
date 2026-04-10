import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
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
              <Input id="email" type="email" placeholder="nome@sistema.gov.br" required className="h-11" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button type="button" className="text-xs font-medium text-indigo-600 hover:underline">Esqueceu a senha?</button>
              </div>
              <Input id="password" type="password" placeholder="••••••••" required className="h-11" />
            </div>
            <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-base font-semibold">
              Entrar no Sistema
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
        
        <p className="text-center text-xs text-slate-400 mt-8">
          © 2024 PRO-ANÁLISE • Sistema de Gestão de Projetos
        </p>
      </div>
    </div>
  );
};

export default Login;