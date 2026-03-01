import { useEffect } from "react";

export function useLearningStreak(pathname: string) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split("T")[0];

    const lastVisit = localStorage.getItem("mycampus:lastVisit");
    const storedStreak = parseInt(localStorage.getItem("mycampus:streak") || "0", 10);

    if (lastVisit !== todayISO) {
      const nextStreak = lastVisit === yesterdayISO ? Math.max(storedStreak, 1) + 1 : 1;
      localStorage.setItem("mycampus:streak", String(nextStreak));
      localStorage.setItem("mycampus:lastVisit", todayISO);
      localStorage.setItem("mycampus:todayMinutes", "0");
    }
  }, [pathname]);
}
