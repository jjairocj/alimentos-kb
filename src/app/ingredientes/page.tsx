'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FlaskRound as Flask, 
  Search, 
  Filter, 
  Tag, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronRight, 
  Sparkles,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import ingredientsData from '@/data/ingredients.json';
import EvidenceBadge from '@/components/EvidenceBadge';
import { playClickSound } from '@/lib/sound';

const FUNCTION_LABELS: Record<string, string> = {
  'func-edulcorantes': 'Edulcorantes',
  'func-emulsionantes': 'Emulsionantes',
  'func-conservantes': 'Conservantes',
  'func-espesantes': 'Espesantes / Estabilizantes',
  'func-colorantes': 'Colorantes',
  'func-potenciadores-del-sabor': 'Potenciadores de Sabor',
  'func-acidulantes': 'Acidulantes',
  'func-antioxidantes': 'Antioxidantes',
  'func-azucares': 'Azúcares / Jarabes',
  'func-grasas-y-aceites': 'Grasas y Fracciones',
  'func-fibras': 'Fibras Prebióticas',
};

export default function IngredientesPage() {
  const [search, setSearch] = useState('');
  const [selectedFunc, setSelectedFunc] = useState<string | null>(null);

  // Filter out index page if present
  const items = useMemo(() => {
    return ingredientsData.filter(i => i.path !== 'ingredientes/categorias');
  }, []);

  const filtered = useMemo(() => {
    return items.filter(item => {
      const q = search.toLowerCase();
      const matchesSearch = !q || 
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));
      
      const matchesFunc = selectedFunc === null || (item.tags && item.tags.includes(selectedFunc));

      return matchesSearch && matchesFunc;
    });
  }, [items, search, selectedFunc]);

  // Extract evidence level from tags
  const getEvidenceLevel = (tags: string[] = []) => {
    const evTag = tags.find(t => t.startsWith('ev-'));
    if (!evTag) return '〔Establecido〕';
    const raw = evTag.replace('ev-', '');
    switch (raw) {
      case 'establecido': return '〔Establecido〕';
      case 'solido': return '〔Sólido〕';
      case 'limitado': return '〔Limitado〕';
      case 'contradictorio': return '〔Contradictorio〕';
      case 'hipotesis':
      case 'hipótesis': return '〔Hipótesis〕';
      case 'opinion':
      case 'opinión': return '〔Opinión〕';
      case 'marketing': return '〔Marketing〕';
      default: return '〔Establecido〕';
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
          <Flask className="w-3.5 h-3.5" />
          Monografías Toxicológicas y Tecnológicas
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Ingredientes y <span className="text-[var(--accent-primary)]">Aditivos Alimentarios</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-3xl text-sm sm:text-base leading-relaxed">
          Base de datos toxicológica y funcional: mecanismos moleculares, dosis de ingesta diaria admisible (IDA/ADI), estatus normativo comparado (Colombia, EFSA, FDA, Codex) y síntesis de controversias científicas.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="lab-card p-5 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-5">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar aditivo (ej: aspartamo, eritritol, nitrito)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
            />
          </div>

          <div className="text-xs font-mono text-[var(--text-muted)]">
            {filtered.length} monografías disponibles
          </div>
        </div>

        {/* Function Tags */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]">
          <button
            onClick={() => { playClickSound('toggle'); setSelectedFunc(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedFunc === null 
                ? 'bg-[var(--accent-primary)] text-slate-950 font-semibold shadow-sm' 
                : 'bg-[var(--surface-hover)] hover:border-[var(--accent-primary)] text-[var(--text-secondary)]'
            }`}
          >
            Todas las Funciones ({items.length})
          </button>
          {Object.entries(FUNCTION_LABELS).map(([tagKey, label]) => {
            const isSelected = selectedFunc === tagKey;
            return (
              <button
                key={tagKey}
                onClick={() => { playClickSound('toggle'); setSelectedFunc(tagKey); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-[var(--accent-primary)] text-slate-950 border-[var(--accent-primary)] font-semibold shadow-sm'
                    : 'bg-[var(--surface-hover)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ingredients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(item => {
          const slug = item.path.split('/').pop() || '';
          const evLevel = getEvidenceLevel(item.tags);

          return (
            <Link
              key={item.path}
              href={`/ingredientes/${slug}`}
              onClick={() => playClickSound('click')}
              className="lab-card p-5 flex flex-col justify-between group hover:-translate-y-1 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <EvidenceBadge level={evLevel} />
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-muted)] border border-[var(--border)]">
                    INS / Monografía
                  </span>
                </div>

                <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed mb-4">
                  {item.description || 'Monografía toxicológica, mecanismo de acción funcional y normativa comparada.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1">
                  {item.tags?.filter(t => t.startsWith('func-')).slice(0, 2).map(f => (
                    <span key={f} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--accent-secondary)]">
                      {FUNCTION_LABELS[f] || f.replace('func-', '')}
                    </span>
                  ))}
                </div>

                <span className="text-[var(--accent-primary)] font-mono text-xs flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Ver Ficha <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
