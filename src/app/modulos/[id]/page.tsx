import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Atom, 
  CheckCircle, 
  ExternalLink,
  Tag,
  Calendar,
  Sparkles
} from 'lucide-react';
import modulesData from '@/data/modules.json';
import conceptsData from '@/data/concepts.json';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import StudyActionToolbar from '@/components/StudyActionToolbar';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return modulesData.map(mod => ({
    id: mod.path.split('/').pop() || '',
  }));
}

export default async function ModuleDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Find module by slug
  const moduleIndex = modulesData.findIndex(m => {
    const slug = m.path.split('/').pop() || '';
    return slug === id || slug.startsWith(id + '-') || slug.split('-')[0] === id.toLowerCase();
  });
  if (moduleIndex === -1) {
    notFound();
  }

  const currentModule = modulesData[moduleIndex];
  const prevModule = moduleIndex > 0 ? modulesData[moduleIndex - 1] : null;
  const nextModule = moduleIndex < modulesData.length - 1 ? modulesData[moduleIndex + 1] : null;

  // Extract mod code, e.g. "m01" or "m13b"
  const modCode = id.split('-')[0].toLowerCase();

  // Find all concepts associated with this module
  const associatedConcepts = conceptsData.filter(c => 
    c.tags && c.tags.some(t => t.toLowerCase() === `mod-${modCode}` || t.toLowerCase().includes(modCode))
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--accent-cyan)] transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/modulos" className="hover:text-[var(--accent-cyan)] transition-colors">
          Módulos
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold uppercase">{modCode}</span>
      </div>

      {/* Module Title Header Card */}
      <div className="lab-card p-6 sm:p-8 mb-6 relative overflow-hidden border-t-4 border-t-[var(--accent-cyan)]">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            {modCode.toUpperCase()} · Módulo Oficial
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-lab)]">
            {associatedConcepts.length} conceptos clave
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 text-[var(--text-primary)]">
          {currentModule.title}
        </h1>

        <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-4">
          {currentModule.description}
        </p>

        {/* Action Toolbar with DB persistence */}
        <StudyActionToolbar type="module" id={modCode} title={currentModule.title} />

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border-lab)]">
          {currentModule.tags.map(tag => (
            <span key={tag} className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] border border-[var(--border-lab)] flex items-center gap-1">
              <Tag className="w-3 h-3 text-[var(--accent-cyan)]" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Two Column Layout on Desktop: Associated Concepts on Side, Content in Middle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <div className="lab-card p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--text-primary)] border-b border-[var(--border-lab)] pb-3">
              <BookOpen className="w-5 h-5 text-[var(--accent-cyan)]" />
              Guía de Estudio y Fundamentos del Módulo
            </h2>
            <MarkdownRenderer content={currentModule.body} />
          </div>
        </div>

        {/* Sidebar: Associated Concepts Index */}
        <div className="lg:col-span-1 space-y-6">
          <div className="lab-card p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--border-lab)]">
              <h3 className="font-bold text-sm flex items-center gap-2 text-[var(--text-primary)]">
                <Atom className="w-4 h-4 text-cyan-400" />
                Conceptos Clave ({associatedConcepts.length})
              </h3>
            </div>

            {associatedConcepts.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] italic">
                No hay conceptos etiquetados directamente con {modCode}.
              </p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {associatedConcepts.map(c => {
                  const cSlug = c.path.replace('conceptos/', '');
                  return (
                    <Link
                      key={c.path}
                      href={`/conceptos/${cSlug}`}
                      className="block p-2.5 rounded-lg border border-transparent hover:border-[var(--border-lab)] hover:bg-[var(--bg-card-subtle)] transition-all group"
                    >
                      <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors line-clamp-1">
                        {c.title}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {c.description || 'Concepto científico'}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-[var(--border-lab)]">
              <Link
                href="/conceptos"
                className="text-xs font-mono text-[var(--accent-cyan)] hover:underline flex items-center gap-1 justify-center"
              >
                Explorar todos los 249 conceptos →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[var(--border-lab)]">
        {prevModule ? (
          <Link
            href={`/modulos/${prevModule.path.split('/').pop()}`}
            className="lab-card px-4 py-3 flex items-center gap-3 w-full sm:w-auto hover:border-[var(--accent-cyan)] transition-colors text-left"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--accent-cyan)] shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Módulo Anterior</div>
              <div className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">{prevModule.title}</div>
            </div>
          </Link>
        ) : <div />}

        {nextModule && (
          <Link
            href={`/modulos/${nextModule.path.split('/').pop()}`}
            className="lab-card px-4 py-3 flex items-center gap-3 w-full sm:w-auto hover:border-[var(--accent-cyan)] transition-colors text-right justify-end ml-auto"
          >
            <div>
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Siguiente Módulo</div>
              <div className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">{nextModule.title}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--accent-cyan)] shrink-0" />
          </Link>
        )}
      </div>
    </div>
  );
}
