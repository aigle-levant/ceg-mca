import { GraduationCap, BookOpen } from "lucide-react";
import type { CourseMode } from "@/types/schedule";
import { cn } from "@/lib/utils";

interface CourseToggleProps {
  mode: CourseMode;
  onModeChange: (mode: CourseMode) => void;
}

export function CourseToggle({ mode, onModeChange }: CourseToggleProps) {
  return (
    <div className="relative flex items-center rounded-full border border-border/80 bg-card/80 p-1 shadow-xs backdrop-blur-sm">
      {/* Sliding indicator */}
      <div
        className={cn(
          "absolute h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-background shadow-xs ring-1 ring-border/50 transition-transform duration-300 ease-out",
          mode === "bridge" && "translate-x-[calc(100%+4px)]"
        )}
      />

      <button
        type="button"
        onClick={() => onModeChange("non-bridge")}
        className={cn(
          "relative z-10 flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors duration-200",
          mode === "non-bridge"
            ? "text-foreground font-semibold"
            : "text-muted-foreground hover:text-foreground/80"
        )}
      >
        <GraduationCap
          className={cn(
            "size-3.5",
            mode === "non-bridge" ? "text-primary" : "text-muted-foreground"
          )}
        />
        Non-Bridge
      </button>

      <button
        type="button"
        onClick={() => onModeChange("bridge")}
        className={cn(
          "relative z-10 flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors duration-200",
          mode === "bridge"
            ? "text-foreground font-semibold"
            : "text-muted-foreground hover:text-foreground/80"
        )}
      >
        <BookOpen
          className={cn(
            "size-3.5",
            mode === "bridge" ? "text-amber-500" : "text-muted-foreground"
          )}
        />
        Bridge
      </button>
    </div>
  );
}
