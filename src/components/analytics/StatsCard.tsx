import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
  accent?: "primary" | "success" | "warning" | "danger";
}

const accentClasses: Record<NonNullable<StatsCardProps["accent"]>, string> = {
  primary: "border-blue-100 bg-blue-50 text-blue-700",
  success: "border-green-100 bg-green-50 text-green-700",
  warning: "border-amber-100 bg-amber-50 text-amber-700",
  danger: "border-red-100 bg-red-50 text-red-700",
};

export const StatsCard = ({ label, value, helper, icon, accent = "primary" }: StatsCardProps) => (
  <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
        {helper && <p className="mt-2 text-sm text-slate-500">{helper}</p>}
      </div>
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border text-xl", accentClasses[accent])}>
        {icon}
      </div>
    </div>
  </article>
);

