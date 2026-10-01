"use client";

import React, { useState } from "react";
import { sound } from "@/lib/sound";
import confetti from "canvas-confetti";
import { Flame, Calculator, Sparkles, RotateCcw, Info } from "lucide-react";

interface FoodPreset {
  name: string;
  p: number;
  c: number;
  f: number;
  fiber: number;
  alc: number;
}

const PRESETS: FoodPreset[] = [
  { name: "Pechuga de pollo (100g)", p: 31, c: 0, f: 3.6, fiber: 0, alc: 0 },
  { name: "Pan integral (100g)", p: 9, c: 41, f: 3.5, fiber: 7, alc: 0 },
  { name: "Leche entera (100ml)", p: 3.2, c: 4.8, f: 3.6, fiber: 0, alc: 0 },
  { name: "Aguacate Hass (100g)", p: 2, c: 2, f: 15, fiber: 7, alc: 0 },
  { name: "Chocolate oscuro 70% (100g)", p: 7.8, c: 34, f: 43, fiber: 11, alc: 0 },
];

export default function AtwaterCalculator() {
  const [protein, setProtein] = useState<number>(10);
  const [carbs, setCarbs] = useState<number>(25);
  const [fat, setFat] = useState<number>(8);
  const [fiber, setFiber] = useState<number>(3);
  const [alcohol, setAlcohol] = useState<number>(0);

  // Atwater general factors (kcal/g)
  const kcalProtein = protein * 4;
  const kcalCarbs = carbs * 4;
  const kcalFat = fat * 9;
  const kcalFiber = fiber * 2; // FAO / EU general factor for soluble/fermentable fiber
  const kcalAlcohol = alcohol * 7;

  const totalKcal = kcalProtein + kcalCarbs + kcalFat + kcalFiber + kcalAlcohol;
  const totalKj = totalKcal * 4.184;

  const pctProtein = totalKcal > 0 ? (kcalProtein / totalKcal) * 100 : 0;
  const pctCarbs = totalKcal > 0 ? (kcalCarbs / totalKcal) * 100 : 0;
  const pctFat = totalKcal > 0 ? (kcalFat / totalKcal) * 100 : 0;
  const pctFiber = totalKcal > 0 ? (kcalFiber / totalKcal) * 100 : 0;
  const pctAlcohol = totalKcal > 0 ? (kcalAlcohol / totalKcal) * 100 : 0;

  const applyPreset = (preset: FoodPreset) => {
    setProtein(preset.p);
    setCarbs(preset.c);
    setFat(preset.f);
    setFiber(preset.fiber);
    setAlcohol(preset.alc);
  };

  return (
    <div className="lab-card p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-lab)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-[var(--accent-cyan)] border border-cyan-500/20">
              <Calculator className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-[var(--text-primary)] font-mono">
              Calculadora de Energía de Atwater
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Sistema clásico de factores generales (4-4-9-2-7) para el cálculo de energía metabolizable en alimentos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] font-mono">Carga rápida:</span>
          <select
            onChange={(e) => {
              const p = PRESETS.find((pr) => pr.name === e.target.value);
              if (p) applyPreset(p);
            }}
            className="text-xs bg-[var(--bg-input)] text-[var(--text-primary)] border border-[var(--border-lab)] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[var(--accent-cyan)] font-mono"
            defaultValue=""
          >
            <option value="" disabled>Seleccionar alimento...</option>
            {PRESETS.map((pr) => (
              <option key={pr.name} value={pr.name}>
                {pr.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input sliders */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Proteínas */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)]">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Proteínas (4 kcal/g)
              </span>
              <span className="text-[var(--text-primary)] font-bold">{protein} g ({Math.round(kcalProtein)} kcal)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={protein}
              onChange={(e) => setProtein(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Carbohidratos disponibles */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)]">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                Carbohidratos disponibles (4 kcal/g)
              </span>
              <span className="text-[var(--text-primary)] font-bold">{carbs} g ({Math.round(kcalCarbs)} kcal)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={carbs}
              onChange={(e) => setCarbs(parseFloat(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Grasas / Lípidos */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)]">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Grasas / Lípidos (9 kcal/g)
              </span>
              <span className="text-[var(--text-primary)] font-bold">{fat} g ({Math.round(kcalFat)} kcal)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={fat}
              onChange={(e) => setFat(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Fibra dietaria */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)]">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-violet-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                Fibra dietaria fermentable (2 kcal/g)
              </span>
              <span className="text-[var(--text-primary)] font-bold">{fiber} g ({Math.round(kcalFiber)} kcal)</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={fiber}
              onChange={(e) => setFiber(parseFloat(e.target.value))}
              className="w-full accent-violet-500"
            />
          </div>

          {/* Alcohol */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)]">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-rose-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Etanol / Alcohol (7 kcal/g)
              </span>
              <span className="text-[var(--text-primary)] font-bold">{alcohol} g ({Math.round(kcalAlcohol)} kcal)</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={alcohol}
              onChange={(e) => setAlcohol(parseFloat(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

        </div>

        {/* Right: Real-time Calorie Display and Distribution Bar */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-900 border border-cyan-500/30 text-center space-y-2 relative overflow-hidden">
            <div className="text-xs uppercase tracking-wider font-mono text-[var(--accent-cyan)] font-bold">
              Energía Metabolizable Total
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold font-mono text-[var(--text-primary)]">
              {Math.round(totalKcal)} <span className="text-lg text-[var(--text-secondary)] font-normal">kcal</span>
            </div>
            <div className="text-sm font-mono text-emerald-400 font-medium">
              ≈ {Math.round(totalKj)} kJ
            </div>
          </div>

          {/* Distribution Progress Bar */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-[var(--text-secondary)] flex justify-between">
              <span>Distribución Calórica (%)</span>
              <span>100%</span>
            </div>

            <div className="h-4 w-full rounded-full bg-slate-800 flex overflow-hidden p-0.5 gap-0.5 border border-slate-700">
              <div style={{ width: `${pctProtein}%` }} className="bg-emerald-500 rounded-l-full transition-all" title={`Proteínas: ${pctProtein.toFixed(1)}%`} />
              <div style={{ width: `${pctCarbs}%` }} className="bg-cyan-500 transition-all" title={`Carbohidratos: ${pctCarbs.toFixed(1)}%`} />
              <div style={{ width: `${pctFat}%` }} className="bg-amber-500 transition-all" title={`Grasas: ${pctFat.toFixed(1)}%`} />
              <div style={{ width: `${pctFiber}%` }} className="bg-violet-500 transition-all" title={`Fibra: ${pctFiber.toFixed(1)}%`} />
              <div style={{ width: `${pctAlcohol}%` }} className="bg-rose-500 rounded-r-full transition-all" title={`Alcohol: ${pctAlcohol.toFixed(1)}%`} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1 text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Prot: {pctProtein.toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span>Carb: {pctCarbs.toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Grasa: {pctFat.toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Scientific note */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)] text-[11px] text-[var(--text-secondary)] leading-relaxed space-y-1">
            <div className="font-bold text-[var(--text-primary)] flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" /> Nota Científica:
            </div>
            <p>
              El calorímetro de bomba mide calor de combustión bruta (ej: 4.1 kcal/g para glucosa, 5.6 kcal/g para proteína). Atwater corrigió por digestibilidad media y excreción de nitrógeno como urea (-1.25 kcal/g), arrojando el factor fisiológico 4.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
