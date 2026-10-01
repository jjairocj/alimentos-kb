'use client';

import React, { useMemo } from 'react';
import { Marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  stripTopTitle?: boolean;
}

export default function MarkdownRenderer({ 
  content, 
  className = '', 
  stripTopTitle = true 
}: MarkdownRendererProps) {
  const processedHtml = useMemo(() => {
    if (!content) return '';

    let text = content;

    // 1. Remove leading Wiki.js metadata blockquote (e.g. > **Tipo:** ... {.is-info})
    text = text.replace(/^>\s*\*\*Tipo:\*\*[\s\S]*?(?:\{\.is-[a-z]+\}\n*|\n\n+)/i, '');

    // 2. Remove redundant initial # Heading if requested
    if (stripTopTitle) {
      text = text.replace(/^#\s+[^\n]+\n+/m, '');
    }

    // 3. Remove Wiki.js callout tags
    text = text.replace(/\{(\.is-[a-z]+)\}/g, '');

    // 4. Transform GitHub-style blockquote alerts: [!IMPORTANT], [!NOTE], [!TIP], [!WARNING], [!CAUTION]
    text = text.replace(
      />\s*\[!IMPORTANT\]\s*\n((?:>.*\n?)*)/gi,
      (match, body) => {
        const cleanBody = body.replace(/^>\s?/gm, '').trim();
        return `\n<div class="scientific-callout scientific-callout-amber my-6"><div class="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-400 uppercase tracking-wider mb-2"><span>⚠️</span> Principio Crítico / Diferencia Clave</div><div class="text-sm sm:text-base leading-relaxed text-[var(--text-primary)]">\n\n${cleanBody}\n\n</div></div>\n`;
      }
    );

    text = text.replace(
      />\s*\[!NOTE\]\s*\n((?:>.*\n?)*)/gi,
      (match, body) => {
        const cleanBody = body.replace(/^>\s?/gm, '').trim();
        return `\n<div class="scientific-callout scientific-callout-cyan my-6"><div class="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2"><span>ℹ️</span> Nota Científica de Referencia</div><div class="text-sm sm:text-base leading-relaxed text-[var(--text-primary)]">\n\n${cleanBody}\n\n</div></div>\n`;
      }
    );

    text = text.replace(
      />\s*\[!TIP\]\s*\n((?:>.*\n?)*)/gi,
      (match, body) => {
        const cleanBody = body.replace(/^>\s?/gm, '').trim();
        return `\n<div class="scientific-callout scientific-callout-emerald my-6"><div class="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2"><span>💡</span> Regla Práctica y Aplicación</div><div class="text-sm sm:text-base leading-relaxed text-[var(--text-primary)]">\n\n${cleanBody}\n\n</div></div>\n`;
      }
    );

    text = text.replace(
      />\s*\[!WARNING\]\s*\n((?:>.*\n?)*)/gi,
      (match, body) => {
        const cleanBody = body.replace(/^>\s?/gm, '').trim();
        return `\n<div class="scientific-callout scientific-callout-rose my-6"><div class="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-400 uppercase tracking-wider mb-2"><span>🚨</span> Alerta Toxicológica / Límite de Seguridad</div><div class="text-sm sm:text-base leading-relaxed text-[var(--text-primary)]">\n\n${cleanBody}\n\n</div></div>\n`;
      }
    );

    // 5. Format "En una frase:" into an elegant executive summary callout
    text = text.replace(
      /\*\*En una frase:\*\*\s*(.+)/g,
      '<div class="scientific-callout scientific-callout-cyan my-6"><div class="flex items-center gap-2 font-mono text-xs font-bold text-[var(--accent-cyan)] uppercase tracking-wider mb-1.5"><span class="text-sm">💡</span> Definición Ejecutiva</div><p class="text-sm sm:text-base font-medium text-[var(--text-primary)] leading-relaxed mb-0">$1</p></div>'
    );

    // 6. Format LaTeX display math $$ ... $$
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
      let clean = formula
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
        .replace(/\\text\{([^}]+)\}/g, '$1')
        .replace(/\\approx/g, '≈')
        .replace(/\\le/g, '≤')
        .replace(/\\ge/g, '≥')
        .replace(/\\times/g, '×')
        .trim();
      return `<div class="my-6 p-4 rounded-xl bg-slate-950/80 border border-cyan-800/40 text-center font-mono text-cyan-300 text-sm sm:text-base tracking-wide shadow-inner overflow-x-auto">${clean}</div>`;
    });

    // 7. Replace LaTeX-like mathematical & chemical symbols
    text = text
      .replaceAll('$\\delta^-$', '<span class="font-mono text-cyan-400 font-bold" title="Carga parcial negativa">δ⁻</span>')
      .replaceAll('$\\delta^+$', '<span class="font-mono text-amber-400 font-bold" title="Carga parcial positiva">δ⁺</span>')
      .replaceAll('$\\rightarrow$', '<span class="font-bold text-cyan-400 mx-1.5 text-base">→</span>')
      .replaceAll('$Na^+$', '<span class="font-mono text-emerald-400 font-bold">Na⁺</span>')
      .replaceAll('$Cl^-$', '<span class="font-mono text-emerald-400 font-bold">Cl⁻</span>')
      .replaceAll('$H_2O$', 'H₂O')
      .replaceAll('$CO_2$', 'CO₂')
      .replaceAll('$O_2$', 'O₂')
      .replaceAll('$a_w$', '<span class="font-mono font-semibold text-cyan-400">a<sub>w</sub></span>')
      .replaceAll('$D_{121.1}$', '<span class="font-mono font-semibold text-amber-400">D<sub>121.1</sub></span>')
      .replaceAll('$F_0$', '<span class="font-mono font-semibold text-cyan-400">F<sub>0</sub></span>')
      .replaceAll('$\\approx$', '≈')
      .replaceAll('$\\sim$', '~');

    // 8. Transform evidence scale tokens into rich colored badges
    const evidenceBadges: Record<string, string> = {
      '〔Establecido〕': '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono tracking-wider ml-1 mr-1">〔Establecido〕</span>',
      '〔Sólido〕': '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-mono tracking-wider ml-1 mr-1">〔Sólido〕</span>',
      '〔Limitado〕': '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono tracking-wider ml-1 mr-1">〔Limitado〕</span>',
      '〔Contradictorio〕': '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30 font-mono tracking-wider ml-1 mr-1">〔Contradictorio〕</span>',
      '〔Hipótesis〕': '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 font-mono tracking-wider ml-1 mr-1">〔Hipótesis〕</span>',
      '〔Opinión〕': '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30 font-mono tracking-wider ml-1 mr-1">〔Opinión〕</span>',
      '〔Marketing〕': '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 font-mono tracking-wider ml-1 mr-1">〔Marketing〕</span>',
    };

    for (const [key, badgeHtml] of Object.entries(evidenceBadges)) {
      text = text.replaceAll(key, badgeHtml);
    }

    // 9. Format footnotes: [^1] -> <sup>[1]</sup>
    text = text.replace(/\[\^(\d+)\]/g, '<sup class="font-mono text-cyan-400 font-bold ml-0.5 cursor-pointer" title="Cita científica [$1]">[$1]</sup>');

    // 10. Normalize internal links (remove /alimentos/ prefix if present)
    text = text.replace(/\]\(\/alimentos\//g, '](/');
    text = text.replace(/\]\(\/…\)/g, '](#');

    // 11. Configure marked
    const markedInstance = new Marked({
      gfm: true,
      breaks: false,
    });

    const rawHtml = markedInstance.parse(text) as string;

    // Post-process table wrappers and links
    let styledHtml = rawHtml
      .replace(/<table>/g, '<div class="overflow-x-auto my-6"><table class="w-full text-left text-sm border-collapse border border-[var(--border-lab)]">')
      .replace(/<\/table>/g, '</table></div>')
      .replace(/<a /g, '<a class="text-[var(--accent-cyan)] hover:underline font-semibold inline-flex items-center gap-0.5" ');

    return styledHtml;
  }, [content, stripTopTitle]);

  return (
    <div
      className={`scientific-content ${className}`}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
