import React from 'react';
import Link from 'next/link';
import { BookOpen, Tag, ChevronRight, FileText, ListOrdered, Library } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import StudyActionToolbar from '@/components/StudyActionToolbar';
import allPages from '@/data/all_pages.json';

interface DocumentViewProps {
  page: {
    path: string;
    title: string;
    description?: string;
    tags?: string[];
    body: string;
  };
  sectionTitle?: string;
  sectionPath?: string;
}

export default function DocumentView({ page, sectionTitle = 'Base de Conocimiento', sectionPath = '/' }: DocumentViewProps) {
  const parts = page.path.split('/');
  const section = parts[0];
  const slug = parts.slice(1).join('/');

  // Extract sections (## Headings) for quick navigation
  const sectionHeadings = (page.body.match(/^##\s+([^#\n]+)$/gm) || []).map(h => {
    return h.replace(/^##\s+/, '').trim();
  });

  // Find other pages in the same section
  const relatedPages = allPages
    .filter(p => p.path !== page.path && p.path.startsWith(`${section}/`))
    .slice(0, 6);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--accent-cyan)] transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link href={sectionPath} className="hover:text-[var(--accent-cyan)] transition-colors capitalize">
          {sectionTitle}
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold line-clamp-1">{page.title}</span>
      </div>

      {/* Header Ficha Card */}
      <div className="lab-card p-6 sm:p-8 mb-6 relative overflow-hidden border-t-4 border-t-[var(--accent-cyan)]">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            {section.toUpperCase()}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-lab)]">
            Documento Oficial Verificado
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-[var(--text-primary)]">
          {page.title}
        </h1>

        {page.description && (
          <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-4 font-medium">
            {page.description}
          </p>
        )}

        {/* Study Progress Toolbar */}
        <StudyActionToolbar type="concept" id={page.path} title={page.title} />

        {/* Tags */}
        {page.tags && page.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border-lab)]">
            {page.tags.map(tag => (
              <span key={tag} className="font-mono text-xs px-2.5 py-0.5 rounded bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] border border-[var(--border-lab)]">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Body */}
        <div className="lg:col-span-2">
          <div className="lab-card p-6 sm:p-9 shadow-sm">
            <MarkdownRenderer content={page.body} />
          </div>
        </div>

        {/* Sidebar: Table of contents & Related */}
        <div className="lg:col-span-1 space-y-6">
          {sectionHeadings.length >= 2 && (
            <div className="lab-card p-5">
              <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-[var(--accent-cyan)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--border-lab)]">
                <ListOrdered className="w-4 h-4 text-cyan-400" />
                Estructura del Documento
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

          {relatedPages.length > 0 && (
            <div className="lab-card p-5 sticky top-24">
              <h3 className="font-bold text-sm flex items-center gap-2 text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--border-lab)]">
                <FileText className="w-4 h-4 text-emerald-400" />
                Más en &quot;{sectionTitle}&quot;
              </h3>

              <div className="space-y-2">
                {relatedPages.map(r => (
                  <Link
                    key={r.path}
                    href={`/${r.path}`}
                    className="block p-2.5 rounded-lg border border-transparent hover:border-[var(--border-lab)] hover:bg-[var(--bg-card-subtle)] transition-all group"
                  >
                    <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors line-clamp-1">
                      {r.title}
                    </div>
                    {r.description && (
                      <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {r.description}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
