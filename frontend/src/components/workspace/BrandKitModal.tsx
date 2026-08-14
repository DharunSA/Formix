"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { XIcon } from "@/components/ui/icons";

interface BrandKitModalProps {
  open: boolean;
  onClose: () => void;
}

export function BrandKitModal({ open, onClose }: BrandKitModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <h2 className="text-xl font-bold text-ink tracking-tight">Brand Kit</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink p-1 rounded-lg hover:bg-surface"
          >
            <XIcon width={16} height={16} />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-ink">Custom Fonts &amp; Palettes</p>
              <p className="text-xs text-ink-soft">Apply brand styling across all forms automatically</p>
            </div>
            <span className="text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
              Pro Feature
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2">
            {["#261C23", "#006644", "#4A154B", "#635BFF"].map((c, i) => (
              <div key={i} className="h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c }}>
                Aa
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-ink-soft">Unlock white-labeling &amp; custom domains</p>
          <button
            onClick={() => {
              toast.info("Brand kit personalization enabled on your account!");
              onClose();
            }}
            className="px-5 py-2 rounded-full bg-[#261c23] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Enable Pro Trial
          </button>
        </div>
      </motion.div>
    </div>
  );
}
