"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  MessageSquare,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUser } from "@/hooks/use-user";

const navItems = [
  { label: "Recherche", icon: Search, href: "/search" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Candidatures", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Parametres", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useUser();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-950 border-r border-zinc-800 hidden lg:flex flex-col z-30">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <Link href="/dashboard">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
            LinkBoost
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-violet-500/10 text-violet-400 border-l-2 border-violet-500"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900 border-l-2 border-transparent"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-sm font-semibold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">
              {user?.name ?? "Utilisateur"}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {user?.email ?? ""}
            </p>
          </div>
          <button
            onClick={() => logout?.()}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label="Deconnexion"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
