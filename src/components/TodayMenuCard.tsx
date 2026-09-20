import { useState, useMemo } from "react";
import {
  UtensilsCrossed,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Leaf,
  Beef,
  Globe,
  ArrowRight,
  Sparkles,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  DayName,
  MealType,
  MessCategory,
  StandardMessData,
  InternationalMessData,
} from "@/types/mess";

import vegMessDataRaw from "@/data/veg-mess.json";
import nonVegMessDataRaw from "@/data/non-veg-mess.json";
import intlMessDataRaw from "@/data/international-mess.json";

const vegMessData = vegMessDataRaw as StandardMessData;
const nonVegMessData = nonVegMessDataRaw as StandardMessData;
const intlMessData = intlMessDataRaw as InternationalMessData;

const MEALS: {
  id: MealType;
  name: string;
  timeRange: string;
  icon: typeof Sun;
  theme: {
    bg: string;
    border: string;
    text: string;
    iconBg: string;
  };
}[] = [
  {
    id: "breakfast",
    name: "Breakfast",
    timeRange: "7:00 – 9:00 AM",
    icon: Coffee,
    theme: {
      bg: "bg-amber-500/5 dark:bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-700 dark:text-amber-300",
      iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    },
  },
  {
    id: "lunch",
    name: "Lunch",
    timeRange: "12:00 – 2:00 PM",
    icon: Sun,
    theme: {
      bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-700 dark:text-emerald-300",
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    },
  },
  {
    id: "snacks",
    name: "Snacks",
    timeRange: "4:30 – 5:45 PM",
    icon: Cookie,
    theme: {
      bg: "bg-rose-500/5 dark:bg-rose-500/10",
      border: "border-rose-500/20",
      text: "text-rose-700 dark:text-rose-300",
      iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20",
    },
  },
  {
    id: "dinner",
    name: "Dinner",
    timeRange: "7:00 – 9:00 PM",
    icon: Moon,
    theme: {
      bg: "bg-indigo-500/5 dark:bg-indigo-500/10",
      border: "border-indigo-500/20",
      text: "text-indigo-700 dark:text-indigo-300",
      iconBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20",
    },
  },
];

function isSpecialDish(name: string): boolean {
  const lowercase = name.toLowerCase();
  const keywords = [
    "biriyani",
    "biryani",
    "ice cream",
    "gulabjamun",
    "payasam",
    "paneer",
    "chicken",
    "mutton",
    "fish",
    "sweet",
    "halwa",
    "pani poori",
  ];
  return keywords.some((k) => lowercase.includes(k));
}

function parseDishItems(raw: string | string[]): string[] {
  if (Array.isArray(raw)) {
    return raw.map((item) => item.trim()).filter(Boolean);
  }
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getActiveMeal(): MealType {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes <= 570) return "breakfast";
  if (minutes <= 870) return "lunch";
  if (minutes <= 1080) return "snacks";
  return "dinner";
}

interface TodayMenuCardProps {
  onNavigateMess?: () => void;
}

