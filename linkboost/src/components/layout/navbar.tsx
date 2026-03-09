"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Fonctionnalites", href: "#features" },
  { label: "Tarifs", href: "#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full h-16 z-50 px-6 lg:px-10",
          "grid grid-cols-3 items-center",
          "bg-zinc-950/80 backdrop-blur-md transition-colors duration-300",
          scrolled
            ? "border-b border-zinc-800"
            : "border-b border-transparent"
        )}
      >
        {/* Logo — col 1 */}
        <Link href="/" className="flex-shrink-0 justify-self-start">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
            LinkBoost
          </span>
        </Link>

        {/* Desktop center nav — col 2 (truly centered) */}
        <div className="hidden md:flex items-center justify-center gap-1">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" asChild>
              <a href={link.href}>{link.label}</a>
            </Button>
          ))}
        </div>

        {/* Desktop actions — col 3 + Mobile hamburger */}
        <div className="flex items-center justify-end gap-3">
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Connexion</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Commencer</Link>
            </Button>
          </div>
          <button
            className="md:hidden text-zinc-400 hover:text-white transition-colors p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-16 right-0 w-72 h-[calc(100vh-4rem)] bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base text-zinc-300 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <hr className="border-zinc-800" />
            <div className="flex flex-col gap-3">
              <Button variant="ghost" asChild className="justify-start">
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Commencer</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
