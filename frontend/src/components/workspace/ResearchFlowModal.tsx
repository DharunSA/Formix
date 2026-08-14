"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { XIcon } from "@/components/ui/icons";

interface ResearchFlowModalProps {
  open: boolean;
  onClose: () => void;
}

export function ResearchFlowModal({ open, onClose }: ResearchFlowModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-card border border-border rounded-2xl max-w-xl w-full p-8 shadow-2xl flex flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧬</span>
            <div>
              <h2 className="text-xl font-bold text-ink tracking-tight font-serif">Research Flow AI</h2>
              <span className="text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                Interactive Preview
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink p-1 rounded-lg hover:bg-surface"
          >
            <XIcon width={16} height={16} />
          </button>
        </div>

        <p className="text-sm text-ink-soft leading-relaxed">
          Research Flow automatically analyzes dynamic conversation pathways, clusters multi-modal interview questions, and extracts semantic customer personas in real time.
        </p>

        <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
          <div className="flex items-center justify-between text-xs text-ink font-semibold">
            <span>Adaptive Follow-Up Prompts</span>
            <span className="text-emerald-600 font-bold">Enabled</span>
          </div>
          <div className="flex items-center justify-between text-xs text-ink font-semibold">
            <span>Semantic Persona Clustering</span>
            <span className="text-emerald-600 font-bold">Ready</span>
          </div>
          <div className="flex items-center justify-between text-xs text-ink font-semibold">
            <span>Autonomous Summary Delivery</span>
            <span className="text-emerald-600 font-bold">Active</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => {
              toast.success("Research Flow sample template applied!");
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#261c23] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Launch Research Flow Demo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
