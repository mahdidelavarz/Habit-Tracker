import { AnalyticsOverview as OverviewType, DateRange } from "@/types";
import { StatsCard } from "./StatsCard";
import { ProgressChart } from "./ProgressChart";
import { Button } from "@/components/ui/Button";

interface AnalyticsOverviewProps {
  overview: OverviewType;
  dateRange: DateRange;
  onPresetChange: (preset: "7" | "30" | "90" | "custom") => void;
}

const PRESETS: { label: string; preset: "7" | "30" | "90" }[] = [
  { label: "Last 7 days", preset: "7" },
  { label: "Last 30 days", preset: "30" },
  { label: "Last 90 days", preset: "90" },
];

export const AnalyticsOverview = ({ overview, dateRange, onPresetChange }: AnalyticsOverviewProps) => (
  <section className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Progress Overview</h2>
        <p className="text-sm text-slate-500">
          Tracking from {dateRange.startDate} to {dateRange.endDate}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.preset}
            variant={dateRange.preset === preset.preset ? "primary" : "ghost"}
            size="sm"
            onClick={() => onPresetChange(preset.preset)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard label="Total habits" value={`${overview.totalHabits}`} helper="Active habits you track" />
      <StatsCard
        label="Completion rate"
        value={`${Math.round(overview.completionRate * 100)}%`}
        helper="Average rate for selected period"
        accent="success"
      />
      <StatsCard
        label="Total completions"
        value={`${overview.totalCompletions}`}
        helper="All logged completions"
        accent="warning"
      />
      <StatsCard
        label="Longest streak"
        value={`${overview.longestStreak} days`}
        helper={overview.bestHabit ? `Best habit: ${overview.bestHabit.name}` : "Keep building streaks"}
        accent="danger"
      />
    </div>
    <ProgressChart title="Completion trend" data={overview.trend} />
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Habits comparison</h3>
      <div className="mt-4 space-y-3">
        {overview.habitComparison.map((item) => (
          <div key={item.habit_id}>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
              <span>{item.name}</span>
              <span>{Math.round(item.completionRate * 100)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-500" style={{ width: `${item.completionRate * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Weekly performance</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overview.weeklyPerformance.map((day) => (
          <div key={day.weekday} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
            <p className="text-sm font-medium text-slate-500">Day {day.weekday}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{Math.round(day.completionRate * 100)}%</p>
          </div>
        ))}
      </div>
    </section>
  </section>
);

