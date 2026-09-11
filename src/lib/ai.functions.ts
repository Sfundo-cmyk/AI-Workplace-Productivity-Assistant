import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.8-flash";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

const inputSchema = z.object({
  tool: z.enum(["email", "meeting", "planner", "research", "chat"]),
  payload: z.record(z.string(), z.string()).optional(),
  messages: z.array(messageSchema).max(40).optional(),
});

type Input = z.infer<typeof inputSchema>;

function buildPrompt(input: Input): { system: string; user: string } {
  const p = input.payload ?? {};

  switch (input.tool) {
    case "email":
      return {
        system: [
          "You are a senior workplace communication assistant.",
          "Write complete, ready-to-send business emails.",
          "Rules: include a subject line on the first line as 'Subject: ...', then a blank line, then the body.",
          "Keep it under 200 words unless the key points require more. Use short paragraphs.",
          "Never invent facts, figures, names or commitments that were not provided.",
          "End with a sign-off placeholder like [Your name] if no sender name is given.",
          "Return plain text only, no markdown formatting.",
        ].join(" "),
        user: [
          `Recipient / context: ${p["context"] || "not specified"}`,
          `Desired tone: ${p["tone"] || "Formal"}`,
          "Key points to cover:",
          p["points"] || "(none provided)",
        ].join("\n"),
      };

    case "meeting":
      return {
        system: [
          "You are a meeting notes analyst.",
          "Summarize raw notes or transcripts into exactly three sections, in this order and with these exact headings:",
          "KEY DECISIONS, ACTION ITEMS, DEADLINES.",
          "Under each heading use '- ' bullets. For action items use the format '- [Owner] Task' when an owner is mentioned, otherwise '- [Unassigned] Task'.",
          "For deadlines use '- Date/timeframe — what is due'.",
          "If a section has no content write '- None identified'. Do not invent decisions, owners or dates.",
          "Return plain text only, no markdown bold or headers beyond the three plain uppercase headings.",
        ].join(" "),
        user: `Raw meeting notes:\n\n${p["notes"] || ""}`,
      };

    case "planner":
      return {
        system: [
          "You are a productivity planner.",
          `Build a prioritized ${p["view"] === "weekly" ? "weekly" : "daily"} schedule from the user's task list.`,
          p["view"] === "weekly"
            ? "Group tasks by day (Monday through Friday, plus a 'Backlog' group if needed)."
            : "Group tasks into time blocks: MORNING (9:00-12:00), AFTERNOON (13:00-17:00), END OF DAY.",
          "For every task show priority as (P1), (P2) or (P3) and a realistic time estimate.",
          "Respect any stated deadlines or priorities; put the most urgent and highest-impact work first.",
          "Finish with a short 'NOTES' section of at most 3 bullets on sequencing or risks.",
          "Return plain text with uppercase group headings and '- ' bullets. No markdown symbols.",
        ].join(" "),
        user: [
          `View: ${p["view"] || "daily"}`,
          `Constraints / deadlines / priorities: ${p["constraints"] || "none given"}`,
          "Tasks (one per line):",
          p["tasks"] || "",
        ].join("\n"),
      };

    case "research":
      return {
        system: [
          "You are a research assistant for busy professionals.",
          "Produce exactly three sections with these exact plain uppercase headings, in this order:",
          "SUMMARY, KEY INSIGHTS, RECOMMENDATIONS.",
          "SUMMARY is a single concise paragraph of 4-6 sentences.",
          "KEY INSIGHTS is 3-5 '- ' bullets of the most decision-relevant facts.",
          "RECOMMENDATIONS is 3-4 '- ' bullets of concrete next actions.",
          "If the input is a topic rather than pasted text, rely on general knowledge and flag anything uncertain as 'verify'.",
          "Never fabricate statistics, citations or sources. Return plain text, no markdown symbols.",
        ].join(" "),
        user: `Topic or source text:\n\n${p["topic"] || ""}`,
      };

    case "chat":
    default:
      return {
        system: [
          "You are the AI Workplace Assistant inside a productivity dashboard.",
          "Help with workplace questions: writing, planning, prioritising, summarising, meeting prep, and process advice.",
          "Be direct and practical. Prefer short paragraphs and bullets. Keep answers under 200 words unless asked for depth.",
          "Say clearly when you are unsure, and never invent company-specific facts, policies or numbers.",
        ].join(" "),
        user: "",
      };
  }
}

export const runAi = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      throw new Error("AI is not configured yet. Please try again in a moment.");
    }

    const { system, user } = buildPrompt(data);

    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: system },
    ];

    if (data.tool === "chat") {
      messages.push(...(data.messages ?? []));
    } else {
      messages.push({ role: "user", content: user });
    }

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: MODEL, messages }),
    });

    if (res.status === 429) {
      throw new Error("Too many requests right now — wait a moment and try again.");
    }
    if (res.status === 402) {
      throw new Error("AI credits are exhausted. Please top up to keep generating.");
    }
    if (!res.ok) {
      const detail = await res.text();
      console.error("AI gateway error", res.status, detail);
      throw new Error("The AI service could not complete that request.");
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new Error("The AI returned an empty response. Try again.");
    }

    return { text };
  });
