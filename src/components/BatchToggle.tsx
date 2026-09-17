import { Sun, Moon } from "lucide-react";
import type { BatchMode } from "@/types/schedule";
import { cn } from "@/lib/utils";

interface BatchToggleProps {
  mode: BatchMode;
  onModeChange: (mode: BatchMode) => void;
}

export function BatchToggle({ mode, onModeChange }: BatchToggleProps) {
  return (
    <div className="relative flex items-center rounded-full border border-border/80 bg-card/80 p-1 shadow-xs backdrop-blur-sm">
      {/* Sliding indicator */}
      <div
        className={cn(
          "absolute h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-background shadow-xs ring-1 ring-border/50 transition-transform duration-300 ease-out",
          mode === "evening" && "translate-x-[calc(100%+4px)]"
        )}
      />

      <button
        type="button"
        onClick={() => onModeChange("regular")}
        className={cn(
          "relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
          mode === "regular"
            ? "text-foreground font-semibold"
            : "text-muted-foreground hover:text-foreground/80"
        )}
      >
        <Sun className={cn("size-3.5", mode === "regular" ? "text-amber-500" : "text-muted-foreground")} />
        Regular
      </button>

      <button
        type="button"
        onClick={() => onModeChange("evening")}
        className={cn(
          "relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
          mode === "evening"
            ? "text-foreground font-semibold"
            : "text-muted-foreground hover:text-foreground/80"
        )}
      >
        <Moon className={cn("size-3.5", mode === "evening" ? "text-amber-400 dark:text-amber-300" : "text-muted-foreground")} />
        Evening
      </button>
    </div>
  );
}
