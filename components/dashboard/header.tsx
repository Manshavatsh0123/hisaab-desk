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

export function Header({
  activeSection,
  onMenuClick,
}: HeaderProps) {
  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        min-h-[76px]
        items-center
        justify-between
        gap-3

        border-b
        border-[var(--hs-border)]

        bg-[var(--hs-white)]

        px-4
        sm:px-6
        md:px-8

        backdrop-blur-sm
      "
    >
      {/* =========================================
          LEFT SIDE
          ========================================= */}

      <div className="flex min-w-0 items-center gap-3 md:gap-6">

        {/* Mobile Menu */}
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="
            flex
            size-9
            shrink-0
            items-center
            justify-center

            rounded-lg

            border
            border-[var(--hs-border)]

            text-[var(--hs-text-secondary)]

            transition-all
            duration-200

            hover:bg-[var(--hs-primary-light)]
            hover:text-[var(--hs-primary)]
            hover:border-[var(--hs-primary-border)]

            lg:hidden
          "
        >
          <Menu className="size-5" />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-3">

          {/* Logo */}
          <div
            className="
              hidden
              size-10
              items-center
              justify-center

              rounded-xl

              bg-[var(--hs-primary-light)]

              border
              border-[var(--hs-primary-border)]

              sm:flex
            "
          >
            <img
              src="/Logo.png"
              alt="HisaabSaathi Logo"
              className="size-9 object-contain"
            />
          </div>

          {/* Brand Text */}
          <div className="min-w-0">

            <h1
              className="
                truncate
                text-lg
                font-bold
                tracking-tight

                text-[var(--hs-text)]

                sm:text-xl
              "
            >
              Hisaab
              <span className="text-[var(--hs-primary)]">
                Saathi
              </span>
            </h1>

            <p
              className="
                hidden
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.20em]

                text-[var(--hs-text-muted)]

                sm:block
              "
            >
              Post Office Collection
            </p>

          </div>
        </div>
      </div>

      {/* =========================================
          RIGHT SIDE
          ========================================= */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-2
          sm:gap-3
        "
      >

        {/* =====================================
            Notifications
            ===================================== */}

        <button
          type="button"
          aria-label="Notifications"
          className="
            relative

            flex
            size-10
            items-center
            justify-center

            rounded-lg

            border
            border-transparent

            text-[var(--hs-text-secondary)]

            transition-all
            duration-200

            hover:bg-[var(--hs-primary-light)]
            hover:text-[var(--hs-primary)]

            hover:border-[var(--hs-primary-border)]
          "
        >
          <Bell
            className="size-[19px]"
            strokeWidth={2}
          />

          {/* Notification Dot */}
          <span
            className="
              absolute
              right-[8px]
              top-[7px]

              size-2

              rounded-full

              bg-[var(--hs-primary)]

              ring-2
              ring-[var(--hs-white)]
            "
          />
        </button>

        {/* =====================================
            Divider
            ===================================== */}

        <div
          className="
            hidden
            h-7
            w-px

            bg-[var(--hs-border)]

            sm:block
          "
        />

        {/* =====================================
            User Avatar
            ===================================== */}

        <button
          type="button"
          aria-label="User profile"
          className="
            flex
            size-10
            items-center
            justify-center

            rounded-xl

            border
            border-[var(--hs-primary-border)]

            bg-[var(--hs-primary-light)]

            transition-all
            duration-200

            hover:border-[var(--hs-primary)]
            hover:bg-[var(--hs-primary)]

            group
          "
        >
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center

              rounded-xl

              text-xs
              font-bold

              text-[var(--hs-primary)]

              transition-colors
              duration-200

              group-hover:text-[var(--hs-white)]
            "
          >
            JD
          </div>
        </button>

      </div>
    </header>
  );
}