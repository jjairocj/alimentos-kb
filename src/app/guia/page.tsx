import React from 'react';
import Link from 'next/link';
import { BookOpen, Compass, ChevronRight, Scale, FileText, CheckCircle2, Bookmark } from 'lucide-react';
import allPages from '@/data/all_pages.json';

export default function GuiaIndexPage() {
  const guiaPages = allPages.filter(p => p.path.startsWith('guia/'));

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--accent-cyan)] transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold">Guías Metodológicas</span>
      </div>

      {/* Header */}
      <div className="lab-card p-6 sm:p-8 mb-8 relative overflow-hidden border-t-4 border-t-[var(--accent-cyan)]">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            METODOLOGÍA CIENTÍFICA
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-lab)]">
            Estándares Operativos
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-[var(--text-primary)]">
          Guías y Estándares de la Base de Conocimiento
        </h1>
        <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed max-w-3xl">
          Protocolos de rigor metodológico, jerarquía de evidencia científica, manual de citación bibliográfica y directrices operativas de estudio personal.
        </p>
      </div>

      {/* Grid of guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guiaPages.map(page => (
          <Link
            key={page.path}
            href={`/${page.path}`}
            className="lab-card p-6 flex flex-col justify-between group hover:border-[var(--accent-cyan)] transition-all"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>GUÍA METODOLÓGICA</span>
              </div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors mb-2">
                {page.title}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                {page.description || 'Consulta los criterios, plantillas y protocolos estándar para el análisis crítico.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border-lab)] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                /{page.path}
              </span>
              <span className="text-xs font-mono font-semibold text-[var(--accent-cyan)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Consultar Guía
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
