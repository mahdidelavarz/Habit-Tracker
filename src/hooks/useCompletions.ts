import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DateRange, HabitCompletion } from "@/types";

export const fetchCompletions = async (habitId: string, range: DateRange): Promise<HabitCompletion[]> => {
  const params = new URLSearchParams({
    habit_id: habitId,
    start_date: range.startDate,
    end_date: range.endDate,
  });
  const response = await fetch(`/api/completions?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch completions");
  }
  return response.json();
};

const addCompletionRequest = async (habitId: string, date: string) => {
  const response = await fetch("/api/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ habit_id: habitId, completion_date: date }),
  });
  if (!response.ok) {
    throw new Error("Failed to mark completion");
  }
  return response.json();
};

const deleteCompletionRequest = async (completionId: string) => {
  const response = await fetch(`/api/completions/${completionId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to remove completion");
  }
  return response.json();
};

export const useCompletions = (habitId?: string, range?: DateRange) =>
  useQuery({
    queryKey: ["completions", habitId, range?.startDate, range?.endDate],
    queryFn: () => {
      if (!habitId || !range) {
        return Promise.resolve([]);
      }
      return fetchCompletions(habitId, range);
    },
    enabled: Boolean(habitId && range),
  });

interface ToggleArgs {
  habitId: string;
  date: string;
  completionId?: string;
  completed: boolean;
}

export const useToggleCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ habitId, date, completionId, completed }: ToggleArgs) => {
      if (completed) {
        return addCompletionRequest(habitId, date);
      }
      if (!completionId) {
        throw new Error("Missing completion id");
      }
      return deleteCompletionRequest(completionId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["completions", variables.habitId],
      });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};

