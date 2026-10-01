"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import SearchModal from "./SearchModal";
import {
  FlaskConical, Sun, Moon, Search, Menu, X, BookOpen,
  Atom, ShieldAlert, Scale, Calculator, Dna, BookA, Library, Database
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/modulos", label: "Módulos", icon: BookOpen },
    { href: "/conceptos", label: "Conceptos", icon: Atom },
    { href: "/ingredientes", label: "Aditivos", icon: Dna },
    { href: "/laboratorio", label: "Laboratorio", icon: Calculator },
    { href: "/mitos", label: "Mitos", icon: ShieldAlert },
    { href: "/regulacion", label: "Regulación", icon: Scale },
    { href: "/glosario", label: "Glosario", icon: BookA },
    { href: "/fuentes", label: "Fuentes", icon: Library },
    { href: "/progreso", label: "Progreso", icon: Database, highlight: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--bg-primary)]/85 backdrop-blur-md border-b border-[var(--border-lab)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[var(--accent-cyan)] group-hover:scale-105 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono text-sm sm:text-base font-extrabold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                Ciencia de Alimentos
              </div>
              <div className="text-[10px] font-mono text-[var(--text-muted)] tracking-wider uppercase -mt-0.5 hidden sm:block">
                Química & Evidencia
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 font-mono text-xs font-bold">
            {navLinks.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                    active
                      ? "bg-cyan-500/10 text-[var(--accent-cyan)] border border-cyan-500/30"
                      : item.highlight
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search + Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-2">
            
            {/* Quick Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-card)] border border-[var(--border-lab)] text-xs text-[var(--text-secondary)] font-mono transition-colors"
              title="Buscar (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
              <span className="hidden md:inline">Buscar...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] rounded bg-[var(--bg-input)] border border-[var(--border-lab)] text-[var(--text-muted)]">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-card)] border border-[var(--border-lab)] text-[var(--text-primary)] transition-colors"
              title={`Cambiar a modo ${theme === "dark" ? "Editorial Claro" : "Dark Lab"}`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-600" />
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)] text-[var(--text-primary)]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden p-4 bg-[var(--bg-card)] border-b border-[var(--border-lab)] grid grid-cols-2 gap-1 font-mono text-xs">
            {navLinks.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl font-bold transition-colors ${
                    active
                      ? "bg-cyan-500/10 text-[var(--accent-cyan)] border border-cyan-500/30"
                      : item.highlight
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
