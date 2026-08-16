"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth-context";

interface ProfileDropdownProps {
  open: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export function ProfileDropdown({ open, onClose, onOpenSettings }: ProfileDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, signOut } = useAuth();

  const userEmail = user?.email || "creator@typeform-clone.local";
  const userName = user?.user_metadata?.full_name || userEmail.split("@")[0] || "Demo Creator";

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

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    onClose();
    router.push("/login");
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 w-64 rounded-2xl bg-card border border-border shadow-2xl p-2 z-50 animate-fade-in"
    >
      <div className="p-3 border-b border-border/60">
        <p className="text-sm font-bold text-ink truncate">{userName}</p>
        <p className="text-xs text-ink-soft truncate">{userEmail}</p>
        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#006644]/10 text-[#006644] dark:bg-emerald-950/50 dark:text-emerald-300 text-[10px] font-bold">
          <span>●</span> Pro Creator
        </div>
      </div>

      <div className="py-1">
        <button
          onClick={() => {
            onClose();
            onOpenSettings?.();
          }}
          className="w-full text-left px-3 py-2 text-xs font-semibold text-ink hover:bg-surface rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">person</span>
          Personal Profile
        </button>
        <button
          onClick={() => {
            onClose();
            onOpenSettings?.();
          }}
          className="w-full text-left px-3 py-2 text-xs font-semibold text-ink hover:bg-surface rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">settings</span>
          Account Preferences
        </button>
      </div>

      <div className="pt-1 border-t border-border/60">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Log out
        </button>
      </div>
    </div>
  );
}
