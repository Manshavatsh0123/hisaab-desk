
"use client";

import { CreditCard } from "lucide-react";
import type { RecentCollection } from "@/features/dashboard/dashboardApi";
import DashboardDataTable, {
  type DashboardColumn,
} from "./DashboardDataTable";

const formatMoney = (amount: number | null | undefined) =>
  `₹${Number(amount ?? 0).toLocaleString("en-IN")}`;

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

function StatusBadge({ status }: { status: string }) {
  const normalized = (status || "UNKNOWN").toUpperCase();

  const styles: Record<string, string> = {
    APPROVED:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    PENDING:
      "border-amber-200 bg-amber-50 text-amber-700",
    REJECTED:
      "border-red-200 bg-red-50 text-red-700",
    REVERSED:
      "border-slate-200 bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-md border px-2 py-1 text-[11px] font-semibold ${
        styles[normalized] ??
        "border-gray-200 bg-gray-50 text-gray-700"
      }`}
    >
      {normalized}
    </span>
  );
}

const columns: DashboardColumn<RecentCollection>[] = [
  {
    key: "customer",
    header: "Customer",
    className: "w-[29%]",
    render: (item) => (
      <div className="min-w-0">
        <p className="truncate font-semibold text-[var(--hs-text)]">
          {item.customer?.name || "Unknown customer"}
        </p>
        <p className="mt-1 truncate text-xs text-[var(--hs-text-muted)]">
          {item.customer?.customer_code || "Customer"}
        </p>
      </div>
    ),
  },
  {
    key: "account",
    header: "Account",
    className: "w-[19%]",
    render: (item) => (
      <div className="min-w-0">
        <p className="truncate font-medium text-[var(--hs-text)]">
          {item.account?.account_number || "—"}
        </p>
        <p className="mt-1 truncate text-xs text-[var(--hs-text-secondary)]">
          {item.account?.scheme || "Scheme unavailable"}
        </p>
      </div>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    headerClassName: "text-right",
    className: "w-[17%] text-right",
    render: (item) => (
      <span className="whitespace-nowrap font-bold tabular-nums text-[var(--hs-text)]">
        {formatMoney(item.amount)}
      </span>
    ),
  },
  {
    key: "date",
    header: "Payment date",
    className: "w-[19%] text-xs font-medium text-[var(--hs-text-secondary)]",
    render: (item) => formatDate(item.payment_date),
  },
  {
    key: "status",
    header: "Status",
    className: "w-[16%]",
    render: (item) => <StatusBadge status={item.status} />,
  },
];

export default function CollectionTable({
  rows,
}: {
  rows: RecentCollection[];
}) {
  return (
    <DashboardDataTable
      rows={rows}
      columns={columns}
      getRowKey={(item) => item.id}
      emptyIcon={CreditCard}
      emptyTitle="No collections to show"
      emptyDescription="Try changing the status filter or refresh the dashboard."
      minWidth="680px"
    />
  );
}