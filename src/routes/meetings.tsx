import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Loader2 } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAiTool } from "@/hooks/use-ai-tool";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get key decisions, action items with owners, and deadlines in seconds.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn messy transcripts into decisions, action items and deadlines.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const { output, setOutput, loading, generate } = useAiTool("meeting");

  return (
    <AppShell>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste a transcript or your rough notes. You'll get key decisions, action items with owners, and deadlines — structured and editable."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-panel space-y-4 rounded-2xl p-5">
          <div className="space-y-2">
            <Label htmlFor="notes">Raw meeting notes or transcript</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={16}
              placeholder="Paste everything — half-sentences and typos are fine."
            />
          </div>

          <Button
            variant="ember"
            className="w-full"
            disabled={!notes.trim() || loading}
            onClick={() => generate({ notes })}
          >
            {loading ? <Loader2 className="animate-spin" /> : <ListChecks />}
            {loading ? "Summarizing…" : "Summarize notes"}
          </Button>
        </section>

        <AiOutput
          title="Structured summary"
          value={output}
          onChange={setOutput}
          loading={loading}
          emptyHint="Key decisions, action items and deadlines will appear here."
        />
      </div>
    </AppShell>
  );
}
