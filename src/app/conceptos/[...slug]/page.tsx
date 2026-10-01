import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  Atom, 
  BookOpen, 
  Calendar, 
  Tag, 
  Layers, 
  Share2, 
  CheckCircle, 
  ChevronRight,
  FlaskConical,
  ExternalLink,
  ListOrdered,
  BookmarkCheck
} from 'lucide-react';
import conceptsData from '@/data/concepts.json';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  return conceptsData.map(c => {
    const parts = c.path.split('/');
    const slugParts = parts[0] === 'conceptos' ? parts.slice(1) : parts;
    return {
      slug: slugParts,
    };
  });
}

export default async function ConceptDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const targetPath = `conceptos/${slug.join('/')}`;

  const concept = conceptsData.find(c => c.path === targetPath || c.path === slug.join('/'));
  if (!concept) {
    notFound();
  }

  const area = slug[0] || 'general';
  const modTag = concept.tags?.find(t => t.startsWith('mod-'))?.replace('mod-', '') || null;

  // Extract sections (## Headings) for the quick index
  const sectionHeadings = (concept.body.match(/^##\s+([^#\n]+)$/gm) || []).map(h => {
    return h.replace(/^##\s+/, '').trim();
  });

  // Find related concepts in same area
  const related = conceptsData
    .filter(c => c.path !== concept.path && c.path.startsWith(`conceptos/${area}`))
    .slice(0, 6);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--accent-cyan)] transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/conceptos" className="hover:text-[var(--accent-cyan)] transition-colors">
          Conceptos
        </Link>
        <span>/</span>
        <span className="capitalize text-[var(--accent-cyan)]">{area}</span>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold line-clamp-1">{concept.title}</span>
      </div>

      {/* Header Ficha Card */}
      <div className="lab-card p-6 sm:p-8 mb-8 relative overflow-hidden border-t-4 border-t-[var(--accent-cyan)]">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            Área: {area}
          </span>

          {modTag && (
            <Link
              href={`/modulos/m${modTag.toLowerCase().replace('m', '')}`}
              className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3" />
              Módulo {modTag.toUpperCase()}
            </Link>
          )}

          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-lab)]">
            Ficha Científica Verificada
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-[var(--text-primary)]">
          {concept.title}
        </h1>

        {concept.description && (
          <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-6 font-medium">
            {concept.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border-lab)]">
          {concept.tags && concept.tags.map(tag => (
            <span key={tag} className="font-mono text-xs px-2.5 py-0.5 rounded bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] border border-[var(--border-lab)]">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Markdown Body */}
        <div className="lg:col-span-2">
          <div className="lab-card p-6 sm:p-9 shadow-sm">
            <MarkdownRenderer content={concept.body} />
          </div>
        </div>

        {/* Sidebar: Table of contents & Related */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Table of Contents if >= 2 sections */}
          {sectionHeadings.length >= 2 && (
            <div className="lab-card p-5">
              <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-[var(--accent-cyan)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--border-lab)]">
                <ListOrdered className="w-4 h-4 text-cyan-400" />
                Estructura del Artículo
              </h3>
              <nav className="space-y-1.5">
                {sectionHeadings.map((heading, idx) => (
                  <div key={idx} className="text-xs text-[var(--text-secondary)] flex items-start gap-2 py-1 leading-snug">
                    <span className="font-mono text-[10px] text-[var(--text-muted)] shrink-0 mt-0.5">§{idx + 1}</span>
                    <span className="font-medium text-[var(--text-primary)] line-clamp-1">{heading}</span>
                  </div>
                ))}
              </nav>
            </div>
          )}

          {/* Related in this area */}
          <div className="lab-card p-5 sticky top-24">
            <h3 className="font-bold text-sm flex items-center gap-2 text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--border-lab)]">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              Más en &quot;{area}&quot;
            </h3>

            <div className="space-y-2">
              {related.map(r => {
                const rSlug = r.path.replace('conceptos/', '');
                return (
                  <Link
                    key={r.path}
                    href={`/conceptos/${rSlug}`}
                    className="block p-2.5 rounded-lg border border-transparent hover:border-[var(--border-lab)] hover:bg-[var(--bg-card-subtle)] transition-all group"
                  >
                    <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors line-clamp-1">
                      {r.title}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                      {r.description || 'Concepto relacionado'}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--border-lab)]">
              <Link
                href="/conceptos"
                className="text-xs font-mono text-[var(--accent-cyan)] hover:underline flex items-center gap-1 justify-center"
              >
                ← Catálogo general (249)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
