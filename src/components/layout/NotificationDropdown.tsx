"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Check, CheckCheck, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Notification } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { showError } from "@/utils/toast";

export const NotificationDropdown = () => {
  const { profile, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !profile?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
    }
  }, [profile?.id, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !profile?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    fetchNotifications();

    // Real-time subscription
    const channel = supabase
      .channel(`notifications-${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${profile.id}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, isAuthenticated, fetchNotifications]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      showError("Erro ao marcar como lida");
    } else {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    if (!profile?.id) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", profile.id)
      .eq("is_read", false);

    if (error) {
      showError("Erro ao marcar todas como lidas");
    } else {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-50 outline-none"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4">
          <DropdownMenuLabel className="p-0 font-semibold">Notificações</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-indigo-600 hover:bg-transparent hover:text-indigo-700"
              onClick={markAllAsRead}
            >
              <CheckCheck size={14} className="mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        
        <ScrollArea className="h-[350px]">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-sm text-slate-500">
              Carregando...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell size={32} className="mb-2 text-slate-200" />
              <p className="text-sm text-slate-500">Nenhuma notificação por aqui.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "relative flex flex-col gap-1 border-b border-slate-50 p-4 transition-colors hover:bg-slate-50/50",
                    !notification.is_read && "bg-indigo-50/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={cn(
                      "text-sm font-medium text-slate-900",
                      !notification.is_read && "font-bold"
                    )}>
                      {notification.title}
                    </h4>
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="rounded-full p-1 text-slate-400 hover:bg-white hover:text-indigo-600 transition-colors"
                        title="Marcar como lida"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {notification.description}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock size={10} />
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <DropdownMenuSeparator className="m-0" />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full text-xs text-slate-500 hover:text-indigo-600"
            onClick={() => {}}
          >
            Ver todas as notificações
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};