import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange, Loader2 } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAiTool } from "@/hooks/use-ai-tool";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste your task list and get a prioritized daily or weekly schedule with time estimates you can edit.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Turn a messy to-do list into a realistic, prioritized plan.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [constraints, setConstraints] = useState("");
  const [view, setView] = useState("daily");
  const { output, setOutput, loading, generate } = useAiTool("planner");

  return (
    <AppShell>
      <PageHeader
        title="AI Task Planner"
        description="List your tasks one per line. Add deadlines or priorities if you have them, then choose a daily or weekly plan."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-panel space-y-4 rounded-2xl p-5">
          <div className="space-y-2">
            <Label htmlFor="tasks">Tasks (one per line)</Label>
            <Textarea
              id="tasks"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              rows={10}
              placeholder={"Finish Q3 budget draft\nReview design handoff\nCall supplier about delay"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="constraints">Deadlines &amp; priorities (optional)</Label>
            <Textarea
              id="constraints"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              rows={3}
              placeholder="Budget draft due Thursday; supplier call is urgent"
            />
          </div>

          <div className="space-y-2">
            <Label>View</Label>
            <Tabs value={view} onValueChange={setView}>
              <TabsList className="w-full">
                <TabsTrigger value="daily" className="flex-1">
                  Daily
                </TabsTrigger>
                <TabsTrigger value="weekly" className="flex-1">
                  Weekly
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Button
            variant="ember"
            className="w-full"
            disabled={!tasks.trim() || loading}
            onClick={() => generate({ tasks, constraints, view })}
          >
            {loading ? <Loader2 className="animate-spin" /> : <CalendarRange />}
            {loading ? "Planning…" : "Generate schedule"}
          </Button>
        </section>

        <AiOutput
          title={view === "weekly" ? "Weekly plan" : "Daily plan"}
          value={output}
          onChange={setOutput}
          loading={loading}
          emptyHint="Your prioritized schedule will appear here, ready to edit."
        />
      </div>
    </AppShell>
  );
}
