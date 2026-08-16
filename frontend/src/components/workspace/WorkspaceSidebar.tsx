import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { AskFormixAICapsule } from "@/components/ai/AskFormixAICapsule";
import { CreateWorkspaceModal } from "./CreateWorkspaceModal";

interface Workspace {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_WORKSPACES: Workspace[] = [
  { id: "ws-default", name: "My workspace", color: "#059669" },
  { id: "ws-marketing", name: "Marketing Campaigns", color: "#7c3aed" },
];

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
  const { data: allForms } = useQuery({ queryKey: ["all_forms_workspace"], queryFn: () => api.listForms() });

  const [workspaces, setWorkspaces] = useState<Workspace[]>(DEFAULT_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>("ws-default");
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("formix_user_workspaces");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setWorkspaces(parsed);
          }
        } catch {
          // ignore
        }
      }
      const storedActive = localStorage.getItem("formix_active_workspace");
      if (storedActive) setActiveWorkspaceId(storedActive);
    }
  }, []);

  const switchWorkspace = (wsId: string, wsName: string) => {
    setActiveWorkspaceId(wsId);
    if (typeof window !== "undefined") {
      localStorage.setItem("formix_active_workspace", wsId);
      window.dispatchEvent(new CustomEvent("formix_workspace_change", { detail: { id: wsId, name: wsName } }));
    }
    toast.info(`Switched to "${wsName}" workspace`);
  };

  const saveWorkspaces = (newWorkspaces: Workspace[]) => {
    setWorkspaces(newWorkspaces);
    if (typeof window !== "undefined") {
      localStorage.setItem("formix_user_workspaces", JSON.stringify(newWorkspaces));
    }
  };

  const handleCreateWorkspace = (name: string, color: string) => {
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      color,
    };
    const next = [...workspaces, newWs];
    saveWorkspaces(next);
    switchWorkspace(newWs.id, newWs.name);
  };

  const activeForms = allForms?.filter((f) => (f.workspace_id || "ws-default") === activeWorkspaceId) ?? [];
  const totalResponses = activeForms.reduce((acc, f) => acc + (f.response_count || 0), 0);
  const quotaLimit = 100;
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
        <div className="flex items-center justify-between text-ink px-2.5 py-2 rounded-lg font-bold text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-ink-soft">grid_view</span>
            Workspaces
          </div>
          <button
            onClick={() => setCreateWorkspaceOpen(true)}
            className="border border-border hover:bg-surface rounded-md w-5 h-5 flex items-center justify-center text-xs text-ink-soft hover:text-ink cursor-pointer transition-colors"
            title="Create new workspace"
          >
            +
          </button>
        </div>

        <div className="mt-1 space-y-1">
          <div className="flex items-center justify-between text-ink-soft px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold">
            <span>Workspaces ({workspaces.length})</span>
          </div>
          {workspaces.map((ws) => {
            const isActive = ws.id === activeWorkspaceId;
            const wsFormCount = allForms?.filter((f) => (f.workspace_id || "ws-default") === ws.id).length ?? 0;
            return (
              <div
                key={ws.id}
                onClick={() => switchWorkspace(ws.id, ws.name)}
                className={`rounded-lg font-bold px-2.5 py-2 flex items-center justify-between cursor-pointer text-xs transition-colors border ${
                  isActive
                    ? "bg-surface text-ink border-border/80 shadow-xs"
                    : "text-ink-soft hover:bg-surface/60 hover:text-ink border-transparent"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: ws.color }}
                  />
                  <span className="truncate">{ws.name}</span>
                </span>
                <span className="text-[10px] bg-card border border-border text-ink-soft px-1.5 py-0.5 rounded font-bold shrink-0">
                  {wsFormCount}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <CreateWorkspaceModal
        open={createWorkspaceOpen}
        onClose={() => setCreateWorkspaceOpen(false)}
        onCreateWorkspace={handleCreateWorkspace}
      />

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
