import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Bell, Shield, Monitor } from "lucide-react";

const Settings = () => {
  const sections = [
    { icon: User, title: "Perfil", desc: "Gerencie suas informações pessoais e avatar" },
    { icon: Bell, title: "Notificações", desc: "Configure como e quando você quer ser avisado" },
    { icon: Shield, title: "Segurança", desc: "Altere sua senha e gerencie acessos" },
    { icon: Monitor, title: "Preferências", desc: "Ajustes de interface e tema do sistema" },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="border-none shadow-sm hover:ring-1 hover:ring-indigo-500/20 transition-all cursor-pointer group">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <section.icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{section.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{section.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Sobre o Sistema</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <p><strong>Versão:</strong> 1.0.0-beta (Etapa 1)</p>
          <p><strong>Ambiente:</strong> Desenvolvimento / Mock</p>
          <p>Sistema desenvolvido para otimização do fluxo de análise de projetos e conferência documental interna.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;