"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { WorkspaceTopNav } from "./WorkspaceTopNav";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { IntegrationsModal } from "./IntegrationsModal";
import { BrandKitModal } from "./BrandKitModal";
import { ViewPlansModal } from "./ViewPlansModal";
import { InviteModal } from "./InviteModal";
import { HelpCenterModal } from "./HelpCenterModal";
import { ResearchFlowModal } from "./ResearchFlowModal";
import { PromptModal } from "@/components/ui/PromptModal";

interface WorkspaceShellProps {
  children: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  showSidebar?: boolean;
}

export function WorkspaceShell({
  children,
  searchQuery,
  onSearchChange,
  showSidebar = true,
}: WorkspaceShellProps) {
  const router = useRouter();
  const qc = useQueryClient();

  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  const [brandKitOpen, setBrandKitOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [researchFlowOpen, setResearchFlowOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: (title: string) => {
      const activeWs = typeof window !== "undefined" ? localStorage.getItem("formix_active_workspace") || "ws-default" : "ws-default";
      return api.createForm(title, activeWs);
    },
    onSuccess: (form) => {
      toast.success("Form created");
      qc.setQueryData(["form", form.id], form);
      qc.invalidateQueries({ queryKey: ["forms"] });
      qc.invalidateQueries({ queryKey: ["all_forms_workspace"] });
      router.push(`/forms/${form.id}/edit`);
    },
    onError: (err: Error) => toast.error(err.message || "Couldn't create the form"),
  });

  return (
    <div className="min-h-screen bg-page text-ink flex flex-col overflow-hidden">
      {/* Top Header */}
      <WorkspaceTopNav
        onOpenIntegrations={() => setIntegrationsOpen(true)}
        onOpenBrandKit={() => setBrandKitOpen(true)}
        onOpenPlans={() => setPlansOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
        onOpenResearchFlow={() => setResearchFlowOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {showSidebar && (
          <WorkspaceSidebar
            onCreateForm={() => setCreateFormOpen(true)}
            onOpenPlans={() => setPlansOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
        )}

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto bg-page p-6 md:p-8 relative">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <PromptModal
        open={createFormOpen}
        onClose={() => setCreateFormOpen(false)}
        onSubmit={(title) => createMutation.mutate(title)}
        title="Create a new form"
        label="Form title"
        placeholder="Untitled form"
        submitLabel="Create"
      />

      <IntegrationsModal
        open={integrationsOpen}
        onClose={() => setIntegrationsOpen(false)}
      />

      <BrandKitModal
        open={brandKitOpen}
        onClose={() => setBrandKitOpen(false)}
      />

      <ViewPlansModal
        open={plansOpen}
        onClose={() => setPlansOpen(false)}
      />

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />

      <HelpCenterModal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
      />

      <ResearchFlowModal
        open={researchFlowOpen}
        onClose={() => setResearchFlowOpen(false)}
      />
    </div>
  );
}
