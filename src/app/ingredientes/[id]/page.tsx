import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  FlaskRound as Flask, 
  ShieldCheck, 
  ShieldAlert, 
  Tag, 
  BookOpen, 
  Scale, 
  ExternalLink,
  ChevronRight,
  FileText
} from 'lucide-react';
import ingredientsData from '@/data/ingredients.json';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import EvidenceBadge from '@/components/EvidenceBadge';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return ingredientsData
    .filter(i => i.path !== 'ingredientes/categorias')
    .map(i => ({
      id: i.path.split('/').pop() || '',
    }));
}

export default async function IngredientDetailPage({ params }: PageProps) {
  const { id } = await params;
  const targetPath = `ingredientes/${id}`;

  const ingredient = ingredientsData.find(i => i.path === targetPath || (i.path.split('/').pop() === id));
  if (!ingredient) {
    notFound();
  }

  // Get evidence level from tags
  const evTag = ingredient.tags?.find(t => t.startsWith('ev-'));
  const rawEv = evTag ? evTag.replace('ev-', '') : 'establecido';
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
  const evBadge = evMap[rawEv] || '〔Establecido〕';

  // Other ingredients
  const otherIngredients = ingredientsData
    .filter(i => i.path !== ingredient.path && i.path !== 'ingredientes/categorias')
    .slice(0, 5);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/ingredientes" className="hover:text-[var(--accent-primary)] transition-colors">
          Ingredientes & Aditivos
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold line-clamp-1">{ingredient.title}</span>
      </div>

      {/* Header Monograph Card */}
      <div className="lab-card p-6 sm:p-8 mb-8 relative overflow-hidden border-t-4 border-t-amber-500">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <EvidenceBadge level={evBadge} />
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-[var(--surface-hover)] text-[var(--text-muted)] border border-[var(--border)]">
            Monografía Toxicológica Oficial
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Módulo M16
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-[var(--text-primary)]">
          {ingredient.title}
        </h1>

        {ingredient.description && (
          <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-6 font-medium">
            {ingredient.description}
          </p>
        )}

        {/* Functional Tags */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border)]">
          {ingredient.tags && ingredient.tags.map(tag => (
            <span key={tag} className="font-mono text-xs px-2.5 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] border border-[var(--border)]">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Monograph Body */}
        <div className="lg:col-span-2">
          <div className="lab-card p-6 sm:p-8">
            <MarkdownRenderer content={ingredient.body} />
          </div>
        </div>

        {/* Sidebar: Regulatory & Related */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Regulatory Reference */}
          <div className="lab-card p-5">
            <h3 className="font-bold text-sm flex items-center gap-2 text-[var(--text-primary)] mb-3 pb-2 border-b border-[var(--border)]">
              <Scale className="w-4 h-4 text-amber-400" />
              Marco Regulatorio Comparado
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
              Consulte la comparativa de límites máximos de uso entre Colombia (INVIMA/MinSalud), EFSA (Unión Europea), FDA (EE. UU.) y Codex Alimentarius.
            </p>
            <Link
              href="/regulacion"
              className="lab-btn w-full py-2 px-3 rounded-lg text-xs font-mono flex items-center justify-center gap-2 text-center"
            >
              Matriz Regulatoria →
            </Link>
          </div>

          {/* Related Ingredients */}
          <div className="lab-card p-5 sticky top-24">
            <h3 className="font-bold text-sm flex items-center gap-2 text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--border)]">
              <Flask className="w-4 h-4 text-cyan-400" />
              Otros Aditivos Destacados
            </h3>

            <div className="space-y-2">
              {otherIngredients.map(item => {
                const iSlug = item.path.split('/').pop() || '';
                return (
                  <Link
                    key={item.path}
                    href={`/ingredientes/${iSlug}`}
                    className="block p-2.5 rounded-lg border border-transparent hover:border-[var(--border)] hover:bg-[var(--surface-hover)] transition-all group"
                  >
                    <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                      {item.description || 'Monografía toxicológica'}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--border)]">
              <Link
                href="/ingredientes"
                className="text-xs font-mono text-[var(--accent-primary)] hover:underline flex items-center gap-1 justify-center"
              >
                ← Ver todas las monografías
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
