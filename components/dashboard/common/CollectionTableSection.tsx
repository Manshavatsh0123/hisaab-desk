
"use client";

import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

export type CollectionRow = {
  id: string;
  name: string;
  amount: string;
  staff?: string;
};

type CollectionTableSectionProps = {
  title: string;
  description: string;
  count: string;
  rows: CollectionRow[];
  type: "paid" | "due";
  onCollect?: (customerName: string) => void;
};

export function CollectionTableSection({
  title,
  description,
  count,
  rows,
  type,
  onCollect,
}: CollectionTableSectionProps) {
  const isPaid = type === "paid";

  return (
    <section className="min-w-0 border border-[var(--hs-border)] bg-[var(--hs-white)] p-[var(--hs-card-padding)] shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--hs-text)]">
            {title}
          </h2>
          <p className="mt-1 text-sm text-[var(--hs-text-muted)]">
            {description}
          </p>
        </div>

        <span className="shrink-0 text-sm text-[var(--hs-text-muted)]">
          {count}
        </span>
      </div>

      {/* Mobile layout */}
      <div className="mt-5 space-y-2 md:hidden">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between gap-3 border border-[var(--hs-border)] bg-[var(--hs-hover)] p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--hs-text)]">
                {row.name}
              </p>

              <p className="mt-1 text-xs text-[var(--hs-text-muted)]">
                {row.id}
                {row.staff ? ` · ${row.staff}` : ""}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-[var(--hs-text)]">
                {row.amount}
              </p>

              {isPaid ? (
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[var(--hs-success)]">
                  <CheckCircle2 className="size-3.5" />
                  Paid
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onCollect?.(row.name)}
                  className="mt-1 bg-[var(--hs-warning-light)] px-2 py-1 text-xs font-medium text-[var(--hs-warning)] hover:bg-[var(--hs-accent-light)]"
                >
                  Due
                </button>
              )}
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <p className="py-8 text-center text-sm text-[var(--hs-text-muted)]">
            No records found.
          </p>
        )}
      </div>

      {/* Desktop table */}
      <div className="mt-5 hidden overflow-x-auto md:block">
        <table className="w-full table-fixed text-left text-xs lg:text-sm">
          <thead className="border-b border-[var(--hs-border)] text-xs uppercase tracking-wide text-[var(--hs-text-muted)]">
            <tr>
              <th className="px-3 pb-3 font-medium">Customer</th>
              <th className="px-3 pb-3 font-medium">ID</th>
              <th className="px-3 pb-3 font-medium">Amount</th>
              <th className="px-3 pb-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--hs-border)]">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="transition-colors hover:bg-[var(--hs-primary-light)]"
              >
                <td className="truncate px-3 py-4 font-medium text-[var(--hs-text)]">
                  {row.name}
                </td>

                <td className="truncate px-3 py-4 text-[var(--hs-text-muted)]">
                  {row.id}
                </td>

                <td className="truncate px-3 py-4 font-semibold text-[var(--hs-text)]">
                  {row.amount}
                </td>

                <td className="px-3 py-4">
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1 bg-[var(--hs-success-light)] px-2 py-1 text-xs font-medium text-[var(--hs-success)]">
                      <CheckCircle2 className="size-3.5" />
                      Paid
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onCollect?.(row.name)}
                      className="bg-[var(--hs-warning-light)] px-2 py-1 text-xs font-medium text-[var(--hs-warning)] hover:bg-[var(--hs-accent-light)]"
                    >
                      Due
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-8 text-center text-sm text-[var(--hs-text-muted)]"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}