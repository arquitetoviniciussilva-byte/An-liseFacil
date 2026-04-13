/**
 * Helpers de permissão centralizados.
 * - admin: acesso total.
 * - analista: acesso limitado ao que a UI permite.
 */

import { UserProfile } from "@/types";

/**
 * Verifica se o usuário tem permissão de administrador.
 */
export const isAdmin = (profile: UserProfile | null): boolean => {
  return profile?.role === "admin";
};

/**
 * Verifica se o usuário pode editar a análise.
 * Só o admin ou o analista responsável podem editar.
 *
 * @param profile Perfil do usuário logado.
 * @param analystId ID do analista responsável pela análise.
 */
export const canEditAnalysis = (
  profile: UserProfile | null,
  analystId: string,
): boolean => {
  if (!profile) return false;
  if (isAdmin(profile)) return true;
  // Analista só pode editar sua própria análise
  return profile.id === analystId;
};