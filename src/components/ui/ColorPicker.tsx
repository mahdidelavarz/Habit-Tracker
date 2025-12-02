"use client";

import { cn } from "@/lib/utils";

const PRESET_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#0EA5E9", "#14B8A6"];

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => (
  <div>
    <p className="mb-2 text-sm font-medium text-slate-700">Color</p>
    <div className="flex flex-wrap gap-2">
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={`Select color ${color}`}
          className={cn(
            "h-10 w-10 rounded-full border-2 border-transparent transition hover:scale-105",
            value === color ? "ring-2 ring-offset-2 ring-offset-white ring-slate-900" : "",
          )}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  </div>
);

