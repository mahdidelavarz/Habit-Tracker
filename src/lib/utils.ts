import { addDays, eachDayOfInterval, format, isAfter, isBefore, isEqual, isSameDay, parseISO, startOfDay } from "date-fns";
import { Habit, HabitCompletion, HeatmapCell, TrendPoint } from "@/types";

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const PRESET_DATE_RANGES: Record<string, number> = {
  "7": 7,
  "30": 30,
  "90": 90,
};

export const formatISODate = (value: Date | string) =>
  format(startOfDay(typeof value === "string" ? parseISO(value) : value), "yyyy-MM-dd");

export const todayISO = () => formatISODate(new Date());

export const createDateRange = (days: number) => {
  const end = startOfDay(new Date());
  const start = addDays(end, -(days - 1));
  return {
    startDate: formatISODate(start),
    endDate: formatISODate(end),
  };
};

export const isDateWithinRange = (date: string, startDate: string, endDate: string) => {
  const target = parseISO(date);
  return (
    (isEqual(target, parseISO(startDate)) || isAfter(target, parseISO(startDate))) &&
    (isEqual(target, parseISO(endDate)) || isBefore(target, parseISO(endDate)))
  );
};

const isWeekdayDue = (weekday: number, selectedDays?: number[] | null) =>
  Array.isArray(selectedDays) ? selectedDays.includes(weekday) : false;

const isMonthdayDue = (dayOfMonth: number, selectedDays?: number[] | null) =>
  Array.isArray(selectedDays) ? selectedDays.includes(dayOfMonth) : false;

export const isHabitDueOnDate = (habit: Habit, date: string | Date) => {
  const current = typeof date === "string" ? parseISO(date) : date;
  const weekday = current.getDay();
  const monthday = current.getDate();
  const startDate = parseISO(habit.start_date);
  if (isBefore(current, startDate)) return false;
  if (habit.pause_until && isBefore(current, parseISO(habit.pause_until))) return false;
  if (habit.archived) return false;

  switch (habit.frequency) {
    case "daily":
      return true;
    case "specific_days_week":
      return isWeekdayDue(weekday, habit.weekly_days ?? undefined);
    case "specific_days_month":
      return isMonthdayDue(monthday, habit.monthly_days ?? undefined);
    default:
      return false;
  }
};

export const calculateStreaks = (habit: Habit, completions: HabitCompletion[], referenceDate?: string) => {
  const sorted = [...completions].sort((a, b) => a.completion_date.localeCompare(b.completion_date));
  const reference = referenceDate ? parseISO(referenceDate) : new Date();
  let currentStreak = 0;
  let bestStreak = 0;
  let streakCounter = 0;

  const completionSet = new Set(sorted.map((c) => c.completion_date));

  // Iterate backwards from reference date until start date
  for (
    let cursor = startOfDay(reference);
    !isBefore(cursor, parseISO(habit.start_date));
    cursor = addDays(cursor, -1)
  ) {
    if (!isHabitDueOnDate(habit, cursor)) {
      continue;
    }

    const iso = formatISODate(cursor);
    if (completionSet.has(iso)) {
      streakCounter += 1;
      bestStreak = Math.max(bestStreak, streakCounter);
      if (isSameDay(cursor, reference)) {
        currentStreak = streakCounter;
      }
    } else {
      if (isSameDay(cursor, reference)) {
        currentStreak = streakCounter;
      }
      streakCounter = 0;
    }
  }

  return { currentStreak, bestStreak };
};

export const buildHeatmap = (habit: Habit, month: Date, completions: HabitCompletion[]): HeatmapCell[] => {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const completionSet = new Set(completions.map((c) => c.completion_date));

  return eachDayOfInterval({ start, end }).map((day) => {
    const iso = formatISODate(day);
    const due = isHabitDueOnDate(habit, day);
    const completed = due && completionSet.has(iso);
    return {
      date: iso,
      completed,
      intensity: completed ? 2 : due ? 1 : 0,
    };
  });
};

export const buildTrend = (habit: Habit, range: { startDate: string; endDate: string }, completions: HabitCompletion[]): TrendPoint[] => {
  const completionSet = new Set(completions.map((c) => c.completion_date));
  return eachDayOfInterval({
    start: parseISO(range.startDate),
    end: parseISO(range.endDate),
  }).map((day) => {
    const iso = formatISODate(day);
    const due = isHabitDueOnDate(habit, day);
    const completed = due && completionSet.has(iso) ? 1 : 0;
    return {
      date: iso,
      completed,
      due: due ? 1 : 0,
    };
  });
};

export const getCurrentMonthLabel = (date: Date) => format(date, "MMMM yyyy");

export const isFutureDate = (date: string | Date) => {
  const compare = typeof date === "string" ? parseISO(date) : date;
  return isAfter(compare, startOfDay(new Date()));
};

export const clampMonthlySelection = (dates: number[]) =>
  dates.filter((day) => day >= 1 && day <= 31).slice(0, 31);

export const ensureWeeklySelection = (days: number[]) =>
  days.filter((day) => day >= 0 && day <= 6).slice(0, 7);

export const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(" ");

