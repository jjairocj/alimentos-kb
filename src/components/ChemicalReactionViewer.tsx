"use client";

import React, { useState } from "react";
import { sound } from "@/lib/sound";
import { Atom, Flame, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface ReactionStep {
  title: string;
  chemicalFormula: string;
  description: string;
  temperature?: string;
  visualNote: string;
}

interface ReactionData {
  id: string;
  name: string;
  type: string;
  color: string;
  steps: ReactionStep[];
  realWorldExample: string;
}

const REACTIONS: ReactionData[] = [
  {
    id: "maillard",
    name: "Reacción de Maillard",
    type: "Pardeamiento No Enzimático",
    color: "amber",
    realWorldExample: "Corteza dorada del pan, costra sellada de la carne, aroma del café tostado",
    steps: [
      {
        title: "Fase 1: Condensación Carbonilo-Amino",
        chemicalFormula: "R-CHO + R'-NH₂ ⇄ R-CH=N-R' (Base de Schiff) + H₂O",
        description: "Un azúcar reductor (glucosa, fructosa) reacciona con el grupo amino libre de un aminoácido (como lisina), perdiendo una molécula de agua.",
        temperature: "> 130 °C",
        visualNote: "Incoloro, sin aroma perceptible aún.",
      },
      {
        title: "Fase 2: Transposición de Amadori / Heyns",
        chemicalFormula: "Glicosilamina ⇄ 1-amino-1-desoxi-2-cetosa (Producto Amadori)",
        description: "Reordenamiento intramolecular irreversible catalizado por ácidos débiles que estabiliza el intermedio antes de la fragmentación.",
        temperature: "140–160 °C",
        visualNote: "Formación de los primeros precursores aromáticos.",
      },
      {
        title: "Fase 3: Degradación de Strecker y Fisión",
        chemicalFormula: "α-dicarbonilos + aminoácidos → Aldehídos de Strecker + Pirazinas",
        description: "Ruptura de la cadena carbonada originando compuestos de bajo peso molecular altamente volátiles (pirazinas, furanos, pirroles).",
        temperature: "> 150 °C",
        visualNote: "Aromas tostados característicos a pan horneado y malta.",
      },
      {
        title: "Fase 4: Polimerización Final a Melanoidinas",
        chemicalFormula: "Polímeros heterogéneos de alto peso molecular con nitrógeno (Melanoidinas)",
        description: "Condensación masiva de compuestos reactivos que confieren el color pardo oscuro brillante y propiedades antioxidantes.",
        temperature: "> 160 °C",
        visualNote: "Pigmentación marrón profunda y textura crujiente exterior.",
      },
    ],
  },
  {
    id: "oxidacion",
    name: "Oxidación de Lípidos",
    type: "Deterioro Químico Radicalario",
    color: "rose",
    realWorldExample: "Rancidez de aceites vegetales, sabor 'a cartón' en frutos secos viejos",
    steps: [
      {
        title: "1. Iniciación (Formación del radical)",
        chemicalFormula: "RH + [Luz/Fe²⁺/Calor] → R• (Radical Alquilo) + H•",
        description: "Un átomo de hidrógeno es sustraído de un carbono alílico adyacente a un doble enlace de un ácido graso poliinsaturado.",
        visualNote: "El aceite luce transparente; no hay olor rancio aún.",
      },
      {
        title: "2. Propagación en Cadena",
        chemicalFormula: "R• + O₂ → ROO• (Radical Peroxilo) | ROO• + RH → ROOH + R•",
        description: "El radical reacciona a velocidad de difusión con el oxígeno atmosférico, creando hidroperóxidos primarios que atacan a otros lípidos vecinos.",
        visualNote: "Aumento progresivo del Índice de Peróxidos (IP).",
      },
      {
        title: "3. Fisión en Compuestos Secundarios",
        chemicalFormula: "ROOH → RO• + •OH → Hexanal, 2,4-decadienal, malondialdehído",
        description: "Descomposición homolítica del enlace peróxido originando aldehídos y cetonas volátiles de umbral olfativo extremadamente bajo.",
        visualNote: "Aparición del olor rancio y picante característico.",
      },
      {
        title: "4. Terminación",
        chemicalFormula: "R• + R• → R-R | ROO• + ROO• → ROOR + O₂",
        description: "Recombinación de dos especies radicalarias para formar dímeros o polímeros estables no reactivos.",
        visualNote: "Aumento de la viscosidad del aceite degradado.",
      },
    ],
  },
  {
    id: "caramelizacion",
    name: "Caramelización",
    type: "Pirólisis Térmica de Azúcares",
    color: "cyan",
    realWorldExample: "Caramelo de azúcar de mesa, dulce de leche, flan",
    steps: [
      {
        title: "1. Fusión e Inversión Térmica",
        chemicalFormula: "Sacarosa (160–180 °C) → D-Glucosa + D-Fructosa",
        description: "A alta temperatura y sin presencia de compuestos nitrogenados, el enlace glucosídico se rompe por pirólisis térmica directa.",
        temperature: "160 °C",
        visualNote: "El azúcar blanco sólido se vuelve jarabe transparente fluido.",
      },
      {
        title: "2. Enolización y Deshidratación",
        chemicalFormula: "Hexosas - H₂O → Furfurales e hidroximetilfurfural (HMF)",
        description: "Pérdida de moléculas de agua intramoleculares que generan anillos aromáticos de furanos y diacetilo.",
        temperature: "170–185 °C",
        visualNote: "Color amarillo pálido virando a dorado ámbar, olor a mantequilla.",
      },
      {
        title: "3. Polimerización de Polímeros de Caramelo",
        chemicalFormula: "Caramelano (C₁₂H₁₈O₉) → Caramaleno (C₃₆H₅₀O₂₅) → Caramalina",
        description: "Condensación progresiva de monómeros deshidratados en moléculas oligoméricas de peso molecular creciente.",
        temperature: "190–200 °C",
        visualNote: "Color marrón rojizo brillante; sabor dulce agridulce balanceado.",
      },
    ],
  },
];

export default function ChemicalReactionViewer() {
  const [selectedId, setSelectedId] = useState<string>("maillard");
  const [activeStep, setActiveStep] = useState<number>(0);

  const reaction = REACTIONS.find((r) => r.id === selectedId) || REACTIONS[0];
  const step = reaction.steps[activeStep] || reaction.steps[0];

  return (
    <div className="lab-card p-6 sm:p-8 space-y-6">
      
      {/* Header with reaction selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-lab)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-[var(--accent-cyan)] border border-cyan-500/20">
              <Atom className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-[var(--text-primary)] font-mono">
              Laboratorio de Mecanismos de Reacción Química
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Explora paso a paso las rutas moleculares que transforman el sabor, color y estabilidad de los alimentos.
          </p>
        </div>

        {/* Reaction Tabs */}
        <div className="flex flex-wrap gap-2">
          {REACTIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                sound.click();
                setSelectedId(r.id);
                setActiveStep(0);
              }}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border transition-all ${
                selectedId === r.id
                  ? "bg-[var(--accent-cyan)] text-slate-950 border-cyan-400 shadow-sm"
                  : "bg-[var(--bg-input)] text-[var(--text-secondary)] border-[var(--border-lab)] hover:text-[var(--text-primary)]"
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Reaction Dashboard */}
      <div className="space-y-6">
        
        {/* Real world context box */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)] flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--accent-amber)]">Impacto en Alimentos:</span>
            <span className="text-[var(--text-primary)]">{reaction.realWorldExample}</span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] uppercase hidden sm:inline">
            {reaction.type}
          </span>
        </div>

        {/* Step Progression Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {reaction.steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.click();
                setActiveStep(idx);
              }}
              className={`p-3 rounded-xl border text-left transition-all font-mono ${
                activeStep === idx
                  ? "bg-cyan-500/10 border-cyan-400 text-[var(--text-primary)] shadow-sm"
                  : "bg-[var(--bg-card-subtle)] border-[var(--border-lab)] text-[var(--text-secondary)] hover:border-cyan-500/40"
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-cyan-400">Paso {idx + 1}</div>
              <div className="text-xs font-bold truncate mt-1">{s.title.split(":")[0]}</div>
            </button>
          ))}
        </div>

        {/* Active Step Molecular Detail */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-4 shadow-lg">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Ruta Molecular · Paso {activeStep + 1} de {reaction.steps.length}
              </div>
              <h4 className="text-lg font-bold font-mono mt-1 text-slate-100">
                {step.title}
              </h4>
            </div>

            {step.temperature && (
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> {step.temperature}
              </span>
            )}
          </div>

          {/* Chemical Formula Block */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto font-bold shadow-inner">
            {step.chemicalFormula}
          </div>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans font-medium">
            {step.description}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center gap-2 text-xs font-mono text-amber-300">
            <span>🔬 Observación Sensorial:</span>
            <span className="text-slate-200">{step.visualNote}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
