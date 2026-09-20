import { useState, useEffect, useCallback } from "react";

export type PageId = "dashboard" | "timetable" | "exams" | "subjects" | "staff" | "mess";

export function useNavigation() {
  const getPageFromHash = (): PageId => {
    const raw = window.location.hash.replace(/^#\/?/, "").toLowerCase();
    if (raw === "timetable") return "timetable";
    if (raw === "exams") return "exams";
    if (raw === "subjects") return "subjects";
    if (raw === "staff") return "staff";
    if (raw === "mess" || raw === "mess-menu") return "mess";
    return "dashboard";
  };

  const [currentPage, setCurrentPage] = useState<PageId>(getPageFromHash);

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPage(getPageFromHash());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((page: PageId) => {
    const targetHash = page === "dashboard" ? "#/" : `#/${page}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
  }, []);

  return { currentPage, navigate };
}
