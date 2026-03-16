"use client";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  variant = "danger",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: "bg-[#fecaca] text-[#7f1d1d] shadow-[4px_4px_0_#7f1d1d] hover:bg-red-200",
    warning: "bg-[#fef08a] text-[#854d0e] shadow-[4px_4px_0_#854d0e] hover:bg-yellow-200",
    info: "bg-[#99f6e4] text-[#0f766e] shadow-[4px_4px_0_#0f766e] hover:bg-teal-200",
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[440px] border-[3px] border-[#0f172a] bg-white p-6 shadow-[10px_10px_0_#0f172a] [transform:rotate(-0.4deg)]">
        {/* Tag */}
        <div className="mb-3 inline-block border-[1.5px] border-[#0f172a] bg-[#fef08a] px-3 py-1 text-[10px] font-[950] uppercase tracking-widest text-[#0f172a]">
          Confirm action
        </div>
        
        <h3 className="m-0 text-[28px] font-black leading-tight tracking-tight text-[#0f172a]">
          {title}
        </h3>
        
        <p className="mb-8 mt-3 text-[14px] font-bold text-slate-500">
          {message}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="border-[2.5px] border-[#0f172a] bg-white px-5 py-2.5 text-[12px] font-black uppercase tracking-wider text-[#0f172a] transition hover:bg-slate-50 hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`border-[2.5px] border-[#0f172a] px-5 py-2.5 text-[12px] font-black uppercase tracking-wider transition hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${variantStyles[variant]}`}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
