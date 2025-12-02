import { create } from "zustand";
import { HabitCompletion } from "@/types";

interface CompletionStoreState {
  completionsByHabit: Record<string, HabitCompletion[]>;
  todayCompletions: Record<string, boolean>;
  isToggling: Record<string, boolean>;
  setCompletions: (habitId: string, completions: HabitCompletion[]) => void;
  upsertCompletion: (habitId: string, completion: HabitCompletion) => void;
  removeCompletion: (habitId: string, completionId: string) => void;
  setTodayCompletion: (habitId: string, value: boolean) => void;
  setIsToggling: (habitId: string, value: boolean) => void;
}

export const useCompletionStore = create<CompletionStoreState>((set) => ({
  completionsByHabit: {},
  todayCompletions: {},
  isToggling: {},
  setCompletions: (habitId, completions) =>
    set((state) => ({
      completionsByHabit: {
        ...state.completionsByHabit,
        [habitId]: completions,
      },
    })),
  upsertCompletion: (habitId, completion) =>
    set((state) => {
      const existing = state.completionsByHabit[habitId] ?? [];
      const idx = existing.findIndex((item) => item.id === completion.id);
      const nextList = [...existing];
      if (idx >= 0) {
        nextList[idx] = completion;
      } else {
        nextList.push(completion);
      }
      return {
        completionsByHabit: {
          ...state.completionsByHabit,
          [habitId]: nextList,
        },
      };
    }),
  removeCompletion: (habitId, completionId) =>
    set((state) => {
      const existing = state.completionsByHabit[habitId] ?? [];
      return {
        completionsByHabit: {
          ...state.completionsByHabit,
          [habitId]: existing.filter((c) => c.id !== completionId),
        },
      };
    }),
  setTodayCompletion: (habitId, value) =>
    set((state) => ({
      todayCompletions: {
        ...state.todayCompletions,
        [habitId]: value,
      },
    })),
  setIsToggling: (habitId, value) =>
    set((state) => ({
      isToggling: {
        ...state.isToggling,
        [habitId]: value,
      },
    })),
}));

