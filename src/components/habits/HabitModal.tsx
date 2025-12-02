"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { IconPicker } from "@/components/ui/IconPicker";
import { Habit, HabitFrequency, HabitPayload } from "@/types";
import { ensureWeeklySelection, todayISO } from "@/lib/utils";

const WEEKDAY_OPTIONS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

const PRESET_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#0EA5E9", "#14B8A6"];

const buildInitialFormState = (habit?: Habit): HabitPayload => ({
  name: habit?.name ?? "",
  description: habit?.description ?? "",
  frequency: habit?.frequency ?? "daily",
  weekly_days: habit?.weekly_days ?? [],
  monthly_days: habit?.monthly_days ?? [],
  color: habit?.color ?? PRESET_COLORS[0],
  icon: habit?.icon ?? "target",
  start_date: habit?.start_date ?? todayISO(),
  archived: habit?.archived ?? false,
  pause_until: habit?.pause_until ?? null,
});

interface HabitModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: Habit;
  onClose: () => void;
  onSubmit: (data: HabitPayload) => void;
  loading?: boolean;
}

export const HabitModal = ({ open, mode, initialData, onClose, onSubmit, loading }: HabitModalProps) => {
  const [form, setForm] = useState<HabitPayload>(() => buildInitialFormState(initialData));

  const [error, setError] = useState<string>();

  const getFrequencyLabel = (frequency: HabitFrequency) => {
    switch (frequency) {
      case "daily":
        return "Daily";
      case "specific_days_week":
        return "Specific days of the week";
      case "specific_days_month":
        return "Specific days of the month";
      default:
        return "";
    }
  };

  const handleChange = (field: keyof HabitPayload, value: HabitPayload[keyof HabitPayload]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleWeeklyDay = (value: number) => {
    setForm((prev) => {
      const current = ensureWeeklySelection(prev.weekly_days ?? []);
      const exists = current.includes(value);
      return {
        ...prev,
        weekly_days: exists ? current.filter((day) => day !== value) : [...current, value],
      };
    });
  };

  const toggleMonthlyDay = (value: number) => {
    setForm((prev) => {
      const current = prev.monthly_days ?? [];
      const exists = current.includes(value);
      return {
        ...prev,
        monthly_days: exists ? current.filter((day) => day !== value) : [...current, value].sort((a, b) => a - b),
      };
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Habit name is required");
      return;
    }
    if (form.name.length > 100) {
      setError("Habit name must be under 100 characters");
      return;
    }
    if (form.description && form.description.length > 500) {
      setError("Description must be under 500 characters");
      return;
    }
    if (form.frequency === "specific_days_week" && (form.weekly_days?.length ?? 0) === 0) {
      setError("Select at least one weekday");
      return;
    }
    if (form.frequency === "specific_days_month" && (form.monthly_days?.length ?? 0) === 0) {
      setError("Select at least one date");
      return;
    }
    setError(undefined);
    onSubmit(form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create a new habit" : "Edit habit"}
      description="Define how often you want to perform this habit."
      widthClass="max-w-3xl"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-slate-700">
            Name
            <input
              className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Read 20 pages"
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
            />
          </label>
          <DatePicker
            label="Start date"
            value={form.start_date}
            onChange={(event) => handleChange("start_date", event.target.value)}
          />
        </div>

        <label className="flex flex-col text-sm font-medium text-slate-700">
          Description
          <textarea
            className="mt-1 h-24 rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Add more context to stay motivated"
            value={form.description ?? ""}
            onChange={(event) => handleChange("description", event.target.value)}
          />
        </label>

        <div>
          <p className="text-sm font-semibold text-slate-700">Repetition type</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {(["daily", "specific_days_week", "specific_days_month"] as HabitFrequency[]).map((frequency) => (
              <label
                key={frequency}
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  form.frequency === frequency ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-200"
                }`}
              >
                <input
                  type="radio"
                  name="frequency"
                  className="sr-only"
                  checked={form.frequency === frequency}
                  onChange={() => handleChange("frequency", frequency)}
                />
                <p className="font-semibold text-slate-800">{getFrequencyLabel(frequency)}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {frequency === "daily" && "Due every day."}
                  {frequency === "specific_days_week" && "Choose specific weekdays."}
                  {frequency === "specific_days_month" && "Choose dates each month."}
                </p>
              </label>
            ))}
          </div>
        </div>

        {form.frequency === "specific_days_week" && (
          <div>
            <p className="text-sm font-semibold text-slate-700">Select weekdays</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {WEEKDAY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleWeeklyDay(option.value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    form.weekly_days?.includes(option.value)
                      ? "bg-blue-600 text-white shadow"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {form.frequency === "specific_days_month" && (
          <div>
            <p className="text-sm font-semibold text-slate-700">Select dates</p>
            <div className="mt-3 grid grid-cols-7 gap-2 text-sm">
              {Array.from({ length: 31 }).map((_, index) => {
                const day = index + 1;
                const active = form.monthly_days?.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleMonthlyDay(day)}
                    className={`rounded-lg border px-2 py-1 transition ${
                      active ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:border-blue-300"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <ColorPicker value={form.color} onChange={(color) => handleChange("color", color)} />
          <IconPicker value={form.icon ?? undefined} onChange={(icon) => handleChange("icon", icon)} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {mode === "create" ? "Create habit" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

