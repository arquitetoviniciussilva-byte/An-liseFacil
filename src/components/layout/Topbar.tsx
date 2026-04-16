"use client";

import { Search, User as UserIcon, Settings, LogOut, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { NotificationDropdown } from "./NotificationDropdown";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export const Topbar = ({ title, subtitle }: TopbarProps) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const userName = profile?.nome?.trim() || "Usuário";
  const userEmail = profile?.email || "email@sistema.gov.br";
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

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

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
          <NotificationDropdown />

          <div className="mx-1 h-8 w-px bg-slate-200" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 pl-1 outline-none group">
                <div className="hidden text-right sm:block">
                  <p className="leading-none text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {userName}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">{userEmail}</p>
                </div>

                <Avatar className="h-9 w-9 border border-slate-200 group-hover:border-indigo-200 transition-colors">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={userName} />
                  ) : (
                    <AvatarFallback className="text-xs font-semibold text-slate-700 bg-slate-50">
                      {initials || <UserIcon size={16} />}
                    </AvatarFallback>
                  )}
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userRole}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/configuracoes")} className="cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Meu perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/configuracoes")} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};