"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AskFormixAICapsule } from "@/components/ai/AskFormixAICapsule";

interface WorkspaceSidebarProps {
  onCreateForm: () => void;
  onOpenPlans: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  className?: string;
}

export function WorkspaceSidebar({
  onCreateForm,
  onOpenPlans,
  searchQuery = "",
  onSearchChange,
  className = "",
}: WorkspaceSidebarProps) {
  const { data: forms } = useQuery({ queryKey: ["forms"], queryFn: api.listForms });

  const totalFormsCount = forms?.length ?? 0;
  const totalResponses = forms?.reduce((acc, f) => acc + (f.response_count || 0), 0) ?? 0;
  const quotaLimit = 10;
  const quotaPercent = Math.min(100, Math.round((totalResponses / quotaLimit) * 100));

  return (
    <aside
      className={`bg-card border-r border-border flex flex-col h-full w-64 p-4 shrink-0 overflow-y-auto ${className}`}
    >
      {/* Create Form Button */}
      <button
        onClick={onCreateForm}
        className="bg-[#261c23] hover:opacity-90 text-white rounded-xl py-3 w-full text-xs font-bold flex justify-center items-center gap-2 transition-opacity mb-4 cursor-pointer shadow-sm"
      >
        <span className="material-symbols-outlined text-base">add</span>
        Create form
      </button>

      {/* Search Bar */}
      {onSearchChange && (
        <div className="relative mb-6">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft text-base pointer-events-none">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search forms..."
            className="w-full bg-surface hover:bg-surface/80 border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-ink placeholder:text-ink-soft outline-none focus:ring-2 focus:ring-ink/20 transition-colors"
          />
        </div>
      )}

      {/* Workspaces Section */}
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center justify-between text-ink px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface transition-colors font-bold text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-ink-soft">grid_view</span>
            Workspaces
          </div>
          <span className="border border-border hover:bg-surface rounded-md w-5 h-5 flex items-center justify-center text-xs text-ink-soft">
            +
          </span>
        </div>

        <div className="mt-2">
          <div className="flex items-center justify-between text-ink-soft px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold">
            <span>Private</span>
            <span className="material-symbols-outlined text-xs">arrow_drop_up</span>
          </div>
          <div className="bg-surface text-ink rounded-lg font-bold px-2.5 py-2 mt-1 flex items-center justify-between cursor-pointer text-xs border border-border/40">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              My workspace
            </span>
            <span className="text-[10px] bg-card border border-border text-ink px-1.5 py-0.5 rounded font-bold">
              {totalFormsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Responses Collected Quota */}
      <div className="mt-auto border-t border-border pt-4 mb-4">
        <div className="text-xs font-bold text-ink mb-1">Responses collected</div>
        <div className="text-xs text-ink-soft mb-2 flex justify-between">
          <span>
            <strong className="text-ink">{totalResponses}</strong> / {quotaLimit}
          </span>
          <span className="text-[10px] font-semibold">{quotaPercent}%</span>
        </div>
        <div className="w-full bg-surface border border-border h-1.5 rounded-full mb-3 overflow-hidden">
          <div
            className="bg-[#261c23] h-full rounded-full transition-all duration-300"
            style={{ width: `${quotaPercent}%` }}
          />
        </div>
        <button
          onClick={onOpenPlans}
          className="w-full text-xs font-bold border border-border rounded-lg px-3 py-2 text-ink hover:bg-surface transition-colors cursor-pointer"
        >
          Increase response limit
        </button>
      </div>

      {/* Ask Formix AI Assistant Capsule */}
      <div>
        <AskFormixAICapsule />
      </div>
    </aside>
  );
}
