import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Telescope, Loader2 } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAiTool } from "@/hooks/use-ai-tool";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Summarize a topic or long article into a concise brief with key insights and recommended next steps.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Condense any topic or article into insights and recommendations.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const { output, setOutput, loading, generate } = useAiTool("research");

  return (
    <AppShell>
      <PageHeader
        title="AI Research Assistant"
        description="Enter a topic or paste an article. You'll get a short summary, the key insights, and recommended next steps."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-panel space-y-4 rounded-2xl p-5">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or pasted text</Label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={16}
              placeholder="e.g. Remote onboarding best practices — or paste a full article here."
            />
          </div>

          <Button
            variant="ember"
            className="w-full"
            disabled={!topic.trim() || loading}
            onClick={() => generate({ topic })}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Telescope />}
            {loading ? "Researching…" : "Generate summary"}
          </Button>
        </section>

        <AiOutput
          title="Research brief"
          value={output}
          onChange={setOutput}
          loading={loading}
          emptyHint="Your summary, key insights and recommendations will appear here."
        />
      </div>
    </AppShell>
  );
}
