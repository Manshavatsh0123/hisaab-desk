
"use client";

import type { LucideIcon } from "lucide-react";

export type StatItem = {
  label: string;
  value: string | number;
  helper?: string;
  icon?: LucideIcon;
  tone?: "primary" | "success" | "warning" | "neutral";
};

type StatsCardsProps = {
  items: StatItem[];
  columns?: 2 | 3 | 4;
};

const toneStyles = {
  primary: {
    card: "border-[var(--hs-primary)] bg-[var(--hs-primary)]",
    label: "text-white",
    value: "text-white",
    helper: "text-white/85",
    icon: "bg-white/15 text-white",
  },
  success: {
    card: "border-[var(--hs-success)]/20 bg-[var(--hs-success-light)]",
    label: "text-[var(--hs-success)]",
    value: "text-[var(--hs-success)]",
    helper: "text-[var(--hs-text-secondary)]",
    icon: "bg-white text-[var(--hs-success)]",
  },
  warning: {
    card: "border-[var(--hs-primary-border)] bg-[var(--hs-warning-light)]",
    label: "text-[var(--hs-text-secondary)]",
    value: "text-[var(--hs-text)]",
    helper: "text-[var(--hs-text-secondary)]",
    icon: "bg-white text-[var(--hs-warning)]",
  },
  neutral: {
    card: "border-[var(--hs-border)] bg-[var(--hs-white)]",
    label: "text-[var(--hs-text-secondary)]",
    value: "text-[var(--hs-text)]",
    helper: "text-[var(--hs-text-muted)]",
    icon: "bg-[var(--hs-background)] text-[var(--hs-text-secondary)]",
  },
};

const columnStyles = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 xl:grid-cols-3",
  4: "sm:grid-cols-2 xl:grid-cols-4",
};

export function StatsCards({
  items,
  columns = 4,
}: StatsCardsProps) {
  return (
    <div
      className={`
        mt-[var(--hs-section-gap)]
        grid grid-cols-1 gap-[var(--hs-card-gap)]
        ${columnStyles[columns]}
      `}
    >
      {items.map((item) => {
        const style = toneStyles[item.tone ?? "neutral"];
        const Icon = item.icon;

        return (
          <article
            key={item.label}
            className={`
              flex min-w-0 items-center justify-between gap-4
              rounded-none border p-5 sm:p-6
              shadow-sm transition-shadow duration-200
              hover:shadow-md
              ${style.card}
            `}
          >
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-medium ${style.label}`}>
                {item.label}
              </p>

              <p
                className={`
                  mt-2 break-words text-2xl font-bold
                  leading-tight tracking-tight
                  ${style.value}
                `}
              >
                {item.value}
              </p>

              {item.helper && (
                <p className={`mt-2 text-xs leading-5 ${style.helper}`}>
                  {item.helper}
                </p>
              )}
            </div>

            {Icon && (
              <div
                className={`
                  grid size-11 shrink-0 place-items-center
                  rounded-none
                  ${style.icon}
                `}
              >
                <Icon
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={1.9}
                />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}