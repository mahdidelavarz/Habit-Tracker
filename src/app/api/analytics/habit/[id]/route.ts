import { NextResponse } from "next/server";
import { eachDayOfInterval, parseISO } from "date-fns";
import { supabase } from "@/lib/supabase";
import { buildHeatmap, buildTrend, calculateStreaks, formatISODate, isHabitDueOnDate } from "@/lib/utils";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");

  if (!startDate || !endDate) {
    return NextResponse.json({ message: "Missing start_date or end_date." }, { status: 400 });
  }

  const habitId = params.id;

  const [{ data: habit, error: habitError }, { data: completions, error: completionError }] = await Promise.all([
    supabase.from("habits").select("*").eq("id", habitId).single(),
    supabase
      .from("habit_completions")
      .select("*")
      .eq("habit_id", habitId)
      .gte("completion_date", startDate)
      .lte("completion_date", endDate),
  ]);

  if (habitError || !habit) {
    return NextResponse.json({ message: habitError?.message || "Habit not found." }, { status: 404 });
  }

  if (completionError) {
    return NextResponse.json({ message: completionError.message }, { status: 500 });
  }

  const completionList = completions ?? [];
  const rangeDays = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) });
  const dueDays = rangeDays.filter((day) => isHabitDueOnDate(habit, day));
  const completionSet = new Set(completionList.map((completion) => completion.completion_date));
  const completedDays = dueDays.filter((day) => completionSet.has(formatISODate(day))).length;
  const daysMissed = dueDays.length - completedDays;
  const { currentStreak, bestStreak } = calculateStreaks(habit, completionList, endDate);

  return NextResponse.json({
    habit,
    completionRate: dueDays.length > 0 ? completedDays / dueDays.length : 0,
    totalCompletions: completionList.length,
    currentStreak,
    bestStreak,
    daysCompleted: completedDays,
    daysMissed,
    trend: buildTrend(habit, { startDate, endDate }, completionList),
    heatmap: buildHeatmap(habit, parseISO(endDate), completionList),
  });
}

