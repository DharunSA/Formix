"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { FormListItem } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import {
  BarChartIcon,
  CopyIcon,
  EditIcon,
  EyeIcon,
  LinkIcon,
  MoreIcon,
  TrashIcon,
} from "@/components/ui/icons";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function FormCard({
  form,
  onRename,
  onDuplicate,
  onDelete,
  onTogglePublish,
}: {
  form: FormListItem;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  const router = useRouter();
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/f/${form.share_slug}` : "";

  return (
    <div className="group relative bg-card border border-border rounded-2xl p-5 hover:shadow-md dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-150 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <Badge tone={form.status === "published" ? "success" : "draft"}>
          {form.status === "published" ? "Published" : "Draft"}
        </Badge>
        <DropdownMenu
          trigger={
            <button className="p-1.5 rounded-full hover:bg-surface text-ink-soft cursor-pointer">
              <MoreIcon width={18} height={18} />
            </button>
          }
          items={[
            { label: "Edit", icon: <EditIcon width={15} height={15} />, onClick: () => router.push(`/forms/${form.id}/edit`) },
            { label: "Rename", icon: <EditIcon width={15} height={15} />, onClick: onRename },
            { label: "Duplicate", icon: <CopyIcon width={15} height={15} />, onClick: onDuplicate },
            {
              label: form.status === "published" ? "Unpublish" : "Publish",
              icon: <EyeIcon width={15} height={15} />,
              onClick: onTogglePublish,
            },
            ...(form.status === "published"
              ? [
                  {
                    label: "Copy share link",
                    icon: <LinkIcon width={15} height={15} />,
                    onClick: () => {
                      navigator.clipboard.writeText(publicUrl);
                      toast.success("Share link copied");
                    },
                  },
                ]
              : []),
            { label: "Delete", icon: <TrashIcon width={15} height={15} />, onClick: onDelete, danger: true },
          ]}
        />
      </div>

      <Link href={`/forms/${form.id}/edit`} className="block flex-1">
        <h3 className="text-lg font-semibold text-ink mb-1 line-clamp-2">{form.title}</h3>
        <p className="text-sm text-ink-soft line-clamp-2 min-h-10">
          {form.description || "No description"}
        </p>
      </Link>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-sm text-ink-soft">
        <span>{form.question_count} question{form.question_count === 1 ? "" : "s"}</span>
        <Link
          href={`/forms/${form.id}/results`}
          className="flex items-center gap-1 hover:text-ink font-medium"
        >
          <BarChartIcon width={14} height={14} />
          {form.response_count} response{form.response_count === 1 ? "" : "s"}
        </Link>
      </div>
      <div className="text-xs text-ink-soft mt-1.5">Updated {timeAgo(form.updated_at)}</div>
    </div>
  );
}
