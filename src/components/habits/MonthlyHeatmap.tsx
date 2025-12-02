"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeatmapCell, Habit } from "@/types";
import { WEEKDAY_LABELS, cn } from "@/lib/utils";

interface MonthlyHeatmapProps {
  habit: Habit;
  monthLabel: string;
  data: HeatmapCell[];
  onPrev: () => void;
  onNext: () => void;
}

const intensityClass = (value: number) => {
  switch (value) {
    case 0:
      return "bg-slate-100";
    case 1:
      return "bg-slate-300";
    case 2:
      return "bg-blue-400";
    default:
      return "bg-slate-200";
  }
};

export const MonthlyHeatmap = ({ habit, monthLabel, data, onPrev, onNext }: MonthlyHeatmapProps) => {
  const weeks: (HeatmapCell | undefined)[][] = [];
  let currentWeek: (HeatmapCell | undefined)[] = Array(7).fill(undefined);

  data.forEach((cell) => {
    const date = new Date(cell.date);
    const weekday = date.getDay();
    if (weekday === 0 && currentWeek.some(Boolean)) {
      weeks.push(currentWeek);
      currentWeek = Array(7).fill(undefined);
    }
    currentWeek[weekday] = cell;
  });
  if (currentWeek.some(Boolean)) {
    weeks.push(currentWeek);
  }
  if (weeks.length === 0) {
    weeks.push(Array(7).fill(undefined));
  }

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{habit.name}</h3>
          <p className="text-sm text-slate-500">Monthly heatmap</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-slate-700">{monthLabel}</span>
          <button
            type="button"
            onClick={onNext}
            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-6 flex gap-4 overflow-x-auto">
        <div className="flex flex-col gap-2 text-xs text-slate-400">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className="h-8 leading-8">
              {label}
            </span>
          ))}
        </div>
        <div className="flex gap-1">
          {weeks.map((week, columnIndex) => (
            <div key={`week-${columnIndex}`} className="grid gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const cell = week[dayIndex];
                return (
                  <span
                    key={`${columnIndex}-${dayIndex}`}
                    className={cn(
                      "h-8 w-8 rounded-md border border-slate-100 transition hover:scale-110",
                      intensityClass(cell?.intensity ?? 0),
                    )}
                    title={
                      cell
                        ? `${cell.date} • ${cell.completed ? "Completed" : cell.intensity === 1 ? "Due" : "No data"}`
                        : "No data"
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3 text-xs text-slate-500">
        <span>Legend:</span>
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((value) => (
            <span key={value} className="flex items-center gap-1">
              <span className={cn("h-3 w-6 rounded", intensityClass(value))} />
              {value === 0 && "No data"}
              {value === 1 && "Due"}
              {value === 2 && "Completed"}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

