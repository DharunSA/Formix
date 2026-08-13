"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { FormListItem } from "@/lib/types";
import { FormCard } from "@/components/dashboard/FormCard";
import { Button } from "@/components/ui/Button";
import { PromptModal } from "@/components/ui/PromptModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PlusIcon, SparkleIcon } from "@/components/ui/icons";

export default function DashboardPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { data: forms, isLoading } = useQuery({ queryKey: ["forms"], queryFn: api.listForms });

  const [createOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<FormListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FormListItem | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["forms"] });

  const createMutation = useMutation({
    mutationFn: (title: string) => api.createForm(title),
    onSuccess: (form) => {
      toast.success("Form created");
      invalidate();
      router.push(`/forms/${form.id}/edit`);
    },
    onError: () => toast.error("Couldn't create the form"),
  });

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
    onSuccess: () => {
      toast.success("Form duplicated");
      invalidate();
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

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
              <SparkleIcon width={18} height={18} className="text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Formix</span>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon width={16} height={16} />
            Create a form
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink tracking-tight">Your forms</h1>
          <p className="text-ink-soft mt-1">Build, publish, and track responses in one place.</p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-white border border-border animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && forms && forms.length === 0 && (
          <div className="text-center py-24 border border-dashed border-border rounded-2xl bg-white">
            <p className="text-ink-soft mb-4">You haven&apos;t created any forms yet.</p>
            <Button onClick={() => setCreateOpen(true)}>
              <PlusIcon width={16} height={16} />
              Create your first form
            </Button>
          </div>
        )}

        {!isLoading && forms && forms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {forms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onRename={() => setRenameTarget(form)}
                onDuplicate={() => duplicateMutation.mutate(form.id)}
                onDelete={() => setDeleteTarget(form)}
                onTogglePublish={() => publishMutation.mutate(form)}
              />
            ))}
          </div>
        )}
      </main>

      <PromptModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(title) => createMutation.mutate(title)}
        title="Create a new form"
        label="Form title"
        placeholder="Untitled form"
        submitLabel="Create"
      />

      <PromptModal
        open={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        onSubmit={(title) => renameTarget && renameMutation.mutate({ id: renameTarget.id, title })}
        title="Rename form"
        label="Form title"
        initialValue={renameTarget?.title ?? ""}
        submitLabel="Save"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Delete form"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This will permanently remove the form and all of its responses.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
