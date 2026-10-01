"use client";

import React, { useState } from "react";
import { sound } from "@/lib/sound";
import confetti from "canvas-confetti";
import { ShieldAlert, CheckCircle, Info, Sparkles } from "lucide-react";

interface SupermarketItem {
  name: string;
  isLiquid: boolean;
  calories: number;
  sugars: number;
  satFat: number;
  transFat: number;
  sodium: number;
  hasSweetener: boolean;
}

const SUPERMARKET_PRESETS: SupermarketItem[] = [
  {
    name: "Gaseosa cola tradicional (100ml)",
    isLiquid: true,
    calories: 42,
    sugars: 10.6,
    satFat: 0,
    transFat: 0,
    sodium: 12,
    hasSweetener: false,
  },
  {
    name: "Galletas tipo wafer rellenas (100g)",
    isLiquid: false,
    calories: 510,
    sugars: 38,
    satFat: 14,
    transFat: 0.2,
    sodium: 210,
    hasSweetener: false,
  },
  {
    name: "Bebida láctea 'light' con fruta (100ml)",
    isLiquid: true,
    calories: 38,
    sugars: 3.5,
    satFat: 0.8,
    transFat: 0,
    sodium: 45,
    hasSweetener: true,
  },
  {
    name: "Salchicha tradicional cocida (100g)",
    isLiquid: false,
    calories: 260,
    sugars: 1.5,
    satFat: 8.5,
    transFat: 0.4,
    sodium: 980,
    hasSweetener: false,
  },
];

