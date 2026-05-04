import { Brain, ShieldCheck, Lock } from "lucide-react";

interface Props {
  analysis?: string;
  phase?: string;
}

export const NexusInsightCard = ({ analysis, phase }: Props) => {
  return (
    <aside className="hidden xl:flex w-[340px] shrink-0 flex-col border-l border-border bg-gradient-to-b from-card/80 to-background/60 backdrop-blur-xl">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center">
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Nexus Strategic Insight</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Lock className="h-2.5 w-2.5" /> Análise técnica confidencial
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
        {phase && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
            <p className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">
              Fase Sugerida
            </p>
            <p className="text-xs text-foreground/90">{phase}</p>
          </div>
        )}

        <div className="rounded-lg border border-border bg-secondary/40 p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <p className="text-[10px] uppercase tracking-wider font-bold text-primary">
                Internal Analysis
              </p>
            </div>
            {analysis ? (
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {analysis}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Aguardando primeira interação para gerar análise técnica do agente Nexus...
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-border p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            Sobre o Nexus
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Camada de raciocínio interno do copiloto. Exibe hipóteses, riscos e direcionadores
            estratégicos identificados — visíveis apenas para o consultor.
          </p>
        </div>
      </div>
    </aside>
  );
};
