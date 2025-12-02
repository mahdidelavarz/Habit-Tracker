"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center rounded-lg font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variantStyles: Record<Variant, string> = {
  primary: "bg-blue-500 text-white hover:bg-blue-600 focus-visible:outline-blue-500",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-400",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-300",
  danger: "bg-red-500 text-white hover:bg-red-600 focus-visible:outline-red-500",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-base",
};

export const Button = ({ variant = "primary", size = "md", loading, className, children, ...props }: ButtonProps) => (
  <button className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props}>
    {loading ? "Please wait…" : children}
  </button>
);

