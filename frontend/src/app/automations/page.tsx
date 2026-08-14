"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Automation } from "@/lib/types";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PlusIcon, XIcon, SparkleIcon, TrashIcon } from "@/components/ui/icons";

type AutomationCategory = "all" | "form_submission" | "contact_activity" | "scheduled";

export default function AutomationsPage() {
  const qc = useQueryClient();
  const [category, setCategory] = useState<AutomationCategory>("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Automation | null>(null);

  // Builder Modal State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTrigger, setSelectedTrigger] = useState("form_submission");
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [autoName, setAutoName] = useState("");
  const [conditionType, setConditionType] = useState("always");
  const [conditionVal, setConditionVal] = useState("");
  const [actionType, setActionType] = useState("webhook");
  const [webhookUrl, setWebhookUrl] = useState("https://httpbin.org/post");
  const [notifyEmail, setNotifyEmail] = useState("team@company.com");

  const { data: automations, isLoading: isAutoLoading } = useQuery({
    queryKey: ["automations"],
    queryFn: api.listAutomations,
  });

  const { data: forms } = useQuery({
    queryKey: ["forms"],
    queryFn: api.listForms,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["automations"] });

  const createMutation = useMutation({
    mutationFn: api.createAutomation,
    onSuccess: () => {
      toast.success("⚡ Automation workflow created!");
      invalidate();
      resetBuilder();
    },
    onError: () => toast.error("Failed to create automation"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      api.updateAutomation(id, { is_active }),
    onSuccess: (updated) => {
      toast.success(`Automation is now ${updated.is_active ? "active" : "paused"}`);
      invalidate();
    },
  });

  const testMutation = useMutation({
    mutationFn: (id: number) => api.testAutomation(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(`✓ Test Success: ${res.message}`);
      } else {
        toast.error(`✗ Test Failed: ${res.message}`);
      }
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message || "Test run failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteAutomation(id),
    onSuccess: () => {
      toast.success("Automation deleted");
      invalidate();
      setDeleteTarget(null);
    },
  });

  const resetBuilder = () => {
    setCreateModalOpen(false);
    setStep(1);
    setAutoName("");
    setSelectedTrigger("form_submission");
    setSelectedFormId(null);
    setConditionType("always");
    setConditionVal("");
    setActionType("webhook");
    setWebhookUrl("https://httpbin.org/post");
    setNotifyEmail("team@company.com");
  };

  const handleSaveAutomation = () => {
    const defaultName =
      autoName.trim() ||
      (actionType === "webhook"
        ? "Stream submissions to Webhook"
        : actionType === "email"
        ? "Send lead notification email"
        : "Automated Slack notification");

    createMutation.mutate({
      name: defaultName,
      trigger_type: selectedTrigger,
      form_id: selectedFormId,
      condition_type: conditionType,
      condition_value: conditionVal.trim() || undefined,
      action_type: actionType,
      action_config:
        actionType === "webhook"
          ? { url: webhookUrl }
          : actionType === "email"
          ? { email: notifyEmail }
          : { channel: "#general-leads" },
      is_active: true,
    });
  };

  const filteredAutomations = useMemo(() => {
    if (!automations) return [];
    if (category === "all") return automations;
    return automations.filter((a) => a.trigger_type === category);
  }, [automations, category]);

  const formSubmissionsCount = automations?.filter((a) => a.trigger_type === "form_submission").length ?? 0;
  const hasAutomations = !!automations && automations.length > 0;

  return (
    <WorkspaceShell showSidebar={false}>
      <div className="flex flex-col md:flex-row h-full -m-6 md:-m-8">
        {/* Left Submenu Navigation */}
        <aside className="w-full md:w-64 border-r border-border p-5 flex flex-col gap-4 bg-card shrink-0">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="w-full bg-[#261c23] hover:opacity-90 text-white py-3 rounded-xl text-xs font-bold flex justify-center items-center gap-2 transition-opacity cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Create automation
          </button>

          <nav className="flex flex-col gap-1.5 flex-1">
            <button
              onClick={() => setCategory("form_submission")}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex justify-between items-center text-left ${
                category === "form_submission" || category === "all"
                  ? "bg-surface text-ink border border-border/60 shadow-sm"
                  : "text-ink-soft hover:bg-surface"
              }`}
            >
              <span>Form submissions</span>
              <span className="text-[10px] bg-card border border-border text-ink px-1.5 py-0.5 rounded font-bold">
                {formSubmissionsCount}
              </span>
            </button>

            <button
              onClick={() => setCategory("contact_activity")}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex justify-between items-center text-left ${
                category === "contact_activity"
                  ? "bg-surface text-ink border border-border/60 shadow-sm"
                  : "text-ink-soft hover:bg-surface"
              }`}
            >
              <span>Contact activity/updates</span>
              <span className="text-[10px] text-ink-soft">0</span>
            </button>

            <button
              onClick={() => setCategory("scheduled")}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex justify-between items-center text-left ${
                category === "scheduled"
                  ? "bg-surface text-ink border border-border/60 shadow-sm"
                  : "text-ink-soft hover:bg-surface"
              }`}
            >
              <span>Specific date/time</span>
              <span className="text-[10px] text-ink-soft">0</span>
            </button>
          </nav>
        </aside>

        {/* Center Main Content Canvas */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-page">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif text-ink tracking-tight">Automations</h1>
                <p className="text-xs text-ink-soft mt-1">
                  Trigger webhooks, send notifications, and sync workflows automatically
                </p>
              </div>

              {hasAutomations && (
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="bg-[#261c23] hover:opacity-90 text-white px-4 py-2 rounded-xl text-xs font-bold transition-opacity flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <PlusIcon width={14} height={14} />
                  New Automation
                </button>
              )}
            </div>

            {/* EMPTY STATE SHOWCASE (Exact Stitch Design) */}
            {!isAutoLoading && !hasAutomations && (
              <section className="flex flex-col lg:flex-row items-center justify-between gap-12 py-10">
                <div className="flex-1 max-w-md text-center lg:text-left">
                  <h2 className="text-3xl sm:text-4xl font-serif font-normal text-ink mb-4 leading-tight">
                    Keep the conversation going
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-soft mb-8 leading-relaxed">
                    Follow up with emails, external webhooks, and automatic workflow actions when someone completes a form.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                    <button
                      onClick={() => setCreateModalOpen(true)}
                      className="bg-[#261c23] hover:opacity-90 text-white px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 transition-opacity cursor-pointer shadow-sm"
                    >
                      <PlusIcon width={14} height={14} />
                      Create automation
                    </button>
                    <a
                      href="#help"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info("Automations stream real-time JSON webhooks upon response submission.");
                      }}
                      className="text-xs font-semibold text-ink-soft hover:text-ink underline"
                    >
                      Learn about automations →
                    </a>
                  </div>
                </div>

                {/* Hero Illustration */}
                <div className="flex-1 w-full max-w-sm">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHH8UDkFdnS91cDH6Fzi2ntNIms5qMi5IOYqUgLBd_yR4yIGyZ6y76WQO2vefGK8un1CCDNj03djXSHXDdfK0JxLtHTJ_Swela4m-CZnS6UYOqNhaG-PWsdV_xV_FVwR2xEBrk4T8IxbRLvjFjKsc1A6Sxw-va6x9-MqYFUfLpWcOrY6MzG4dNb5D1fiwk2pHaKSIfoJ_uW2PkVtuU9YW9gViCOfpv5-8K2jAUe7kc37_KkRa3XkNDZ4Y2l4b-I6QUm6Q"
                    alt="Automation workflow preview"
                    className="w-full h-auto rounded-3xl shadow-lg border border-border object-cover"
                  />
                </div>
              </section>
            )}

            {/* POPULATED AUTOMATIONS LIST */}
            {!isAutoLoading && hasAutomations && (
              <div className="space-y-4">
                {filteredAutomations.map((a) => {
                  const lastRun = a.last_executed_at
                    ? new Date(a.last_executed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "Never";

                  return (
                    <div
                      key={a.id}
                      className="p-5 rounded-2xl bg-card border border-border hover:border-ink/30 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                          <h3 className="font-bold text-sm text-ink">{a.name}</h3>
                          <span className="text-[10px] font-semibold bg-surface border border-border px-2 py-0.5 rounded-full text-ink-soft">
                            {a.trigger_type.replace("_", " ")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-ink-soft">
                          <span>Form: <strong className="text-ink">{a.form_title || "All Published Forms"}</strong></span>
                          <span>•</span>
                          <span>Action: <strong className="text-ink uppercase">{a.action_type}</strong></span>
                        </div>

                        <div className="flex items-center gap-4 text-[11px] text-ink-soft pt-1">
                          <span>Executions: <strong className="text-ink">{a.execution_count}</strong></span>
                          <span>Last triggered: <strong className="text-ink">{lastRun}</strong></span>
                        </div>
                      </div>

                      {/* Actions & Toggles */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          onClick={() => testMutation.mutate(a.id)}
                          disabled={testMutation.isPending}
                          className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-card text-xs font-bold text-ink transition-colors flex items-center gap-1 cursor-pointer"
                          title="Trigger a live test payload"
                        >
                          <span className="material-symbols-outlined text-sm text-purple-600">play_arrow</span>
                          Test
                        </button>

                        {/* Switch toggle */}
                        <button
                          onClick={() => toggleMutation.mutate({ id: a.id, is_active: !a.is_active })}
                          className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                            a.is_active ? "bg-[#261c23]" : "bg-border"
                          }`}
                          aria-label="Toggle active status"
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                              a.is_active ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(a)}
                          className="p-1.5 rounded-lg text-ink-soft hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <TrashIcon width={16} height={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE AUTOMATION VISUAL BUILDER MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-[#faf9f7] dark:bg-[#1a1c1b]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Step {step} of 3
                </span>
                <h2 className="text-xl font-bold text-ink tracking-tight font-serif">
                  {step === 1 && "What will trigger this automation?"}
                  {step === 2 && "Configure Form & Conditions"}
                  {step === 3 && "Select Action Node"}
                </h2>
              </div>
              <button onClick={resetBuilder} className="text-ink-soft hover:text-ink">
                <XIcon width={16} height={16} />
              </button>
            </div>

            {/* Step Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* STEP 1: TRIGGER SELECTION */}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      setSelectedTrigger("form_submission");
                      setStep(2);
                    }}
                    className="p-6 rounded-2xl border-2 border-border hover:border-ink hover:shadow-md transition-all text-center flex flex-col items-center bg-surface group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#e7dff1] text-[#261c23] flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-2xl">filter_alt</span>
                    </div>
                    <h3 className="font-bold text-sm text-ink mb-1">Form submission</h3>
                    <p className="text-xs text-ink-soft">When someone completes or answers a form.</p>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTrigger("contact_activity");
                      setStep(2);
                    }}
                    className="p-6 rounded-2xl border-2 border-border hover:border-ink hover:shadow-md transition-all text-center flex flex-col items-center bg-surface group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#f0dee7] text-[#261c23] flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-2xl">group</span>
                    </div>
                    <h3 className="font-bold text-sm text-ink mb-1">Contact activity</h3>
                    <p className="text-xs text-ink-soft">When a new contact is created or updated.</p>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTrigger("scheduled");
                      setStep(2);
                    }}
                    className="p-6 rounded-2xl border-2 border-border hover:border-ink hover:shadow-md transition-all text-center flex flex-col items-center bg-surface group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#f0e3a6] text-[#261c23] flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-2xl">calendar_month</span>
                    </div>
                    <h3 className="font-bold text-sm text-ink mb-1">Scheduled</h3>
                    <p className="text-xs text-ink-soft">Trigger on a recurring interval or date.</p>
                  </button>
                </div>
              )}

              {/* STEP 2: FORM & CONDITION CONFIG */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">Automation Name</label>
                    <input
                      value={autoName}
                      onChange={(e) => setAutoName(e.target.value)}
                      placeholder="e.g. Forward qualified leads to Webhook"
                      className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-xs text-ink outline-none focus:ring-2 focus:ring-ink/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">Target Form</label>
                    <select
                      value={selectedFormId || ""}
                      onChange={(e) => setSelectedFormId(e.target.value ? Number(e.target.value) : null)}
                      className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-xs text-ink outline-none focus:ring-2 focus:ring-ink/20"
                    >
                      <option value="">Any Form Submission (Global)</option>
                      {forms?.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.title} ({f.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">Condition Rule</label>
                    <select
                      value={conditionType}
                      onChange={(e) => setConditionType(e.target.value)}
                      className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-xs text-ink outline-none focus:ring-2 focus:ring-ink/20"
                    >
                      <option value="always">Always execute on submission</option>
                      <option value="rating_less_than">If rating is less than threshold (e.g. &lt; 3)</option>
                    </select>
                  </div>

                  {conditionType === "rating_less_than" && (
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1.5">Rating Threshold</label>
                      <input
                        type="number"
                        value={conditionVal}
                        onChange={(e) => setConditionVal(e.target.value)}
                        placeholder="3"
                        min="1"
                        max="5"
                        className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-xs text-ink outline-none focus:ring-2 focus:ring-ink/20"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: ACTION NODE */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setActionType("webhook")}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                        actionType === "webhook"
                          ? "border-[#261c23] bg-surface font-bold text-ink shadow-sm"
                          : "border-border text-ink-soft hover:bg-surface"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl block mb-1 text-purple-600">
                        webhook
                      </span>
                      <span className="text-xs">Webhook POST</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActionType("email")}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                        actionType === "email"
                          ? "border-[#261c23] bg-surface font-bold text-ink shadow-sm"
                          : "border-border text-ink-soft hover:bg-surface"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl block mb-1 text-emerald-600">
                        mail
                      </span>
                      <span className="text-xs">Email Alert</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActionType("slack");
                        toast.info("Slack channel stream integration selected");
                      }}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                        actionType === "slack"
                          ? "border-[#261c23] bg-surface font-bold text-ink shadow-sm"
                          : "border-border text-ink-soft hover:bg-surface"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl block mb-1 text-[#4A154B]">
                        chat
                      </span>
                      <span className="text-xs">Slack Message</span>
                    </button>
                  </div>

                  {actionType === "webhook" && (
                    <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
                      <label className="block text-xs font-bold text-ink">Webhook Target URL *</label>
                      <input
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://your-api.com/webhook"
                        required
                        className="w-full bg-card border border-border rounded-xl px-4 py-2 text-xs text-ink outline-none focus:ring-2 focus:ring-ink/20 font-mono"
                      />
                      <p className="text-[11px] text-ink-soft">
                        We will send a POST request with structured JSON payload whenever responses are submitted.
                      </p>
                    </div>
                  )}

                  {actionType === "email" && (
                    <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
                      <label className="block text-xs font-bold text-ink">Recipient Email *</label>
                      <input
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        placeholder="notifications@yourcompany.com"
                        required
                        className="w-full bg-card border border-border rounded-xl px-4 py-2 text-xs text-ink outline-none focus:ring-2 focus:ring-ink/20 font-mono"
                      />
                    </div>
                  )}

                  {actionType === "slack" && (
                    <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                      <p className="text-xs font-bold text-ink">Slack Channel: #general-leads</p>
                      <p className="text-[11px] text-ink-soft">Formix bot will stream completed answers directly to your channel.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Controls */}
            <div className="px-6 py-4 border-t border-border flex justify-between bg-surface">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                  className="px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-card rounded-xl"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                  className="px-6 py-2 bg-[#261c23] text-white text-xs font-bold rounded-xl hover:opacity-90 cursor-pointer"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveAutomation}
                  disabled={createMutation.isPending}
                  className="px-6 py-2 bg-[#006644] text-white text-xs font-bold rounded-xl hover:opacity-90 cursor-pointer shadow-sm"
                >
                  {createMutation.isPending ? "Creating..." : "Save Automation"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Delete automation"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        danger
      />
    </WorkspaceShell>
  );
}
