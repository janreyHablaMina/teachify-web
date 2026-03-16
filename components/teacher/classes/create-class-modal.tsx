"use client";

import { useState } from "react";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; room: string; schedule: string }) => void;
  isSubmitting?: boolean;
}

export function CreateClassModal({ isOpen, onClose, onSubmit, isSubmitting }: CreateClassModalProps) {
  const [formData, setFormData] = useState({ name: "", room: "", schedule: "" });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[500px] border-[3px] border-[#0f172a] bg-white p-8 shadow-[12px_12px_0_#0f172a] [transform:rotate(-0.5deg)]">
        <h3 className="m-0 text-[28px] font-black tracking-tight text-[#0f172a]">Create New Classroom</h3>
        <p className="mt-2 text-[15px] font-bold text-slate-500">Add a new class to your teaching workspace.</p>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }} 
          className="mt-8 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-black uppercase tracking-wider text-slate-500">Class Name</label>
            <input
              type="text"
              required
              className="rounded-xl border-2 border-[#0f172a] bg-slate-50 px-4 py-3 text-[14px] font-bold outline-none transition-all focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              placeholder="e.g. 5A - Science"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-black uppercase tracking-wider text-slate-500">Room (Optional)</label>
              <input
                type="text"
                className="rounded-xl border-2 border-[#0f172a] bg-slate-50 px-4 py-3 text-[14px] font-bold outline-none transition-all focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                placeholder="e.g. 302"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-black uppercase tracking-wider text-slate-500">Schedule (Optional)</label>
              <input
                type="text"
                className="rounded-xl border-2 border-[#0f172a] bg-slate-50 px-4 py-3 text-[14px] font-bold outline-none transition-all focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                placeholder="Mon, Wed, Fri"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-[13px] font-black uppercase tracking-wider text-slate-500 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl border-2 border-[#0f172a] bg-[#0f172a] px-8 py-3 text-[13px] font-black uppercase tracking-wider text-white transition hover:-translate-y-1 hover:shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
