import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wand2, Loader2 } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAiTool } from "@/hooks/use-ai-tool";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate formal, friendly or persuasive work emails from a few key points, then edit and copy them.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Turn bullet points into a polished, ready-to-send business email.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [context, setContext] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState("Formal");
  const { output, setOutput, loading, generate } = useAiTool("email");

  const canGenerate = points.trim().length > 0 && !loading;

  return (
    <AppShell>
      <PageHeader
        title="Smart Email Generator"
        description="Describe who you're writing to and the points you need to make. The assistant drafts the email — you stay in control of the final wording."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-panel space-y-4 rounded-2xl p-5">
          <div className="space-y-2">
            <Label htmlFor="context">Recipient &amp; context</Label>
            <Input
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g.客户 Sarah at Northwind, following up after Tuesday's demo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Key points</Label>
            <Textarea
              id="points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              rows={8}
              placeholder={"Thank her for the time\nShare updated pricing\nAsk for a decision by Friday"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ember"
            className="w-full"
            disabled={!canGenerate}
            onClick={() => generate({ context, points, tone })}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
            {loading ? "Generating…" : "Generate email"}
          </Button>
        </section>

        <AiOutput
          title="Generated email"
          value={output}
          onChange={setOutput}
          loading={loading}
          emptyHint="Your drafted email will appear here, fully editable before you copy it."
        />
      </div>
    </AppShell>
  );
}
