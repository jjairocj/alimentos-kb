'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Compass, 
  Layers, 
  ChevronRight, 
  Sparkles, 
  GraduationCap, 
  FlaskConical, 
  Search,
  Filter
} from 'lucide-react';
import modulesData from '@/data/modules.json';
import conceptsData from '@/data/concepts.json';
import { playClickSound } from '@/lib/sound';

interface Module {
  path: string;
  title: string;
  description: string;
  tags: string[];
  body: string;
}

export default function ModulosPage() {
  const [search, setSearch] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('alimentos_completed_modules');
      if (saved) setCompletedModules(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playClickSound('toggle');
    const updated = completedModules.includes(id)
      ? completedModules.filter(m => m !== id)
      : [...completedModules, id];
    setCompletedModules(updated);
    try {
      localStorage.setItem('alimentos_completed_modules', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Group modules into 4 phases
  const getPhase = (modId: string) => {
    const num = parseInt(modId.replace(/\D/g, ''), 10);
    if (num <= 7) return 1;
    if (num <= 13) return 2;
    if (num <= 19) return 3;
    if (num <= 23) return 4;
    if (num <= 26) return 5;
    return 6;
  };

  const phases = [
    { id: 1, title: 'Fase I: Fundamentos Fisicoquímicos y Celulares', desc: 'Química general, biomoléculas, célula, agua y sistemas coloidales', range: 'M00 – M07' },
    { id: 2, title: 'Fase II: Fisiología, Nutrición y Microbiología', desc: 'Microbiología, digestión, bioenergética, endocrino y macronutrientes', range: 'M08 – M13b' },
    { id: 3, title: 'Fase III: Procesamiento, Toxicología y Aditivos', desc: 'Transformación industrial, toxicología, aditivos INS, sensorial y ultraprocesados', range: 'M14 – M19' },
    { id: 4, title: 'Fase IV: Regulación, Evidencia e Investigación', desc: 'Marco regulatorio, etiquetado normativo e investigación de afirmaciones', range: 'M20 – M23' },
    { id: 5, title: 'Fase V: Ingeniería de Procesos y Fenómenos (Universitario)', desc: 'Balances de materia y energía, reología no newtoniana y transporte de calor/masa', range: 'M24 – M26' },
    { id: 6, title: 'Fase VI: Operaciones Unitarias, AOAC y GFSI (Universitario)', desc: 'UHT, evaporación, secado, membranas, HPLC/GC-MS, microbiología predictiva y HACCP', range: 'M27 – M33' },
  ];

  const filtered = modulesData.filter(mod => {
    const slug = mod.path.split('/').pop() || '';
    const matchesSearch = 
      mod.title.toLowerCase().includes(search.toLowerCase()) || 
      mod.description.toLowerCase().includes(search.toLowerCase()) ||
      slug.toLowerCase().includes(search.toLowerCase());
    const matchesPhase = selectedPhase === null || getPhase(slug) === selectedPhase;
    return matchesSearch && matchesPhase;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
          <GraduationCap className="w-3.5 h-3.5" />
          Ruta Curricular para Adultos · 36 Módulos (Ciclo Tecnólogo y Universitario)
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Programa Troncal de <span className="text-[var(--accent-primary)]">Ciencia de Alimentos</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-3xl text-sm sm:text-base leading-relaxed">
          Diseñado para construir alfabetización científica avanzada y criterio riguroso: desde la termodinámica del agua y la química orgánica molecular hasta la toxicología de aditivos y la lectura crítica de literatura indexada.
        </p>
      </div>

      {/* Progress Card */}
      <div className="lab-card p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-[var(--accent-primary)]">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Progreso Personal de Estudio</div>
            <div className="text-lg font-bold text-[var(--text-primary)]">
              {completedModules.length} de {modulesData.length} módulos completados ({Math.round((completedModules.length / modulesData.length) * 100)}%)
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="w-full h-3 rounded-full bg-[var(--surface-hover)] overflow-hidden border border-[var(--border)]">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500 transition-all duration-500"
              style={{ width: `${(completedModules.length / modulesData.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-[var(--text-muted)] font-mono mt-1.5">
            <span>249 conceptos científicos indexados</span>
            <span>{modulesData.length - completedModules.length} módulos por completar</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-stretch md:items-center">
        {/* Phase buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { playClickSound('toggle'); setSelectedPhase(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedPhase === null 
                ? 'bg-[var(--accent-primary)] text-slate-950 font-semibold shadow-sm' 
                : 'lab-card hover:border-[var(--accent-primary)]'
            }`}
          >
            Todas las Fases ({modulesData.length})
          </button>
          {phases.map(p => (
            <button
              key={p.id}
              onClick={() => { playClickSound('toggle'); setSelectedPhase(p.id); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPhase === p.id 
                  ? 'bg-[var(--accent-primary)] text-slate-950 font-semibold shadow-sm' 
                  : 'lab-card hover:border-[var(--accent-primary)]'
              }`}
            >
              Fase {p.id} ({p.range})
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por módulo o tema..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
          />
        </div>
      </div>

      {/* Phase Info Box if phase selected */}
      {selectedPhase && (
        <div className="mb-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs">
          <div className="font-bold text-cyan-400 mb-1">{phases[selectedPhase - 1].title}</div>
          <div className="text-[var(--text-secondary)]">{phases[selectedPhase - 1].desc}</div>
        </div>
      )}

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(mod => {
          const slug = mod.path.split('/').pop() || '';
          const isDone = completedModules.includes(slug);
          const phase = getPhase(slug);

          return (
            <div
              key={mod.path}
              className={`lab-card p-5 flex flex-col justify-between group transition-all relative overflow-hidden ${
                isDone ? 'border-emerald-500/40 bg-emerald-950/5' : ''
              }`}
            >
              {/* Top Row: Tag, Phase badge, Checkbox */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Fase {phase} · {slug.split('-')[0].toUpperCase()}
                  </span>

                  <button
                    onClick={(e) => toggleComplete(slug, e)}
                    title={isDone ? 'Marcar como pendiente' : 'Marcar como estudiado'}
                    className={`p-1.5 rounded-lg border transition-all ${
                      isDone 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30' 
                        : 'text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                  </button>
                </div>

                <Link href={`/modulos/${slug}`} className="block group-hover:text-[var(--accent-primary)] transition-colors">
                  <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] mb-2 line-clamp-1">
                    {mod.title}
                  </h3>
                </Link>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                  {mod.description || 'Módulo troncal con fundamentos fisicoquímicos, evidencia y aplicaciones en alimentos.'}
                </p>
              </div>

              {/* Bottom Row */}
              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1">
                  {mod.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-muted)]">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/modulos/${slug}`}
                  onClick={() => playClickSound('click')}
                  className="inline-flex items-center gap-1 font-mono text-xs text-[var(--accent-primary)] hover:translate-x-0.5 transition-transform font-semibold"
                >
                  Estudiar
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
