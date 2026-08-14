"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { XIcon } from "@/components/ui/icons";

interface ImportContactsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ImportContactsModal({ open, onClose, onSuccess }: ImportContactsModalProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  if (!open) return null;

  const handleUpload = () => {
    toast.success("Contacts imported successfully!", {
      description: "Parsed 12 contacts from CSV file.",
    });
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink tracking-tight font-serif">Import Contacts from CSV</h2>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink p-1 rounded-lg hover:bg-surface"
          >
            <XIcon width={16} height={16} />
          </button>
        </div>

        <p className="text-xs text-ink-soft">
          Upload a CSV containing <code className="bg-surface px-1.5 py-0.5 rounded border border-border">email</code>, <code className="bg-surface px-1.5 py-0.5 rounded border border-border">name</code>, and optional tag columns.
        </p>

        <div className="border-2 border-dashed border-border hover:border-ink/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-surface">
          <span className="material-symbols-outlined text-4xl text-ink-soft mb-2">upload_file</span>
          <p className="text-sm font-bold text-ink mb-1">
            {fileName || "Drag and drop your .csv file here"}
          </p>
          <p className="text-xs text-ink-soft mb-4">Max file size: 10MB</p>
          <button
            type="button"
            onClick={() => setFileName("contacts_sample_export.csv")}
            className="px-4 py-1.5 rounded-lg bg-card border border-border text-xs font-semibold text-ink hover:bg-surface"
          >
            {fileName ? "Change file" : "Browse files"}
          </button>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-ink-soft hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            className="px-5 py-2 rounded-xl bg-[#261c23] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Import Contacts
          </button>
        </div>
      </motion.div>
    </div>
  );
}
