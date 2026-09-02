import { cn } from "@/lib/utils";
import type { ProcessingStatus } from "@/lib/supabase";

const map: Record<ProcessingStatus, { label: string; className: string }> = {
  uploaded: { label: "Queued", className: "bg-muted text-muted-foreground" },
  processing: { label: "Being read", className: "bg-muted text-muted-foreground" },
  ready: { label: "Ready", className: "bg-calm-soft text-calm" },
  failed: { label: "Couldn't be read", className: "bg-attention-soft text-attention" },
};

export default function StatusPill({ status }: { status: ProcessingStatus }) {
  const s = map[status] ?? map.uploaded;
  return (
    <span className={cn("inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold", s.className)}>
      {s.label}
    </span>
  );
}
