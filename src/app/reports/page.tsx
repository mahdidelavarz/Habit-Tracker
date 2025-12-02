'use client';

import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useHabits } from "@/hooks/useHabits";
import { fetchHabitAnalytics, useAnalyticsOverview } from "@/hooks/useAnalytics";
import { AnalyticsOverview as OverviewSection } from "@/components/analytics/AnalyticsOverview";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { createDateRange, cn } from "@/lib/utils";

const defaultRange = { ...createDateRange(30), preset: "30" as const };

export default function ReportsPage() {
  const [range, setRange] = useState(defaultRange);
  const { data: habits = [] } = useHabits();
  const overviewQuery = useAnalyticsOverview(range);

  const habitQueries = useQueries({
    queries: habits.map((habit) => ({
      queryKey: ["analytics", "habit", habit.id, range.startDate, range.endDate],
      queryFn: () => fetchHabitAnalytics(habit.id, range),
      enabled: habits.length > 0,
    })),
  });

  const handlePresetChange = (preset: "7" | "30" | "90" | "custom") => {
    if (preset === "custom") return;
    setRange({ ...createDateRange(Number(preset)), preset });
  };

  const handleCustomRangeChange = (field: "startDate" | "endDate", value: string) => {
    setRange((prev) => ({
      ...prev,
      [field]: value,
      preset: "custom",
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Reports</p>
            <h1 className="text-3xl font-bold text-slate-900">Progress & analytics</h1>
            <p className="text-sm text-slate-500">Understand trends, streaks, and performance.</p>
          </div>
          <div className="flex gap-3">
            <DatePicker label="From" value={range.startDate} onChange={(event) => handleCustomRangeChange("startDate", event.target.value)} />
            <DatePicker label="To" value={range.endDate} onChange={(event) => handleCustomRangeChange("endDate", event.target.value)} />
          </div>
        </header>

        <section className="mt-10">
          {overviewQuery.isLoading && <p>Loading overview...</p>}
          {overviewQuery.error && <p className="text-red-500">Failed to load analytics.</p>}
          {overviewQuery.data && (
            <OverviewSection overview={overviewQuery.data} dateRange={range} onPresetChange={handlePresetChange} />
          )}
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Per-habit analytics</h2>
            <Button variant="ghost" size="sm">
              Export CSV
            </Button>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {habits.map((habit, index) => {
              const analytics = habitQueries[index]?.data;
              return (
                <article key={habit.id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{habit.name}</h3>
                      <p className="text-sm text-slate-500">Completion insights</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
                      {Math.round((analytics?.completionRate ?? 0) * 100)}%
                    </span>
                  </div>
                  {!analytics && <p className="mt-4 text-sm text-slate-500">Loading...</p>}
                  {analytics && (
                    <>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-slate-500">Total completions</p>
                          <p className="text-2xl font-semibold text-slate-900">{analytics.totalCompletions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Current streak</p>
                          <p className="text-2xl font-semibold text-slate-900">{analytics.currentStreak} days</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Best streak</p>
                          <p className="text-2xl font-semibold text-slate-900">{analytics.bestStreak} days</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Days completed vs missed</p>
                          <p className="text-2xl font-semibold text-slate-900">
                            {analytics.daysCompleted}/{analytics.daysMissed + analytics.daysCompleted}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <p className="text-sm font-semibold text-slate-700">Trend</p>
                        <div className="mt-3 flex gap-2">
                          {analytics.trend.map((point) => (
                            <span key={point.date} className="block flex-1 rounded-full bg-slate-100">
                              <span
                                className={cn("block rounded-full bg-blue-500 text-xs text-transparent", {
                                  "bg-green-500": point.completed === point.due,
                                })}
                                style={{ height: `${(point.completed / Math.max(point.due, 1)) * 100}%` }}
                              >
                                .
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-6">
                        <p className="text-sm font-semibold text-slate-700">Monthly heatmap</p>
                        <div className="mt-3 grid grid-cols-7 gap-1 text-xs text-slate-400">
                          {analytics.heatmap.map((cell) => (
                            <span
                              key={cell.date}
                              className={cn("h-7 rounded-md border border-slate-100", {
                                "bg-slate-100": cell.intensity === 0,
                                "bg-slate-300": cell.intensity === 1,
                                "bg-blue-500": cell.intensity >= 2,
                              })}
                              title={`${cell.date} - ${cell.completed ? "Completed" : "Missed"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

