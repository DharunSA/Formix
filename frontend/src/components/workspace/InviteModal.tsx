"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { XIcon } from "@/components/ui/icons";

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
}

export function InviteModal({ open, onClose }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");

  if (!open) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success(`Invitation sent to ${email} as ${role}!`);
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink tracking-tight">Invite to Workspace</h2>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink p-1 rounded-lg hover:bg-surface"
          >
            <XIcon width={16} height={16} />
          </button>
        </div>

        <p className="text-xs text-ink-soft">
          Collaborate on form creation, review responses, and manage automations together.
        </p>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              required
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-ink/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-ink/20"
            >
              <option value="Admin">Admin (Full edit &amp; publish rights)</option>
              <option value="Member">Member (Create &amp; edit forms)</option>
              <option value="Viewer">Viewer (View responses only)</option>
            </select>
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
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#261c23] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Send Invite
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
