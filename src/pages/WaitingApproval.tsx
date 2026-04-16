"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMounted } from "@/hooks/use-is-mounted";

const WaitingApproval = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isMounted = useIsMounted();
  const logoUrl = "dyad-media://media/An%C3%A1liseF%C3%A1cil/.dyad/media/59a59dd7a0368dd81e5d625bba7fca6c.png";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center mb-8">
          <img 
            src={logoUrl} 
            alt="Análise Fácil Logo" 
            className="w-24 h-24 object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Solicitação em Análise</h1>
        <p className="text-slate-600 mb-8">
          Olá, <span className="font-semibold">{profile?.nome}</span>. Sua solicitação de acesso foi recebida e está aguardando aprovação de um administrador.
        </p>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 text-left">
          <div className="flex gap-3 items-start">
            <Clock className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-slate-500">
              Seu acesso ao sistema será liberado após aprovação do administrador. Até lá, esta conta permanecerá sem acesso às áreas internas.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={async () => {
            await signOut();
            if (isMounted) navigate("/login");
          }}
        >
          <LogOut size={16} />
          Voltar para o login
        </Button>
      </div>
    </div>
  );
};

export default WaitingApproval;