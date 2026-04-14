"use client";

import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const WaitingApproval = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleBackToLogin = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <LogOut size={40} />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Solicitação em Análise
        </h1>

        <p className="mb-8 text-slate-600">
          Olá, <span className="font-semibold">{profile?.nome}</span>. Sua
          solicitação de acesso foi recebida e está aguardando aprovação de um
          administrador.
        </p>

        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
          <div className="flex items-start gap-3">
            <LogOut className="mt-0.5 shrink-0 text-amber-500" size={18} />
            <p className="text-sm text-slate-500">
              Seu acesso ao sistema será liberado após aprovação do
              administrador. Até lá, esta conta permanecerá sem acesso às áreas
              internas.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="gap-2"
          onClick={handleBackToLogin}
        >
          Voltar para o login
        </Button>
      </div>
    </div>
  );
};

export default WaitingApproval;