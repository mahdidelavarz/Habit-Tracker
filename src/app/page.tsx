'use client';

import { useMemo, useState } from "react";
import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { useQueries } from "@tanstack/react-query";
import { PlusCircle, Flame, CheckCircle2, Trophy } from "lucide-react";
import { useHabits, useCreateHabit, useUpdateHabit, useDeleteHabit } from "@/hooks/useHabits";
import { fetchCompletions, useToggleCompletion } from "@/hooks/useCompletions";
import { useHabitStore } from "@/stores/habitStore";
import { HabitList } from "@/components/habits/HabitList";
import { HabitModal } from "@/components/habits/HabitModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Habit, HabitCompletion, HabitPayload } from "@/types";
import {
  buildHeatmap,
  formatISODate,
  getCurrentMonthLabel,
  isHabitDueOnDate,
  todayISO,
} from "@/lib/utils";
import { MonthlyHeatmap } from "@/components/habits/MonthlyHeatmap";
import { StatsCard } from "@/components/analytics/StatsCard";

const formatDateLabel = (date: string) => format(new Date(date), "EEEE, MMM d");

export default function DashboardPage() {
  const { data: habits = [], isLoading } = useHabits();
  const toggleCompletion = useToggleCompletion();
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();

  const {
    selectedDate,
    setDate,
    modalOpen,
    modalMode,
    editingHabit,
    openCreateModal,
    openEditModal,
    closeModal,
    confirmOpen,
    confirmHabit,
    openConfirm,
    closeConfirm,
  } = useHabitStore();
  const modalKey = modalMode === "edit" ? editingHabit?.id ?? "edit" : "create";

  const [heatmapMonth, setHeatmapMonth] = useState(new Date());

  const dayRange = useMemo(
    () => ({ startDate: selectedDate, endDate: selectedDate }),
    [selectedDate],
  );
  const monthRange = useMemo(
    () => ({
      startDate: formatISODate(startOfMonth(heatmapMonth)),
      endDate: formatISODate(endOfMonth(heatmapMonth)),
    }),
    [heatmapMonth],
  );

  const completionQueries = useQueries({
    queries: habits.map((habit) => ({
      queryKey: ["completions", habit.id, dayRange.startDate, dayRange.endDate],
      queryFn: () => fetchCompletions(habit.id, dayRange),
      enabled: habits.length > 0,
    })),
  });

  const heatmapQueries = useQueries({
    queries: habits.map((habit) => ({
      queryKey: ["heatmap", habit.id, monthRange.startDate, monthRange.endDate],
      queryFn: () => fetchCompletions(habit.id, monthRange),
      enabled: habits.length > 0,
    })),
  });

  const completionsByHabit = useMemo(() => {
    const map: Record<string, HabitCompletion[]> = {};
    habits.forEach((habit, index) => {
      map[habit.id] = completionQueries[index]?.data ?? [];
    });
    return map;
  }, [completionQueries, habits]);

  const heatmapData = useMemo(() => {
    const map: Record<string, HabitCompletion[]> = {};
    habits.forEach((habit, index) => {
      map[habit.id] = heatmapQueries[index]?.data ?? [];
    });
    return map;
  }, [heatmapQueries, habits]);

  const dueToday = habits.filter((habit) => isHabitDueOnDate(habit, selectedDate));
  const completedToday = dueToday.filter((habit) =>
    (completionsByHabit[habit.id] ?? []).some((completion) => completion.completion_date === selectedDate),
  );
  const todayCompletionRate = dueToday.length > 0 ? Math.round((completedToday.length / dueToday.length) * 100) : 0;
  const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.current_streak ?? 0), 0);

  const handleToggle = (habit: Habit, completed: boolean, completionId?: string) => {
    toggleCompletion.mutate({
      habitId: habit.id,
      date: selectedDate,
      completionId,
      completed: !completed,
    });
  };

  const handleHabitSubmit = (payload: HabitPayload) => {
    if (modalMode === "edit" && editingHabit) {
      updateHabit.mutate(
        { id: editingHabit.id, data: payload },
        {
          onSuccess: () => closeModal(),
        },
      );
    } else {
      createHabit.mutate(payload, {
        onSuccess: () => closeModal(),
      });
    }
  };

  const handleDeleteHabit = () => {
    if (!confirmHabit) return;
    deleteHabit.mutate(confirmHabit.id, {
      onSuccess: () => closeConfirm(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{formatDateLabel(selectedDate)}</p>
            <h1 className="text-3xl font-bold text-slate-900">Stay on track</h1>
            <p className="text-sm text-slate-500">Build streaks, celebrate wins.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setDate(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <Button variant="secondary" size="sm" className="border border-slate-200" onClick={() => setDate(todayISO())}>
              Today
            </Button>
            <Button onClick={openCreateModal} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add habit
            </Button>
          </div>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard label="Total habits" value={`${habits.length}`} icon={<Flame className="h-5 w-5" />} />
          <StatsCard
            label="Today&apos;s completion rate"
            value={`${todayCompletionRate}%`}
            helper={`${completedToday.length}/${dueToday.length || 0} due today`}
            icon={<CheckCircle2 className="h-5 w-5" />}
            accent="success"
          />
          <StatsCard
            label="Current streak"
            value={`${longestStreak} days`}
            helper="Longest active streak"
            icon={<Trophy className="h-5 w-5" />}
            accent="warning"
          />
          <StatsCard
            label="Active habits"
            value={`${habits.filter((habit) => !habit.archived).length}`}
            helper="Pause or archive anytime"
            icon={<Flame className="h-5 w-5" />}
            accent="danger"
          />
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Today&apos;s habits</h2>
                <p className="text-sm text-slate-500">Habits due on {formatDateLabel(selectedDate)}</p>
              </div>
            </div>
            <div className="mt-6">
              {isLoading ? (
                <p className="text-sm text-slate-500">Loading habits...</p>
              ) : (
                <HabitList
                  habits={habits}
                  selectedDate={selectedDate}
                  completionsByHabit={completionsByHabit}
                  onToggle={handleToggle}
                  onEdit={openEditModal}
                  onDelete={openConfirm}
                />
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Quick tips</h3>
            <ul className="mt-4 space-y-4 text-sm text-slate-600">
              <li>Tap a habit to log a completion. Streaks update instantly.</li>
              <li>Use filters to jump between days or focus on key habits.</li>
              <li>Head to Reports for deeper analytics and exports.</li>
            </ul>
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white">
              <p className="text-sm uppercase tracking-wide opacity-70">Streak boost</p>
              <p className="mt-2 text-2xl font-semibold">Complete 5 days in a row to unlock a celebration</p>
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Monthly heatmaps</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setHeatmapMonth(addMonths(heatmapMonth, -1))}>
                Previous
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setHeatmapMonth(addMonths(heatmapMonth, 1))}>
                Next
              </Button>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {habits.map((habit) => (
              <MonthlyHeatmap
                key={habit.id}
                habit={habit}
                monthLabel={getCurrentMonthLabel(heatmapMonth)}
                data={buildHeatmap(habit, heatmapMonth, heatmapData[habit.id] ?? [])}
                onPrev={() => setHeatmapMonth(addMonths(heatmapMonth, -1))}
                onNext={() => setHeatmapMonth(addMonths(heatmapMonth, 1))}
              />
            ))}
          </div>
        </section>
      </div>

      {modalOpen && (
        <HabitModal
          key={modalKey}
          open={modalOpen}
          mode={modalMode}
          initialData={editingHabit}
          onClose={closeModal}
          onSubmit={handleHabitSubmit}
          loading={createHabit.isPending || updateHabit.isPending}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete habit"
        message={
          confirmHabit
            ? `Are you sure you want to delete "${confirmHabit.name}"? This cannot be undone.`
            : "Are you sure you want to delete this habit? This cannot be undone."
        }
        destructive
        onConfirm={handleDeleteHabit}
        onCancel={closeConfirm}
        loading={deleteHabit.isPending}
      />
    </div>
  );
}
