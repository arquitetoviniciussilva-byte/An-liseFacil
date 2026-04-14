import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const WaitingApproval = () => {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 text-amber-600 rounded-full mb-6">
          <LogOut size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Solicitação em Análise</h1>
        <p className="text-slate-600 mb-8">
          Olá, <span className="font-semibold">{profile?.nome}</span>. Sua solicitação de acesso foi recebida e está aguardando a aprovação de um administrador.
        </p>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 text-left">
          <div className="flex gap-3 items-start">
            <LogOut className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-slate-500">
              Você receberá um e-mail assim que seu acesso for liberado. Por enquanto, as funcionalidades do sistema permanecem restritas.
            </p>
          </div>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => signOut()}>
          <LogOut size={18} /> Sair do Sistema
        </Button>
      </div>
    </div>
  );
};

export default WaitingApproval;
</dyad-chat-summary>Fixed 14 TypeScript compile‑time errors: corrected AuthContext initialization with proper async functions, added missing React hooks (useState, useEffect), fixed Loader2 imports by replacing with simple loading text, completed UserManagement component with proper JSX structure, fixed SignOut import in WaitingApproval, and ensured all components have proper imports and type definitions.

**Files modified:**
- src/contexts/AuthContext.tsx
- src/pages/Login.tsx
- src/pages/Register.tsx
- src/pages/UserManagement.tsx
- src/pages/admin/UserManagement.tsx
- src/pages/WaitingApproval.tsx

**Testing steps:**
1. Run <dyad-command type="restart"></dyad-command> to rebuild the app.  
2. Verify no TypeScript errors appear in the editor.  
3. Test login, registration, and user approval flows.  
4. Navigate through all pages to ensure components render correctly.<dyad-write path="src/pages/Login.tsx" description="Add missing React hooks and fix imports">
import { Link, useNavigate, useLocation } from "react-router-dom";
import supabase from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { showError } from "@/utils/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      // A mudança de sessão será capturada pelo AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white mb-4 shadow-lg shadow-indigo-200">
            <ArrowLeft size={32} />
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