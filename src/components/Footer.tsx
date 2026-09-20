import { ArrowUpRight, Heart } from "lucide-react";
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

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-foreground/90 dark:text-[#F7F1EB]">
                <span>Made with</span>
                <Heart className="size-3.5 fill-rose-500 text-rose-500 inline-block" />
                <span>by</span>
                <span className="font-semibold text-foreground dark:text-white">Prajanya Subramanian</span>
              </p>

              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/aigle-levant"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 dark:hover:text-white transition-all shadow-2xs group"
                >
                  <svg className="size-3.5 text-muted-foreground group-hover:text-foreground dark:group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                  <ArrowUpRight size={11} className="text-muted-foreground/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href="https://www.linkedin.com/in/prajanya-subramanian/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-[#0A66C2] hover:border-[#0A66C2]/40 transition-all shadow-2xs group"
                >
                  <svg className="size-3.5 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 1 0 0-3.38 1.69 1.69 0 0 0 0 3.38m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                  </svg>
                  <span>LinkedIn</span>
                  <ArrowUpRight size={11} className="text-muted-foreground/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
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
        <div className="mt-16 flex flex-col items-center text-center gap-4 border-t border-border dark:border-white/10 pt-8 text-xs text-muted-foreground dark:text-[#F7F1EB]/50 md:flex-row md:items-center md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} College of Engineering Guindy • MCA Class of '28.</p>

          <p className="text-amber-700/80 dark:text-amber-400/70 font-medium">
            Crafted with care & perseverance.
          </p>

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
