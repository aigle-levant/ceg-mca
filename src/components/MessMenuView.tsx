import { useState, useMemo } from "react";
import {
  UtensilsCrossed,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Search,
  Calendar,
  Sparkles,
  Info,
  Clock,
  CheckCircle2,
  ChevronRight,
  Flame,
  Globe,
  Leaf,
  Beef,
  ArrowRight,
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

const DAYS: DayName[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MEALS: {
  id: MealType;
  name: string;
  timeRange: string;
  icon: typeof Sun;
  theme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    iconBg: string;
  };
}[] = [
    {
      id: "breakfast",
      name: "Breakfast",
      timeRange: "7:00 AM – 9:00 AM",
      icon: Coffee,
      theme: {
        bg: "bg-amber-500/5 dark:bg-amber-500/10",
        border: "border-amber-500/20",
        text: "text-amber-700 dark:text-amber-300",
        badge: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300",
        iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
      },
    },
    {
      id: "lunch",
      name: "Lunch",
      timeRange: "12:00 PM – 2:00 PM",
      icon: Sun,
      theme: {
        bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
        border: "border-emerald-500/20",
        text: "text-emerald-700 dark:text-emerald-300",
        badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300",
        iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
      },
    },
    {
      id: "snacks",
      name: "Snacks",
      timeRange: "4:30 PM – 5:45 PM",
      icon: Cookie,
      theme: {
        bg: "bg-rose-500/5 dark:bg-rose-500/10",
        border: "border-rose-500/20",
        text: "text-rose-700 dark:text-rose-300",
        badge: "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300",
        iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20",
      },
    },
    {
      id: "dinner",
      name: "Dinner",
      timeRange: "7:00 PM – 9:00 PM",
      icon: Moon,
      theme: {
        bg: "bg-indigo-500/5 dark:bg-indigo-500/10",
        border: "border-indigo-500/20",
        text: "text-indigo-700 dark:text-indigo-300",
        badge: "bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-300",
        iconBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20",
      },
    },
  ];

// Helper to determine active or upcoming meal period based on current time
function getCurrentMealPeriod(): {
  day: DayName;
  meal: MealType;
  isLive: boolean;
  statusLabel: string;
} {
  const now = new Date();
  const dayIndex = now.getDay(); // 0 is Sunday, 1 is Monday...
  const dayNamesOrder: DayName[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = dayNamesOrder[dayIndex];
  const minutes = now.getHours() * 60 + now.getMinutes();

  // Breakfast: 7:00 AM (420) to 9:30 AM (570)
  if (minutes < 420) {
    return {
      day: currentDay,
      meal: "breakfast",
      isLive: false,
      statusLabel: "Upcoming Breakfast",
    };
  }
  if (minutes <= 570) {
    return {
      day: currentDay,
      meal: "breakfast",
      isLive: true,
      statusLabel: "Serving Breakfast Now",
    };
  }

  // Lunch: 12:00 PM (720) to 2:30 PM (870)
  if (minutes < 720) {
    return {
      day: currentDay,
      meal: "lunch",
      isLive: false,
      statusLabel: "Upcoming Lunch",
    };
  }
  if (minutes <= 870) {
    return {
      day: currentDay,
      meal: "lunch",
      isLive: true,
      statusLabel: "Serving Lunch Now",
    };
  }

  // Snacks: 4:30 PM (990) to 6:00 PM (1080)
  if (minutes < 990) {
    return {
      day: currentDay,
      meal: "snacks",
      isLive: false,
      statusLabel: "Upcoming Evening Snacks",
    };
  }
  if (minutes <= 1080) {
    return {
      day: currentDay,
      meal: "snacks",
      isLive: true,
      statusLabel: "Serving Snacks Now",
    };
  }

  // Dinner: 7:00 PM (1140) to 9:30 PM (1290)
  if (minutes < 1140) {
    return {
      day: currentDay,
      meal: "dinner",
      isLive: false,
      statusLabel: "Upcoming Dinner",
    };
  }
  if (minutes <= 1290) {
    return {
      day: currentDay,
      meal: "dinner",
      isLive: true,
      statusLabel: "Serving Dinner Now",
    };
  }

  // Late night -> Next day breakfast
  const nextDay = dayNamesOrder[(dayIndex + 1) % 7];
  return {
    day: nextDay,
    meal: "breakfast",
    isLive: false,
    statusLabel: "Tomorrow's Breakfast",
  };
}

// Check if an item is a special highlight dish (desserts, Biriyani, chicken, etc.)
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
    "cutlet",
    "gobi 65",
    "pulao",
    "paratha",
  ];
  return keywords.some((k) => lowercase.includes(k));
}

