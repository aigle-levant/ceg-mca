import { ArrowUpRight, GraduationCap } from "lucide-react";

const navigation = [
  { label: "Class", href: "#class" },
  { label: "Syllabus", href: "#syllabus" },
  { label: "Time Table", href: "#timetable" },
  { label: "Important Dates", href: "#important-dates" },
];

const resources = [
  "Upcoming Exams",
  "Upcoming Holidays",
  "Regular Timetable",
  "SS Timetable",
];

export function Footer() {
  return (
    <footer className="bg-[#223843] text-[#EFF1F3]">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 lg:px-16 lg:py-28">
        {/* Hero */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D8B4A0]">
              Everything your class needs.
            </p>

            <h2 className="mt-6 max-w-5xl text-[clamp(3.5rem,8vw,8.5rem)] font-medium leading-[0.84] tracking-[-0.065em]">
              Less confusion.
              <br />
              More learning.
            </h2>
          </div>
        </div>

        {/* Divider */}
        <div className="my-20 h-px bg-white/10" />

        {/* Content */}
        <div className="grid gap-14 lg:grid-cols-[2fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#D77A61]">
                <GraduationCap className="size-5 text-[#EFF1F3]" />
              </div>

              <h3 className="text-3xl font-semibold tracking-[-0.05em]">
                Class<span className="text-[#D77A61]">.</span>
              </h3>
            </div>

            <p className="mt-6 max-w-md text-base leading-8 text-[#EFF1F3]/70">
              A simple place for your class to keep track of timetables,
              syllabus, exams, holidays, and everything important.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D8B4A0]">
              Navigate
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="transition-colors hover:text-[#D77A61]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D8B4A0]">
              At a glance
            </p>

            <div className="mt-6 flex flex-col gap-4 text-[#EFF1F3]/70">
              {resources.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 flex flex-col gap-5 border-t border-white/10 pt-8 text-sm text-[#EFF1F3]/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Class Dashboard.</p>

          <p>Made for our class.</p>

          <a
            href="https://github.com/aigle-levant/voicekart-ai"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-[#D77A61]"
          >
            Built by us
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
