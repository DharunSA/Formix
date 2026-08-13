"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { QuestionSummaryCard } from "./QuestionSummaryCard";
import { ResponsesTable } from "./ResponsesTable";
import { ResponseDetailModal } from "./ResponseDetailModal";
import { DownloadIcon, LinkIcon, LoaderIcon } from "@/components/ui/icons";
import { toast } from "sonner";

export function ResultsClient({ formId }: { formId: number }) {
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);

  const { data: form, isLoading: loadingForm } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => api.getForm(formId),
  });
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["summary", formId],
    queryFn: () => api.getSummary(formId),
  });
  const { data: responses, isLoading: loadingResponses } = useQuery({
    queryKey: ["responses", formId],
    queryFn: () => api.listResponses(formId),
  });

  if (loadingForm || loadingSummary || loadingResponses || !form || !summary || !responses) {
    return (
      <div className="h-screen flex items-center justify-center text-ink-soft gap-2">
        <LoaderIcon width={18} height={18} /> Loading results...
      </div>
    );
  }

  const accent = form.theme_color || "#0d0d0d";
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/f/${form.share_slug}` : "";

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <header className="border-b border-border bg-white px-5 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="text-ink-soft hover:text-ink text-sm shrink-0">
            ← Forms
          </Link>
          <h1 className="text-base font-semibold text-ink truncate">{form.title}</h1>
          <Badge tone={form.status === "published" ? "success" : "draft"}>
            {form.status === "published" ? "Published" : "Draft"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/forms/${formId}/edit`}>
            <Button variant="secondary" size="sm">
              Edit form
            </Button>
          </Link>
          {form.status === "published" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                toast.success("Share link copied");
              }}
            >
              <LinkIcon width={14} height={14} />
              Copy link
            </Button>
          )}
          <a href={api.exportCsvUrl(formId)} download>
            <Button size="sm">
              <DownloadIcon width={14} height={14} />
              Export CSV
            </Button>
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatTile label="Total responses" value={summary.total_responses} />
          <StatTile label="Completed" value={summary.completed_responses} />
          <StatTile
            label="Completion rate"
            value={`${Math.round(summary.completion_rate * 100)}%`}
          />
        </div>

        <h2 className="text-lg font-semibold text-ink mb-4">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {summary.questions.map((q) => (
            <QuestionSummaryCard key={q.question_id} summary={q} accent={accent} />
          ))}
        </div>

        <h2 className="text-lg font-semibold text-ink mb-4">
          Responses <span className="text-ink-soft font-normal">({responses.length})</span>
        </h2>
        <ResponsesTable responses={responses} onSelect={setSelectedResponse} />
      </main>

      <ResponseDetailModal
        formId={formId}
        responseId={selectedResponse}
        questions={form.questions}
        onClose={() => setSelectedResponse(null)}
      />
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5">
      <p className="text-xs font-medium text-ink-soft uppercase tracking-wide mb-1.5">{label}</p>
      <p className="text-3xl font-bold text-ink tabular-nums">{value}</p>
    </div>
  );
}
