
"use client";

import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  highlight?: string;
  subtitle?: string;
  eyebrow?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
};

export function PageHeader({
  title,
  highlight,
  subtitle,
  eyebrow,
  action,
}: PageHeaderProps) {
  return (
    <header className="mb-6 border-b border-[var(--hs-border)] pb-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Page Title */}
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-1.5 text-xs font-medium tracking-wide text-[var(--hs-text-muted)]">
              {eyebrow}
            </p>
          )}

          <h1 className="text-2xl font-bold tracking-tight text-[var(--hs-text)] sm:text-3xl">
            {title}
            {highlight && (
              <>
                {" "}
                <span className="text-[var(--hs-primary)]">
                  {highlight}
                </span>
              </>
            )}
          </h1>

          {subtitle && (
            <p className="mt-1.5 text-sm leading-5 text-[var(--hs-text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>


        {action && (
          <button
            type="button"
            onClick={action.onClick}
            style={{ borderRadius: "8px" }}
            className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-sm bg-[var(--hs-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--hs-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)] focus-visible:ring-offset-2 active:scale-[0.98] sm:w-auto"
          >
            {action.icon && (
              <span className="flex items-center justify-center">
                {action.icon}
              </span>
            )}

            <span>{action.label}</span>
          </button>
        )}
      </div>
    </header>
  );
}