import { Link, useNavigate, useLocation } from "react-router-dom";
import supabase from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { showError, showSuccess } from "@/utils/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const logoUrl = "dyad-media://media/An%C3%A1liseF%C3%A1cil/.dyad/media/59a59dd7a0368dd81e5d625bba7fca6c.png";

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      showError("As senhas não coincidem");
      return;
    }

    setLoadingBtn(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
        },
      },
    });

    if (error) {
      showError(error.message);
      setLoadingBtn(false);
      return;
    }

    if (data.user) {
      showSuccess("Solicitação enviada! Verifique seu e‑mail para confirmar o cadastro.");
      navigate("/login");
    }

    setLoadingBtn(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft size={16} /> Voltar para o login
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src={logoUrl} 
              alt="Análise Fácil Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Solicitar Acesso</h1>
          <p className="text-slate-500 mt-2">Preencha os dados para análise da sua conta</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-900">Nome Completo</label>
              <Input
                id="name"
                required
                className="h-11"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-900">E‑mail Institucional</label>
              <Input
                id="email"
                type="email"
                required
                className="h-11"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-900">Senha</label>
              <Input
                id="password"
                type="password"
                required
                className="h-11"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm" className="text-sm font-medium text-slate-900">Confirmar Senha</label>
              <Input
                id="confirm"
                type="password"
                required
                className="h-11"
                value={formData.confirm}
                onChange={(e) => setFormData({...formData, confirm: e.target.value})}
              />
            </div>
            <Button
              type="submit"
              disabled={loadingBtn}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-base font-semibold mt-2"
            >
              {loadingBtn ? "Carregando..." : "Enviar Solicitação"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;