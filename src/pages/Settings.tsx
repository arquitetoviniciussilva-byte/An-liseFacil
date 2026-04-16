"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bell, Shield, Monitor, Save, Loader2, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { showSuccess, showError } from "@/utils/toast";

const Settings = () => {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.nome || "",
        email: profile.email || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          nome: formData.nome,
          email: formData.email,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      await refreshProfile();
      showSuccess("Perfil atualizado com sucesso!");
    } catch (error: any) {
      showError(error.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { icon: Bell, title: "Notificações", desc: "Configure como e quando você quer ser avisado" },
    { icon: Shield, title: "Segurança", desc: "Altere sua senha e gerencie acessos" },
    { icon: Monitor, title: "Preferências", desc: "Ajustes de interface e tema do sistema" },
  ];

  const initials = formData.nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="max-w-4xl space-y-8">
      {/* Seção de Perfil Ativa */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User className="text-indigo-600" size={20} />
            <CardTitle className="text-lg font-semibold">Meu Perfil</CardTitle>
          </div>
          <CardDescription>
            Gerencie suas informações pessoais e como elas aparecem no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSaveProfile} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage src={formData.avatar_url} alt={formData.nome} />
                  <AvatarFallback className="text-xl font-bold bg-indigo-50 text-indigo-600">
                    {initials || <User size={32} />}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={20} />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Seu nome"
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail de Exibição</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="avatar">URL da Foto de Perfil</Label>
                  <Input
                    id="avatar"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="https://exemplo.com/foto.jpg"
                    className="h-11"
                  />
                  <p className="text-[11px] text-slate-500">
                    Insira o link de uma imagem hospedada (ex: GitHub, LinkedIn ou servidor de imagens).
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-50">
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 h-11 px-8 gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Outras Seções (Layout Preservado) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="border-none shadow-sm hover:ring-1 hover:ring-indigo-500/20 transition-all cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <section.icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{section.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{section.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="border-none shadow-sm bg-slate-900 text-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Sobre o Sistema</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-400 space-y-2">
          <p><strong>Versão:</strong> 1.0.0-beta (Etapa 1)</p>
          <p><strong>Ambiente:</strong> Produção / Supabase</p>
          <p>Sistema desenvolvido para otimização do fluxo de análise de projetos e conferência documental interna.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;