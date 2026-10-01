'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Library, 
  BookOpen, 
  FileText, 
  Globe, 
  Search, 
  ExternalLink, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import allPages from '@/data/all_pages.json';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { playClickSound } from '@/lib/sound';

export default function FuentesPage() {
  const [activeTab, setActiveTab] = useState<'articulos' | 'libros' | 'recursos'>('articulos');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Group items by category
  const articulos = useMemo(() => {
    return allPages.filter(p => p.path.startsWith('fuentes/articulos/'));
  }, []);

  const libros = useMemo(() => {
    return allPages.filter(p => p.path.startsWith('fuentes/libros/'));
  }, []);

  const recursosPage = useMemo(() => {
    return allPages.find(p => p.path === 'fuentes/recursos');
  }, []);

  const currentList = activeTab === 'articulos' ? articulos : libros;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return currentList.filter(item => 
      !q || 
      item.title.toLowerCase().includes(q) || 
      (item.description && item.description.toLowerCase().includes(q))
    );
  }, [currentList, search]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
          <Library className="w-3.5 h-3.5" />
          Bibliografía Científica Primaria y Verificada
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Fuentes, <span className="text-[var(--accent-cyan)]">Literatura y Tratados</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-3xl text-sm sm:text-base leading-relaxed">
          Cada concepto y norma de la base se sustenta en tratados de química de alimentos y revisiones sistemáticas indexadas en PubMed, Crossref y Cochrane Library.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => { playClickSound('toggle'); setActiveTab('articulos'); setSelectedItem(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all ${
            activeTab === 'articulos'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
              : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] border-[var(--border-lab)] hover:text-[var(--text-primary)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          Artículos Centrales ({articulos.length})
        </button>

        <button
          onClick={() => { playClickSound('toggle'); setActiveTab('libros'); setSelectedItem(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all ${
            activeTab === 'libros'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
              : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] border-[var(--border-lab)] hover:text-[var(--text-primary)]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Tratados y Libros de Texto ({libros.length})
        </button>

        <button
          onClick={() => { playClickSound('toggle'); setActiveTab('recursos'); setSelectedItem(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all ${
            activeTab === 'recursos'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
              : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] border-[var(--border-lab)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Globe className="w-4 h-4" />
          Bases de Datos y Recursos Online
        </button>
      </div>

      {/* Content */}
      {activeTab === 'recursos' ? (
        <div className="lab-card p-6 sm:p-8">
          {recursosPage ? (
            <MarkdownRenderer content={recursosPage.body} />
          ) : (
            <div className="text-sm text-[var(--text-muted)]">No se encontró el recurso.</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List: 5 columns */}
          <div className="lg:col-span-5 space-y-4">
            <div className="lab-card p-4">
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Buscar ${activeTab === 'articulos' ? 'artículo...' : 'libro...'}`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-lab)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
                />
              </div>

              <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                {filtered.map(item => {
                  const isSelected = selectedItem?.path === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => { playClickSound('click'); setSelectedItem(item); }}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-[var(--bg-card-subtle)] border-[var(--accent-cyan)] shadow-sm'
                          : 'border-transparent hover:border-[var(--border-lab)] hover:bg-[var(--bg-card-subtle)]/60'
                      }`}
                    >
                      <div>
                        <div className={`text-xs font-semibold line-clamp-2 ${isSelected ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-primary)]'}`}>
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                          {item.description || 'Fuente científica verificada'}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${isSelected ? 'text-[var(--accent-cyan)] translate-x-0.5' : 'text-[var(--text-muted)]'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reader: 7 columns */}
          <div className="lg:col-span-7">
            {selectedItem ? (
              <div className="lab-card p-6 sm:p-8 sticky top-24">
                <div className="pb-4 mb-6 border-b border-[var(--border-lab)]">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase">
                    {activeTab === 'articulos' ? 'Lectura Crítica' : 'Tratado de Referencia'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold mt-2 text-[var(--text-primary)]">
                    {selectedItem.title}
                  </h2>
                </div>

                <div className="max-h-[650px] overflow-y-auto pr-2">
                  <MarkdownRenderer content={selectedItem.body} />
                </div>
              </div>
            ) : (
              <div className="lab-card p-12 text-center text-sm text-[var(--text-muted)]">
                Seleccione un {activeTab === 'articulos' ? 'artículo' : 'libro'} del panel izquierdo para consultar la ficha técnica y lectura crítica.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
