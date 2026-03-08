"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, MessageSquare, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const tabs = [
  { icon: Search, href: "/search", label: "Recherche" },
  { icon: MessageSquare, href: "/messages", label: "Messages" },
  { icon: LayoutDashboard, href: "/dashboard", label: "Board" },
  { icon: Settings, href: "/settings", label: "Reglages" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-zinc-950 border-t border-zinc-800 flex justify-around items-center lg:hidden z-40">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 transition-colors",
              isActive ? "text-violet-400" : "text-zinc-500"
            )}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
