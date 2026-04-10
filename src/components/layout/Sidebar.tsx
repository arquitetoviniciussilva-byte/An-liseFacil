import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  FileBadge, 
  Settings,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileText, label: "Análises", path: "/analises" },
  { icon: PlusCircle, label: "Nova Análise", path: "/analises/nova" },
  { icon: CheckCircle2, label: "Aprovados", path: "/aprovados" },
  { icon: FileBadge, label: "Alvarás", path: "/alvaras" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 leading-tight">PRO-ANÁLISE</h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Sistema Interno</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-indigo-50 text-indigo-700" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut size={18} />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
};