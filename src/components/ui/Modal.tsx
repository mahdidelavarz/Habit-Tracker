"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  widthClass?: string;
}

export const Modal = ({ open, onClose, title, description, footer, children, widthClass = "max-w-lg" }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (typeof document === "undefined" || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className={cn("w-full rounded-2xl bg-white p-6 shadow-xl transition-all", widthClass)}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          <Button
            aria-label="Close modal"
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-900"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>
        <div className="mt-6 space-y-4">{children}</div>
        {footer && <div className="mt-8 flex flex-wrap gap-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
};

