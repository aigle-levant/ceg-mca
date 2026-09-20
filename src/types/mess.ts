export type DayName =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type MealType = "breakfast" | "lunch" | "snacks" | "dinner";

export type MessCategory = "veg" | "non-veg" | "international";

export interface StandardDayMeals {
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface StandardMessData {
  institution: string;
  date_range: string;
  menu_type: string;
  days: Record<DayName, StandardDayMeals>;
  pickle: string;
  beverages: Record<string, string>;
}

export interface InternationalDayMeals {
  breakfast: string[];
  lunch: string[];
  snacks: string[];
  dinner: string[];
}

export interface InternationalMessData {
  title: string;
  effective_from: string;
  all_days: InternationalDayMeals;
  days: Record<DayName, InternationalDayMeals>;
}
