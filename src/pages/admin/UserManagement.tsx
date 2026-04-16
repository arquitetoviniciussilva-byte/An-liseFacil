"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";
import { UserProfile } from "@/types";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Users, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMounted } from "@/hooks/use-is-mounted";

const UserManagement = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const isMounted = useIsMounted();

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (isMounted) {
      if (error) {
        showError("Erro ao carregar usuários");
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateStatus = async (userId: string, newStatus: string) => {
    setActionId(userId);
    try {
      // Realizamos o update e usamos .select() para confirmar que a linha foi afetada
      const { data, error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("Não foi possível atualizar o status. Verifique suas permissões.");
      }

      if (isMounted) {
        showSuccess(`Usuário ${newStatus === 'ativo' ? 'aprovado' : 'recusado'} com sucesso!`);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, status: newStatus as any } : user,
          ),
        );
      }
    } catch (e: any) {
      showError(e.message || "Erro ao atualizar status do usuário");
    } finally {
      if (isMounted) setActionId(null);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Acessos</h1>
          <p className="text-sm text-slate-500">Aprove ou recuse solicitações de novos analistas</p>
        </div>
        <Button variant="outline" onClick={fetchUsers} className="gap-2">
          Atualizar Lista
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users size={18} className="text-indigo-600" /> 
            Usuários Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 bg-white">
                  <th className="px-6 py-4 font-medium">Usuário</th>
                  <th className="px-6 py-4 font-medium">E‑mail</th>
                  <th className="px-6 py-4 font-medium">Perfil</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Data Criação</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{user.nome}</div>
                      {user.id === profile?.id && (
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase">Você</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {user.role === 'admin' && <ShieldCheck size={14} className="text-indigo-600" />}
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={user.status === 'ativo' ? 'default' : user.status === 'pendente' ? 'outline' : 'destructive'}
                        className={user.status === 'ativo' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                      >
                        {user.status === 'ativo' ? 'Ativo' : user.status === 'pendente' ? 'Pendente' : 'Recusado'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === 'pendente' && (
                          <>
                            <Button
                              size="sm"
                              disabled={!!actionId}
                              className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white gap-1"
                              onClick={() => updateStatus(user.id, 'ativo')}
                            >
                              {actionId === user.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!!actionId}
                              className="h-8 text-red-600 border-red-200 hover:bg-red-50 gap-1"
                              onClick={() => updateStatus(user.id, 'recusado')}
                            >
                              <X size={14} /> Recusar
                            </Button>
                          </>
                        )}
                        {user.status !== 'pendente' && user.id !== profile?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-slate-600 text-xs"
                            onClick={() => updateStatus(user.id, 'pendente')}
                          >
                            Resetar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;