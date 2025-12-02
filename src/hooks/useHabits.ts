import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Habit, HabitPayload } from "@/types";

const fetchHabits = async (): Promise<Habit[]> => {
  const response = await fetch("/api/habits");
  if (!response.ok) {
    throw new Error("Failed to load habits");
  }
  return response.json();
};

const createHabitRequest = async (payload: HabitPayload) => {
  const response = await fetch("/api/habits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to create habit");
  }
  return response.json();
};

const updateHabitRequest = async ({ id, data }: { id: string; data: Partial<HabitPayload> }) => {
  const response = await fetch(`/api/habits/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update habit");
  }
  return response.json();
};

const deleteHabitRequest = async (id: string) => {
  const response = await fetch(`/api/habits/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete habit");
  }
  return response.json();
};

export const useHabits = () =>
  useQuery({
    queryKey: ["habits"],
    queryFn: fetchHabits,
  });

export const useCreateHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHabitRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
};

export const useUpdateHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateHabitRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
};

export const useDeleteHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHabitRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
};