export default function SellosCalculator() {
  const [isLiquid, setIsLiquid] = useState(false);
  const [calories, setCalories] = useState<number>(250);
  const [sugars, setSugars] = useState<number>(12); // g
  const [satFat, setSatFat] = useState<number>(6); // g
  const [transFat, setTransFat] = useState<number>(0.1); // g
  const [sodium, setSodium] = useState<number>(450); // mg
  const [hasSweetener, setHasSweetener] = useState(false);

  // Regulatory Thresholds (Colombia Res. 2492/2022)
  const sugarKcal = sugars * 4;
  const sugarPct = calories > 0 ? (sugarKcal / calories) * 100 : 0;
  const stampSugars = sugarPct >= 10;

  const satFatKcal = satFat * 9;
  const satFatPct = calories > 0 ? (satFatKcal / calories) * 100 : 0;
  const stampSatFat = satFatPct >= 10;

  const transFatKcal = transFat * 9;
  const transFatPct = calories > 0 ? (transFatKcal / calories) * 100 : 0;
  const stampTransFat = transFatPct >= 1;

  // Sodium: >= 1mg/kcal OR >= 300mg/100g (solid) or >= 100mg/100ml (liquid)
  const sodiumRatio = calories > 0 ? sodium / calories : 0;
  const sodiumAbsoluteLimit = isLiquid ? 100 : 300;
  const stampSodium = sodiumRatio >= 1 || sodium >= sodiumAbsoluteLimit;

  const stampsCount =
    (stampSugars ? 1 : 0) +
    (stampSatFat ? 1 : 0) +
    (stampTransFat ? 1 : 0) +
    (stampSodium ? 1 : 0) +
    (hasSweetener ? 1 : 0);

  const applyItem = (item: SupermarketItem) => {
    setIsLiquid(item.isLiquid);
    setCalories(item.calories);
    setSugars(item.sugars);
    setSatFat(item.satFat);
    setTransFat(item.transFat);
    setSodium(item.sodium);
    setHasSweetener(item.hasSweetener);
    sound.click();
  };

  return (
    <div className="lab-card p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-lab)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-[var(--accent-amber)] border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-[var(--text-primary)] font-mono">
              Calculadora de Sellos Frontales (Resolución 2492/2022 Colombia)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Simula si un alimento o bebida requiere sellos octogonales negros de advertencia según la ley colombiana.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] font-mono">Ejemplos reales:</span>
          <select
            onChange={(e) => {
              const it = SUPERMARKET_PRESETS.find((p) => p.name === e.target.value);
              if (it) applyItem(it);
            }}
            className="text-xs bg-[var(--bg-input)] text-[var(--text-primary)] border border-[var(--border-lab)] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[var(--accent-amber)] font-mono"
            defaultValue=""
          >
            <option value="" disabled>Cargar producto...</option>
            {SUPERMARKET_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Nutritional inputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-3 p-2 bg-[var(--bg-card-subtle)] rounded-xl border border-[var(--border-lab)] text-xs font-mono">
            <span className="text-[var(--text-secondary)]">Formato del producto:</span>
            <button
              onClick={() => setIsLiquid(false)}
              className={`px-3 py-1 rounded-lg font-bold ${!isLiquid ? "bg-amber-500 text-slate-950" : "text-[var(--text-secondary)]"}`}
            >
              Sólido (100g)
            </button>
            <button
              onClick={() => setIsLiquid(true)}
              className={`px-3 py-1 rounded-lg font-bold ${isLiquid ? "bg-amber-500 text-slate-950" : "text-[var(--text-secondary)]"}`}
            >
              Líquido (100ml)
            </button>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="flex justify-between text-[var(--text-secondary)] mb-1">
                <span>Calorías totales (kcal/100g):</span>
                <span className="font-bold text-[var(--text-primary)]">{calories} kcal</span>
              </label>
              <input
                type="number"
                min="1"
                value={calories}
                onChange={(e) => setCalories(parseFloat(e.target.value) || 0)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-lab)] rounded-xl p-2.5 text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="flex justify-between text-[var(--text-secondary)] mb-1">
                <span>Azúcares libres / añadidos (g):</span>
                <span className="font-bold text-[var(--text-primary)]">{sugars} g ({sugarPct.toFixed(1)}% kcal)</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={sugars}
                onChange={(e) => setSugars(parseFloat(e.target.value) || 0)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-lab)] rounded-xl p-2.5 text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="flex justify-between text-[var(--text-secondary)] mb-1">
                <span>Grasa saturada (g):</span>
                <span className="font-bold text-[var(--text-primary)]">{satFat} g ({satFatPct.toFixed(1)}% kcal)</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={satFat}
                onChange={(e) => setSatFat(parseFloat(e.target.value) || 0)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-lab)] rounded-xl p-2.5 text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="flex justify-between text-[var(--text-secondary)] mb-1">
                <span>Grasas trans (g):</span>
                <span className="font-bold text-[var(--text-primary)]">{transFat} g ({transFatPct.toFixed(1)}% kcal)</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.05"
                value={transFat}
                onChange={(e) => setTransFat(parseFloat(e.target.value) || 0)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-lab)] rounded-xl p-2.5 text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="flex justify-between text-[var(--text-secondary)] mb-1">
                <span>Sodio (mg):</span>
                <span className="font-bold text-[var(--text-primary)]">{sodium} mg ({sodiumRatio.toFixed(2)} mg/kcal)</span>
              </label>
              <input
                type="number"
                min="0"
                value={sodium}
                onChange={(e) => setSodium(parseFloat(e.target.value) || 0)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-lab)] rounded-xl p-2.5 text-[var(--text-primary)]"
              />
            </div>

            <label className="flex items-center gap-3 p-3 bg-[var(--bg-card-subtle)] rounded-xl border border-[var(--border-lab)] cursor-pointer">
              <input
                type="checkbox"
                checked={hasSweetener}
                onChange={(e) => setHasSweetener(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="text-[var(--text-primary)] font-medium">
                ¿Contiene edulcorantes añadidos? (Sucralosa, aspartamo, stevia, etc.)
              </span>
            </label>
          </div>
        </div>

        {/* Right: Rendered Stamp Mockup on Simulated Package */}
        <div className="lg:col-span-6 space-y-5">
          
          <div className="p-6 rounded-2xl bg-slate-900 border-2 border-slate-700 min-h-[320px] flex flex-col justify-between relative shadow-lg text-white">
            <div className="flex justify-between items-center text-xs font-mono opacity-60 pb-2 border-b border-slate-800">
              <span>FRONTAL DEL ENVASE SIMULADO</span>
              <span>{stampsCount} SELLO(S) APLICABLE(S)</span>
            </div>

            {/* Stamp Row */}
            <div className="py-6 flex flex-wrap gap-3 items-center justify-center">
              {stampSugars && (
                <div className="w-24 h-24 bg-black border-2 border-white rounded-md flex flex-col items-center justify-center p-1 text-center shadow-md animate-in zoom-in-75">
                  <div className="text-[9px] font-extrabold uppercase tracking-tighter leading-none">EXCESO EN</div>
                  <div className="text-xs font-black uppercase tracking-tight mt-0.5">AZÚCARES</div>
                  <div className="text-[7px] opacity-70 mt-1">MINSALUD</div>
                </div>
              )}

              {stampSatFat && (
                <div className="w-24 h-24 bg-black border-2 border-white rounded-md flex flex-col items-center justify-center p-1 text-center shadow-md animate-in zoom-in-75">
                  <div className="text-[9px] font-extrabold uppercase tracking-tighter leading-none">EXCESO EN</div>
                  <div className="text-[10px] font-black uppercase tracking-tight mt-0.5">GRASA SATURADA</div>
                  <div className="text-[7px] opacity-70 mt-1">MINSALUD</div>
                </div>
              )}

              {stampTransFat && (
                <div className="w-24 h-24 bg-black border-2 border-white rounded-md flex flex-col items-center justify-center p-1 text-center shadow-md animate-in zoom-in-75">
                  <div className="text-[9px] font-extrabold uppercase tracking-tighter leading-none">EXCESO EN</div>
                  <div className="text-[10px] font-black uppercase tracking-tight mt-0.5">GRASAS TRANS</div>
                  <div className="text-[7px] opacity-70 mt-1">MINSALUD</div>
                </div>
              )}

              {stampSodium && (
                <div className="w-24 h-24 bg-black border-2 border-white rounded-md flex flex-col items-center justify-center p-1 text-center shadow-md animate-in zoom-in-75">
                  <div className="text-[9px] font-extrabold uppercase tracking-tighter leading-none">EXCESO EN</div>
                  <div className="text-xs font-black uppercase tracking-tight mt-0.5">SODIO</div>
                  <div className="text-[7px] opacity-70 mt-1">MINSALUD</div>
                </div>
              )}

              {hasSweetener && (
                <div className="w-48 py-2 px-3 bg-black border-2 border-white rounded-md text-center shadow-md animate-in zoom-in-75">
                  <div className="text-[10px] font-black uppercase tracking-tight leading-tight">CONTIENE EDULCORANTES</div>
                  <div className="text-[8px] opacity-80">NO RECOMENDABLE EN NIÑOS</div>
                </div>
              )}

              {stampsCount === 0 && (
                <div className="text-center py-8 space-y-2 text-emerald-400">
                  <CheckCircle className="w-12 h-12 mx-auto" />
                  <div className="text-sm font-bold font-mono">Sin sellos de advertencia obligatorios</div>
                  <p className="text-xs text-slate-400 max-w-xs">
                    El alimento cumple con todos los umbrales máximos establecidos por la Resolución 2492 de 2022.
                  </p>
                </div>
              )}
            </div>

            {/* Threshold mathematical details */}
            <div className="text-[10px] font-mono opacity-80 pt-2 border-t border-slate-800 space-y-1">
              <div>• Azúcar: {sugarPct.toFixed(1)}% (Límite ≥ 10%) → {stampSugars ? "🔴 Exceso" : "🟢 Cumple"}</div>
              <div>• Grasa Sat: {satFatPct.toFixed(1)}% (Límite ≥ 10%) → {stampSatFat ? "🔴 Exceso" : "🟢 Cumple"}</div>
              <div>• Sodio: {sodium} mg ({sodiumRatio.toFixed(2)} mg/kcal, Límite ≥ 1 o ≥ {sodiumAbsoluteLimit} mg) → {stampSodium ? "🔴 Exceso" : "🟢 Cumple"}</div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
