"use client";

import { Bell, Search, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export const Topbar = ({ title, subtitle }: TopbarProps) => {
  const { profile } = useAuth();

  const userName = profile?.nome?.trim() || "Usuário";
  const avatarUrl = profile?.avatar_url || "";

  const userRole =
    profile?.role === "admin"
      ? "Administrador"
      : profile?.role === "analista"
        ? "Analista"
        : "";

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Buscar processo ou protocolo..."
            className="w-72 rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-50"
          >
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
          </button>

          <div className="mx-1 h-8 w-px bg-slate-200" />

          <div className="flex items-center gap-3 pl-1">
            <div className="hidden text-right sm:block">
              <p className="leading-none text-sm font-medium text-slate-900">
                {userName}
              </p>
              {userRole && (
                <p className="mt-1 text-[11px] text-slate-500">{userRole}</p>
              )}
            </div>

            <Avatar className="h-9 w-9 border border-slate-200">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={userName} />
              ) : (
                <AvatarFallback className="text-xs font-semibold text-slate-700">
                  {initials || <UserIcon size={16} />}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};