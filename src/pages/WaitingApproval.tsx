"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { showError, showSuccess } from "@/utils/toast";
import { UserProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, X } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        showError("Erro ao carregar usuários");
        return;
      }

      setUsers(data || []);
    };

    fetchUsers();
  }, []);

  const updateStatus = async (userId: string, newStatus: string) => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", userId);

      if (error) {
        showError("Erro ao atualizar status do usuário");
        return;
      }

      showSuccess(`Status do usuário atualizado para ${newStatus}`);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, status: newStatus as UserProfile["status"] }
            : user
        )
      );
    } catch {
      showError("Erro ao atualizar status do usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    await updateStatus(userId, "ativo");
  };

  const handleReject = async (userId: string) => {
    await updateStatus(userId, "recusado");
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Shield className="text-indigo-600" size={20} />
            Gestão de Acessos
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400">
                  <th className="px-6 py-4 font-medium">Usuário</th>
                  <th className="px-6 py-4 font-medium">E-mail</th>
                  <th className="px-6 py-4 font-medium">Perfil</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Data Criação</th>
                  <th className="px-6 py-4 text-right font-medium">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {user.nome}
                    </td>

                    <td className="px-6 py-4 text-slate-600">{user.email}</td>

                    <td className="px-6 py-4 text-slate-600">{user.role}</td>

                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          user.status === "ativo"
                            ? "default"
                            : user.status === "pendente"
                              ? "outline"
                              : "destructive"
                        }
                        className={user.status === "ativo" ? "bg-emerald-500" : ""}
                      >
                        {user.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === "pendente" && (
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              className="h-8 bg-indigo-600 text-white hover:bg-indigo-700"
                              onClick={() => handleApprove(user.id)}
                              disabled={loading}
                            >
                              <Check size={14} />
                              Aprovar
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-1 border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => handleReject(user.id)}
                              disabled={loading}
                            >
                              <X size={14} />
                              Recusar
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;