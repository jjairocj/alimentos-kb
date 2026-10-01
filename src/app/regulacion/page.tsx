'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  Search, 
  Filter, 
  Building2, 
  FileText, 
  Layers, 
  CheckCircle2, 
  Globe2, 
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import regulationsData from '@/data/regulations.json';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { playClickSound } from '@/lib/sound';

export default function RegulacionPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'normas' | 'conceptos' | 'comparaciones'>('all');
  const [activeItem, setActiveItem] = useState<any>(regulationsData[0] || null);

  const categories = [
    { id: 'all', label: 'Todo el Marco', count: regulationsData.length },
    { id: 'normas', label: 'Normas y Decretos', count: regulationsData.filter(r => r.path.includes('/normas/')).length },
    { id: 'conceptos', label: 'Conceptos Legales', count: regulationsData.filter(r => r.path.includes('/conceptos/')).length },
    { id: 'comparaciones', label: 'Comparativas Internacionales', count: regulationsData.filter(r => r.path.includes('/comparaciones/')).length },
  ];

  const filtered = useMemo(() => {
    return regulationsData.filter(item => {
      const q = search.toLowerCase();
      const matchesSearch = !q || 
        item.title.toLowerCase().includes(q) || 
        (item.description && item.description.toLowerCase().includes(q));

      const matchesCat = 
        selectedCategory === 'all' || 
        (selectedCategory === 'normas' && item.path.includes('/normas/')) ||
        (selectedCategory === 'conceptos' && item.path.includes('/conceptos/')) ||
        (selectedCategory === 'comparaciones' && item.path.includes('/comparaciones/'));

      return matchesSearch && matchesCat;
    });
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
          <Scale className="w-3.5 h-3.5" />
          Derecho y Regulación de Alimentos Comparada
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Marco Regulatorio de los <span className="text-[var(--accent-primary)]">Alimentos</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-3xl text-sm sm:text-base leading-relaxed">
          Análisis jurídico y técnico comparado entre Colombia (INVIMA / MinSalud), Codex Alimentarius (FAO/OMS), Unión Europea (EFSA) y Estados Unidos (FDA eCFR).
        </p>
      </div>

      {/* Jurisdictions Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="lab-card p-5 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-yellow-400 uppercase">Colombia</span>
            <Building2 className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-base font-bold text-[var(--text-primary)] mb-1">INVIMA / MinSalud</div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Ley 2120/2021, Res. 810/2021 y Res. 2492/2022 (sellos de advertencia octogonales negros, límites de sodio, azúcares y grasas).
          </p>
        </div>

        <div className="lab-card p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase">Internacional</span>
            <Globe2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-base font-bold text-[var(--text-primary)] mb-1">Codex Alimentarius</div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Comisión FAO/OMS, norma general GSFA (STAN 192-1995), comités del Codex y evaluaciones toxicológicas del JECFA.
          </p>
        </div>

        <div className="lab-card p-5 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Unión Europea</span>
            <Scale className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-base font-bold text-[var(--text-primary)] mb-1">EFSA / CE 1333/2008</div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Principio de precaución, sistema armonizado de números E, prohibición de TiO2 (E171) y reevaluación continua.
          </p>
        </div>

        <div className="lab-card p-5 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase">Estados Unidos</span>
            <FileText className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-base font-bold text-[var(--text-primary)] mb-1">US FDA / 21 CFR</div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Estatus GRAS (Generally Recognized As Safe), FD&C Act, Color Additive Amendments y panel de Nutrition Facts NLEA.
          </p>
        </div>
      </div>

      {/* Explorer: Split screen List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left List: 5 columns on large screen */}
        <div className="lg:col-span-5 space-y-4">
          <div className="lab-card p-4">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar norma o concepto (ej: 810, GRAS, IDA)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 pb-2 border-b border-[var(--border)]">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => { playClickSound('toggle'); setSelectedCategory(c.id as any); }}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                    selectedCategory === c.id
                      ? 'bg-[var(--accent-primary)] text-slate-950 font-bold'
                      : 'bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {c.label} ({c.count})
                </button>
              ))}
            </div>

            {/* List */}
            <div className="mt-3 space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {filtered.map(item => {
                const isSelected = activeItem && activeItem.path === item.path;
                const isNorma = item.path.includes('/normas/');
                const isComparacion = item.path.includes('/comparaciones/');

                return (
                  <button
                    key={item.path}
                    onClick={() => { playClickSound('click'); setActiveItem(item); }}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-[var(--surface-hover)] border-[var(--accent-primary)] shadow-sm'
                        : 'border-transparent hover:border-[var(--border)] hover:bg-[var(--surface-hover)]/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase ${
                          isNorma ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          isComparacion ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        }`}>
                          {isNorma ? 'Norma' : isComparacion ? 'Comparativa' : 'Concepto'}
                        </span>
                      </div>
                      <div className={`text-xs font-semibold line-clamp-2 ${isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
                        {item.title}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${isSelected ? 'text-[var(--accent-primary)] translate-x-0.5' : 'text-[var(--text-muted)]'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Detail: 7 columns on large screen */}
        <div className="lg:col-span-7">
          {activeItem ? (
            <div className="lab-card p-6 sm:p-8 sticky top-24">
              <div className="flex items-center justify-between gap-3 pb-4 mb-6 border-b border-[var(--border)]">
                <div>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase">
                    {activeItem.path.split('/')[1]?.toUpperCase() || 'REGULACIÓN'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold mt-2 text-[var(--text-primary)]">
                    {activeItem.title}
                  </h2>
                </div>
              </div>

              <div className="max-h-[700px] overflow-y-auto pr-2">
                <MarkdownRenderer content={activeItem.body} />
              </div>
            </div>
          ) : (
            <div className="lab-card p-12 text-center text-sm text-[var(--text-muted)]">
              Seleccione una norma o concepto del panel izquierdo para consultar el texto jurídico analítico.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
