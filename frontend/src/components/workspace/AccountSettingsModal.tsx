"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { XIcon, CheckIcon } from "@/components/ui/icons";

interface AccountSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function AccountSettingsModal({ open, onClose }: AccountSettingsModalProps) {
  const { user, updateProfile } = useAuth();
  const defaultEmail = user?.email || "creator@typeform-clone.local";
  const defaultName = user?.user_metadata?.full_name || defaultEmail.split("@")[0] || "Demo Creator";

  const [fullName, setFullName] = useState(defaultName);
  const [emailAddress, setEmailAddress] = useState(defaultEmail);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
    if (user?.email) {
      setEmailAddress(user.email);
    }
  }, [user]);

  if (!open) return null;

  const initials = fullName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "DC";

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ full_name: fullName, email: emailAddress });
      toast.success("Account profile updated successfully!");
      onClose();
    } catch {
      toast.error("Failed to update account profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6"
      >
        <div className="flex justify-between items-center border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#261c23] text-white font-bold flex items-center justify-center text-sm shadow-md">
              {initials}
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-ink">Personal Profile & Settings</h2>
              <p className="text-xs text-ink-soft">Manage your account information and preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink p-1 rounded-lg hover:bg-surface transition-colors"
          >
            <XIcon width={18} height={18} />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="block font-bold text-ink mb-1">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-bold text-ink mb-1">Email Address</label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="creator@domain.com"
              className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-ink/20 font-mono"
            />
            <p className="text-[11px] text-ink-soft/70 mt-1">Used for notifications and account access.</p>
          </div>

          {/* Plan Info */}
          <div className="p-4 rounded-xl border border-border bg-surface/40 flex items-center justify-between">
            <div>
              <p className="font-bold text-ink text-xs">Current Plan</p>
              <p className="text-[11px] text-ink-soft">Formix Pro Creator Plan (Unlimited forms & submissions)</p>
            </div>
            <span className="bg-[#261c23] text-white px-3 py-1 rounded-full text-[10px] font-bold">
              PRO ACTIVE
            </span>
          </div>

          {/* Preferences */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-ink uppercase text-[10px] tracking-wider text-ink-soft">
              Preferences
            </h4>

            <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface/50 cursor-pointer">
              <div>
                <p className="font-semibold text-ink">Email Notifications</p>
                <p className="text-[11px] text-ink-soft">Receive daily summaries for form responses</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 rounded accent-[#261c23]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-surface/50 cursor-pointer">
              <div>
                <p className="font-semibold text-ink">Automatic Contact Extraction</p>
                <p className="text-[11px] text-ink-soft">Auto-sync email submissions to Contacts Hub</p>
              </div>
              <input
                type="checkbox"
                checked={autoSyncEnabled}
                onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                className="w-4 h-4 rounded accent-[#261c23]"
              />
            </label>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-surface rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#261c23] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
