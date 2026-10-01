import React from "react";

export type EvidenceLevel =
  | "establecido"
  | "solido"
  | "limitado"
  | "contradictorio"
  | "hipotesis"
  | "opinion"
  | "marketing";

interface EvidenceBadgeProps {
  level: string;
  size?: "sm" | "md" | "lg";
  showExplanation?: boolean;
}

const BADGE_CONFIG: Record<
  string,
  { label: string; desc: string; bg: string; text: string; border: string; icon: string }
> = {
  establecido: {
    label: "〔Establecido〕",
    desc: "Múltiples ECA y metaanálisis consistentes con mecanismo demostrado.",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    icon: "🛡️",
  },
  solido: {
    label: "〔Sólido〕",
    desc: "Ensayos clínicos controlados de buena calidad con resultados convergentes.",
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    border: "border-teal-500/30",
    icon: "🔬",
  },
  limitado: {
    label: "〔Limitado〕",
    desc: "Estudios observacionales o ensayos pequeños con variables confusoras.",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    icon: "⚠️",
  },
  contradictorio: {
    label: "〔Contradictorio〕",
    desc: "Estudios de calidad similar muestran resultados opuestos o no concluyentes.",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/30",
    icon: "⚖️",
  },
  hipotesis: {
    label: "〔Hipótesis〕",
    desc: "Mecanismo biológico propuesto o modelos in vitro / roedores sin réplica humana.",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
    icon: "💡",
  },
  opinion: {
    label: "〔Opinión〕",
    desc: "Postura narrativa de expertos o consenso sin respaldo en datos primarios.",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/30",
    icon: "💬",
  },
  marketing: {
    label: "〔Marketing〕",
    desc: "Afirmación comercial sin evidencia científica metodológica comprobable.",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
    icon: "📢",
  },
};

export default function EvidenceBadge({ level, size = "md", showExplanation = false }: EvidenceBadgeProps) {
  const norm = level.toLowerCase().replace(/[^a-z]/g, "");
  const config = BADGE_CONFIG[norm] || {
    label: `〔${level}〕`,
    desc: "Nivel de evidencia sin clasificar.",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/30",
    icon: "📄",
  };

  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2 py-0.5"
      : size === "lg"
      ? "text-sm px-3.5 py-1.5"
      : "text-xs px-2.5 py-1";

  if (showExplanation) {
    return (
      <div className={`inline-flex flex-col p-2.5 rounded-xl border ${config.bg} ${config.border} max-w-xs text-left`}>
        <div className={`inline-flex items-center gap-1.5 font-mono font-bold text-xs ${config.text}`}>
          <span>{config.icon}</span>
          <span>{config.label}</span>
        </div>
        <div className="text-[11px] text-[var(--text-secondary)] mt-1 leading-snug">
          {config.desc}
        </div>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold rounded-lg border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
      title={`${config.label}: ${config.desc}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
