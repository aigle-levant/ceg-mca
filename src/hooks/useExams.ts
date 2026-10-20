import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { ExamRecord } from "@/types/exams";

export function useExams() {
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchExams() {
      try {
        const response = await supabase
          .from("exams")
          .select("*, courses(*)")
          .order("exam_date", { ascending: true });

        const { data, error: queryError, status, statusText } = response;

        console.log("[useExams] raw response:", { data, error: queryError, status, statusText });

        if (!isMounted) return;

        if (queryError) {
          throw new Error(`${queryError.code}: ${queryError.message} (${queryError.details})`);
        }

        console.log(`[useExams] loaded ${data?.length ?? 0} exam(s)`);
        setExams((data as unknown as ExamRecord[]) || []);
      } catch (err: unknown) {
        if (!isMounted) return;
        console.error("[useExams] fetch failed:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load exams from Supabase"
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchExams();

    // Subscribe to live realtime changes in exams table
    const channel = supabase
      .channel("public:exams")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "exams" },
        () => {
          fetchExams();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { exams, loading, error };
}
