import { Link, useNavigate, useLocation } from "react-router-dom";
import supabase from "@/lib/supabase"; // @ts-ignoreimport { useAuth } from "@/contexts/AuthContext";
import { showError } from "@/utils/toast";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });

  // Se já houver sessão válida, redireciona para a página de origem ou dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      return showError("As senhas não coincidem");
    }

    setLoadingBtn(true);

    // O Perfil é criado automaticamente via Trigger no banco de dados (handle_new_user)
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
      showSuccess('Solicitação enviada! Verifique seu e-mail para confirmar o cadastro.');
      navigate('/login');
    }

    setLoadingBtn(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft size={16} /> Voltar para o login        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white mb-4 shadow-lg shadow-indigo-200">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Solicitar Acesso</h1>
          <p className="text-slate-500 mt-2">
            Preencha os dados para análise da sua conta
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                required
                className="h-11"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail Institucional</Label>
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
              <Label htmlFor="password">Senha</Label>
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
              <Label htmlFor="confirm">Confirmar Senha</Label>
              <Input                id="confirm"
                type="password"
                required
                className="h-11"
                value={formData.confirm}
                onChange={(e) => setFormData({...formData, confirm: e.target.value})}
              />
            </div>
            <Button type="submit" disabled={loadingBtn} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-base font-semibold mt-2">
              {loadingBtn ? <Loader2 className="animate-spin" /> : "Enviar Solicitação"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;