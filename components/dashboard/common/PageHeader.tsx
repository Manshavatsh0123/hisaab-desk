
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
    <header className="flex flex-col gap-3 border-b border-[var(--hs-border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--hs-text-muted)]">
            {eyebrow}
          </p>
        )}

        <h1 className="text-2xl font-bold tracking-tight text-[var(--hs-text)] sm:text-3xl">
          {title}{" "}
          {highlight && (
            <span className="text-[var(--hs-primary)]">
              {highlight}
            </span>
          )}
        </h1>

        {subtitle && (
          <p className="mt-1 text-sm text-[var(--hs-text-secondary)]">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-[var(--hs-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--hs-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)] focus-visible:ring-offset-2"
        >
          {action.icon}
          {action.label}
        </button>
      )}
    </header>
  );
}
