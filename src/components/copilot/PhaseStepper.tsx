import { Stethoscope, LayoutTemplate, BriefcaseBusiness, Check } from "lucide-react";

const PHASES = [
  { id: 1, key: "diagnosis", label: "Phase 1: Diagnosis", Icon: Stethoscope },
  { id: 2, key: "architecture", label: "Phase 2: Architecture", Icon: LayoutTemplate },
  { id: 3, key: "business", label: "Phase 3: Business Case", Icon: BriefcaseBusiness },
];

export const detectPhase = (suggestion?: string): number => {
  if (!suggestion) return 1;
  const s = suggestion.toLowerCase();
  if (s.includes("3") || s.includes("business") || s.includes("negócio") || s.includes("negocio") || s.includes("case")) return 3;
  if (s.includes("2") || s.includes("arquitet") || s.includes("architect") || s.includes("solu")) return 2;
  return 1;
};

export const PhaseStepper = ({ current }: { current: number }) => {
  return (
    <div className="w-full px-6 py-4 border-b border-border glass">
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        {PHASES.map((p, idx) => {
          const isDone = current > p.id;
          const isActive = current === p.id;
          const { Icon } = p;
          return (
            <div key={p.id} className="flex items-center flex-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary glow-primary"
                      : isDone
                      ? "bg-primary/20 text-primary border-primary/40"
                      : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] uppercase tracking-wider font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    Etapa {p.id}
                  </p>
                  <p className={`text-xs font-medium truncate ${isActive ? "text-foreground" : isDone ? "text-foreground/80" : "text-muted-foreground"}`}>
                    {p.label}
                  </p>
                </div>
              </div>
              {idx < PHASES.length - 1 && (
                <div className={`flex-1 h-px mx-3 ${current > p.id ? "bg-primary/60" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
