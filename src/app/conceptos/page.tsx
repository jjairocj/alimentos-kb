'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Atom, 
  Search, 
  Filter, 
  Layers, 
  Sparkles, 
  ChevronRight, 
  BookMarked,
  Tag,
  Dna,
  FlaskRound as Flask,
  Activity,
  Flame,
  ShieldAlert,
  BrainCircuit,
  Eye
} from 'lucide-react';
import conceptsData from '@/data/concepts.json';
import { playClickSound } from '@/lib/sound';

const AREA_META: Record<string, { label: string; color: string; bg: string }> = {
  quimica: { label: 'Química General', color: 'text-cyan-400 border-cyan-500/30', bg: 'bg-cyan-500/10' },
  bioquimica: { label: 'Bioquímica', color: 'text-indigo-400 border-indigo-500/30', bg: 'bg-indigo-500/10' },
  biologia: { label: 'Biología Celular', color: 'text-teal-400 border-teal-500/30', bg: 'bg-teal-500/10' },
  alimentos: { label: 'Ciencia de Alimentos', color: 'text-amber-400 border-amber-500/30', bg: 'bg-amber-500/10' },
  fisiologia: { label: 'Fisiología', color: 'text-sky-400 border-sky-500/30', bg: 'bg-sky-500/10' },
  nutricion: { label: 'Nutrición', color: 'text-emerald-400 border-emerald-500/30', bg: 'bg-emerald-500/10' },
  metabolismo: { label: 'Metabolismo', color: 'text-yellow-400 border-yellow-500/30', bg: 'bg-yellow-500/10' },
  microbiologia: { label: 'Microbiología', color: 'text-lime-400 border-lime-500/30', bg: 'bg-lime-500/10' },
  microbiota: { label: 'Microbiota', color: 'text-emerald-400 border-emerald-500/30', bg: 'bg-emerald-500/10' },
  procesamiento: { label: 'Procesamiento', color: 'text-orange-400 border-orange-500/30', bg: 'bg-orange-500/10' },
  sensorial: { label: 'Ciencia Sensorial', color: 'text-purple-400 border-purple-500/30', bg: 'bg-purple-500/10' },
  toxicologia: { label: 'Toxicología', color: 'text-rose-400 border-rose-500/30', bg: 'bg-rose-500/10' },
  evidencia: { label: 'Evidencia y Método', color: 'text-blue-400 border-blue-500/30', bg: 'bg-blue-500/10' },
  aditivos: { label: 'Aditivos y Funciones', color: 'text-pink-400 border-pink-500/30', bg: 'bg-pink-500/10' },
};

export default function ConceptosPage() {
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(24);

  // Group count by area
  const areaCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of conceptsData) {
      const parts = c.path.split('/');
      const area = parts[1] || 'general';
      counts[area] = (counts[area] || 0) + 1;
    }
    return counts;
  }, []);

  // Filtered concepts
  const filteredConcepts = useMemo(() => {
    return conceptsData.filter(c => {
      const parts = c.path.split('/');
      const area = parts[1] || 'general';
      const matchesArea = selectedArea === null || area === selectedArea;

      const q = search.toLowerCase().trim();
      const matchesSearch = !q || 
        c.title.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.tags && c.tags.some(t => t.toLowerCase().includes(q)));

      return matchesArea && matchesSearch;
    });
  }, [search, selectedArea]);

  const visibleConcepts = filteredConcepts.slice(0, displayCount);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          <Atom className="w-3.5 h-3.5" />
          Red Científica Interconectada · 249 Conceptos Clave
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Enciclopedia de <span className="text-[var(--accent-primary)]">Conceptos Científicos</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-3xl text-sm sm:text-base leading-relaxed">
          Cada concepto está fundamentado en principios fisicoquímicos rigurosos, con delimitación de dosis, mecanismos de acción celular y referencias cruzadas.
        </p>
      </div>

      {/* Search and Area Filter Bar */}
      <div className="lab-card p-5 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-5">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar concepto (ej: polaridad, amilasa, osmolaridad)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
            />
          </div>

          <div className="text-xs font-mono text-[var(--text-muted)] self-end sm:self-center">
            Mostrando {filteredConcepts.length} de {conceptsData.length} conceptos
          </div>
        </div>

        {/* Area Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]">
          <button
            onClick={() => { playClickSound('toggle'); setSelectedArea(null); setDisplayCount(24); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedArea === null 
                ? 'bg-[var(--accent-primary)] text-slate-950 font-semibold shadow-sm' 
                : 'bg-[var(--surface-hover)] hover:border-[var(--accent-primary)] text-[var(--text-secondary)]'
            }`}
          >
            Todas las Áreas ({conceptsData.length})
          </button>
          {Object.entries(AREA_META).map(([areaKey, meta]) => {
            const count = areaCounts[areaKey] || 0;
            if (count === 0) return null;
            const isSelected = selectedArea === areaKey;
            return (
              <button
                key={areaKey}
                onClick={() => { playClickSound('toggle'); setSelectedArea(areaKey); setDisplayCount(24); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[var(--accent-primary)] text-slate-950 border-[var(--accent-primary)] font-semibold shadow-sm'
                    : `${meta.bg} ${meta.color} hover:bg-opacity-80`
                }`}
              >
                <span>{meta.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-black/30 text-[var(--text-muted)]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Concepts */}
      {visibleConcepts.length === 0 ? (
        <div className="lab-card p-12 text-center text-sm text-[var(--text-muted)]">
          No se encontraron conceptos para tu búsqueda &quot;{search}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleConcepts.map((c) => {
            const parts = c.path.split('/');
            const area = parts[1] || 'general';
            const meta = AREA_META[area] || { label: area, color: 'text-cyan-400 border-cyan-500/30', bg: 'bg-cyan-500/10' };
            const subSlug = c.path.replace('conceptos/', '');

            return (
              <Link
                key={c.path}
                href={`/conceptos/${subSlug}`}
                onClick={() => playClickSound('click')}
                className="lab-card p-4 sm:p-5 flex flex-col justify-between group hover:-translate-y-1 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md border font-semibold ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                    {c.tags && c.tags.find(t => t.startsWith('mod-')) && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-muted)] uppercase">
                        {c.tags.find(t => t.startsWith('mod-'))?.replace('mod-', '')}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-1.5 line-clamp-1">
                    {c.title}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-3">
                    {c.description || 'Fundamento científico riguroso con mecanismos moleculares y aplicaciones analíticas.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span className="font-mono text-[10px]">
                    {c.tags?.length || 0} etiquetas
                  </span>
                  <span className="text-[var(--accent-primary)] font-mono text-xs flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                    Leer <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      {displayCount < filteredConcepts.length && (
        <div className="text-center mt-10">
          <button
            onClick={() => { playClickSound('click'); setDisplayCount(prev => prev + 24); }}
            className="lab-btn px-6 py-2.5 rounded-xl font-medium text-xs font-mono inline-flex items-center gap-2"
          >
            Cargar 24 conceptos más ({filteredConcepts.length - displayCount} restantes)
          </button>
        </div>
      )}
    </div>
  );
}
