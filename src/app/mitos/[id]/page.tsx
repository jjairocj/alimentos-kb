import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Tag, 
  Scale, 
  BookOpen, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import mythsData from '@/data/myths.json';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import EvidenceBadge from '@/components/EvidenceBadge';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mythsData.map(m => ({
    id: m.path.split('/').pop() || '',
  }));
}

export default async function MythDetailPage({ params }: PageProps) {
  const { id } = await params;
  const targetPath = `afirmaciones/${id}`;

  const myth = mythsData.find(m => m.path === targetPath || (m.path.split('/').pop() === id));
  if (!myth) {
    notFound();
  }

  // Get evidence level
  const evTag = myth.tags?.find(t => t.startsWith('ev-'));
  const rawEv = evTag ? evTag.replace('ev-', '') : 'limitado';
  const evMap: Record<string, string> = {
    establecido: '〔Establecido〕',
    solido: '〔Sólido〕',
    limitado: '〔Limitado〕',
    contradictorio: '〔Contradictorio〕',
    hipotesis: '〔Hipótesis〕',
    'hipótesis': '〔Hipótesis〕',
    opinion: '〔Opinión〕',
    marketing: '〔Marketing〕'
  };
  const evBadge = evMap[rawEv] || '〔Limitado〕';

  const otherMyths = mythsData.filter(m => m.path !== myth.path);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/mitos" className="hover:text-[var(--accent-primary)] transition-colors">
          Detector de Mitos
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold line-clamp-1">{myth.title}</span>
      </div>

      {/* Header Card */}
      <div className="lab-card p-6 sm:p-8 mb-8 relative overflow-hidden border-t-4 border-t-rose-500">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <EvidenceBadge level={evBadge} showExplanation />
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Módulo M22 · Verificación
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-[var(--text-primary)]">
          {myth.title}
        </h1>

        {myth.description && (
          <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-6 font-medium">
            {myth.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border)]">
          {myth.tags && myth.tags.map(tag => (
            <span key={tag} className="font-mono text-xs px-2.5 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] border border-[var(--border)]">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Body */}
        <div className="lg:col-span-2">
          <div className="lab-card p-6 sm:p-8">
            <MarkdownRenderer content={myth.body} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="lab-card p-5 sticky top-24">
            <h3 className="font-bold text-sm flex items-center gap-2 text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--border)]">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Otras Afirmaciones Analizadas
            </h3>

            <div className="space-y-2">
              {otherMyths.map(item => {
                const mSlug = item.path.split('/').pop() || '';
                return (
                  <Link
                    key={item.path}
                    href={`/mitos/${mSlug}`}
                    className="block p-2.5 rounded-lg border border-transparent hover:border-[var(--border)] hover:bg-[var(--surface-hover)] transition-all group"
                  >
                    <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                      {item.description || 'Auditoría de evidencia'}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--border)]">
              <Link
                href="/mitos"
                className="text-xs font-mono text-[var(--accent-primary)] hover:underline flex items-center gap-1 justify-center"
              >
                ← Ver todas las afirmaciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
