import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { runAi } from "@/lib/ai.functions";

type Tool = "email" | "meeting" | "planner" | "research";

export function useAiTool(tool: Tool) {
  const call = useServerFn(runAi);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async (payload: Record<string, string>) => {
    setLoading(true);
    try {
      const result = await call({ data: { tool, payload } });
      setOutput(result.text);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { output, setOutput, loading, generate };
}
