"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    if (!isOpen) {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        "opacity-100"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-2xl bg-white border-2 border-slate-900 rounded-[24px] shadow-[8px_8px_0_#0f172a] overflow-hidden transition-all duration-300 ${
          "scale-100 translate-y-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 bg-teal-50 px-6 py-4">
          <h3 className="text-[18px] font-black text-[#0f172a] uppercase tracking-wide">{title}</h3>
          <button
            onClick={onClose}
            className="group flex h-9 w-9 items-center justify-center rounded-lg border-2 border-slate-900 bg-white transition hover:bg-rose-50 hover:translate-y-[-1px] active:translate-y-[1px]"
          >
            <X size={20} className="text-slate-900 group-hover:text-rose-500" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6 custom-scrollbar">
          <div className="text-[15px] font-semibold leading-[1.7] text-[#0f172a] whitespace-pre-wrap">
            {children}
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t-2 border-slate-900 bg-slate-50 px-6 py-4 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
