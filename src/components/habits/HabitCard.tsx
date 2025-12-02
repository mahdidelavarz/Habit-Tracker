"use client";

import { CheckCircle2, Circle, Edit3, Pause, Trash2 } from "lucide-react";
import { Habit } from "@/types";
import { HABIT_ICONS } from "@/lib/icons";
import { cn, isFutureDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface HabitCardProps {
  habit: Habit;
  color?: string;
  completed: boolean;
  streak?: number;
  date: string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export const HabitCard = ({
  habit,
  color = habit.color,
  completed,
  streak,
  date,
  onToggle,
  onEdit,
  onDelete,
  disabled,
}: HabitCardProps) => {
  const Icon = (habit.icon && HABIT_ICONS[habit.icon]) || HABIT_ICONS.target;

  return (
    <article
      className={cn(
        "relative flex w-full flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        disabled && "opacity-70",
      )}
      style={{ borderLeft: `6px solid ${color}` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-700"
            style={{ color }}
            aria-hidden
          >
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{habit.name}</h3>
            {habit.description && <p className="text-sm text-slate-500">{habit.description}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-blue-600"
            aria-label="Edit habit"
            onClick={onEdit}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-red-600"
            aria-label="Archive habit"
            onClick={onDelete}
          >
            {habit.archived ? <Pause className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-6">
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled || isFutureDate(date)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
            completed
              ? "border-green-100 bg-green-50 text-green-600"
              : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600",
          )}
        >
          {completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
          {completed ? "Completed" : "Mark complete"}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500">Current streak</span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
            {streak ?? 0} days
          </span>
        </div>
      </div>
    </article>
  );
};

