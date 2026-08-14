"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProfileDropdownProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileDropdown({ open, onClose }: ProfileDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 w-64 rounded-2xl bg-card border border-border shadow-2xl p-2 z-50 animate-fade-in"
    >
      <div className="p-3 border-b border-border/60">
        <p className="text-sm font-bold text-ink">Dharun SA</p>
        <p className="text-xs text-ink-soft">dharun.s23@typeform.demo</p>
        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#006644]/10 text-[#006644] dark:bg-emerald-950/50 dark:text-emerald-300 text-[10px] font-bold">
          <span>●</span> Free Plan
        </div>
      </div>

      <div className="py-1">
        <button
          onClick={() => {
            toast.info("Profile settings opened");
            onClose();
          }}
          className="w-full text-left px-3 py-2 text-xs font-semibold text-ink hover:bg-surface rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">person</span>
          Personal Info
        </button>
        <button
          onClick={() => {
            toast.info("Account preferences updated");
            onClose();
          }}
          className="w-full text-left px-3 py-2 text-xs font-semibold text-ink hover:bg-surface rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">settings</span>
          Account Settings
        </button>
      </div>

      <div className="pt-1 border-t border-border/60">
        <button
          onClick={() => {
            toast.success("Logged out successfully");
            onClose();
            router.push("/login");
          }}
          className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Log out
        </button>
      </div>
    </div>
  );
}
