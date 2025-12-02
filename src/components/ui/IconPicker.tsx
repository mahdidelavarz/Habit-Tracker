"use client";

import { HABIT_ICON_OPTIONS } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
}

export const IconPicker = ({ value, onChange }: IconPickerProps) => (
  <div>
    <p className="mb-2 text-sm font-medium text-slate-700">Icon</p>
    <div className="grid grid-cols-5 gap-3">
      {HABIT_ICON_OPTIONS.map(({ value: key, Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-300 hover:bg-blue-50",
            value === key && "border-blue-500 bg-blue-50 text-blue-600 shadow-inner",
          )}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  </div>
);

