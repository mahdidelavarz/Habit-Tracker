import { useQuery } from "@tanstack/react-query";
import { AnalyticsOverview, DateRange, HabitAnalytics } from "@/types";

export const fetchOverview = async (range: DateRange): Promise<AnalyticsOverview> => {
  const params = new URLSearchParams({
    start_date: range.startDate,
    end_date: range.endDate,
  });
  const response = await fetch(`/api/analytics/overview?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to load analytics overview");
  }
  return response.json();
};

export const fetchHabitAnalytics = async (habitId: string, range: DateRange): Promise<HabitAnalytics> => {
  const params = new URLSearchParams({
    start_date: range.startDate,
    end_date: range.endDate,
  });
  const response = await fetch(`/api/analytics/habit/${habitId}?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to load habit analytics");
  }
  return response.json();
};

export const useAnalyticsOverview = (range: DateRange) =>
  useQuery<AnalyticsOverview>({
    queryKey: ["analytics", "overview", range.startDate, range.endDate],
    queryFn: () => fetchOverview(range),
  });

export const useHabitAnalytics = (habitId?: string, range?: DateRange) =>
  useQuery<HabitAnalytics>({
    queryKey: ["analytics", "habit", habitId, range?.startDate, range?.endDate],
    queryFn: () => {
      if (!habitId || !range) {
        return Promise.reject(new Error("Missing habit id or range"));
      }
      return fetchHabitAnalytics(habitId, range);
    },
    enabled: Boolean(habitId && range),
  });

