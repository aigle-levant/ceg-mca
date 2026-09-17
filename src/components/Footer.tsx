import { ArrowUpRight, GraduationCap } from "lucide-react";
import type { PageId } from "@/hooks/useNavigation";

const navigation: { id: PageId; label: string; href: string }[] = [
  { id: "dashboard", label: "Dashboard", href: "#/" },
  { id: "timetable", label: "Timetable", href: "#/timetable" },
  { id: "exams", label: "Exams", href: "#/exams" },
  { id: "subjects", label: "Subjects", href: "#/subjects" },
  { id: "staff", label: "Staff", href: "#/staff" },
];

interface FooterProps {
  onNavigate?: (page: PageId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-border/80 bg-[#150F12] text-[#F7F1EB]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24 pb-24 md:pb-24">
        {/* Hero */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400/80">
              Department of Computer Science & Engineering
            </p>

            <h2 className="mt-6 max-w-3xl text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.05em] text-[#FFFDF9]">
              Heritage.
              <br />
              Excellence.
            </h2>
          </div>
        </div>

        {/* Divider */}
        <div className="my-14 h-px bg-white/10" />

        {/* Content */}
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/40">
                <GraduationCap className="size-5 text-primary" />
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-[#FFFDF9]">
                CEG MCA<span className="text-amber-400">.</span>
              </h3>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#F7F1EB]/60">
              A crafted dashboard for Anna University MCA students to effortlessly
              track timetables, ongoing lectures, examinations, and faculty details.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/80">
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
                  className="text-sm text-[#F7F1EB]/70 transition-colors hover:text-amber-400"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-[#F7F1EB]/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} College of Engineering Guindy • MCA Class.</p>

          <p className="text-amber-400/60">Crafted with Indian Heritage Elegance.</p>

          <a
            href="https://github.com/aigle-levant/ceg-mca"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-amber-400"
          >
            Source Code
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
