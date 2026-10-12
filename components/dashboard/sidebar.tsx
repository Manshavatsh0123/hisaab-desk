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
} from "lucide-react";

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems: {
  id: Section;
  label: string;
  icon: React.ElementType;
}[] = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "pipeline",
      label: "Add Customer",
      icon: PlusCircle,
    },
    {
      id: "deals",
      label: "Customers",
      icon: ContactRound,
    },
    {
      id: "team",
      label: "Field Agents",
      icon: Users,
    },
    {
      id: "approvals",
      label: "Approvals",
      icon: Bell,
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
    },
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
      className={cn("fixed left-0 top-0 z-50 h-screen", "bg-[var(--hs-white)]", "border-r border-[var(--hs-border)]", "flex flex-col", "shadow-[4px_0_20px_rgba(38,54,77,0.04)]", "transition-all duration-300 ease-out", "w-[260px]",

        mobileOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0 max-lg:pointer-events-none",

        collapsed && "lg:w-[78px]"
      )}
    >

      <div className="relative h-[82px] flex items-center px-4 border-b border-[var(--hs-border-light)]">

        <div className=" absolute top-0 left-0 right-0 h-[3px] bg-[var(--hs-accent)]" />

        <div
          className={cn(
            "flex items-center",
            collapsed ? "justify-center w-full" : "gap-3"
          )}
        >
          {/* Logo */}
          <div
            className="h-11  w-11  shrink-0  flex  items-center  justify-center  rounded-xl  bg-[var(--hs-primary-light)]  border  border-[var(--hs-primary-border)]">
            <CircleDollarSign
              className=" h-[23px] w-[23px] text-[var(--hs-primary)]"
              strokeWidth={2.2}
            />
          </div>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              collapsed
                ? "w-0 opacity-0"
                : "w-auto opacity-100"
            )}
          >
            <div className=" whitespace-nowrap text-[17px] font-bold tracking-tight text-[var(--hs-text)] ">
              Hisaab
              <span className="text-[var(--hs-primary)]">
                Saathi
              </span>
            </div>

            <div
              className=" mt-0.5 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--hs-text-muted)] ">
              Post Office Collection
            </div>
          </div>
        </div>
      </div>


      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 mb-3">
            <span
              className=" text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--hs-text-muted)]
              "
            >
              Main Menu
            </span>
          </div>
        )}

        <div className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  onMobileClose();
                }}
                className={cn("group", "relative", "w-full", "flex", "items-center", "rounded-lg", "transition-all duration-200",

                  collapsed
                    ? "justify-center px-3 py-3"
                    : "gap-3 px-3.5 py-3",

                  /* ACTIVE */
                  isActive
                    ? ["bg-[var(--hs-primary)]", "text-[var(--hs-white)]", "shadow-[0_5px_14px_rgba(201,37,45,0.16)]",
                    ]
                    : ["text-[var(--hs-text-secondary)]", "hover:bg-[var(--hs-primary-light)]", "hover:text-[var(--hs-primary)]",
                    ]
                )}
              >
                {/* Icon */}
                <Icon
                  className={cn("h-[20px] w-[20px] shrink-0", "transition-transform duration-200",

                    isActive
                      ? "text-[var(--hs-white)]"
                      : "text-[var(--hs-text-secondary)] group-hover:text-[var(--hs-primary)]",

                    !isActive &&
                    "group-hover:scale-105"
                  )}
                  strokeWidth={isActive ? 2.3 : 2}
                />

                {/* Label */}
                <span
                  className={cn("text-[13px]", "font-semibold", "whitespace-nowrap", "transition-all duration-300",

                    collapsed
                      ? "w-0 opacity-0 overflow-hidden"
                      : "w-auto opacity-100"
                  )}
                >
                  {item.label}
                </span>

                {/* Approval Badge */}
                {item.id === "approvals" &&
                  !collapsed && (
                    <span
                      className={cn("ml-auto", "flex", "h-5", "min-w-5", "items-center", "justify-center", "rounded-full", "px-1.5", "text-[10px]", "font-bold",

                        isActive
                          ? "bg-[var(--hs-white)] text-[var(--hs-primary)]"
                          : "bg-[var(--hs-primary-light)] text-[var(--hs-primary)]"
                      )}
                    >
                      12
                    </span>
                  )}
              </button>
            );
          })}
        </div>
      </nav>


      <div className="px-3 pb-2">
        {!collapsed && (
          <div
            className="rounded-xl border border-[var(--hs-border)] bg-[var(--hs-background)] p-3">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full bg-[var(--hs-success)]" />

              <span
                className=" text-[11px] font-semibold text-[var(--hs-text)]">
                System Online
              </span>
            </div>

            <p
              className=" mt-1 text-[10px] text-[var(--hs-text-muted)] ">
              Collection services are running
            </p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-[var(--hs-border-light)]">
        <button
          onClick={() =>
            onCollapsedChange(!collapsed)
          }
          className="group w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-[var(--hs-text-secondary)] hover:bg-[var(--hs-background)] hover:text-[var(--hs-primary)] transition-all duration-200">
          {collapsed ? (
            <ChevronRight className="h-[18px] w-[18px]" />
          ) : (
            <>
              <ChevronLeft className="h-[18px] w-[18px]" />
              <span>Collapse sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}