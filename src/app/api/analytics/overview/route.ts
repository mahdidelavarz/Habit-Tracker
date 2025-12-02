import { NextResponse } from "next/server";
import { eachDayOfInterval, parseISO } from "date-fns";
import { supabase } from "@/lib/supabase";
import { calculateStreaks, formatISODate, isHabitDueOnDate } from "@/lib/utils";
import { Habit } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");

  if (!startDate || !endDate) {
    return NextResponse.json({ message: "Missing start_date or end_date" }, { status: 400 });
  }

  const [{ data: habits, error: habitsError }, { data: completions, error: completionError }] = await Promise.all([
    supabase.from("habits").select("*"),
    supabase
      .from("habit_completions")
      .select("*")
      .gte("completion_date", startDate)
      .lte("completion_date", endDate),
  ]);

  if (habitsError || completionError) {
    return NextResponse.json({ message: habitsError?.message || completionError?.message }, { status: 500 });
  }

  const habitList = (habits ?? []) as Habit[];
  const completionList = completions ?? [];
  const rangeDays = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) });

  const completionsByHabit = completionList.reduce<Record<string, string[]>>((acc, completion) => {
    acc[completion.habit_id] = acc[completion.habit_id] ?? [];
    acc[completion.habit_id].push(completion.completion_date);
    return acc;
  }, {});

  const habitStats = habitList.map((habit) => {
    const dueDates = rangeDays.filter((day) => isHabitDueOnDate(habit, day));
    const completionSet = new Set(completionsByHabit[habit.id] ?? []);
    const completedDays = dueDates.filter((day) => completionSet.has(formatISODate(day))).length;
    const { currentStreak, bestStreak } = calculateStreaks(
      habit,
      (completionList ?? []).filter((item) => item.habit_id === habit.id),
      endDate,
    );
    return {
      habit,
      dueDays: dueDates.length,
      completedDays,
      currentStreak,
      bestStreak,
    };
  });

  const totalDue = habitStats.reduce((sum, stat) => sum + stat.dueDays, 0);
  const totalCompleted = habitStats.reduce((sum, stat) => sum + stat.completedDays, 0);
  const completionRate = totalDue > 0 ? totalCompleted / totalDue : 0;

  const bestHabit = habitStats
    .map((stat) => ({
      habit_id: stat.habit.id,
      name: stat.habit.name,
      completionRate: stat.dueDays > 0 ? stat.completedDays / stat.dueDays : 0,
    }))
    .sort((a, b) => b.completionRate - a.completionRate)[0];

  const trend = rangeDays.map((day) => {
    const iso = formatISODate(day);
    const due = habitStats.filter((stat) =>
      isHabitDueOnDate(stat.habit, day),
    ).length;
    const completed = completionList.filter(
      (item) => item.completion_date === iso && habitList.some((habit) => isHabitDueOnDate(habit, day)),
    ).length;

    return {
      date: iso,
      completed,
      due,
    };
  });

  const weeklyPerformance = Array.from({ length: 7 }).map((_, weekday) => {
    let due = 0;
    let completed = 0;
    rangeDays.forEach((day) => {
      if (day.getDay() !== weekday) return;
      habitList.forEach((habit) => {
        if (isHabitDueOnDate(habit, day)) {
          due += 1;
          const iso = formatISODate(day);
          if (completionsByHabit[habit.id]?.includes(iso)) {
            completed += 1;
          }
        }
      });
    });
    return {
      weekday,
      completionRate: due > 0 ? completed / due : 0,
    };
  });

  return NextResponse.json({
    totalHabits: habitList.length,
    completionRate,
    totalCompletions: completionList.length,
    bestHabit,
    longestStreak: habitStats.reduce((max, stat) => Math.max(max, stat.bestStreak), 0),
    trend,
    habitComparison: habitStats.map((stat) => ({
      habit_id: stat.habit.id,
      name: stat.habit.name,
      completionRate: stat.dueDays > 0 ? stat.completedDays / stat.dueDays : 0,
    })),
    weeklyPerformance,
  });
}

