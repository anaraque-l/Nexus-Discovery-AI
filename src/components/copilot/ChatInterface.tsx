import { useEffect, useMemo, useRef, useState } from "react";
import { Send, FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ChatMessage, ChatMessageData } from "./ChatMessage";
import { PhaseStepper, detectPhase } from "./PhaseStepper";
import { NexusInsightCard } from "./NexusInsightCard";

const API_BASE = "http://127.0.0.1:8000";

const INITIAL_MESSAGE: ChatMessageData = {
  role: "assistant",
  content:
    "Olá! Sou o seu copiloto de Discovery. Qual é o principal desafio operacional ou gargalo técnico que o cliente está enfrentando hoje?",
  phase_suggestion: "Phase 1: Diagnosis",
  internal_analysis: "Coleta de contexto inicial — aguardando primeiros sinais do cliente para mapear hipóteses.",
};

export const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessageData[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const lastAssistant = useMemo(
    () => [...messages].reverse().find((m) => m.role === "assistant"),
    [messages]
  );
  const currentPhase = detectPhase(lastAssistant?.phase_suggestion);
  const assistantTurns = messages.filter((m) => m.role === "assistant").length;
  const showReport = currentPhase >= 3 || assistantTurns >= 4;

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessageData = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: text,
          history: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Falha na resposta do servidor");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.agent_response ?? data.response ?? "(Sem resposta)",
          phase_suggestion: data.phase_suggestion,
          internal_analysis: data.internal_analysis,
        },
      ]);
    } catch (e) {
      toast.error("Erro ao conectar com o agente. Verifique se o backend está ativo em 127.0.0.1:8000.");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (generating) return;
    setGenerating(true);
    const toastId = toast.loading("Gerando Documento...");
    try {
      const res = await fetch(`${API_BASE}/generate-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          analysis: lastAssistant?.internal_analysis ?? "",
          client_name: "Prospect",
        }),
      });
      if (!res.ok) throw new Error("falhou");
      const data = await res.json();
      const filename = data.filename;
      if (!filename) throw new Error("Sem filename");

      const a = document.createElement("a");
      a.href = `${API_BASE}/download-report/${encodeURIComponent(filename)}`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success("Relatório gerado com sucesso!", { id: toastId });
    } catch {
      toast.error("Não foi possível gerar o relatório.", { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col h-full min-w-0">
        <header className="flex items-center justify-between px-6 py-4 border-b border-border glass">
          <div>
            <h2 className="text-base font-semibold">Sessão de Discovery</h2>
            <p className="text-xs text-muted-foreground">Facilitador técnico para tradução negócio → tecnologia</p>
          </div>
          {showReport && (
            <Button onClick={generateReport} disabled={generating} className="gap-2 font-medium glow-primary">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              Download Business Case (PDF)
            </Button>
          )}
        </header>

        <PhaseStepper current={currentPhase} />

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((m, i) => (
              <ChatMessage key={i} message={m} />
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg glass flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
                <div className="glass rounded-2xl px-4 py-2.5 text-sm text-muted-foreground">
                  Pensando...
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border p-4 glass">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 rounded-xl border border-border bg-card/60 p-2 focus-within:border-primary/60 transition-colors">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Descreva o desafio do cliente, o gargalo técnico ou faça uma pergunta..."
                rows={1}
                className="flex-1 min-h-[44px] max-h-40 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
              <Button onClick={send} disabled={loading || !input.trim()} size="icon" className="h-9 w-9 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground text-center mt-2">
              O copiloto auxilia a execução do Discovery — não substitui um profissional.
            </p>
          </div>
        </div>
      </div>

      <NexusInsightCard
        analysis={lastAssistant?.internal_analysis}
        phase={lastAssistant?.phase_suggestion}
      />
    </div>
  );
};
