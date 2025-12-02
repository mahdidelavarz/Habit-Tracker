import { create } from "zustand";
import { Habit, HabitFrequency } from "@/types";
import { todayISO } from "@/lib/utils";

export interface HabitFilters {
  search: string;
  frequency: HabitFrequency | "all";
  includeArchived: boolean;
}

interface HabitStoreState {
  selectedDate: string;
  filters: HabitFilters;
  activeHabitId?: string;
  modalOpen: boolean;
  modalMode: "create" | "edit";
  editingHabit?: Habit;
  confirmOpen: boolean;
  confirmHabit?: Habit;
  setDate: (date: string) => void;
  setFilters: (filters: Partial<HabitFilters>) => void;
  openCreateModal: () => void;
  openEditModal: (habit: Habit) => void;
  closeModal: () => void;
  openConfirm: (habit: Habit) => void;
  closeConfirm: () => void;
  setActiveHabit: (id?: string) => void;
}

const defaultFilters: HabitFilters = {
  search: "",
  frequency: "all",
  includeArchived: false,
};

export const useHabitStore = create<HabitStoreState>((set) => ({
  selectedDate: todayISO(),
  filters: defaultFilters,
  modalOpen: false,
  modalMode: "create",
  confirmOpen: false,
  setDate: (selectedDate) => set({ selectedDate }),
  setFilters: (incoming) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...incoming,
      },
    })),
  openCreateModal: () => set({ modalOpen: true, modalMode: "create", editingHabit: undefined }),
  openEditModal: (habit) =>
    set({
      modalOpen: true,
      modalMode: "edit",
      editingHabit: habit,
    }),
  closeModal: () => set({ modalOpen: false, editingHabit: undefined }),
  openConfirm: (habit) => set({ confirmOpen: true, confirmHabit: habit }),
  closeConfirm: () => set({ confirmOpen: false, confirmHabit: undefined }),
  setActiveHabit: (activeHabitId) => set({ activeHabitId }),
}));

