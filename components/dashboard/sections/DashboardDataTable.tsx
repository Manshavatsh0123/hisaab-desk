
"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export type DashboardColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
};

type DashboardDataTableProps<T> = {
  rows: T[];
  columns: DashboardColumn<T>[];
  getRowKey: (row: T) => string;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  minWidth?: string;
};

export default function DashboardDataTable<T>({
  rows,
  columns,
  getRowKey,
  emptyIcon: EmptyIcon = Inbox,
  emptyTitle = "No records found",
  emptyDescription = "Records will appear here when available.",
  minWidth = "680px",
}: DashboardDataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--hs-border)] bg-[var(--hs-background)] px-4 py-10 text-center">
        <span className="grid size-12 place-items-center rounded-xl border border-[var(--hs-border-light)] bg-[var(--hs-white)] text-[var(--hs-text-secondary)]">
          <EmptyIcon className="size-5" strokeWidth={1.8} />
        </span>

        <p className="mt-3 text-sm font-semibold text-[var(--hs-text)]">
          {emptyTitle}
        </p>

        <p className="mt-1 max-w-xs text-xs leading-5 text-[var(--hs-text-secondary)]">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
   
<div className="mt-4 w-full overflow-hidden rounded-xl border border-[var(--hs-border)] bg-[var(--hs-white)]">
  <table className="w-full table-fixed text-left text-sm">
    <thead>
      <tr className="border-b border-[var(--hs-border)] bg-[var(--hs-background)]">
        {columns.map((column) => (
          <th
            key={column.key}
            scope="col"
            className={`break-words px-2 py-3 text-[10px] font-bold uppercase tracking-wide text-[var(--hs-text-secondary)] sm:px-3 ${
              column.headerClassName ?? ""
            }`}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>

    <tbody className="divide-y divide-[var(--hs-border-light)]">
      {rows.map((row) => (
        <tr
          key={getRowKey(row)}
          className="transition-colors duration-150 hover:bg-[var(--hs-hover)]"
        >
          {columns.map((column) => (
            <td
              key={column.key}
              className={`overflow-hidden px-2 py-3 align-middle sm:px-3 ${
                column.className ?? ""
              }`}
            >
              {column.render(row)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>
  );
}