// Split comma items and clean up
function parseDishItems(raw: string | string[]): string[] {
  if (Array.isArray(raw)) {
    return raw.map((item) => item.trim()).filter(Boolean);
  }
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function MessMenuView() {
  const [selectedCategory, setSelectedCategory] =
    useState<MessCategory>("veg");
  const [selectedDay, setSelectedDay] = useState<DayName | "all">(() => {
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
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showDailyEssentials, setShowDailyEssentials] = useState(false);

  const livePeriod = useMemo(() => getCurrentMealPeriod(), []);
  const todayName: DayName = useMemo(() => {
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

  // Retrieve meals for a day based on active mess
  const getMealsForDay = (day: DayName): Record<MealType, string[]> => {
    if (selectedCategory === "veg") {
      const d = vegMessData.days[day];
      return {
        breakfast: parseDishItems(d.breakfast),
        lunch: parseDishItems(d.lunch),
        snacks: parseDishItems(d.snacks),
        dinner: parseDishItems(d.dinner),
      };
    }
    if (selectedCategory === "non-veg") {
      const d = nonVegMessData.days[day];
      return {
        breakfast: parseDishItems(d.breakfast),
        lunch: parseDishItems(d.lunch),
        snacks: parseDishItems(d.snacks),
        dinner: parseDishItems(d.dinner),
      };
    }
    const d = intlMessData.days[day];
    return {
      breakfast: parseDishItems(d.breakfast),
      lunch: parseDishItems(d.lunch),
      snacks: parseDishItems(d.snacks),
      dinner: parseDishItems(d.dinner),
    };
  };

  // Search results across all days for active category
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: {
      day: DayName;
      meal: MealType;
      matchingItems: string[];
    }[] = [];

    DAYS.forEach((day) => {
      const meals = getMealsForDay(day);
      (Object.keys(meals) as MealType[]).forEach((meal) => {
        const matches = meals[meal].filter((item) =>
          item.toLowerCase().includes(q)
        );
        if (matches.length > 0) {
          results.push({
            day,
            meal,
            matchingItems: matches,
          });
        }
      });
    });

    return results;
  }, [searchQuery, selectedCategory]);

  // Current meal items for Live Card
  const liveItems = useMemo(() => {
    const meals = getMealsForDay(livePeriod.day);
    return meals[livePeriod.meal] || [];
  }, [livePeriod, selectedCategory]);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* ── 1. Page Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <UtensilsCrossed className="size-3.5" />
            CEG Campus Hostels • Dining
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Hostel Mess Menu
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {selectedCategory === "international"
              ? "International Hostel Mess • Effective from " +
              intlMessData.effective_from
              : "Engineering College Hostels • Validity: " +
              vegMessData.date_range}
          </p>
        </div>

        {/* Date / Validity Pill */}
        <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-card p-2 px-3 shadow-xs text-xs text-muted-foreground">
          <Calendar className="size-4 text-primary" />
          <span>
            Today is <strong className="text-foreground">{todayName}</strong>
          </span>
        </div>
      </div>

      {/* ── 2. Live "Happening Now / Up Next" Meal Banner ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              {livePeriod.meal === "breakfast" && <Coffee className="size-5" />}
              {livePeriod.meal === "lunch" && <Sun className="size-5" />}
              {livePeriod.meal === "snacks" && <Cookie className="size-5" />}
              {livePeriod.meal === "dinner" && <Moon className="size-5" />}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {livePeriod.statusLabel}
                </span>
                {livePeriod.isLive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                    LIVE SERVING
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 border border-border/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    <Clock className="size-2.5" />
                    {livePeriod.day}
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-bold text-foreground mt-0.5 capitalize">
                {livePeriod.day}’s {livePeriod.meal} (
                {selectedCategory === "veg"
                  ? "Veg Mess"
                  : selectedCategory === "non-veg"
                    ? "Non-Veg Mess"
                    : "International Mess"}
                )
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedDay(livePeriod.day)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>View full day</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        {/* Live Meal Items Badges */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex flex-wrap items-center gap-2">
            {liveItems.map((item) => {
              const special = isSpecialDish(item);
              return (
                <span
                  key={item}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-medium transition-all shadow-2xs",
                    special
                      ? "bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold"
                      : "bg-background/90 border border-border/70 text-foreground"
                  )}
                >
                  {special && <Sparkles className="size-3 text-amber-500" />}
                  {item === "T/C/M" ? "Tea / Coffee / Milk (T/C/M)" : item}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. Mess Category Switcher Tabs ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-3 sm:inline-flex p-1 rounded-2xl bg-muted/70 border border-border/70 w-full sm:w-auto gap-1">
          {/* Veg Mess Button */}
          <button
            type="button"
            onClick={() => setSelectedCategory("veg")}
            className={cn(
              "flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 min-h-[38px] active:scale-95 touch-manipulation",
              selectedCategory === "veg"
                ? "bg-background text-foreground shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Leaf className="size-3.5 sm:size-4 text-emerald-500" />
            <span>Veg</span>
          </button>

          {/* Non-Veg Mess Button */}
          <button
            type="button"
            onClick={() => setSelectedCategory("non-veg")}
            className={cn(
              "flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 min-h-[38px] active:scale-95 touch-manipulation",
              selectedCategory === "non-veg"
                ? "bg-background text-foreground shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Beef className="size-3.5 sm:size-4 text-rose-500" />
            <span>Non-Veg</span>
          </button>

          {/* International Mess Button */}
          <button
            type="button"
            onClick={() => setSelectedCategory("international")}
            className={cn(
              "flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 min-h-[38px] active:scale-95 touch-manipulation",
              selectedCategory === "international"
                ? "bg-background text-foreground shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Globe className="size-3.5 sm:size-4 text-sky-500" />
            <span>Int'l</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search dish (e.g., Biriyani)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-card pl-9 pr-8 py-2 text-xs sm:text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground p-0.5"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── 4. Search Results View (if search active) ── */}
      {searchQuery.trim() ? (
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Search className="size-4 text-primary" />
              Search results for “{searchQuery}” in{" "}
              {selectedCategory === "veg"
                ? "Veg Mess"
                : selectedCategory === "non-veg"
                  ? "Non-Veg Mess"
                  : "International Mess"}
            </h3>
            <span className="text-xs text-muted-foreground font-medium">
              {searchResults.length}{" "}
              {searchResults.length === 1 ? "match" : "matches"} found
            </span>
          </div>

          {searchResults.length === 0 ? (
            <p className="py-6 text-center text-xs sm:text-sm text-muted-foreground">
              No matching dishes found for “{searchQuery}”. Try searching for
              “Pongal”, “Idly”, “Biriyani”, “Paneer”, or “Chapathi”.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((res, idx) => (
                <div
                  key={`${res.day}-${res.meal}-${idx}`}
                  className="rounded-xl border border-border/70 bg-muted/30 p-3.5 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-foreground font-bold">{res.day}</span>
                      <span className="capitalize px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[10px]">
                        {res.meal}
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {res.matchingItems.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary/15 border border-primary/25 px-2.5 py-1 text-xs font-semibold text-primary"
                        >
                          <Sparkles className="size-3" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDay(res.day);
                      setSearchQuery("");
                    }}
                    className="self-end inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                  >
                    Go to {res.day}
                    <ChevronRight className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* ── 5. Day Selector Pills ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Select Day
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedDay(todayName)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold transition-colors",
                selectedDay === todayName
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/80 bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <CheckCircle2 className="size-3.5" />
              Today ({todayName.slice(0, 3)})
            </button>

            <button
              type="button"
              onClick={() =>
                setSelectedDay(selectedDay === "all" ? todayName : "all")
              }
              className={cn(
                "rounded-xl border px-3 py-1 text-xs font-semibold transition-colors",
                selectedDay === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/80 bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {selectedDay === "all" ? "Showing All" : "View Full Week"}
            </button>
          </div>
        </div>

        {/* Days pill row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
          {DAYS.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = day === todayName;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "relative flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all duration-200 border active:scale-95 touch-manipulation",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card border-border/80 text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <span>{day}</span>
                {isToday && (
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      isSelected ? "bg-primary-foreground" : "bg-primary"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 6. International Mess "All Days Common Items" Drawer / Accordion ── */}
      {selectedCategory === "international" && (
        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                <Globe className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Daily Common Essentials (Served All Days)
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Standard items available during every meal slot at the
                  International Hostel
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDailyEssentials(!showDailyEssentials)}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline px-2 py-1"
            >
              {showDailyEssentials ? "Hide" : "Show All"}
            </button>
          </div>

          {showDailyEssentials && (
            <div className="mt-4 pt-4 border-t border-sky-500/20 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-sky-500/20 bg-card p-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Breakfast Essentials
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {intlMessData.all_days.breakfast.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-foreground border border-border/50 font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-sky-500/20 bg-card p-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Lunch Essentials
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {intlMessData.all_days.lunch.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-foreground border border-border/50 font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-sky-500/20 bg-card p-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Snacks Essentials
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {intlMessData.all_days.snacks.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-foreground border border-border/50 font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-sky-500/20 bg-card p-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Dinner Essentials
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {intlMessData.all_days.dinner.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-foreground border border-border/50 font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 7. Daily Breakdown or Full Week Schedule ── */}
      {selectedDay === "all" ? (
        // Full Week View
        <div className="space-y-8">
          {DAYS.map((day) => {
            const meals = getMealsForDay(day);
            const isToday = day === todayName;

            return (
              <div
                key={day}
                className={cn(
                  "rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-6 shadow-xs space-y-5",
                  isToday
                    ? "border-primary/40 ring-2 ring-primary/20"
                    : "border-border/80"
                )}
              >
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {day}
                    </h3>
                    {isToday && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                        Today
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Focus Day
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {MEALS.map((mealMeta) => {
                    const items = meals[mealMeta.id] || [];
                    const Icon = mealMeta.icon;

                    return (
                      <div
                        key={mealMeta.id}
                        className={cn(
                          "rounded-2xl border p-4 flex flex-col justify-between gap-3",
                          mealMeta.theme.bg,
                          mealMeta.theme.border
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "flex size-7 items-center justify-center rounded-lg",
                                  mealMeta.theme.iconBg
                                )}
                              >
                                <Icon className="size-3.5" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs font-bold uppercase tracking-wider",
                                  mealMeta.theme.text
                                )}
                              >
                                {mealMeta.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {mealMeta.timeRange}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {items.map((item) => {
                              const special = isSpecialDish(item);
                              return (
                                <span
                                  key={item}
                                  className={cn(
                                    "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium border",
                                    special
                                      ? "bg-amber-500/20 border-amber-500/30 text-amber-800 dark:text-amber-200 font-semibold"
                                      : "bg-background/80 border-border/60 text-foreground"
                                  )}
                                >
                                  {special && (
                                    <Sparkles className="size-2.5 text-amber-500" />
                                  )}
                                  {item === "T/C/M"
                                    ? "T/C/M (Tea/Coffee/Milk)"
                                    : item}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Single Selected Day View (Focused, Beautiful Cards)
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
              <span>{selectedDay}’s Menu</span>
              {selectedDay === todayName && (
                <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
                  Today
                </span>
              )}
            </h2>

            <span className="text-xs text-muted-foreground">
              4 meal periods served
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MEALS.map((mealMeta) => {
              const meals = getMealsForDay(selectedDay);
              const items = meals[mealMeta.id] || [];
              const Icon = mealMeta.icon;
              const isCurrentPeriod =
                livePeriod.day === selectedDay &&
                livePeriod.meal === mealMeta.id;

              return (
                <div
                  key={mealMeta.id}
                  className={cn(
                    "relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border p-5 shadow-xs transition-all hover:shadow-md",
                    mealMeta.theme.bg,
                    mealMeta.theme.border,
                    isCurrentPeriod && "ring-2 ring-primary/40 shadow-sm"
                  )}
                >
                  {isCurrentPeriod && (
                    <div className="absolute -top-3 right-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-xs">
                      <span className="size-1.5 rounded-full bg-primary-foreground animate-ping" />
                      ACTIVE MEAL
                    </div>
                  )}

                  <div>
                    {/* Meal Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "flex size-10 items-center justify-center rounded-xl",
                            mealMeta.theme.iconBg
                          )}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <h3
                            className={cn(
                              "text-sm font-bold uppercase tracking-wider",
                              mealMeta.theme.text
                            )}
                          >
                            {mealMeta.name}
                          </h3>
                          <span className="text-[11px] text-muted-foreground font-medium">
                            {mealMeta.timeRange}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Meal Items */}
                    <div className="space-y-2">
                      {items.map((item) => {
                        const special = isSpecialDish(item);

                        return (
                          <div
                            key={item}
                            className={cn(
                              "flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors",
                              special
                                ? "bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-100 font-semibold"
                                : "bg-card/90 border border-border/70 text-foreground"
                            )}
                          >
                            <span className="flex items-center gap-1.5">
                              {special && (
                                <Flame className="size-3.5 text-amber-500 shrink-0" />
                              )}
                              <span>
                                {item === "T/C/M"
                                  ? "Tea / Coffee / Milk"
                                  : item}
                              </span>
                            </span>

                            {item === "T/C/M" && (
                              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-border/50">
                                T/C/M
                              </span>
                            )}
                            {special && (
                              <span className="rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                                Special
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>{items.length} items listed</span>
                    <span className="text-muted-foreground/60">CEG Hostels</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 8. Information & Abbreviations Card ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Beverages Guide */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2.5 text-primary mb-2">
            <Coffee className="size-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Beverage Abbreviations
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            T/C/M served hot across morning and snack counters:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-border/60 bg-muted/40 p-2 text-center">
              <span className="font-mono text-sm font-bold text-primary">T</span>
              <p className="text-[11px] text-muted-foreground">Tea</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/40 p-2 text-center">
              <span className="font-mono text-sm font-bold text-primary">C</span>
              <p className="text-[11px] text-muted-foreground">Coffee</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/40 p-2 text-center">
              <span className="font-mono text-sm font-bold text-primary">M</span>
              <p className="text-[11px] text-muted-foreground">Milk / Boost</p>
            </div>
          </div>
        </div>

        {/* Pickle Varieties */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-500 mb-2">
            <Sparkles className="size-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Daily Pickle Varieties
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Traditional South Indian pickles rotated on meal times:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["Lemon Pickle", "Amla Pickle", "Ginger Pickle", "Garlic Pickle"].map(
              (p) => (
                <span
                  key={p}
                  className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300"
                >
                  {p}
                </span>
              )
            )}
          </div>
        </div>

        {/* Hostel Institution & Validity Notice */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 mb-2">
            <Info className="size-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Hostel Dining Notice
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Fourth week
            special ice creams feature Arun / Dairy Day brands.
          </p>
        </div>
      </div>
    </div>
  );
}
