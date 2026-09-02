import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function InfoTip({
  label = "How this is calculated",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger
        type="button"
        aria-label={label}
        className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-accent text-muted-foreground transition-colors duration-300 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Info className="h-3.5 w-3.5" aria-hidden />
      </TooltipTrigger>
      <TooltipContent side="bottom" align="end" className="max-w-xs p-4 text-left">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}
