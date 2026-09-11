import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, CheckCircle2, Mail, Sparkles, ArrowUpRight } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { navItems } from "@/components/nav-items";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant — Dashboard" },
      {
        name: "description",
        content:
          "One dashboard for AI-drafted emails, meeting summaries, task plans, research briefs and a workplace chatbot.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Automate everyday workplace tasks — emails, meeting notes, planning, research and quick answers — in one AI dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Hours saved this month", value: "12.5", icon: Clock },
  { label: "Tasks planned", value: "48", icon: CheckCircle2 },
  { label: "Emails generated", value: "23", icon: Mail },
  { label: "Summaries created", value: "16", icon: Sparkles },
];

function Dashboard() {
  const tools = navItems.filter((item) => item.to !== "/");

  return (
    <AppShell>
      <section className="surface-panel mb-8 rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
          Welcome back
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Your <span className="text-gradient-ember">AI workplace assistant</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Draft emails, digest meetings, plan your week, research faster and ask anything — all from
          one place.
        </p>
      </section>

      <section className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="surface-panel rounded-2xl p-4">
            <stat.icon className="h-4 w-4 text-primary" />
            <p className="mt-3 font-display text-2xl font-semibold">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
        <p className="col-span-2 text-xs text-muted-foreground lg:col-span-4">
          Sample activity figures for demonstration.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="surface-panel group rounded-2xl p-5 transition-colors hover:border-primary/60"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <tool.icon className="h-4 w-4 text-primary" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:text-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{tool.label}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
