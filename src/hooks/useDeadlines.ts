import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { DeadlineRecord } from "@/types/deadlines";

export function useDeadlines() {
  const [deadlines, setDeadlines] = useState<DeadlineRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeadlines = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: queryError } = await supabase
        .from("deadlines")
        .select("*, courses(*), batches(*)")
        .order("due_date", { ascending: true });

      if (queryError) {
        throw new Error(queryError.message);
      }

      setDeadlines((data as unknown as DeadlineRecord[]) || []);
    } catch (err: unknown) {
      console.error("Error fetching deadlines from Supabase:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load deadlines from Supabase"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initialFetch() {
      try {
        const { data, error: queryError } = await supabase
          .from("deadlines")
          .select("*, courses(*), batches(*)")
          .order("due_date", { ascending: true });

        if (!isMounted) return;

        if (queryError) {
          throw new Error(queryError.message);
        }

        setDeadlines((data as unknown as DeadlineRecord[]) || []);
      } catch (err: unknown) {
        if (!isMounted) return;
        setError(
          err instanceof Error ? err.message : "Failed to load deadlines from Supabase"
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initialFetch();

    // Subscribe to live realtime changes in deadlines table
    const channel = supabase
      .channel("public:deadlines")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "deadlines" },
        () => {
          initialFetch();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const updateDeadline = useCallback(
    async (
      id: string,
      updates: { title: string; description: string | null }
    ) => {
      const { error: updateError } = await supabase
        .from("deadlines")
        .update({
          title: updates.title,
          description: updates.description,
        })
        .eq("id", id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setDeadlines((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                title: updates.title,
                description: updates.description,
              }
            : item
        )
      );
    },
    []
  );

  return { deadlines, loading, error, refresh: fetchDeadlines, updateDeadline };
}
