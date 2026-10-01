'use client';

import React, { useState } from 'react';
import { 
  FlaskConical, 
  Flame, 
  ShieldAlert, 
  Timer, 
  Atom, 
  FileSearch,
  Sparkles,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import AtwaterCalculator from '@/components/AtwaterCalculator';
import SellosCalculator from '@/components/SellosCalculator';
import ThermalKineticsSimulator from '@/components/ThermalKineticsSimulator';
import ChemicalReactionViewer from '@/components/ChemicalReactionViewer';
import labData from '@/data/lab.json';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { playClickSound } from '@/lib/sound';

export default function LaboratorioPage() {
  const [activeTab, setActiveTab] = useState<'atwater' | 'sellos' | 'termica' | 'rutas' | 'casos'>('sellos');
  const [selectedCase, setSelectedCase] = useState<number>(0);

  const tabs = [
    { id: 'sellos', label: 'Sellos Frontales (Res. 810/2492)', icon: ShieldAlert, desc: 'Calculadora de octágonos negros según normativa colombiana' },
    { id: 'atwater', label: 'Calculadora Atwater', icon: Flame, desc: 'Balance de energía metabolizable y macronutrientes' },
    { id: 'termica', label: 'Cinética Térmica (D, z, F₀)', icon: Timer, desc: 'Inactivación microbiana y esterilización botulínica 12D' },
    { id: 'rutas', label: 'Rutas Químicas Moleculares', icon: Atom, desc: 'Maillard, peroxidación lipídica y caramelización' },
    { id: 'casos', label: 'Casos y Análisis Forense', icon: FileSearch, desc: '10 expedientes de análisis de laboratorio y auditoría de etiquetas' },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          <FlaskConical className="w-3.5 h-3.5" />
          Laboratorio Interactivo de Simulación
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Laboratorio de <span className="text-[var(--accent-primary)]">Ciencia y Análisis de Alimentos</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-3xl text-sm sm:text-base leading-relaxed">
          Herramientas computacionales para aplicar principios de termodinámica, cinética microbiológica, cálculo de energía metabolizable y auditoría toxicológica y regulatoria sobre formulaciones reales.
        </p>
      </div>

      {/* Lab Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound('toggle');
                setActiveTab(tab.id as any);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-[var(--surface-hover)] border-[var(--accent-primary)] shadow-md'
                  : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--text-muted)]'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[var(--accent-primary)] text-slate-950' : 'bg-[var(--surface-hover)] text-[var(--accent-primary)]'}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className={`text-xs font-bold ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                  {tab.label}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                  {tab.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[500px]">
        {activeTab === 'sellos' && <SellosCalculator />}
        {activeTab === 'atwater' && <AtwaterCalculator />}
        {activeTab === 'termica' && <ThermalKineticsSimulator />}
        {activeTab === 'rutas' && <ChemicalReactionViewer />}

        {activeTab === 'casos' && (
          <div className="space-y-8">
            {/* Case Selector */}
            <div className="lab-card p-5">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-[var(--text-primary)]">
                <FileSearch className="w-4 h-4 text-cyan-400" />
                Expedientes de Laboratorio Disponibles ({labData.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {labData.map((item, idx) => (
                  <button
                    key={item.path}
                    onClick={() => { playClickSound('click'); setSelectedCase(idx); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedCase === idx
                        ? 'bg-[var(--accent-primary)] text-slate-950 border-[var(--accent-primary)] font-semibold'
                        : 'bg-[var(--surface-hover)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Case Content */}
            {labData[selectedCase] && (
              <div className="lab-card p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-[var(--border)]">
                  <div>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase">
                      Expediente #{selectedCase + 1}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold mt-2 text-[var(--text-primary)]">
                      {labData[selectedCase].title}
                    </h2>
                  </div>
                </div>

                <MarkdownRenderer content={labData[selectedCase].body} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
