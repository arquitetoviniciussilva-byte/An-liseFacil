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

  const userName = profile?.nome ?? "Usuário";
  const userRole = profile?.role ?? "";
  const avatarUrl = profile?.avatar_url ?? "";

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Buscar processo ou protocolo..."
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-8 w-px bg-slate-200 mx-1"></div>

          <div className="flex items-center gap-3 pl-1">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900 leading-none">{userName}</p>
              <p className="text-[11px] text-slate-500 mt-1 capitalize">{userRole}</p>
            </div>
            <Avatar className="h-9 w-9 border border-slate-200">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} />
              ) : (
                <AvatarFallback>
                  <UserIcon size={18} />
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};