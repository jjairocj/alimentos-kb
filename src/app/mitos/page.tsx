'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ChevronRight, 
  FileText,
  Search,
  Scale
} from 'lucide-react';
import mythsData from '@/data/myths.json';
import EvidenceBadge from '@/components/EvidenceBadge';
import { playClickSound } from '@/lib/sound';

export default function MitosPage() {
  const [search, setSearch] = useState('');

  const getEvidenceLevel = (tags: string[] = []) => {
    const evTag = tags.find(t => t.startsWith('ev-'));
    if (!evTag) return '〔Limitado〕';
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
      default: return '〔Limitado〕';
    }
  };

  const filtered = mythsData.filter(m => {
    const q = search.toLowerCase();
    return !q || 
      m.title.toLowerCase().includes(q) || 
      (m.description && m.description.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          Verificación de Afirmaciones Nutricionales
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Detector de Mitos y <span className="text-[var(--accent-primary)]">Evidencia Científica</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-3xl text-sm sm:text-base leading-relaxed">
          Evaluamos afirmaciones populares y titulares alarmistas utilizando la escala oficial de 7 niveles de evidencia, dosis reales de exposición, modelos biológicos y revisiones sistemáticas indexadas.
        </p>
      </div>

      {/* Evidence Scale Guide Banner */}
      <div className="lab-card p-5 mb-8 border-l-4 border-l-cyan-500">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
            Escala Oficial de Evidencia Aplicada
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <EvidenceBadge level="〔Establecido〕" showExplanation />
          <EvidenceBadge level="〔Sólido〕" showExplanation />
          <EvidenceBadge level="〔Limitado〕" showExplanation />
          <EvidenceBadge level="〔Contradictorio〕" showExplanation />
          <EvidenceBadge level="〔Hipótesis〕" showExplanation />
          <EvidenceBadge level="〔Opinión〕" showExplanation />
          <EvidenceBadge level="〔Marketing〕" showExplanation />
        </div>
      </div>

      {/* Myths Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(item => {
          const slug = item.path.split('/').pop() || '';
          const evLevel = getEvidenceLevel(item.tags);

          return (
            <div
              key={item.path}
              className="lab-card p-6 flex flex-col justify-between group hover:border-[var(--accent-primary)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <EvidenceBadge level={evLevel} />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-muted)] border border-[var(--border)]">
                    Auditoría Científica
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-2.5">
                  {item.title}
                </h3>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed mb-5">
                  {item.description || 'Evaluación de los estudios primarios, sesgos metodológicos, dosis empleadas y consenso de agencias sanitarias internacionales.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  Módulo M22 · Investigación
                </span>

                <Link
                  href={`/mitos/${slug}`}
                  onClick={() => playClickSound('click')}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--accent-primary)] hover:translate-x-0.5 transition-transform"
                >
                  Leer Dictamen Científico
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
