import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function ThemeSwitcher({ className, compact = false }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  const options: {
    value: Theme;
    label: string;
    description: string;
    icon: typeof Sun;
  }[] = [
    {
      value: "light",
      label: "Light",
      description: "Sandalwood & Heritage Terracotta",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark",
      description: "Royal Velvet & Midnight Saffron",
      icon: Moon,
    },
    {
      value: "system",
      label: "Auto",
      description: "Sync with system preference",
      icon: Laptop,
    },
  ];

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full border border-border/70 bg-card/80 p-0.5 shadow-xs backdrop-blur-md",
          className
        )}
        role="group"
        aria-label="Theme selection"
      >
        {options.map(({ value, label, description, icon: Icon }) => {
          const isActive = theme === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              title={`${label}: ${description}`}
              aria-label={`${label}: ${description}`}
              className={cn(
                "relative rounded-full p-1.5 text-xs transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="size-3.5" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border/80 bg-card/80 p-1 shadow-xs backdrop-blur-md",
        className
      )}
      role="group"
      aria-label="Theme selection"
    >
      {options.map(({ value, label, description, icon: Icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            title={description}
            aria-label={`${label} theme: ${description}`}
            className={cn(
              "group relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Icon className="size-3.5 shrink-0 transition-transform group-hover:rotate-12" />
            <span className="capitalize">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
