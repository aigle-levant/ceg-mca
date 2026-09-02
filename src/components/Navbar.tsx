import { CalendarDays, Clock3, GraduationCap, Menu, BookOpen } from "lucide-react";
import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";

const navItems = [
  {
    label: "Class",
    href: "#class",
    icon: GraduationCap,
  },
  {
    label: "Syllabus",
    href: "#syllabus",
    icon: BookOpen,
  },
  {
    label: "Time Table",
    href: "#timetable",
    icon: Clock3,
  },
  {
    label: "Important Dates",
    href: "#important-dates",
    icon: CalendarDays,
  },
];

export function Navbar() {
  return (
    <header className="sticky top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border bg-background/80 px-4 py-2 shadow-sm backdrop-blur-md">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 rounded-full px-3 py-2 font-semibold"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <GraduationCap className="size-4" />
          </div>

          <span className="hidden sm:inline">Class Dashboard</span>
        </a>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-4" />
              {label}
            </a>
          ))}
        </div>

        {/* Mobile navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[280px]">
            <div className="mt-8 flex flex-col gap-2">
              {navItems.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Icon className="size-5 text-muted-foreground" />
                  {label}
                </a>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}