"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Atom, FlaskConical, Dna, Calculator, ShieldAlert, Scale,
  BookOpen, Sparkles, ArrowRight, ShieldCheck, Search, ChevronRight,
  Layers, Flame, Activity, Microscope
} from "lucide-react";
import AtwaterCalculator from "@/components/AtwaterCalculator";
import SellosCalculator from "@/components/SellosCalculator";
import ThermalKineticsSimulator from "@/components/ThermalKineticsSimulator";
import ChemicalReactionViewer from "@/components/ChemicalReactionViewer";
import EvidenceBadge from "@/components/EvidenceBadge";
import modulesData from "@/data/modules.json";
import mythsData from "@/data/myths.json";
import SearchModal from "@/components/SearchModal";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"atwater" | "sellos" | "termico" | "reacciones">("atwater");
  const [searchOpen, setSearchOpen] = useState(false);

  const areas = [
    { id: "quimica", name: "Química General & Orgánica", icon: "⚛️", count: 40, desc: "Enlaces, polaridad, ácidos grasos, pH y estructura molecular" },
    { id: "bioquimica", name: "Bioquímica de Alimentos", icon: "🧬", count: 14, desc: "ATP, β-oxidación, ciclo de Krebs y síntesis energética" },
    { id: "fisiologia", name: "Fisiología Digestiva", icon: "🫁", count: 23, desc: "Absorción intestinal, transportadores SGLT1/GLUT5 y barrera mucosa" },
    { id: "nutricion", name: "Nutrición & Metabolismo", icon: "🥗", count: 27, desc: "Macronutrientes, almidón resistente y densidad energética" },
    { id: "procesamiento", name: "Tecnología de Alimentos", icon: "⚙️", count: 19, desc: "Cinética térmica, pasteurización, HPP, emulsificación y liofilización" },
    { id: "toxicologia", name: "Toxicología & Seguridad", icon: "🧪", count: 11, desc: "IDA, NOAEL, dosis-respuesta y clasificaciones IARC / JECFA" },
    { id: "microbiota", name: "Microbiota Intestinal", icon: "🦠", count: 11, desc: "Ácidos grasos de cadena corta (AGCC), disbiosis y fermentación" },
    { id: "evidencia", name: "Metodología & Evidencia", icon: "📊", count: 28, desc: "Lectura crítica de papers, ensayos clínicos, metaanálisis y sesgos" },
  ];

  return (
    <div className="space-y-16 py-8 sm:py-12">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Scientific Scope Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-[var(--accent-cyan)] border border-cyan-500/30 text-xs font-mono font-bold">
          <Atom className="w-4 h-4 animate-spin-slow" />
          <span>Alfabetización Científica Avanzada &amp; Química Culinaria</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-mono text-[var(--text-primary)] max-w-4xl mx-auto leading-tight">
          Ciencia &amp; Química de los Alimentos
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-sans">
          Aprende a mirar cualquier producto del supermercado y comprender con rigor técnico qué contiene a nivel molecular, cómo se fabricó, cómo se metaboliza y qué demuestra la evidencia científica independiente.
        </p>

        {/* Hero Interactive Search Bar */}
        <div className="max-w-2xl mx-auto pt-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full p-4 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border-lab)] hover:border-[var(--accent-cyan)] shadow-xl flex items-center justify-between gap-3 text-left transition-all group"
          >
            <div className="flex items-center gap-3 text-[var(--text-muted)] font-mono text-sm sm:text-base">
              <Search className="w-5 h-5 text-[var(--accent-cyan)]" />
              <span>Explorar entre 428 conceptos, moléculas, aditivos o normas...</span>
            </div>
            <kbd className="hidden sm:inline-block px-2.5 py-1 text-xs rounded-lg bg-[var(--bg-input)] border border-[var(--border-lab)] text-[var(--text-secondary)] font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Metrics Bar */}
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto font-mono text-center">
          <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-lab)]">
            <div className="text-2xl font-bold text-[var(--accent-cyan)]">28</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase mt-0.5">Módulos de Estudio</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-lab)]">
            <div className="text-2xl font-bold text-emerald-400">249</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase mt-0.5">Conceptos Científicos</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-lab)]">
            <div className="text-2xl font-bold text-amber-400">48</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase mt-0.5">Aditivos &amp; E-Numbers</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-lab)]">
            <div className="text-2xl font-bold text-violet-400">100%</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase mt-0.5">Fuentes Verificadas (DOI)</div>
          </div>
        </div>

      </section>

      {/* 2. SUITE INTERACTIVA DE LABORATORIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent-cyan)] uppercase tracking-wider">
              <FlaskConical className="w-4 h-4" /> Laboratorio Interactivo
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text-primary)] mt-1">
              Simuladores &amp; Herramientas de Cálculo
            </h2>
          </div>

          {/* Interactive Tool Selector Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-lab)] font-mono text-xs font-bold">
            <button
              onClick={() => setActiveTab("atwater")}
              className={`px-3 py-2 rounded-xl transition-all ${
                activeTab === "atwater"
                  ? "bg-[var(--accent-cyan)] text-slate-950 shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              🧮 Calorías Atwater
            </button>
            <button
              onClick={() => setActiveTab("sellos")}
              className={`px-3 py-2 rounded-xl transition-all ${
                activeTab === "sellos"
                  ? "bg-[var(--accent-cyan)] text-slate-950 shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              🛑 Sellos Colombia (Res. 2492)
            </button>
            <button
              onClick={() => setActiveTab("termico")}
              className={`px-3 py-2 rounded-xl transition-all ${
                activeTab === "termico"
                  ? "bg-[var(--accent-cyan)] text-slate-950 shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              🌡️ Cinética Térmica (D, z, F₀)
            </button>
            <button
              onClick={() => setActiveTab("reacciones")}
              className={`px-3 py-2 rounded-xl transition-all ${
                activeTab === "reacciones"
                  ? "bg-[var(--accent-cyan)] text-slate-950 shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              ⚛️ Reacciones Químicas
            </button>
          </div>
        </div>

        {/* Active Tool Mount */}
        <div>
          {activeTab === "atwater" && <AtwaterCalculator />}
          {activeTab === "sellos" && <SellosCalculator />}
          {activeTab === "termico" && <ThermalKineticsSimulator />}
          {activeTab === "reacciones" && <ChemicalReactionViewer />}
        </div>
      </section>

      {/* 3. DETECTOR DE MITOS & EVIDENCIA CIENTÍFICA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> Análisis Riguroso de Afirmaciones
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text-primary)] mt-1">
              Detector de Mitos Alimentarios &amp; Evidencia
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 font-sans">
              Evaluación crítica de afirmaciones virales con la escala estándar de consenso científico.
            </p>
          </div>

          <Link
            href="/mitos"
            className="text-xs font-mono font-bold text-[var(--accent-cyan)] hover:underline flex items-center gap-1"
          >
            <span>Ver todas las investigaciones</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mythsData.map((myth) => {
            const evTag = myth.tags.find((t) => t.startsWith("ev-"));
            const evLevel = evTag ? evTag.replace("ev-", "") : "limitado";
            const slug = myth.path.replace("afirmaciones/", "");

            return (
              <Link
                key={myth.path}
                href={`/mitos/${slug}`}
                className="lab-card p-5 flex flex-col justify-between group hover:border-[var(--accent-cyan)] transition-all"
              >
                <div className="space-y-3">
                  <EvidenceBadge level={evLevel} size="sm" />
                  <h3 className="font-mono text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors leading-snug">
                    {myth.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans line-clamp-3">
                    {myth.description}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-[var(--border-lab)] flex items-center justify-between text-xs font-mono font-bold text-[var(--accent-cyan)]">
                  <span>Leer veredicto</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. RUTA TRONCAL DE APRENDIZAJE: 28 MÓDULOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" /> Currículo Estructurado
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text-primary)] mt-1">
              Ruta Troncal de 28 Módulos de Estudio
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 font-sans">
              Desde las bases atómicas y moleculares hasta el análisis forense de etiquetas y regulación internacional.
            </p>
          </div>

          <Link
            href="/modulos"
            className="text-xs font-mono font-bold text-[var(--accent-cyan)] hover:underline flex items-center gap-1"
          >
            <span>Ver el plan completo de estudio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modulesData.slice(0, 6).map((mod) => {
            const slug = mod.path.replace("programa/modulos/", "");
            const modTag = mod.tags.find((t) => t.startsWith("mod-m"));
            const code = modTag ? modTag.replace("mod-", "").toUpperCase() : "M00";

            return (
              <Link
                key={mod.path}
                href={`/modulos/${slug}`}
                className="lab-card p-5 sm:p-6 flex flex-col justify-between group hover:border-emerald-500/50 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {code}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">
                      Ruta Troncal
                    </span>
                  </div>

                  <h3 className="font-mono text-base font-bold text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">
                    {mod.title.replace(/^M\d+\s*·\s*/, "")}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans line-clamp-3">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-[var(--border-lab)] flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                  <span>Explorar temario y fuentes</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. EXPLORADOR POR ÁREAS CIENTÍFICAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent-cyan)] uppercase tracking-wider">
            <Atom className="w-4 h-4" /> Red de Conocimientos
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text-primary)] mt-1">
            Explorador por Áreas de la Ciencia
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {areas.map((area) => (
            <Link
              key={area.id}
              href={`/conceptos?area=${area.id}`}
              className="p-4 rounded-xl lab-card hover:border-[var(--accent-cyan)] transition-all group"
            >
              <div className="text-2xl mb-2">{area.icon}</div>
              <div className="font-mono text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                {area.name}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-sans line-clamp-2">
                {area.desc}
              </p>
              <div className="text-[11px] font-mono text-[var(--text-muted)] mt-2 font-bold">
                {area.count} conceptos ➔
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

    </div>
  );
}
