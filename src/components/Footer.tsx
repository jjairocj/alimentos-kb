import React from "react";
import Link from "next/link";
import { FlaskConical, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-lab)] bg-[var(--bg-card)]/50 mt-16 text-xs font-mono transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-[var(--accent-cyan)]" />
              <span className="font-bold text-sm text-[var(--text-primary)]">
                Ciencia & Química de los Alimentos
              </span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed font-sans max-w-md">
              Base de conocimiento científico personal de libre acceso. Alfabetización científica avanzada para comprender la composición molecular, transformaciones por procesamiento, digestión, toxicología y regulación comparada de lo que comemos.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Estándar de evidencia con fuentes verificadas (DOI, PubMed, Codex, EFSA, FDA, INVIMA).</span>
            </div>
          </div>

          {/* Quick Sections */}
          <div className="space-y-2">
            <div className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[11px]">
              Exploración
            </div>
            <ul className="space-y-1.5 text-[var(--text-secondary)]">
              <li>
                <Link href="/modulos" className="hover:text-[var(--accent-cyan)] transition-colors">
                  28 Módulos de Estudio
                </Link>
              </li>
              <li>
                <Link href="/conceptos" className="hover:text-[var(--accent-cyan)] transition-colors">
                  249 Conceptos Científicos
                </Link>
              </li>
              <li>
                <Link href="/ingredientes" className="hover:text-[var(--accent-cyan)] transition-colors">
                  Aditivos & E-Numbers
                </Link>
              </li>
              <li>
                <Link href="/laboratorio" className="hover:text-[var(--accent-cyan)] transition-colors">
                  Laboratorio & Calculadoras
                </Link>
              </li>
            </ul>
          </div>

          {/* Regulatory & Scientific */}
          <div className="space-y-2">
            <div className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[11px]">
              Evidencia & Normas
            </div>
            <ul className="space-y-1.5 text-[var(--text-secondary)]">
              <li>
                <Link href="/mitos" className="hover:text-[var(--accent-cyan)] transition-colors">
                  Mitos & Desmentidos
                </Link>
              </li>
              <li>
                <Link href="/regulacion" className="hover:text-[var(--accent-cyan)] transition-colors">
                  Matriz Regulatoria (CO/Codex/UE/USA)
                </Link>
              </li>
              <li>
                <Link href="/laboratorio#sellos" className="hover:text-[var(--accent-cyan)] transition-colors">
                  Sellos Res. 2492/2022
                </Link>
              </li>
              <li>
                <Link href="/laboratorio#atwater" className="hover:text-[var(--accent-cyan)] transition-colors">
                  Calculadora Atwater
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with User Attribution */}
        <div className="pt-8 border-t border-[var(--border-lab)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-muted)]">
          <div>
            Diseñado con rigor científico y amor por{" "}
            <span className="font-bold text-[var(--text-primary)]">
              Jhon Jairo Cruz Jiménez
            </span>
          </div>

          <div className="text-center sm:text-right">
            Proyecto educativo de libre acceso · Sin fines comerciales ni consejo clínico.
          </div>
        </div>

      </div>
    </footer>
  );
}
