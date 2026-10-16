
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
    label: "text-white/85",
    value: "text-white",
    helper: "text-white/75",
    icon: "bg-white/15 text-white",
    accent: "bg-white/30",
  },
  success: {
    card: "border-[var(--hs-border)] bg-[var(--hs-white)]",
    label: "text-[var(--hs-text-secondary)]",
    value: "text-[var(--hs-success)]",
    helper: "text-[var(--hs-text-muted)]",
    icon: "bg-[var(--hs-success-light)] text-[var(--hs-success)]",
    accent: "bg-[var(--hs-success)]",
  },
  warning: {
    card: "border-[var(--hs-border)] bg-[var(--hs-white)]",
    label: "text-[var(--hs-text-secondary)]",
    value: "text-[var(--hs-text)]",
    helper: "text-[var(--hs-text-muted)]",
    icon: "bg-[var(--hs-warning-light)] text-[var(--hs-warning)]",
    accent: "bg-[var(--hs-warning)]",
  },
  neutral: {
    card: "border-[var(--hs-border)] bg-[var(--hs-white)]",
    label: "text-[var(--hs-text-secondary)]",
    value: "text-[var(--hs-text)]",
    helper: "text-[var(--hs-text-muted)]",
    icon: "bg-[var(--hs-background)] text-[var(--hs-text-secondary)]",
    accent: "bg-[var(--hs-border)]",
  },
};

const columnStyles = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
};

export function StatsCards({
  items,
  columns = 4,
}: StatsCardsProps) {
  return (
    <div
      className={`
        mt-5 grid items-stretch gap-3
        sm:mt-6 sm:gap-4
        lg:gap-5
        ${columnStyles[columns]}
      `}
    >
      {items.map((item) => {
        const style = toneStyles[item.tone ?? "neutral"];
        const Icon = item.icon;

        return (
          <article
            key={item.label}
            className={` group relative flex h-full min-h-[132px] min-w-0 items-center justify-between gap-3 overflow-hidden rounded-xl border p-4 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:shadow-md sm:min-h-[148px] sm:rounded-2xl sm:p-5 lg:p-5 xl:p-6 ${style.card}
            `}
          >
            <div className="min-w-0 flex-1 self-stretch">
              <p
                className={` line-clamp-2 text-xs font-medium leading-5 sm:text-sm ${style.label} `}>
                {item.label}
              </p>

              <p
                className={` mt-3 break-words text-2xl font-bold leading-tight tracking-tight tabular-nums sm:mt-3 sm:text-3xl lg:text-[30px] ${style.value}
                `}>
                {item.value}
              </p>

              {item.helper && (
                <p
                  className={`
                    mt-2 line-clamp-2 text-xs leading-5
                    ${style.helper}
                  `}
                >
                  {item.helper}
                </p>
              )}
            </div>

            {Icon && (
              <div
                className={` grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-105 sm:size-11 lg:size-12 ${style.icon}`}>
                <Icon
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={2}
                />
              </div>
            )}

            {/* Subtle hover accent */}
            <div
              aria-hidden="true"
              className={`absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100 ${style.accent}`}
            />
          </article>
        );
      })}
    </div>
  );
}