"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/lib/theme";
import { ProfileDropdown } from "./ProfileDropdown";

interface WorkspaceTopNavProps {
  onOpenIntegrations: () => void;
  onOpenBrandKit: () => void;
  onOpenPlans: () => void;
  onOpenHelp: () => void;
  onOpenResearchFlow: () => void;
}

export function WorkspaceTopNav({
  onOpenIntegrations,
  onOpenBrandKit,
  onOpenPlans,
  onOpenHelp,
  onOpenResearchFlow,
}: WorkspaceTopNavProps) {
  const pathname = usePathname();
  const { theme, toggle, mounted } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  const tabs = [
    { label: "Forms", href: "/dashboard", icon: "description" },
    { label: "Contacts", href: "/contacts", icon: "group" },
    { label: "Automations", href: "/automations", icon: "account_tree" },
  ];

  return (
    <header className="bg-card text-ink border-b border-border z-30 sticky top-0 w-full">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 h-14 w-full">
        {/* Workspace Dropdown */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 text-ink hover:opacity-90">
            <div className="w-7 h-7 rounded-lg bg-[#261c23] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              D
            </div>
            <div className="flex items-center gap-1 font-bold text-sm tracking-tight text-ink">
              dharun.s23
              <span className="material-symbols-outlined text-xs text-ink-soft">expand_more</span>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-5 mr-2">
            <button
              onClick={onOpenIntegrations}
              className="text-xs font-semibold text-ink-soft hover:text-ink transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
              Integrations
            </button>
            <button
              onClick={onOpenBrandKit}
              className="text-xs font-semibold text-ink-soft hover:text-ink transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">palette</span>
              Brand kit
            </button>
          </div>

          <ThemeToggle theme={theme} onToggle={toggle} mounted={mounted} />

          <button
            onClick={onOpenPlans}
            className="bg-[#006644] hover:bg-[#005237] text-white rounded-full px-4 py-1.5 text-xs font-bold transition-opacity cursor-pointer shadow-sm"
          >
            View plans
          </button>

          <button
            onClick={onOpenHelp}
            className="text-ink-soft hover:text-ink transition-colors p-1 rounded-lg hover:bg-surface cursor-pointer"
            title="Help center"
            aria-label="Help"
          >
            <span className="material-symbols-outlined text-lg">help</span>
          </button>

          {/* User Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-[#e7dff1] dark:bg-[#382d35] text-[#261c23] dark:text-[#f0dee7] flex items-center justify-center font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity border border-border"
              aria-label="User Profile"
            >
              DS
            </button>
            <ProfileDropdown open={profileOpen} onClose={() => setProfileOpen(false)} />
          </div>
        </div>
      </div>

      {/* Secondary Navigation Tabs */}
      <div className="flex px-6 items-center gap-6 h-11 border-t border-border/50 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href === "/dashboard" && pathname.startsWith("/forms"));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`h-full flex items-center gap-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                isActive
                  ? "text-ink border-b-2 border-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}

        <button
          onClick={onOpenResearchFlow}
          className="h-full flex items-center gap-1.5 text-xs font-bold text-ink-soft hover:text-ink transition-colors border-l border-border/60 pl-6 cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-base">account_tree</span>
          Research Flow
          <span className="text-[10px] bg-surface text-ink border border-border rounded px-1.5 py-0.2 font-bold ml-1">
            Demo
          </span>
        </button>
      </div>
    </header>
  );
}
