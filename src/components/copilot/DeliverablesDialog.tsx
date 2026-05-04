import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Plano Essencial",
    items: [
      "Diagnóstico AS-IS (BPMN 2.0)",
      "Business Case executivo",
      "Matriz de riscos resumida",
      "Apresentação final ao C-level",
    ],
  },
  {
    name: "Plano Avançado",
    featured: true,
    items: [
      "Arquitetura de referência (C4 Model)",
      "Business Case + análise de sensibilidade",
      "Matriz de riscos ISO 31000 detalhada",
      "Modelo de governança contínua",
    ],
  },
];

export const DeliverablesDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="glass max-w-3xl">
      <DialogHeader>
        <DialogTitle className="text-xl">Entregáveis</DialogTitle>
      </DialogHeader>
      <div className="grid md:grid-cols-2 gap-4 pt-2">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`rounded-xl p-5 border transition-all ${
              t.featured
                ? "border-primary/50 bg-primary/5 glow-primary"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">{t.name}</h3>
              {t.featured && (
                <span className="text-[10px] uppercase tracking-wider font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded">
                  Premium
                </span>
              )}
            </div>
            <ul className="space-y-2.5">
              {t.items.map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);
