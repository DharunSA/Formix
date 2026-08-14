"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { XIcon } from "@/components/ui/icons";

interface IntegrationsModalProps {
  open: boolean;
  onClose: () => void;
}

interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  category: string;
  iconBg: string;
  icon: string;
  connected: boolean;
}

const initialIntegrations: IntegrationItem[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Send form responses directly to your Slack channels in real time.",
    category: "Communication",
    iconBg: "#4A154B",
    icon: "chat",
    connected: true,
  },
  {
    id: "sheets",
    name: "Google Sheets",
    description: "Automatically append every new entry to a cloud spreadsheet for analysis.",
    category: "Productivity",
    iconBg: "#0F9D58",
    icon: "table_chart",
    connected: false,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Create and enrich leads in your CRM whenever a prospect completes a form.",
    category: "CRM & Sales",
    iconBg: "#FF7A59",
    icon: "hub",
    connected: false,
  },
  {
    id: "webhooks",
    name: "Custom Webhooks",
    description: "Transmit signed JSON payloads via HTTP POST to any external endpoint or Zapier.",
    category: "Developer Tools",
    iconBg: "#261C23",
    icon: "webhook",
    connected: true,
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Collect payments, deposits, and subscriptions seamlessly inside your forms.",
    category: "Payments",
    iconBg: "#635BFF",
    icon: "payments",
    connected: false,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Sync form answers directly into Notion databases and team workspaces.",
    category: "Productivity",
    iconBg: "#000000",
    icon: "description",
    connected: false,
  },
];

export function IntegrationsModal({ open, onClose }: IntegrationsModalProps) {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [search, setSearch] = useState("");

  if (!open) return null;

  const toggleConnection = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.connected;
          toast.success(`${item.name} is now ${next ? "connected" : "disconnected"}`);
          return { ...item, connected: next };
        }
        return item;
      })
    );
  };

  const filtered = integrations.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-card border border-border rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-[#faf9f7] dark:bg-[#1a1c1b]">
          <div>
            <h2 className="text-xl font-bold text-ink tracking-tight">Apps &amp; Integrations</h2>
            <p className="text-xs text-ink-soft mt-0.5">
              Connect Formix to your tech stack and sync data automatically
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink p-1.5 rounded-lg hover:bg-surface transition-colors"
          >
            <XIcon width={16} height={16} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 pb-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 100+ integrations..."
            className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft outline-none focus:ring-2 focus:ring-ink/20"
          />
        </div>

        {/* Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between hover:border-ink/30 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      item.connected
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-surface text-ink-soft border border-border"
                    }`}
                  >
                    {item.connected ? "Active" : "Available"}
                  </span>
                </div>
                <h3 className="font-bold text-ink text-base">{item.name}</h3>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-[11px] text-ink-soft font-medium">{item.category}</span>
                <button
                  onClick={() => toggleConnection(item.id)}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors ${
                    item.connected
                      ? "border border-border text-ink hover:bg-surface"
                      : "bg-[#261c23] text-white hover:opacity-90"
                  }`}
                >
                  {item.connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end bg-surface">
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
