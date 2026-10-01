"use client";

import React, { useState } from "react";
import { sound } from "@/lib/sound";
import confetti from "canvas-confetti";
import { Flame, Thermometer, ShieldCheck, AlertTriangle, Info } from "lucide-react";

export default function ThermalKineticsSimulator() {
  const [temperature, setTemperature] = useState<number>(121.1); // °C
  const [holdingTime, setHoldingTime] = useState<number>(3.0); // minutes
  const [initialSpores, setInitialSpores] = useState<number>(12); // 10^12

  // Reference for Clostridium botulinum
  const D_ref = 0.21; // minutes at 121.1 °C
  const z_value = 10.0; // °C

  // Calculate D at current temperature: D_T = D_ref * 10^((121.1 - T) / z)
  const D_current = D_ref * Math.pow(10, (121.1 - temperature) / z_value);

  // Lethal rate: L = 10^((T - 121.1) / z)
  const lethalRate = Math.pow(10, (temperature - 121.1) / z_value);

  // Equivalent F0 lethality (minutes at 121.1 °C): F0 = L * time
  const F0 = lethalRate * holdingTime;

  // Log reductions achieved: reductions = time / D_current
  const logReductions = holdingTime / D_current;

  // Surviving spore exponent: initial - logReductions
  const survivingLog = initialSpores - logReductions;
  const is12DAchieved = logReductions >= 12;

  return (
    <div className="lab-card p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-lab)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Thermometer className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-[var(--text-primary)] font-mono">
              Simulador de Cinética Térmica y Esterilización (D, z, F₀)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Modela la inactivación de esporas de <em>Clostridium botulinum</em> en alimentos de baja acidez (pH &gt; 4.6).
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setTemperature(121.1);
              setHoldingTime(2.52); // Exactly 12D: 12 * 0.21 = 2.52 min
              sound.click();
            }}
            className="text-xs font-mono px-3 py-1.5 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-primary)] border border-[var(--border-lab)] font-bold"
          >
            Fijar 12D Botulinum Cook
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input controls */}
        <div className="lg:col-span-6 space-y-5">
          
          <div className="space-y-2 p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)] font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[var(--text-primary)]">Temperatura de Retorta / Autoclave:</span>
              <span className="text-rose-400 font-bold text-sm">{temperature.toFixed(1)} °C</span>
            </div>
            <input
              type="range"
              min="100"
              max="135"
              step="0.5"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
              <span>100 °C (Ebullición)</span>
              <span>121.1 °C (Estándar autoclave)</span>
              <span>135 °C (UHT)</span>
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)] font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[var(--text-primary)]">Tiempo de Sostenimiento Isotérmico:</span>
              <span className="text-amber-400 font-bold text-sm">{holdingTime.toFixed(2)} min</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="20"
              step="0.1"
              value={holdingTime}
              onChange={(e) => setHoldingTime(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
              <span>0.1 min</span>
              <span>10 min</span>
              <span>20 min</span>
            </div>
          </div>

          {/* Reference organism parameters */}
          <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)] text-xs font-mono space-y-2">
            <div className="font-bold text-[var(--text-primary)]">Parámetros del Microorganismo Patógeno:</div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--text-secondary)]">
              <div>• D₁₂₁.₁°C = <strong>0.21 min</strong></div>
              <div>• Valor z = <strong>10.0 °C</strong></div>
              <div>• Carga inicial = <strong>10¹² esporas</strong></div>
              <div>• Reducción objetivo = <strong>12D</strong></div>
            </div>
          </div>

        </div>

        {/* Right: Real-time kinetics results & Safety Assessment */}
        <div className="lg:col-span-6 space-y-5">
          
          <div className="grid grid-cols-2 gap-3 font-mono text-center">
            <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)]">
              <div className="text-[10px] text-[var(--text-muted)] uppercase">Valor D a {temperature.toFixed(1)}°C</div>
              <div className="text-2xl font-bold text-[var(--accent-cyan)] mt-1">
                {D_current < 0.01 ? D_current.toExponential(2) : D_current.toFixed(2)}
              </div>
              <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">minutos / ciclo log</div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)]">
              <div className="text-[10px] text-[var(--text-muted)] uppercase">Letalidad Equivalente F₀</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                {F0.toFixed(2)}
              </div>
              <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">minutos a 121.1°C</div>
            </div>
          </div>

          {/* Log Reductions Status */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 text-white space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span>Reducciones Decimales Logarítmicas:</span>
              <span className="font-bold text-emerald-400 text-sm">{logReductions.toFixed(1)} D</span>
            </div>

            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                style={{ width: `${Math.min(100, (logReductions / 12) * 100)}%` }}
                className={`h-full transition-all rounded-full ${
                  is12DAchieved ? "bg-emerald-500 shadow-sm" : "bg-amber-500"
                }`}
              />
            </div>

            <div className="flex items-center gap-3 pt-2 text-xs font-mono">
              {is12DAchieved ? (
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>¡Esterilidad Comercial Cumplida! (Criterio 12D alcanzado)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>Sub-esterilización: Faltan {(12 - logReductions).toFixed(1)} reducciones logarítmicas.</span>
                </div>
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
              Esporas sobrevivientes estimadas: <strong>10^{survivingLog.toFixed(1)}</strong> por lote de 10¹² latas.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-lab)] text-[11px] text-[var(--text-secondary)] leading-relaxed space-y-1">
            <div className="font-bold text-[var(--text-primary)] flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-rose-400" /> Fundamento de Microbiología Industrial:
            </div>
            <p>
              El criterio de 12D garantiza que si una lata parte con una contaminación de 1 espora, la probabilidad de que sobreviva una espora es de 1 en un billón (10⁻¹²), garantizando inocuidad pública contra la neurotoxina botulínica.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
