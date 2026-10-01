'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookA, Search, ChevronRight, Sparkles, Filter } from 'lucide-react';
import allPages from '@/data/all_pages.json';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { playClickSound } from '@/lib/sound';

export default function GlosarioPage() {
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const glosarioPage = allPages.find(p => p.path === 'glosario');

  // Extract terms from the markdown table
  const terms = useMemo(() => {
    if (!glosarioPage?.body) return [];
    const lines = glosarioPage.body.split('\n');
    const parsed: { term: string; def: string; link: string; rawLink: string }[] = [];

    for (const line of lines) {
      if (!line.startsWith('|') || line.includes('---|---') || line.includes('Definición breve')) continue;
      const parts = line.split('|').map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const term = parts[0].replace(/['"`]/g, '');
        const def = parts[1];
        const rawLink = parts[2] || '';
        // Extract href from [Texto](url)
        const match = rawLink.match(/\[([^\]]+)\]\(([^)]+)\)/);
        const link = match ? match[2].replace('/alimentos', '') : '';
        parsed.push({ term, def, link, rawLink });
      }
    }
    return parsed.sort((a, b) => a.term.localeCompare(b.term, 'es'));
  }, [glosarioPage]);

  // Alphabet letters present
  const alphabet = useMemo(() => {
    const letters = new Set<string>();
    for (const t of terms) {
      const first = t.term.charAt(0).toUpperCase();
      if (/[A-ZÁÉÍÓÚÑ]/.test(first)) letters.add(first);
    }
    return Array.from(letters).sort((a, b) => a.localeCompare(b, 'es'));
  }, [terms]);

  const filtered = useMemo(() => {
    return terms.filter(t => {
      const q = search.toLowerCase();
      const matchesSearch = !q || 
        t.term.toLowerCase().includes(q) || 
        t.def.toLowerCase().includes(q);
      
      const first = t.term.charAt(0).toUpperCase();
      const matchesLetter = selectedLetter === null || first === selectedLetter;

      return matchesSearch && matchesLetter;
    });
  }, [terms, search, selectedLetter]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
          <BookA className="w-3.5 h-3.5" />
          Diccionario Terminológico · {terms.length} Términos Científicos
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Glosario de <span className="text-[var(--accent-cyan)]">Ciencia de los Alimentos</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-3xl text-sm sm:text-base leading-relaxed">
          Definiciones sintéticas de cada concepto químico, enzimático, toxicológico y tecnológico, con enlace directo a su desarrollo monográfico completo.
        </p>
      </div>

      {/* Search and A-Z Pills */}
      <div className="lab-card p-5 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-5">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar término o palabra clave..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
            />
          </div>

          <div className="text-xs font-mono text-[var(--text-muted)]">
            {filtered.length} términos encontrados
          </div>
        </div>

        {/* A-Z Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-lab)]">
          <button
            onClick={() => { playClickSound('toggle'); setSelectedLetter(null); }}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
              selectedLetter === null
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Todos
          </button>
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => { playClickSound('toggle'); setSelectedLetter(letter); }}
              className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all flex items-center justify-center ${
                selectedLetter === letter
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--text-primary)] border border-transparent'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Glossary terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="lab-card p-5 flex flex-col justify-between group hover:border-[var(--accent-cyan)] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-xs font-bold flex items-center justify-center">
                  {item.term.charAt(0).toUpperCase()}
                </span>
                {item.link && (
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-lab)]">
                    Monografía
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors mb-2">
                {item.term}
              </h3>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                {item.def}
              </p>
            </div>

            {item.link ? (
              <div className="pt-3 border-t border-[var(--border-lab)] flex justify-end">
                <Link
                  href={item.link}
                  onClick={() => playClickSound('click')}
                  className="inline-flex items-center gap-1 font-mono text-xs text-[var(--accent-cyan)] hover:underline font-semibold"
                >
                  Ver concepto <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
