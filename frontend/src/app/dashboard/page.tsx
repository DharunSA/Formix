"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { toast } from "sonner";
import Link from "next/link";
import { api } from "@/lib/api";
import type { FormListItem, FormStatus } from "@/lib/types";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { FormCard } from "@/components/dashboard/FormCard";
import { PromptModal } from "@/components/ui/PromptModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SparkleIcon, PlusIcon, XIcon, MoreIcon, CheckIcon } from "@/components/ui/icons";

type SortKey = "updated" | "responses" | "title";
type StatusFilter = "all" | FormStatus;
type ViewMode = "list" | "grid";

export default function DashboardPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { data: forms, isLoading } = useQuery({ queryKey: ["forms"], queryFn: api.listForms });

  const [renameTarget, setRenameTarget] = useState<FormListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FormListItem | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showBanner, setShowBanner] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["forms"] });

  const renameMutation = useMutation({
    mutationFn: ({ id, title }: { id: number; title: string }) => api.patchForm(id, { title }),
    onSuccess: () => {
      toast.success("Form renamed");
      invalidate();
    },
    onError: () => toast.error("Couldn't rename the form"),
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: number) => api.duplicateForm(id),
    onSuccess: (dup) => {
      toast.success("Form duplicated");
      invalidate();
      router.push(`/forms/${dup.id}/edit`);
    },
    onError: () => toast.error("Couldn't duplicate the form"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteForm(id),
    onSuccess: () => {
      toast.success("Form deleted");
      invalidate();
    },
    onError: () => toast.error("Couldn't delete the form"),
  });

  const publishMutation = useMutation({
    mutationFn: (form: FormListItem) =>
      form.status === "published" ? api.unpublishForm(form.id) : api.publishForm(form.id),
    onSuccess: (updated) => {
      toast.success(updated.status === "published" ? "Form published" : "Form unpublished");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message || "Couldn't update the form"),
  });

  const templateMutation = useMutation({
    mutationFn: () =>
      api.generateFormWithAI("Project Request & Prioritization Intake Form with detailed requirements"),
    onSuccess: (newForm) => {
      toast.success("✨ Template loaded successfully!");
      invalidate();
      router.push(`/forms/${newForm.id}/edit`);
    },
  });

  const visibleForms = useMemo(() => {
    if (!forms) return [];
    const query = search.trim().toLowerCase();
    let result = forms.filter((f) => {
      const matchesSearch = !query || f.title.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || f.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    result = [...result].sort((a, b) => {
      if (sortKey === "responses") return b.response_count - a.response_count;
      if (sortKey === "title") return a.title.localeCompare(b.title);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    return result;
  }, [forms, search, statusFilter, sortKey]);

  const hasAnyForms = !!forms && forms.length > 0;
  const hasFiltersActive = search.trim() !== "" || statusFilter !== "all";

  return (
    <WorkspaceShell searchQuery={search} onSearchChange={setSearch}>
      <div className="max-w-6xl mx-auto pb-12">
        {/* Top Workspace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif text-ink tracking-tight">
              My workspace
            </h1>
            <span className="text-xs bg-surface border border-border text-ink-soft px-2.5 py-0.5 rounded-full font-bold">
              {forms?.length ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-surface rounded-lg p-1 border border-border/50">
              {(["all", "draft", "published"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={clsx(
                    "px-3 py-1 rounded-md text-xs font-semibold cursor-pointer capitalize transition-colors",
                    statusFilter === s ? "bg-card text-ink shadow-sm" : "text-ink-soft hover:text-ink"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="border border-border bg-card rounded-lg px-3 py-1.5 text-xs text-ink font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-ink/20"
            >
              <option value="updated">Last updated</option>
              <option value="responses">Most responses</option>
              <option value="title">Title A-Z</option>
            </select>

            {/* List / Grid View Switcher */}
            <div className="flex items-center border border-border rounded-lg bg-card p-0.5">
              <button
                onClick={() => setViewMode("list")}
                className={clsx(
                  "flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-colors",
                  viewMode === "list"
                    ? "bg-surface text-ink shadow-sm"
                    : "text-ink-soft hover:text-ink"
                )}
                title="List view"
              >
                <span className="material-symbols-outlined text-sm">view_list</span>
                <span className="hidden md:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={clsx(
                  "flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-colors",
                  viewMode === "grid"
                    ? "bg-surface text-ink shadow-sm"
                    : "text-ink-soft hover:text-ink"
                )}
                title="Grid view"
              >
                <span className="material-symbols-outlined text-sm">grid_view</span>
                <span className="hidden md:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Template Prompt Banner (From Stitch Design) */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-card border border-border rounded-2xl p-5 mb-8 flex justify-between items-start relative overflow-hidden shadow-sm"
            >
              <div className="flex items-start gap-4 z-10 w-full">
                <div className="w-10 h-10 bg-[#f0dee7] dark:bg-[#382d35] rounded-xl flex items-center justify-center text-[#261c23] dark:text-[#f0dee7] shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-xl">auto_awesome</span>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-ink font-medium text-xs sm:text-sm mb-3">
                      Collect and prioritize incoming requests with detailed information for better workflow management.
                    </p>
                    <button
                      onClick={() => setShowBanner(false)}
                      className="text-ink-soft hover:text-ink p-1 rounded-lg hover:bg-surface transition-colors"
                      aria-label="Dismiss banner"
                    >
                      <XIcon width={14} height={14} />
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => templateMutation.mutate()}
                      disabled={templateMutation.isPending}
                      className="border border-border bg-surface text-xs font-bold px-3.5 py-1.5 rounded-lg hover:bg-card transition-colors text-ink cursor-pointer"
                    >
                      {templateMutation.isPending ? "Loading template..." : "Use this form"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-card border border-border animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty States */}
        {!isLoading && !hasAnyForms && (
          <div className="text-center py-24 border border-dashed border-border rounded-2xl bg-card">
            <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
              <SparkleIcon width={20} height={20} className="text-ink-soft" />
            </div>
            <p className="text-ink-soft mb-4">You haven&apos;t created any forms yet.</p>
            <p className="text-xs text-ink-soft mb-6">
              Create a form or use the &ldquo;Ask Formix AI&rdquo; bar in the bottom left!
            </p>
          </div>
        )}

        {!isLoading && hasAnyForms && visibleForms.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
            <p className="text-ink-soft mb-4">No forms match your search query.</p>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-surface border border-border text-ink hover:bg-card"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* LIST VIEW MODE */}
        {!isLoading && visibleForms.length > 0 && viewMode === "list" && (
          <div className="space-y-2">
            {/* List Header */}
            <div className="grid grid-cols-12 gap-4 text-[11px] font-bold uppercase tracking-wider text-ink-soft px-4 pb-2">
              <div className="col-span-6 sm:col-span-5">Title</div>
              <div className="col-span-2 text-center sm:text-left">Responses</div>
              <div className="hidden sm:block col-span-2">Status</div>
              <div className="col-span-3 sm:col-span-2">Updated</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* List Rows */}
            {visibleForms.map((form) => {
              const formattedDate = new Date(form.updated_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={form.id}
                  className="bg-card border border-border hover:border-ink/40 rounded-xl p-3 flex items-center transition-all shadow-sm group relative"
                >
                  <div className="grid grid-cols-12 gap-4 w-full items-center">
                    {/* Form icon & Title */}
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 font-bold text-xs"
                        style={{ backgroundColor: form.theme_color || "#7ba5e8" }}
                      >
                        <span className="material-symbols-outlined text-sm">description</span>
                      </div>
                      <Link
                        href={`/forms/${form.id}/edit`}
                        className="font-bold text-xs sm:text-sm text-ink group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate"
                      >
                        {form.title}
                      </Link>
                    </div>

                    {/* Responses Count */}
                    <div className="col-span-2 text-xs text-ink-soft font-semibold text-center sm:text-left">
                      <Link
                        href={`/forms/${form.id}/results`}
                        className="hover:text-ink hover:underline"
                      >
                        {form.response_count}
                      </Link>
                    </div>

                    {/* Status Badge */}
                    <div className="hidden sm:block col-span-2">
                      <span
                        className={clsx(
                          "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize",
                          form.status === "published"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                            : "bg-surface text-ink-soft border border-border"
                        )}
                      >
                        <span
                          className={clsx(
                            "w-1.5 h-1.5 rounded-full",
                            form.status === "published" ? "bg-emerald-500" : "bg-ink-soft"
                          )}
                        />
                        {form.status}
                      </span>
                    </div>

                    {/* Updated Date */}
                    <div className="col-span-3 sm:col-span-2 text-xs text-ink-soft">{formattedDate}</div>

                    {/* Actions Menu */}
                    <div className="col-span-1 flex items-center justify-end relative">
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === form.id ? null : form.id)}
                        className="text-ink-soft hover:text-ink p-1.5 rounded-lg hover:bg-surface transition-colors cursor-pointer"
                        aria-label="Menu"
                      >
                        <MoreIcon width={16} height={16} />
                      </button>

                      {/* Dropdown Menu */}
                      {menuOpenId === form.id && (
                        <div
                          className="absolute right-0 top-8 w-44 rounded-xl bg-card border border-border shadow-xl p-1 z-30 animate-fade-in text-xs font-semibold"
                          onMouseLeave={() => setMenuOpenId(null)}
                        >
                          <Link
                            href={`/forms/${form.id}/edit`}
                            className="block px-3 py-1.5 text-ink hover:bg-surface rounded-lg"
                          >
                            Edit questions
                          </Link>
                          <Link
                            href={`/forms/${form.id}/results`}
                            className="block px-3 py-1.5 text-ink hover:bg-surface rounded-lg"
                          >
                            View results ({form.response_count})
                          </Link>
                          <button
                            onClick={() => {
                              setRenameTarget(form);
                              setMenuOpenId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-ink hover:bg-surface rounded-lg"
                          >
                            Rename
                          </button>
                          <button
                            onClick={() => {
                              duplicateMutation.mutate(form.id);
                              setMenuOpenId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-ink hover:bg-surface rounded-lg"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={() => {
                              publishMutation.mutate(form);
                              setMenuOpenId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-ink hover:bg-surface rounded-lg"
                          >
                            {form.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                          <div className="my-1 border-t border-border" />
                          <button
                            onClick={() => {
                              setDeleteTarget(form);
                              setMenuOpenId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* GRID VIEW MODE */}
        {!isLoading && visibleForms.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleForms.map((form, i) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
              >
                <FormCard
                  form={form}
                  onRename={() => setRenameTarget(form)}
                  onDuplicate={() => duplicateMutation.mutate(form.id)}
                  onDelete={() => setDeleteTarget(form)}
                  onTogglePublish={() => publishMutation.mutate(form)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {hasFiltersActive && visibleForms.length > 0 && (
          <p className="text-xs text-ink-soft mt-6">
            Showing {visibleForms.length} of {forms?.length} forms
          </p>
        )}
      </div>

      {/* Rename Dialog */}
      <PromptModal
        open={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        onSubmit={(title) => renameTarget && renameMutation.mutate({ id: renameTarget.id, title })}
        title="Rename form"
        label="Form title"
        initialValue={renameTarget?.title ?? ""}
        submitLabel="Save"
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Delete form"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This will permanently remove the form and all of its responses.`}
        confirmLabel="Delete"
        danger
      />
    </WorkspaceShell>
  );
}
