"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { XIcon } from "@/components/ui/icons";

interface CreateWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
  onCreateWorkspace: (name: string, color: string) => void;
}

const ACCENT_COLORS = [
  { name: "Obsidian", value: "#261c23" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Blue", value: "#2563eb" },
  { name: "Emerald", value: "#059669" },
  { name: "Amber", value: "#d97706" },
  { name: "Rose", value: "#e11d48" },
];

export function CreateWorkspaceModal({ open, onClose, onCreateWorkspace }: CreateWorkspaceModalProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#261c23");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) {
      toast.error("Please enter a workspace name");
      return;
    }
    onCreateWorkspace(workspaceName.trim(), selectedColor);
    toast.success(`Workspace "${workspaceName.trim()}" created!`);
    setWorkspaceName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5"
      >
        <div className="flex justify-between items-center border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
              style={{ backgroundColor: selectedColor }}
            >
              +
            </div>
            <h3 className="font-serif text-lg font-bold text-ink">Create New Workspace</h3>
          </div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink p-1 rounded-lg hover:bg-surface transition-colors"
          >
            <XIcon width={18} height={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-ink mb-1.5">Workspace Name *</label>
            <input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="e.g. Marketing Campaigns, Product Feedback"
              required
              className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </div>

          <div>
            <label className="block font-bold text-ink mb-1.5">Workspace Accent Color</label>
            <div className="flex items-center gap-2">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedColor(c.value)}
                  className="w-7 h-7 rounded-full transition-transform cursor-pointer border border-border"
                  style={{
                    backgroundColor: c.value,
                    transform: selectedColor === c.value ? "scale(1.15)" : "scale(1)",
                    boxShadow: selectedColor === c.value ? `0 0 0 2px white, 0 0 0 4px ${c.value}` : "none",
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-surface rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#261c23] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-md"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
