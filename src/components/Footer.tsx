import { ArrowUpRight } from "lucide-react";
import type { PageId } from "@/hooks/useNavigation";

const navigation: { id: PageId; label: string; href: string }[] = [
  { id: "dashboard", label: "Dashboard", href: "#/" },
  { id: "timetable", label: "Timetable", href: "#/timetable" },
  { id: "exams", label: "Exams", href: "#/exams" },
  { id: "subjects", label: "Subjects", href: "#/subjects" },
  { id: "staff", label: "Staff", href: "#/staff" },
  { id: "mess", label: "Mess Menu", href: "#/mess" },
];

interface FooterProps {
  onNavigate?: (page: PageId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-border bg-[#F7F3EE] dark:bg-[#150F12] text-foreground dark:text-[#F7F1EB] transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24 pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] md:pb-24">
        {/* Hero / Quote */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            {/* Department Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-amber-600/25 bg-amber-500/10 dark:border-amber-400/20 dark:bg-amber-400/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400/90">
              <span>Department of Information Science and Technology</span>
              <span className="text-foreground/30 dark:text-white/30">•</span>
              <span className="text-foreground/80 dark:text-white/80">Class of ’28</span>
            </div>

            {/* Quote Block */}
            <div className="border-l-2 border-amber-600/50 dark:border-amber-400/40 pl-4 sm:pl-6 space-y-3.5">
              {/* Tamil Kural */}
              <blockquote className="text-lg sm:text-2xl md:text-3xl font-bold leading-relaxed sm:leading-relaxed tracking-normal text-foreground dark:text-[#FFFDF9]">
                <p>
                  அருமை உடைத்தென்று அசாவாமை வேண்டும்<br />
                  பெருமை முயற்சி தரும்.
                </p>
              </blockquote>

              {/* Transliteration */}
              <div className="text-xs sm:text-sm font-medium italic tracking-wide text-amber-700 dark:text-amber-300/90">
                <p>Arumai udaiththenru asaavaamai vendum. Perumai muyarchi tharum.</p>
              </div>

              {/* Translation & Attribution */}
              <div className="pt-3 border-t border-border dark:border-white/15 space-y-2.5">
                <p className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-foreground/90 dark:text-[#FFFDF9]">
                  “Without losing heart because a task is difficult, one must persevere; perseverance brings greatness.”
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground dark:text-[#F7F1EB]/75 font-medium">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">Kural 613</span>
                  <span className="text-foreground/25 dark:text-white/30">•</span>
                  <span>அதிகாரம் 62</span>
                  <span className="text-foreground/25 dark:text-white/30">•</span>
                  <span className="text-foreground/80 dark:text-[#F7F1EB]/90">ஆள்வினையுடைமை (Perseverance)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-14 h-px bg-border dark:bg-white/10" />

        {/* Content */}
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full overflow-hidden bg-foreground/5 ring-1 ring-foreground/10 dark:bg-white/5 dark:ring-white/10 p-1">
                <img src="/ceg-logo.png" alt="CEG Crest" className="size-full object-contain" />
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-foreground dark:text-[#FFFDF9]">
                CEG MCA
              </h3>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground dark:text-[#F7F1EB]/60">
              For MCA students, by MCA students.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400/90 font-semibold">
              Navigate
            </p>

            <div className="mt-5 flex flex-col gap-3.5">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate(item.id);
                    }
                  }}
                  className="text-sm text-muted-foreground hover:text-amber-700 dark:text-[#F7F1EB]/70 dark:hover:text-amber-400 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col gap-4 border-t border-border dark:border-white/10 pt-8 text-xs text-muted-foreground dark:text-[#F7F1EB]/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} College of Engineering Guindy • MCA Class of '28.</p>

          <p className="text-amber-700/80 dark:text-amber-400/70 font-medium">Crafted with love and care.</p>

          <a
            href="https://github.com/aigle-levant/ceg-mca"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-amber-700 dark:text-[#F7F1EB]/60 dark:hover:text-amber-400 transition-colors"
          >
            Source Code
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
