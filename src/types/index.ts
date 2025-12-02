export type HabitFrequency = "daily" | "specific_days_week" | "specific_days_month";

export interface Habit {
  id: string;
  name: string;
  description?: string | null;
  frequency: HabitFrequency;
  weekly_days?: number[] | null;
  monthly_days?: number[] | null;
  color: string;
  icon?: string | null;
  start_date: string;
  archived: boolean;
  pause_until?: string | null;
  created_at: string;
  updated_at: string;
  current_streak?: number;
  best_streak?: number;
}

export type HabitPayload = Omit<Habit, "id" | "created_at" | "updated_at" | "current_streak" | "best_streak">;

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completion_date: string;
  created_at: string;
  note?: string | null;
}

export type CompletionPayload = Omit<HabitCompletion, "id" | "created_at">;

export type DatePreset = "7" | "30" | "90" | "custom";

export interface DateRange {
  startDate: string;
  endDate: string;
  preset?: DatePreset;
}

export interface HeatmapCell {
  date: string;
  completed: boolean;
  intensity: number;
}

export interface TrendPoint {
  date: string;
  completed: number;
  due: number;
}

export interface HabitAnalytics {
  habit: Habit;
  completionRate: number;
  totalCompletions: number;
  currentStreak: number;
  bestStreak: number;
  daysCompleted: number;
  daysMissed: number;
  trend: TrendPoint[];
  heatmap: HeatmapCell[];
}

export interface AnalyticsOverview {
  totalHabits: number;
  completionRate: number;
  totalCompletions: number;
  bestHabit?: {
    habit_id: string;
    name: string;
    completionRate: number;
  };
  longestStreak: number;
  trend: TrendPoint[];
  habitComparison: {
    habit_id: string;
    name: string;
    completionRate: number;
  }[];
  weeklyPerformance: {
    weekday: number;
    completionRate: number;
  }[];
}

export interface ApiError {
  message: string;
  status?: number;
}

