"use client";

import type { Section } from "@/app/page";
import { Bell, Menu } from "lucide-react";

interface HeaderProps {
  activeSection: Section;
  onMenuClick?: () => void;
}

const sectionTitles: Record<Section, string> = {
  overview: "Overview",
  pipeline: "Add Customer",
  deals: "Customers",
  approvals: "Approvals",
  team: "Field Agents",
  reports: "Reports",
  settings: "Settings",
};

export function Header({ activeSection, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-3 border-b border-[#d8e2db] bg-[#f7faf7] px-4 backdrop-blur-sm sm:px-6 md:px-8">
      <div className="flex min-w-0 items-center gap-3 md:gap-6">
        <button type="button" aria-label="Open navigation" onClick={onMenuClick} className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary lg:hidden"><Menu className="size-5" /></button>
        <div className="flex items-center gap-3">
          <div className="hidden size-10 items-center justify-center sm:flex">
            <img
              src="/Logo.png"
              alt="HisaabSaathi Logo"
              className="size-10 object-contain"
            />
          </div>

          <div>
            <h1 className="truncate text-lg font-bold tracking-tight text-[#173b30] sm:text-xl">
              HisaabSaathi
            </h1>
            <p className="hidden text-[9px] font-medium uppercase tracking-[0.22em] text-[#6b8176] sm:block">
              Post office collection
            </p>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
        </button>

        {/* User avatar */}
        <button className="w-9 h-9 rounded-lg overflow-hidden bg-secondary ring-2 ring-transparent hover:ring-accent/50 transition-all duration-200">
          <div className="flex h-full w-full items-center justify-center bg-[#e8f2ed] text-xs font-semibold text-[#173b30]">
            JD
          </div>
        </button>
      </div>
    </header>
  );
}
