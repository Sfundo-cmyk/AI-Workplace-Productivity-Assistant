import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SendHorizonal, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { runAi } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Ask quick workplace questions and get practical, to-the-point answers from your AI assistant.",
      },
      { property: "og:title", content: "AI Workplace Chatbot" },
      {
        property: "og:description",
        content: "A general-purpose assistant for quick questions at work.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const call = useServerFn(runAi);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const result = await call({ data: { tool: "chat", messages: next.slice(-20) } });
      setMessages([...next, { role: "assistant", content: result.text }]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="AI Chatbot"
        description="Your general-purpose workplace assistant — ask about wording, priorities, processes or anything else."
      />

      <section className="surface-panel flex h-[60vh] min-h-[420px] flex-col rounded-2xl">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && !loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              Ask something like "How do I politely chase an overdue approval?"
            </div>
          ) : null}

          {messages.map((message, index) => (
            <div
              key={index}
              className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                  message.role === "user"
                    ? "bg-gradient-ember text-primary-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading ? (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            </div>
          ) : null}

          <div ref={endRef} />
        </div>

        <div className="flex items-end gap-2 border-t border-border p-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={1}
            placeholder="Ask your assistant…"
            className="max-h-40 min-h-11 resize-none bg-background/40"
          />
          <Button
            variant="ember"
            size="icon"
            aria-label="Send message"
            disabled={!input.trim() || loading}
            onClick={send}
          >
            <SendHorizonal />
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
