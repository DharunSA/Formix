"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Contact } from "@/lib/types";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { ImportContactsModal } from "@/components/workspace/ImportContactsModal";
import { PromptModal } from "@/components/ui/PromptModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SparkleIcon, PlusIcon, XIcon, SearchIcon, TrashIcon } from "@/components/ui/icons";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ContactsPage() {
  return (
    <AuthGuard>
      <ContactsContent />
    </AuthGuard>
  );
}

function ContactsContent() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilterTag, setActiveFilterTag] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);

  const { data: contacts, isLoading, refetch } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => api.listContacts(),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["contacts"] });
    refetch();
  };

  const autoSyncMutation = useMutation({
    mutationFn: api.autoSyncContacts,
    onSuccess: (res) => {
      toast.success("✨ Contacts Synchronized!", {
        description: res.message,
      });
      invalidate();
    },
    onError: () => toast.error("Could not sync contacts from forms"),
  });

  const createContactMutation = useMutation({
    mutationFn: (data: { name: string; email: string }) => api.createContact(data),
    onSuccess: () => {
      toast.success("Contact added successfully");
      invalidate();
      setAddContactOpen(false);
      setNewContactEmail("");
      setNewContactName("");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create contact"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteContact(id),
    onSuccess: () => {
      toast.success("Contact deleted");
      invalidate();
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete contact"),
  });

  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    const q = search.trim().toLowerCase();
    return contacts.filter((c) => {
      const matchSearch =
        !q ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        c.email.toLowerCase().includes(q) ||
        (c.source_form_title && c.source_form_title.toLowerCase().includes(q));

      const matchTag =
        !activeFilterTag || (c.tags && c.tags.includes(activeFilterTag));

      return matchSearch && matchTag;
    });
  }, [contacts, search, activeFilterTag]);

  const hasContacts = !!contacts && contacts.length > 0;

  return (
    <WorkspaceShell searchQuery={search} onSearchChange={setSearch}>
      <div className="max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif text-ink tracking-tight">All contacts</h1>
            <span className="text-xs bg-surface border border-border text-ink-soft px-2.5 py-0.5 rounded-full font-bold">
              {contacts?.length ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => autoSyncMutation.mutate()}
              disabled={autoSyncMutation.isPending}
              className="border border-border bg-card hover:bg-surface text-ink px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Scan form submissions for email fields"
            >
              <SparkleIcon width={14} height={14} className="text-purple-600" />
              {autoSyncMutation.isPending ? "Syncing..." : "Auto-add from forms"}
            </button>

            <button
              onClick={() => setImportOpen(true)}
              className="border border-border bg-card hover:bg-surface text-ink px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              Import CSV
            </button>

            <button
              onClick={() => setAddContactOpen(true)}
              className="bg-[#261c23] hover:opacity-90 text-white px-4 py-2 rounded-xl text-xs font-bold transition-opacity flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <PlusIcon width={14} height={14} />
              Add contact
            </button>
          </div>
        </div>

        {/* Toolbar */}
        {hasContacts && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <SearchIcon
                  width={15}
                  height={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, or form..."
                  className="w-full border border-border bg-card rounded-lg pl-9 pr-4 py-2 text-xs text-ink placeholder:text-ink-soft outline-none focus:ring-2 focus:ring-ink/20"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                  >
                    <XIcon width={12} height={12} />
                  </button>
                )}
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setFilterOpen((p) => !p)}
                  className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold transition-colors ${
                    activeFilterTag
                      ? "bg-[#261c23] text-white border-[#261c23]"
                      : "bg-card text-ink border-border hover:bg-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">filter_alt</span>
                  {activeFilterTag ? `Tag: ${activeFilterTag}` : "Filter"}
                </button>

                {filterOpen && (
                  <div
                    className="absolute left-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl p-2 z-30 animate-fade-in text-xs font-semibold"
                    onMouseLeave={() => setFilterOpen(false)}
                  >
                    <div className="px-2 py-1 text-[10px] uppercase font-bold text-ink-soft">
                      Filter by Tag
                    </div>
                    <button
                      onClick={() => {
                        setActiveFilterTag(null);
                        setFilterOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-surface rounded-lg text-ink"
                    >
                      All Contacts
                    </button>
                    {["Qualified Lead", "Auto-Synced", "Customer", "Beta Tester"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setActiveFilterTag(tag);
                          setFilterOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-surface rounded-lg text-ink flex items-center justify-between"
                      >
                        <span>{tag}</span>
                        {activeFilterTag === tag && <span className="text-purple-600 font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {activeFilterTag && (
              <button
                onClick={() => setActiveFilterTag(null)}
                className="text-xs text-ink-soft hover:text-ink underline self-start sm:self-auto"
              >
                Reset filter
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-card border border-border animate-pulse" />
            ))}
          </div>
        )}

        {/* UI STATE 1: Empty State (Exact Stitch Layout) */}
        {!isLoading && !hasContacts && (
          <div className="bg-card border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="max-w-md">
              <div className="w-12 h-12 rounded-2xl bg-[#e7dff1] dark:bg-[#382d35] text-[#261c23] dark:text-[#f0dee7] flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">group</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-ink mb-2 tracking-tight">
                Ready to build your contact list?
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft mb-6 leading-relaxed">
                Create contacts automatically whenever respondents fill out your forms.
              </p>

              <ol className="text-left text-xs sm:text-sm text-ink-soft mb-8 space-y-2.5 list-decimal list-inside mx-auto max-w-xs bg-surface p-4 rounded-xl border border-border">
                <li>Add an email question to a form</li>
                <li>Publish your form</li>
                <li>Click &ldquo;Auto-add from forms&rdquo; below</li>
              </ol>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => autoSyncMutation.mutate()}
                  disabled={autoSyncMutation.isPending}
                  className="bg-[#261c23] hover:opacity-90 text-white py-2.5 px-5 rounded-xl text-xs font-bold transition-opacity flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <SparkleIcon width={14} height={14} className="text-purple-300" />
                  {autoSyncMutation.isPending ? "Extracting..." : "Auto-add from forms"}
                </button>
                <button
                  onClick={() => setImportOpen(true)}
                  className="border border-border bg-surface hover:bg-card text-ink py-2.5 px-5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Import contacts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* UI STATE 2: Populated Contacts Table */}
        {!isLoading && hasContacts && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ink">
                <thead className="bg-surface border-b border-border text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                  <tr>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Source Form</th>
                    <th className="py-3.5 px-4 text-center">Submissions</th>
                    <th className="py-3.5 px-4">Tags</th>
                    <th className="py-3.5 px-4">Last Active</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-ink-soft">
                        No contacts found matching {search ? `"${search}"` : activeFilterTag ? `tag "${activeFilterTag}"` : "your filter"}.
                        {(search || activeFilterTag) && (
                          <button
                            onClick={() => {
                              setSearch("");
                              setActiveFilterTag(null);
                            }}
                            className="ml-2 font-bold text-ink underline hover:opacity-80"
                          >
                            Clear filters
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((c) => {
                    const initials = (c.name || c.email)
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    const activeDate = new Date(c.last_active_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <tr key={c.id} className="hover:bg-surface/50 transition-colors">
                        {/* Name & Avatar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#e7dff1] dark:bg-[#382d35] text-[#261c23] dark:text-[#f0dee7] font-bold flex items-center justify-center text-[11px] shrink-0 border border-border">
                              {initials}
                            </div>
                            <span className="font-bold text-ink">{c.name || "Anonymous"}</span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-ink-soft">{c.email}</td>

                        {/* Source Form */}
                        <td className="py-3.5 px-4 text-ink-soft">
                          {c.source_form_title ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-ink">
                              <span className="material-symbols-outlined text-sm text-ink-soft">description</span>
                              {c.source_form_title}
                            </span>
                          ) : (
                            <span className="italic text-ink-soft/70">Direct / Manual</span>
                          )}
                        </td>

                        {/* Submissions Count */}
                        <td className="py-3.5 px-4 text-center font-bold text-ink">
                          {c.submissions_count}
                        </td>

                        {/* Tags */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {c.tags && c.tags.length > 0 ? (
                              c.tags.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-semibold bg-surface border border-border px-2 py-0.5 rounded-full text-ink"
                                >
                                  {t}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-ink-soft/60">-</span>
                            )}
                          </div>
                        </td>

                        {/* Last Active */}
                        <td className="py-3.5 px-4 text-ink-soft text-[11px]">{activeDate}</td>

                        {/* Delete Action */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setDeleteTarget(c)}
                            className="text-ink-soft hover:text-red-600 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Delete contact"
                          >
                            <TrashIcon width={14} height={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>

            {filteredContacts.length === 0 && (
              <div className="p-8 text-center text-xs text-ink-soft">
                No contacts match your active search or filters.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Manual Add Contact Modal */}
      {addContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-ink font-serif">Add New Contact</h3>
              <button onClick={() => setAddContactOpen(false)} className="text-ink-soft hover:text-ink">
                <XIcon width={16} height={16} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Full Name</label>
              <input
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2 text-xs text-ink outline-none focus:ring-2 focus:ring-ink/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Email address *</label>
              <input
                type="email"
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)}
                placeholder="jane.doe@company.com"
                required
                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2 text-xs text-ink outline-none focus:ring-2 focus:ring-ink/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAddContactOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-surface rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newContactEmail.trim()) {
                    toast.error("Email is required");
                    return;
                  }
                  createContactMutation.mutate({
                    name: newContactName.trim() || "Anonymous",
                    email: newContactEmail.trim(),
                  });
                }}
                className="px-5 py-2 bg-[#261c23] text-white text-xs font-bold rounded-xl hover:opacity-90"
              >
                Save Contact
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* CSV Import Modal */}
      <ImportContactsModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={invalidate}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Delete contact"
        description={`Are you sure you want to remove "${deleteTarget?.email}" from your contact list?`}
        confirmLabel="Delete"
        danger
      />
    </WorkspaceShell>
  );
}