export function TodayMenuCard({ onNavigateMess }: TodayMenuCardProps) {
  const [category, setCategory] = useState<MessCategory>("veg");

  const today = useMemo<DayName>(() => {
    const dayIndex = new Date().getDay();
    const dayMap: DayName[] = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return dayMap[dayIndex];
  }, []);

  const activeMeal = useMemo(() => getActiveMeal(), []);

  const todayMeals = useMemo(() => {
    if (category === "veg") {
      const d = vegMessData.days[today];
      return {
        breakfast: parseDishItems(d.breakfast),
        lunch: parseDishItems(d.lunch),
        snacks: parseDishItems(d.snacks),
        dinner: parseDishItems(d.dinner),
      };
    }
    if (category === "non-veg") {
      const d = nonVegMessData.days[today];
      return {
        breakfast: parseDishItems(d.breakfast),
        lunch: parseDishItems(d.lunch),
        snacks: parseDishItems(d.snacks),
        dinner: parseDishItems(d.dinner),
      };
    }
    const d = intlMessData.days[today];
    return {
      breakfast: parseDishItems(d.breakfast),
      lunch: parseDishItems(d.lunch),
      snacks: parseDishItems(d.snacks),
      dinner: parseDishItems(d.dinner),
    };
  }, [category, today]);

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs">
      {/* ── Card Header ── */}
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <UtensilsCrossed className="size-4" />
              </div>
              <h2 className="text-base sm:text-xl font-bold tracking-tight text-foreground">
                Today's Menu
              </h2>
              <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-bold text-primary">
                {today}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Hostel meals served across all 4 sessions today
            </p>
          </div>

          {onNavigateMess && (
            <button
              type="button"
              onClick={onNavigateMess}
              className="sm:hidden inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline px-2 py-1 active:scale-95 touch-manipulation shrink-0 whitespace-nowrap"
            >
              <span>Full Menu</span>
              <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>

        {/* Category Toggle (International / Veg / Non-Veg) */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="grid grid-cols-3 w-full sm:inline-flex p-1 rounded-xl bg-muted/80 border border-border/70 gap-1">
            <button
              type="button"
              onClick={() => setCategory("veg")}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs font-semibold transition-all duration-200 min-h-[36px] active:scale-95 touch-manipulation",
                category === "veg"
                  ? "bg-background text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Leaf className="size-3.5 text-emerald-500" />
              <span>Veg</span>
            </button>

            <button
              type="button"
              onClick={() => setCategory("non-veg")}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs font-semibold transition-all duration-200 min-h-[36px] active:scale-95 touch-manipulation",
                category === "non-veg"
                  ? "bg-background text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Beef className="size-3.5 text-rose-500" />
              <span>Non-Veg</span>
            </button>

            <button
              type="button"
              onClick={() => setCategory("international")}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs font-semibold transition-all duration-200 min-h-[36px] active:scale-95 touch-manipulation",
                category === "international"
                  ? "bg-background text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Globe className="size-3.5 text-sky-500" />
              <span>Int'l</span>
            </button>
          </div>

          {onNavigateMess && (
            <button
              type="button"
              onClick={onNavigateMess}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline px-2 py-1 active:scale-95 touch-manipulation shrink-0"
            >
              <span>Full Menu</span>
              <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Meals 4-Column Grid ── */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MEALS.map((meal) => {
          const items = todayMeals[meal.id] || [];
          const Icon = meal.icon;
          const isLive = activeMeal === meal.id;

          return (
            <div
              key={meal.id}
              className={cn(
                "relative flex flex-col justify-between rounded-2xl border p-3.5 sm:p-4 transition-all",
                meal.theme.bg,
                meal.theme.border,
                isLive && "ring-2 ring-primary/35 shadow-xs"
              )}
            >
              {isLive && (
                <div className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground shadow-2xs">
                  <span className="size-1 rounded-full bg-primary-foreground animate-ping" />
                  CURRENT
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "flex size-6 items-center justify-center rounded-md",
                        meal.theme.iconBg
                      )}
                    >
                      <Icon className="size-3" />
                    </div>
                    <span
                      className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        meal.theme.text
                      )}
                    >
                      {meal.name}
                    </span>
                  </div>

                  <span className="text-[10px] text-muted-foreground font-mono">
                    {meal.timeRange}
                  </span>
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => {
                    const special = isSpecialDish(item);
                    return (
                      <span
                        key={item}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors border",
                          special
                            ? "bg-amber-500/20 border-amber-500/30 text-amber-800 dark:text-amber-200 font-semibold"
                            : "bg-background/85 border-border/60 text-foreground"
                        )}
                      >
                        {special && (
                          <Sparkles className="size-2.5 text-amber-500 shrink-0" />
                        )}
                        <span>
                          {item === "T/C/M" ? "Tea / Coffee / Milk" : item}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {category === "international" && meal.id === "lunch" && (
                <div className="mt-3 pt-2 border-t border-border/40 text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="size-2.5" />
                  <span>+ Plain Rice, Rasam, Curd, Appalam</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
