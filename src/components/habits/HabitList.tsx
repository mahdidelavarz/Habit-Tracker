"use client";

import { Habit, HabitCompletion } from "@/types";
import { HabitCard } from "./HabitCard";
import { isHabitDueOnDate } from "@/lib/utils";

interface HabitListProps {
  habits: Habit[];
  selectedDate: string;
  completionsByHabit: Record<string, HabitCompletion[]>;
  streaks?: Record<string, number>;
  onToggle: (habit: Habit, completed: boolean, completionId?: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export const HabitList = ({
  habits,
  selectedDate,
  completionsByHabit,
  streaks = {},
  onToggle,
  onEdit,
  onDelete,
}: HabitListProps) => {
  const dueHabits = habits.filter((habit) => isHabitDueOnDate(habit, selectedDate));

  if (dueHabits.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
        <p className="text-base font-semibold text-slate-700">No habits due today</p>
        <p className="mt-2 text-sm text-slate-500">Create a new habit or adjust filters to see more.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {dueHabits.map((habit) => {
        const completions = completionsByHabit[habit.id] ?? [];
        const completionForDate = completions.find((completion) => completion.completion_date === selectedDate);
        const completed = Boolean(completionForDate);
        return (
          <HabitCard
            key={habit.id}
            habit={habit}
            completed={completed}
            streak={streaks[habit.id] ?? habit.current_streak ?? 0}
            date={selectedDate}
            onToggle={() => onToggle(habit, completed, completionForDate?.id)}
            onEdit={() => onEdit(habit)}
            onDelete={() => onDelete(habit)}
          />
        );
      })}
    </div>
  );
};

