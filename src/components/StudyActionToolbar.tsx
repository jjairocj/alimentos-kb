'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Edit3, Bookmark, Save, Trash2, Sparkles } from 'lucide-react';
import { playClickSound } from '@/lib/sound';

interface StudyActionToolbarProps {
  type: 'concept' | 'module';
  id: string; // conceptPath or moduleCode
  title: string;
}

export default function StudyActionToolbar({ type, id, title }: StudyActionToolbarProps) {
  const [isDone, setIsDone] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    // 1. Fetch initial status from DB API
    const loadStatus = async () => {
      try {
        const res = await fetch('/api/progress');
        if (res.ok) {
          const data = await res.json();
          if (type === 'concept') {
            setIsDone(data.studiedConcepts?.includes(id) || false);
            const found = data.conceptsDetail?.find((c: any) => c.conceptPath === id);
            if (found?.notes) setNotes(found.notes);
          } else {
            setIsDone(data.completedModules?.includes(id.toLowerCase()) || false);
            const found = data.modulesDetail?.find((m: any) => m.moduleCode === id.toLowerCase());
            if (found?.notes) setNotes(found.notes);
          }
        }
      } catch (err) {
        console.error('Error loading progress:', err);
      }
    };

    loadStatus();

    // Also register this visit in user progress
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'visit',
        currentPath: window.location.pathname,
      }),
    }).catch(() => {});
  }, [type, id]);

  const toggleStatus = async () => {
    const nextState = !isDone;
    setIsDone(nextState);
    playClickSound(nextState ? 'success' : 'toggle');

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          type === 'concept'
            ? { action: 'concept', conceptPath: id, isStudied: nextState }
            : { action: 'module', moduleCode: id, isCompleted: nextState }
        ),
      });
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  const saveNotes = async () => {
    setIsSaving(true);
    playClickSound('click');
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          type === 'concept'
            ? { action: 'concept', conceptPath: id, notes }
            : { action: 'module', moduleCode: id, notes }
        ),
      });
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2000);
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="my-4">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Toggle Studied Button */}
        <button
          onClick={toggleStatus}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all ${
            isDone
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] border-[var(--border-lab)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]'
          }`}
        >
          {isDone ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{type === 'concept' ? 'Concepto Estudiado' : 'Módulo Completado'}</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4" />
              <span>{type === 'concept' ? 'Marcar como Estudiado' : 'Marcar como Completado'}</span>
            </>
          )}
        </button>

        {/* Toggle Notes Button */}
        <button
          onClick={() => {
            playClickSound('toggle');
            setShowNotes(!showNotes);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 border transition-all ${
            showNotes || notes
              ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
              : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border-[var(--border-lab)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{notes ? 'Notas Personales (Guardadas)' : 'Agregar Notas'}</span>
        </button>
      </div>

      {/* Slide-down Notes Editor */}
      {showNotes && (
        <div className="mt-3 p-4 rounded-xl border border-[var(--border-lab)] bg-[var(--bg-card-subtle)] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              Bitácora Personal de Estudio (Persistente en SQLite)
            </span>
            {savedFeedback && <span className="text-emerald-400 font-bold">✓ Guardado en base de datos</span>}
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anota aquí preguntas, observaciones de laboratorio, dudas o relaciones con otros alimentos..."
            rows={3}
            className="w-full p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-lab)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)] transition-colors leading-relaxed resize-y"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={saveNotes}
              disabled={isSaving}
              className="lab-btn py-1.5 px-3 rounded-lg text-xs font-mono bg-cyan-500 text-slate-950 font-bold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Guardando...' : 'Guardar en Base de Datos'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
