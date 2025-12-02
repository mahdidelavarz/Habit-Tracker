"use client";

import { InputHTMLAttributes } from "react";

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const DatePicker = ({ label, error, ...props }: DatePickerProps) => (
  <label className="flex flex-col text-sm font-medium text-slate-700">
    {label && <span className="mb-1">{label}</span>}
    <input
      type="date"
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      {...props}
    />
    {error && <span className="mt-1 text-xs text-red-600">{error}</span>}
  </label>
);

