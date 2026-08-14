"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { XIcon } from "@/components/ui/icons";

interface HelpCenterModalProps {
  open: boolean;
  onClose: () => void;
}

const faqs = [
  {
    q: "How does the 'Ask Formix AI' assistant build forms?",
    a: "Formix AI parses your natural language requirements (purpose, question count, tone) and automatically constructs questions, validations, choice options, and themes.",
  },
  {
    q: "How does the automatic Contacts Sync work?",
    a: "Whenever respondents complete forms containing an email field, Formix automatically indexes and updates their record in the Contacts Hub.",
  },
  {
    q: "Can I connect Webhooks to Zapier or Make?",
    a: "Yes! In the Automations tab, create a Webhook action and paste your Zapier Catch Hook URL to stream form submissions in real time.",
  },
  {
    q: "Are CSV exports protected against spreadsheet formula injections?",
    a: "Yes, all exports sanitize dangerous leading characters (=, +, -, @) to safeguard your spreadsheets.",
  },
];

export function HelpCenterModal({ open, onClose }: HelpCenterModalProps) {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-[#faf9f7] dark:bg-[#1a1c1b]">
          <div>
            <h2 className="text-xl font-bold text-ink tracking-tight font-serif">Formix Help &amp; Support</h2>
            <p className="text-xs text-ink-soft mt-0.5">Guides, documentation, and answers to common questions</p>
          </div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink p-1.5 rounded-lg hover:bg-surface transition-colors"
          >
            <XIcon width={16} height={16} />
          </button>
        </div>

        <div className="p-6 pb-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides and documentation..."
            className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-ink/20"
          />
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filtered.map((f, i) => (
            <div key={i} className="p-4 rounded-xl border border-border bg-surface">
              <h3 className="text-sm font-bold text-ink mb-1.5">{f.q}</h3>
              <p className="text-xs text-ink-soft leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-between items-center bg-surface">
          <button
            onClick={() => {
              toast.success("Support ticket opened. Our team will contact you!");
              onClose();
            }}
            className="text-xs font-semibold text-purple-700 dark:text-purple-300 hover:underline"
          >
            💬 Contact Live Support
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#261c23] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
