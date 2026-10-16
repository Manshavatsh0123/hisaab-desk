
"use client";

import { Bell } from "lucide-react";
import type { RecentNotification } from "@/features/dashboard/dashboardApi";
import DashboardDataTable, {
  type DashboardColumn,
} from "./DashboardDataTable";

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function ReadBadge({ isRead }: { isRead: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-[11px] font-semibold ${
        isRead
          ? "border-[var(--hs-border)] bg-[var(--hs-background)] text-[var(--hs-text-secondary)]"
          : "border-[var(--hs-primary-border)] bg-[var(--hs-primary-light)] text-[var(--hs-primary)]"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isRead ? "bg-[var(--hs-text-muted)]" : "bg-[var(--hs-primary)]"
        }`}
      />
      {isRead ? "Read" : "New"}
    </span>
  );
}

const columns: DashboardColumn<RecentNotification>[] = [
  {
    key: "activity",
    header: "Activity",
    className: "w-[30%]",
    render: (item) => (
      <div className="flex min-w-0 items-start gap-2.5">
        <span
          className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${
            item.is_read
              ? "bg-[var(--hs-background)] text-[var(--hs-text-secondary)]"
              : "bg-[var(--hs-primary-light)] text-[var(--hs-primary)]"
          }`}
        >
          <Bell className="size-4" strokeWidth={1.8} />
        </span>

        <p className="min-w-0 break-words font-semibold leading-5 text-[var(--hs-text)]">
          {item.title || "Notification"}
        </p>
      </div>
    ),
  },
  {
    key: "message",
    header: "Details",
    className: "w-[38%]",
    render: (item) => (
      <p className="line-clamp-2 whitespace-normal text-xs leading-5 text-[var(--hs-text-secondary)]">
        {item.message || "No additional details"}
      </p>
    ),
  },
  {
    key: "date",
    header: "Date & time",
    className: "w-[22%] text-xs leading-5 text-[var(--hs-text-secondary)]",
    render: (item) => (
      <time dateTime={item.created_at || undefined}>
        {formatDateTime(item.created_at)}
      </time>
    ),
  },
  {
    key: "status",
    header: "Status",
    className: "w-[10%]",
    render: (item) => <ReadBadge isRead={item.is_read} />,
  },
];

export default function NotificationsTable({
  rows,
}: {
  rows: RecentNotification[];
}) {
  return (
    <DashboardDataTable
      rows={rows}
      columns={columns}
      getRowKey={(item) => item.id}
      emptyIcon={Bell}
      emptyTitle="You're all caught up"
      emptyDescription="New collection and account activity will appear here."
      minWidth="720px"
    />
  );
}