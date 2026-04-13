import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, UserMinus, Shield } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showError("Erro ao carregar usuários");
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateStatus = async (userId: string, status: UserProfile['status'], role: UserProfile['role'] = 'analista') => {
    // Casting to any to bypass strict type inference issues with the Supabase client
    const { error } = await (supabase as any)
      .from('profiles')
      .update({ status, role })
      .eq('id', userId);

    if (error) {
      showError("Erro ao atualizar usuário");
    } else {
      showSuccess(`Usuário ${status === 'ativo' ? 'aprovado' : 'atualizado'} com sucesso`);
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Shield className="text-indigo-600" size={20} /> Gestão de Acessos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 font-medium">Usuário</th>
                  <th className="px-6 py-4 font-medium">E-mail</th>
                  <th className="px-6 py-4 font-medium">Perfil</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{user.nome}</td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 capitalize">{user.role}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        user.status === 'ativo' ? 'default' :
                        user.status === 'pendente' ? 'outline' : 'destructive'
                      } className={user.status === 'ativo' ? 'bg-emerald-500' : ''}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === 'pendente' && (
                          <>
                            <Button
                              size="sm"
                              className="h-8 bg-emerald-600 hover:bg-emerald-700 gap-1"
                              onClick={() => updateStatus(user.id, 'ativo')}
                            >
                              <Check size={14} /> Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-red-600 border-red-200 hover:bg-red-50 gap-1"
                              onClick={() => updateStatus(user.id, 'recusado')}
                            >
                              <X size={14} /> Recusar
                            </Button>
                          </>
                        )}
                        {user.status === 'ativo' && user.role !== 'admin' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-slate-400 hover:text-red-600 gap-1"
                            onClick={() => updateStatus(user.id, 'inativo')}
                          >
                            <UserMinus size={14} /> Inativar
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