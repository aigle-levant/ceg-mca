import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { StaffRecord, StaffAssignmentRecord } from "@/types/staff";

export function useStaff() {
  const [staff, setStaff] = useState<StaffRecord[]>([]);
  const [staffAssignments, setStaffAssignments] = useState<StaffAssignmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaffData = useCallback(async () => {
    setLoading(true);
    try {
      const [staffRes, assignmentsRes] = await Promise.all([
        supabase
          .from("staff")
          .select("*")
          .order("staff_name", { ascending: true }),
        supabase
          .from("staff_assignments")
          .select("*, batches(id, batch), courses(id, course_code, course_name, category, course_type), staff(id, staff_name)")
      ]);

      if (staffRes.error) {
        throw new Error(staffRes.error.message);
      }
      if (assignmentsRes.error) {
        throw new Error(assignmentsRes.error.message);
      }

      setStaff((staffRes.data as StaffRecord[]) || []);
      setStaffAssignments((assignmentsRes.data as unknown as StaffAssignmentRecord[]) || []);
    } catch (err: unknown) {
      console.error("Error fetching staff data from Supabase:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load staff data from Supabase"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initialFetch() {
      try {
        const [staffRes, assignmentsRes] = await Promise.all([
          supabase
            .from("staff")
            .select("*")
            .order("staff_name", { ascending: true }),
          supabase
            .from("staff_assignments")
            .select("*, batches(id, batch), courses(id, course_code, course_name, category, course_type), staff(id, staff_name)")
        ]);

        if (!isMounted) return;

        if (staffRes.error) throw new Error(staffRes.error.message);
        if (assignmentsRes.error) throw new Error(assignmentsRes.error.message);

        setStaff((staffRes.data as StaffRecord[]) || []);
        setStaffAssignments((assignmentsRes.data as unknown as StaffAssignmentRecord[]) || []);
      } catch (err: unknown) {
        if (!isMounted) return;
        setError(
          err instanceof Error ? err.message : "Failed to load staff data from Supabase"
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initialFetch();

    // Subscribe to realtime changes on both staff and staff_assignments
    const channel = supabase
      .channel("public:staff_directory")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "staff" },
        () => {
          initialFetch();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "staff_assignments" },
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

  return { staff, staffAssignments, loading, error, refresh: fetchStaffData };
}
