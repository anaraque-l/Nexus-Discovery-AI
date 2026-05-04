import { Plus, MessageSquare, FileText, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onNewChat: () => void;
  onOpenDeliverables: () => void;
  onOpenAbout: () => void;
  recentChats: { id: string; title: string }[];
  activeId?: string;
  onSelectChat: (id: string) => void;
}

export const CopilotSidebar = ({
  onNewChat,
  onOpenDeliverables,
  onOpenAbout,
  recentChats,
  activeId,
  onSelectChat,
}: SidebarProps) => {
  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-border bg-sidebar/80 backdrop-blur-xl">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center glow-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">Copiloto Discovery</h1>
            <p className="text-[11px] text-muted-foreground">Tech Product Consulting</p>
          </div>
        </div>
        <Button onClick={onNewChat} className="w-full justify-start gap-2 font-medium">
          <Plus className="h-4 w-4" />
          Novo Diagnóstico
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground px-2 mb-2 font-semibold">
          Conversas Recentes
        </p>
        <div className="space-y-1">
          {recentChats.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectChat(c.id)}
              className={`w-full text-left flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors ${
                activeId === c.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
              <span className="truncate">{c.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Button
          variant="ghost"
          onClick={onOpenDeliverables}
          className="w-full justify-start gap-2 text-sidebar-foreground/90"
        >
          <FileText className="h-4 w-4" />
          Entregáveis
        </Button>
        <Button
          variant="ghost"
          onClick={onOpenAbout}
          className="w-full justify-start gap-2 text-sidebar-foreground/90"
        >
          <Info className="h-4 w-4" />
          Sobre a Ferramenta
        </Button>
      </div>
    </aside>
  );
};
