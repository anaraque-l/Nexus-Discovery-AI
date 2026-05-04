import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

export const AboutDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="glass max-w-xl">
      <DialogHeader>
        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center mb-2 glow-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <DialogTitle className="text-xl">Sobre a Ferramenta</DialogTitle>
        <DialogDescription className="text-base text-foreground/80 leading-relaxed pt-2">
          Este agente atua como um facilitador técnico no processo de Discovery de Produtos.
          Seu objetivo é ajudar a equipe a traduzir desafios de negócio em soluções de tecnologia,
          fazendo a ponte direta para as esteiras de Engenharia de Software (Dev) e Inteligência
          de Dados (Data). A ferramenta não substitui um profissional, apenas auxilia na execução
          dos processos.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);
