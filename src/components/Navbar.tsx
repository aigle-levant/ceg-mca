import {
  CalendarDays,
  CalendarCheck,
  Users,
  Zap,
  BookOpen,
  UtensilsCrossed,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import type { PageId } from "@/hooks/useNavigation";
import { cn } from "@/lib/utils";

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

const navItems: { id: PageId; label: string; shortLabel: string; href: string; icon: typeof Zap }[] = [
  { id: "dashboard", label: "Dashboard", shortLabel: "Home", href: "#/", icon: Zap },
  { id: "timetable", label: "Timetable", shortLabel: "Timetable", href: "#/timetable", icon: CalendarDays },
  { id: "exams", label: "Exams", shortLabel: "Exams", href: "#/exams", icon: CalendarCheck },
  { id: "subjects", label: "Subjects", shortLabel: "Subjects", href: "#/subjects", icon: BookOpen },
  { id: "staff", label: "Staff", shortLabel: "Staff", href: "#/staff", icon: Users },
  { id: "mess", label: "Mess", shortLabel: "Mess", href: "#/mess", icon: UtensilsCrossed },
];

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <>
      {/* ── Top Header Bar (iPhone 16 Dynamic Island / Safe Area Aware) ── */}
      <header className="sticky top-0 z-40 px-2.5 sm:px-4 pt-[calc(0.375rem+env(safe-area-inset-top,0px))] pb-1">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full border border-border/80 bg-background/85 px-2.5 sm:px-4 py-1.5 sm:py-2 shadow-xs backdrop-blur-md">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2 rounded-full px-1 py-0.5 sm:px-1.5 sm:py-1 font-semibold group transition-colors text-left"
          >
            <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full overflow-hidden transition-transform group-hover:scale-105">
              <img src="/ceg-logo.png" alt="CEG Crest" className="size-full object-contain drop-shadow-xs" />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight text-foreground">
                CEG MCA
              </span>
              <span className="hidden text-[10px] font-medium text-primary/80 sm:inline">
                Anna University
              </span>
            </div>
          </button>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map(({ id, label, href, icon: Icon }) => {
              const isActive = currentPage === id;
              return (
                <a
                  key={id}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(id);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </a>
              );
            })}
          </div>

          {/* Theme Switcher: standard on desktop, compact on mobile */}
          <div className="flex items-center">
            <div className="hidden md:block">
              <ThemeSwitcher />
            </div>
            <div className="md:hidden">
              <ThemeSwitcher compact />
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile Bottom Navigation Bar (Native App Feel) ── */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-border/80 bg-background/95 backdrop-blur-xl px-1 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.4)]"
      >
        <div className="grid grid-cols-6 w-full max-w-md mx-auto items-center">
          {navItems.map(({ id, label, shortLabel, href, icon: Icon }) => {
            const isActive = currentPage === id;
            return (
              <a
                key={id}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(id);
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-1 px-0.5 rounded-xl transition-all duration-150 min-h-[48px] active:scale-95 touch-manipulation min-w-0 w-full",
                  isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={label}
              >
                <div
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full transition-all duration-200 shrink-0",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs scale-105"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                </div>
                <span className="text-[10px] font-medium leading-none tracking-tight truncate max-w-full text-center block w-full">
                  {shortLabel}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}