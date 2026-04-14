"use client"; import { useAuth } from "@/contexts/AuthContext"; import { LogOut } from "lucide-react"; import { Button } from "@/components/ui/button"; import { navigate } from "react-router-dom";

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
          Olá, <span className="font-semibold">{profile?.nome}</span>. Sua solicitação de acesso foi recebida e está aguardando aprovação de um administrador.
        </p>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 text-left">
          <div className="flex gap-3 items-start">
            <LogOut className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-slate-500">
              Seu acesso ao sistema será liberado após aprovação do administrador. Até lá, esta conta permanecerá sem acesso às áreas internas.
            </p>
          </div>
        </div>
        <Button variant="outline" className="gap-2" onClick={async () => {
          await signOut();
          navigate('/login');
        }}>
          Voltar para o login
        </Button>
      </div>
    </div>
  );
};

export default WaitingApproval;