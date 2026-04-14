import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";
import { UserProfile } from "@/types";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const UserManagement = () => {
  const { profile, signOut } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) {
        showError("Erro ao carregar usuários");
      } else {
        setUsers(data || []);
      }
    };
    fetchUsers();
  }, []);

  const updateStatus = async (userId: string, newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', userId);
      if (error) {
        showError("Erro ao atualizar status do usuário");
      } else {
        showSuccess(`Status do usuário atualizado para ${newStatus}`);
        setUsers((prev) => prev.map(user => user.id === userId ? { ...user, status: newStatus as any } : user));
      }
    } catch (error) {
      showError("Erro ao atualizar status do usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    await updateStatus(userId, 'ativo');
    const { data, error } = await supabase.auth.getUser();
    if (!error && data) {
      await supabase.auth.setSession(data.session);
    }
  };

  const handleReject = async (userId: string) => {
    await updateStatus(userId, 'recusado');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Gestão de Acessos</h1>
        <Button onClick={() => signOut()} variant="outline">
          Sair
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100 bg-slate-50/50">
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
              <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{user.nome}</td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4 text-slate-600">{user.role}</td>
                <td className="px-6 py-4">
                  <Badge variant={user.status === 'ativo' ? 'default' : user.status === 'pendente' ? 'outline' : 'destructive'} className={user.status === 'ativo' ? 'bg-emerald-500' : ''}>
                    {user.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {user.status === 'pendente' && (
                      <div className="flex items-center gap-1">
                        <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => handleApprove(user.id)}>
                          <Check size={14} /> Aprovar
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-red-600 border-red-200 hover:bg-red-50 gap-1" onClick={() => handleReject(user.id)}>
                          <X size={14} /> Recusar
                        </Button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;