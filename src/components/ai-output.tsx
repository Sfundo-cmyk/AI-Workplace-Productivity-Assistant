import { useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  emptyHint: string;
  title?: string;
  rows?: number;
};

export function AiOutput({
  value,
  onChange,
  loading,
  emptyHint,
  title = "Result",
  rows = 16,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — select the text and copy manually.");
    }
  };

  return (
    <section className="surface-panel rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          {title}
        </h2>
        <Button variant="subtle" size="sm" onClick={copy} disabled={!value || loading}>
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Generating with AI…
        </div>
      ) : value ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="resize-y bg-background/40 font-sans text-sm leading-relaxed"
        />
      ) : (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border px-6 text-center text-sm text-muted-foreground">
          {emptyHint}
        </div>
      )}

      {value && !loading ? (
        <p className="mt-2 text-xs text-muted-foreground">
          This output is editable — refine it before you use it.
        </p>
      ) : null}
    </section>
  );
}
