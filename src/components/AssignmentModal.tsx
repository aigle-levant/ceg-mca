import { useState, useEffect } from "react";
import {
  X,
  Save,
  Clock,
  Calendar,
  FlaskConical,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeadlineRecord } from "@/types/deadlines";

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: DeadlineRecord | null;
  onSave: (
    id: string,
    updates: { title: string; description: string | null }
  ) => Promise<void>;
}

function getDeadlineMeta(dateStr: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dateStr.split("-").map(Number);
    const target =
      parts.length === 3
        ? new Date(parts[0], parts[1] - 1, parts[2])
        : new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const dateFormatted = target.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (diffDays === 0)
      return { label: "Due Today", badge: dateFormatted, urgent: true, diffDays };
    if (diffDays === 1)
      return { label: "Due Tomorrow", badge: dateFormatted, urgent: true, diffDays };
    if (diffDays > 1 && diffDays <= 3)
      return { label: `Due in ${diffDays} days`, badge: dateFormatted, urgent: true, diffDays };
    if (diffDays > 3)
      return { label: `Due in ${diffDays} days`, badge: dateFormatted, urgent: false, diffDays };
    if (diffDays < 0)
      return {
        label: diffDays === -1 ? "Due Yesterday" : `Past Due (${Math.abs(diffDays)}d ago)`,
        badge: dateFormatted,
        urgent: true,
        diffDays,
      };

    return { label: `Due ${dateFormatted}`, badge: dateFormatted, urgent: false, diffDays };
  } catch {
    return { label: dateStr, badge: dateStr, urgent: false, diffDays: 0 };
  }
}

export function AssignmentModal({
  isOpen,
  onClose,
  assignment,
  onSave,
}: AssignmentModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state whenever the assignment changes or modal opens
  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title || "");
      setDescription(assignment.description || "");
      setError(null);
      setSaveSuccess(false);
    }
  }, [assignment, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Ctrl+Enter or Cmd+Enter to save
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, title, description, isSaving, assignment]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !assignment) return null;

  const isLab =
    assignment.courses?.course_type?.toLowerCase() === "lab" ||
    assignment.courses?.course_code?.toLowerCase().includes("lab") ||
    assignment.courses?.course_name?.toLowerCase().includes("lab") ||
    assignment.title.toLowerCase().includes("lab");

  const meta = getDeadlineMeta(assignment.due_date);
  const isFallback = assignment.id.startsWith("fallback-");

  const isDirty =
    title.trim() !== (assignment.title || "").trim() ||
    description.trim() !== (assignment.description || "").trim();

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Assignment title cannot be empty.");
      return;
    }

    if (isFallback) {
      setError("This is local demo data and cannot be saved to Supabase without a database ID.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(assignment.id, {
        title: title.trim(),
        description: description.trim() ? description.trim() : null,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error("Failed to save assignment:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save assignment to Supabase. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="assignment-modal-title"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl border border-border/90 bg-card text-card-foreground shadow-2xl overflow-hidden transition-all duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-border/70 bg-muted/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Course code badge */}
              <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-mono font-bold text-foreground border border-border/70">
                {assignment.courses?.course_code || "MCA Course"}
              </span>

              {/* Lab or Theory badge */}
              {isLab ? (
                <span className="inline-flex items-center gap-1 rounded-lg bg-sky-500/15 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300 border border-sky-500/25">
                  <FlaskConical className="size-3.5" />
                  Lab
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-500/25">
                  <BookOpen className="size-3.5" />
                  Theory
                </span>
              )}

              {/* Batch badge if present */}
              {assignment.batches?.batch && (
                <span className="inline-flex items-center rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground border border-border/50">
                  Batch: {assignment.batches.batch}
                </span>
              )}

              {/* Due Date Status */}
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border",
                  meta.urgent
                    ? "bg-amber-500/15 border-amber-500/25 text-amber-700 dark:text-amber-300"
                    : "bg-sky-500/15 border-sky-500/25 text-sky-700 dark:text-sky-300"
                )}
              >
                {meta.urgent && (
                  <span className="size-1.5 animate-pulse rounded-full bg-amber-500 dark:bg-amber-400" />
                )}
                <Clock className="size-3" />
                {meta.label}
              </span>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
              title="Close (Esc)"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground/85">
              {assignment.courses?.course_name || "Anna University CEG"}
            </span>
            <span className="inline-flex items-center gap-1 font-mono">
              <Calendar className="size-3.5 text-muted-foreground/70" />
              {meta.badge}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Status Banners */}
          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 flex items-start gap-2.5 text-xs text-destructive animate-in fade-in">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to save</p>
                <p className="mt-0.5 opacity-90">{error}</p>
              </div>
            </div>
          )}

          {saveSuccess && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 flex items-center gap-2.5 text-xs text-emerald-600 dark:text-emerald-400 animate-in fade-in">
              <CheckCircle2 className="size-4 shrink-0" />
              <span className="font-semibold">
                Saved successfully to Supabase!
              </span>
            </div>
          )}

          {/* Title Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="assignment-modal-title"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Edit3 className="size-3.5 text-primary" />
                Assignment Title
              </label>
              <span className="text-[11px] text-muted-foreground">
                Editable by all
              </span>
            </div>
            <input
              id="assignment-modal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Activity - I: Socket Programming"
              disabled={isSaving}
              className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-base sm:text-lg font-bold text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-60"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="assignment-modal-desc"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <FileText className="size-3.5 text-primary" />
                Description & Instructions
              </label>
              <span className="text-[11px] text-muted-foreground">
                Markdown / Plain text
              </span>
            </div>
            <textarea
              id="assignment-modal-desc"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add assignment requirements, problem statements, lab observation tasks, links to Google Drive / Classroom, or submission format instructions..."
              disabled={isSaving}
              className="w-full rounded-xl border border-border/80 bg-background p-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all leading-relaxed resize-y disabled:opacity-60"
            />
          </div>

          {/* Live Sync Notice */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-3.5 flex items-start gap-2.5 text-xs text-muted-foreground">
            <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-foreground">
                Collaborative MCA Workspace:
              </span>{" "}
              Any classmate can view and update the title or description. All changes
              are saved directly to the database and synced in real-time.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-border/70 bg-muted/15 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1.5">
            <kbd className="rounded-md border border-border/60 bg-muted px-1.5 py-0.5 text-[10px] font-mono">
              Ctrl+Enter
            </kbd>
            <span>to save</span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl border border-border/80 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !title.trim() || (!isDirty && !error)}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95 disabled:pointer-events-none",
                isDirty || error
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground opacity-60"
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving to Supabase…</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>Save to Supabase</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
