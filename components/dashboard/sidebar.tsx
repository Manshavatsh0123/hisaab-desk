"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { Section } from "@/app/page";
import {
  LayoutDashboard,
  PlusCircle,
  ContactRound,
  Users,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Settings,
} from "lucide-react";

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "pipeline", label: "Add Customer", icon: PlusCircle },
  { id: "deals", label: "Customers", icon: ContactRound },
  { id: "team", label: "Field Agents", icon: Users },
  { id: "approvals", label: "Approvals", icon: Bell },
  { id: "reports", label: "Reports", icon: BarChart3 },
  // { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onCollapsedChange,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-screen w-[260px] border-r border-[#285444] bg-[#123c30] transition-all duration-300 ease-out flex flex-col lg:z-40",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 max-lg:pointer-events-none",
        collapsed ? "lg:w-[72px]" : "lg:w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="h-[76px] flex items-center px-4 border-b border-[#285444]">
        <div className="flex items-center gap-3 min-w-0">

          {/* Brand Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c4f36b] shadow-sm">
            <CircleDollarSign className="h-5.5 w-5.5 text-[#123c30]" />
          </div>

          {/* Brand Text */}
          <div
            className={cn(
              "min-w-0 overflow-hidden transition-all duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            <div className="whitespace-nowrap text-[16px] font-bold tracking-tight text-sidebar-foreground">
              Hisaab Desk
            </div>

            <div className="mt-0.5 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.18em] text-[#9ab8aa]">
              Collection Management
            </div>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => { onSectionChange(item.id); onMobileClose(); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-[#c4f36b] text-[#123c30]"
                  : "text-[#d2e3d8] hover:text-white hover:bg-[#1c4d3c]"
              )}
            >
              {/* Active indicator */}
              <span
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#c4f36b] transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-transform duration-200",
                  isActive ? "text-[#123c30]" : "text-[#c4f36b] group-hover:scale-110"
                )}
              />
              <span
                className={cn(
                  "whitespace-nowrap transition-all duration-300",
                  collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
