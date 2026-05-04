import { Sparkles, User, Layers } from "lucide-react";

export interface ChatMessageData {
  role: "user" | "assistant";
  content: string;
  phase_suggestion?: string;
  internal_analysis?: string;
}

export const ChatMessage = ({ message }: { message: ChatMessageData }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
          isUser ? "bg-primary" : "glass"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Sparkles className="h-4 w-4 text-primary" />
        )}
      </div>
      <div className={`flex flex-col gap-1.5 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        {!isUser && message.phase_suggestion && (
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
              <Layers className="h-3 w-3" />
              {message.phase_suggestion}
            </span>
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "glass text-foreground rounded-tl-sm"
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};
