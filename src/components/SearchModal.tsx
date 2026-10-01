"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import allPagesData from "@/data/all_pages.json";
import { Search, X, BookOpen, Atom, FlaskConical, ShieldAlert, Scale, ChevronRight } from "lucide-react";
import EvidenceBadge from "./EvidenceBadge";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    let list = allPagesData;
    if (activeCategory !== "all") {
      if (activeCategory === "modulos") list = list.filter((p) => p.path.startsWith("programa/modulos/"));
      else if (activeCategory === "conceptos") list = list.filter((p) => p.path.startsWith("conceptos/"));
      else if (activeCategory === "ingredientes") list = list.filter((p) => p.path.startsWith("ingredientes/"));
      else if (activeCategory === "mitos") list = list.filter((p) => p.path.startsWith("afirmaciones/"));
      else if (activeCategory === "regulacion") list = list.filter((p) => p.path.startsWith("regulacion/"));
      else if (activeCategory === "laboratorio") list = list.filter((p) => p.path.startsWith("laboratorio/"));
    }

    if (!query.trim()) return list.slice(0, 10);
    const q = query.toLowerCase();
    return list
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 20);
  }, [query, activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[var(--bg-card)] border-2 border-[var(--border-glow)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[var(--border-lab)] flex items-center gap-3">
          <Search className="w-5 h-5 text-[var(--accent-cyan)] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar entre 428 conceptos, moléculas, aditivos o normas..."
            autoFocus
            className="flex-1 bg-transparent text-sm sm:text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Borrar
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Category Pills */}
        <div className="px-4 py-2 border-b border-[var(--border-lab)] bg-[var(--bg-card-subtle)] flex gap-2 overflow-x-auto text-xs font-mono">
          {[
            { id: "all", label: "Todo (428)" },
            { id: "modulos", label: "Módulos (26)" },
            { id: "conceptos", label: "Conceptos (249)" },
            { id: "ingredientes", label: "Ingredientes (48)" },
            { id: "mitos", label: "Mitos (4)" },
            { id: "regulacion", label: "Regulación (39)" },
            { id: "laboratorio", label: "Laboratorio (10)" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? "bg-[var(--accent-cyan)] text-slate-950 font-bold"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-input)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-[var(--border-lab)]">
          {filtered.map((item) => {
            // Determine friendly target URL
            let href = `/${item.path}`;
            if (item.path.startsWith("programa/modulos/")) href = `/modulos/${item.path.replace("programa/modulos/", "")}`;
            else if (item.path.startsWith("conceptos/")) href = `/conceptos/${item.path.replace("conceptos/", "")}`;
            else if (item.path.startsWith("ingredientes/")) href = `/ingredientes/${item.path.replace("ingredientes/", "")}`;
            else if (item.path.startsWith("afirmaciones/")) href = `/mitos/${item.path.replace("afirmaciones/", "")}`;
            else if (item.path.startsWith("regulacion/")) href = `/regulacion/${item.path.replace("regulacion/", "")}`;
            else if (item.path.startsWith("laboratorio/")) href = `/laboratorio`;

            const evTag = item.tags.find((t) => t.startsWith("ev-"));
            const evLevel = evTag ? evTag.replace("ev-", "") : null;

            return (
              <Link
                key={item.path}
                href={href}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-card-subtle)] transition-colors group"
              >
                <div className="space-y-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--accent-cyan)] opacity-80">
                      {item.path.split("/")[0]}
                    </span>
                    {evLevel && <EvidenceBadge level={evLevel} size="sm" />}
                  </div>
                  <div className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-xs text-[var(--text-secondary)] line-clamp-1">
                      {item.description}
                    </div>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-cyan)] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-[var(--text-muted)] text-sm font-mono">
              No se encontraron resultados para &quot;{query}&quot;
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
