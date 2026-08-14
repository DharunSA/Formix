"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { XIcon } from "@/components/ui/icons";

interface ViewPlansModalProps {
  open: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Essential conversational forms for individuals.",
    responses: "10 responses / mo",
    features: ["Unlimited questions", "CSV responses export", "Ask Formix AI", "Basic Webhooks"],
    current: true,
  },
  {
    name: "Basic",
    price: "$25",
    period: "/mo",
    desc: "Create interactive forms and gather customer feedback.",
    responses: "100 responses / mo",
    features: ["File uploads", "Custom Thank You screens", "Automations Engine", "Email notifications"],
    recommended: false,
  },
  {
    name: "Plus",
    price: "$50",
    period: "/mo",
    desc: "Scale your workflow with custom branding and CRM tools.",
    responses: "1,000 responses / mo",
    features: ["Remove Formix branding", "Custom domain (cname)", "CRM auto-sync", "Priority AI generation"],
    recommended: true,
  },
  {
    name: "Business",
    price: "$83",
    period: "/mo",
    desc: "Advanced analytics, team collaboration, and security.",
    responses: "10,000 responses / mo",
    features: ["Unlimited team members", "SSO & SAML Login", "VIP Support", "Custom webhooks & SLA"],
    recommended: false,
  },
];

export function ViewPlansModal({ open, onClose }: ViewPlansModalProps) {
  if (!open) return null;

  const handleUpgrade = (planName: string) => {
    toast.success(`🎉 You've upgraded to Formix ${planName}!`, {
      description: "Response limit has been increased.",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-card border border-border rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-[#faf9f7] dark:bg-[#1a1c1b]">
          <div>
            <h2 className="text-2xl font-bold text-ink tracking-tight font-serif">Choose the right plan for your team</h2>
            <p className="text-xs text-ink-soft mt-1">Upgrade your response capacity and unlock advanced automations</p>
          </div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink p-1.5 rounded-lg hover:bg-surface transition-colors"
          >
            <XIcon width={18} height={18} />
          </button>
        </div>

        {/* Plans Grid */}
        <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                p.recommended
                  ? "border-[#261c23] shadow-md ring-2 ring-[#261c23]/10 bg-card"
                  : "border-border bg-surface"
              }`}
            >
              <div>
                {p.recommended && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#261c23] text-white px-2.5 py-0.5 rounded-full mb-3 inline-block">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-ink">{p.name}</h3>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-extrabold text-ink">{p.price}</span>
                  {p.period && <span className="text-xs text-ink-soft">{p.period}</span>}
                </div>
                <p className="text-xs text-ink-soft mb-4">{p.desc}</p>
                <div className="text-xs font-semibold text-ink bg-card border border-border rounded-lg p-2.5 mb-4">
                  ⚡ {p.responses}
                </div>

                <div className="space-y-2 pt-2 border-t border-border">
                  {p.features.map((f, i) => (
                    <div key={i} className="text-xs text-ink-soft flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => (p.current ? onClose() : handleUpgrade(p.name))}
                disabled={p.current}
                className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-opacity ${
                  p.current
                    ? "bg-surface border border-border text-ink-soft cursor-default"
                    : p.recommended
                    ? "bg-[#006644] hover:bg-[#005237] text-white shadow-sm"
                    : "bg-[#261c23] hover:opacity-90 text-white"
                }`}
              >
                {p.current ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-border flex items-center justify-between bg-surface text-xs text-ink-soft">
          <span>Need custom enterprise volumes or SSO?</span>
          <button
            onClick={() => {
              toast.info("Enterprise team will reach out within 24 hours!");
              onClose();
            }}
            className="text-ink font-bold hover:underline"
          >
            Contact Sales →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
