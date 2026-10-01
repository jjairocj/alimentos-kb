'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  CheckCircle2, 
  Circle, 
  Flame, 
  BookOpen, 
  Atom, 
  Calendar, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Sparkles, 
  Database,
  Bookmark,
  Layers,
  FlaskConical,
  Award
} from 'lucide-react';
import modulesData from '@/data/modules.json';
import conceptsData from '@/data/concepts.json';
import { playClickSound } from '@/lib/sound';

interface StudyLog {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function ProgresoPage() {
  const [loading, setLoading] = useState(true);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [studiedConcepts, setStudiedConcepts] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('/modulos/m00-como-estudiar-e-investigar');
  const [logs, setLogs] = useState<StudyLog[]>([]);

  // New log form state
  const [showNewLog, setShowNewLog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('diario');
  const [isSavingLog, setIsSavingLog] = useState(false);

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/progress');
      if (res.ok) {
        const data = await res.json();
        setCompletedModules(data.completedModules || []);
        setStudiedConcepts(data.studiedConcepts || []);
        if (data.userProgress?.currentPath) {
          setCurrentPath(data.userProgress.currentPath);
        }
      }

      const logsRes = await fetch('/api/logs');
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSavingLog(true);
    playClickSound('click');

    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: newCategory,
        }),
      });

      if (res.ok) {
        setNewTitle('');
        setNewContent('');
        setShowNewLog(false);
        playClickSound('success');
        fetchProgress();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingLog(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    playClickSound('toggle');
    try {
      const res = await fetch(`/api/logs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLogs(logs.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const modulePercent = Math.round((completedModules.length / modulesData.length) * 100);
  const conceptPercent = Math.round((studiedConcepts.length / conceptsData.length) * 100);
  const totalPercent = Math.round((modulePercent * 0.6) + (conceptPercent * 0.4));

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          <Database className="w-3.5 h-3.5" />
          Base de Datos SQLite Activa · Persistencia Total de Estudio
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Tablero de <span className="text-[var(--accent-cyan)]">Progreso y Bitácora Personal</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-3xl text-sm sm:text-base leading-relaxed">
          Monitoriza tu avance a través de los 26 módulos curriculares y 249 conceptos científicos. Tu progreso y anotaciones se almacenan directamente en la base de datos persistente.
        </p>
      </div>

      {/* Main KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Progress */}
        <div className="lab-card p-5 border-l-4 border-l-cyan-500 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Avance Global
            </div>
            <div className="text-3xl font-extrabold text-[var(--text-primary)]">
              {totalPercent}%
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--bg-card-subtle)] mt-3 overflow-hidden border border-[var(--border-lab)]">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${totalPercent}%` }}
            />
          </div>
        </div>

        {/* Modules Completed */}
        <div className="lab-card p-5 border-l-4 border-l-emerald-500 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Módulos Troncales
            </div>
            <div className="text-3xl font-extrabold text-[var(--text-primary)]">
              {completedModules.length} <span className="text-sm font-normal text-[var(--text-muted)]">/ {modulesData.length}</span>
            </div>
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-2 font-mono">
            {modulesData.length - completedModules.length} módulos por completar
          </div>
        </div>

        {/* Concepts Studied */}
        <div className="lab-card p-5 border-l-4 border-l-indigo-500 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Conceptos Dominados
            </div>
            <div className="text-3xl font-extrabold text-[var(--text-primary)]">
              {studiedConcepts.length} <span className="text-sm font-normal text-[var(--text-muted)]">/ {conceptsData.length}</span>
            </div>
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-2 font-mono">
            {conceptsData.length - studiedConcepts.length} conceptos pendientes
          </div>
        </div>

        {/* Resume Button */}
        <div className="lab-card p-5 border-l-4 border-l-amber-500 flex flex-col justify-between bg-amber-500/5">
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Continuar Estudio
            </div>
            <div className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1 mt-1">
              Reanudar sesión
            </div>
          </div>
          <Link
            href={currentPath}
            onClick={() => playClickSound('click')}
            className="lab-btn py-2 px-3 rounded-lg text-xs font-mono bg-amber-500 text-slate-950 font-bold flex items-center justify-between mt-3"
          >
            <span>Ir al último tema</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Module Roadmap Checklist on Left, Journal on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 7 Columns - Modules Status */}
        <div className="lg:col-span-7 space-y-6">
          <div className="lab-card p-6">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-[var(--border-lab)]">
              <h2 className="text-base font-bold flex items-center gap-2 text-[var(--text-primary)]">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Plan Curricular y Estado de Módulos (26)
              </h2>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {completedModules.length} completados
              </span>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {modulesData.map(mod => {
                const slug = mod.path.split('/').pop() || '';
                const code = slug.split('-')[0].toLowerCase();
                const isDone = completedModules.includes(code);

                return (
                  <div
                    key={mod.path}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-[var(--bg-card-subtle)] border-[var(--border-lab)] hover:border-[var(--accent-cyan)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1 rounded-full ${isDone ? 'text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                        {isDone ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5" />}
                      </div>
                      <div>
                        <Link
                          href={`/modulos/${slug}`}
                          className="text-xs font-bold text-[var(--text-primary)] hover:text-[var(--accent-cyan)] transition-colors line-clamp-1"
                        >
                          {mod.title}
                        </Link>
                        <div className="text-[11px] text-[var(--text-muted)] font-mono uppercase mt-0.5">
                          {code.toUpperCase()} · {mod.tags.slice(0, 2).join(' · ')}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/modulos/${slug}`}
                      className="text-xs font-mono text-[var(--accent-cyan)] hover:underline shrink-0 font-semibold"
                    >
                      Ver →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: 5 Columns - Study Journal and Notes */}
        <div className="lg:col-span-5 space-y-6">
          <div className="lab-card p-6">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-[var(--border-lab)]">
              <h2 className="text-base font-bold flex items-center gap-2 text-[var(--text-primary)]">
                <Bookmark className="w-4 h-4 text-emerald-400" />
                Bitácora de Estudio y Preguntas
              </h2>
              <button
                onClick={() => { playClickSound('toggle'); setShowNewLog(!showNewLog); }}
                className="lab-btn py-1 px-2.5 rounded-lg text-xs font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Nueva Entrada
              </button>
            </div>

            {/* Create new log form */}
            {showNewLog && (
              <form onSubmit={handleCreateLog} className="mb-6 p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-cyan-500/30 space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-[var(--text-muted)] uppercase mb-1">Título de la entrada</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Duda sobre desnaturalización y pH..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-lab)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[var(--text-muted)] uppercase mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-lab)] text-xs text-[var(--text-primary)] focus:outline-none"
                  >
                    <option value="diario">Diario de Estudio</option>
                    <option value="pregunta">Pregunta para Investigar</option>
                    <option value="hipotesis">Hipótesis / Observación</option>
                    <option value="laboratorio">Nota de Laboratorio / Receta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[var(--text-muted)] uppercase mb-1">Contenido</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Escribe tus observaciones detalladas..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-lab)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowNewLog(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingLog}
                    className="lab-btn py-1.5 px-3 rounded-lg text-xs font-mono bg-cyan-500 text-slate-950 font-bold"
                  >
                    {isSavingLog ? 'Guardando...' : 'Guardar en Base de Datos'}
                  </button>
                </div>
              </form>
            )}

            {/* List of study logs */}
            {logs.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-lab)] rounded-xl">
                Aún no has registrado notas personales. Haz clic en &quot;Nueva Entrada&quot; para registrar preguntas, reflexiones o experimentos caseros.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {logs.map(log => (
                  <div key={log.id} className="p-4 rounded-xl border border-[var(--border-lab)] bg-[var(--bg-card-subtle)] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded uppercase font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {log.category}
                      </span>
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="text-[var(--text-muted)] hover:text-rose-400 transition-colors p-1"
                        title="Eliminar nota"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-[var(--text-primary)]">
                      {log.title}
                    </h4>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                      {log.content}
                    </p>

                    <div className="text-[10px] font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-lab)] flex items-center justify-between">
                      <span>{new Date(log.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
