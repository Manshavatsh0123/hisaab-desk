"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Bell, CalendarDays, CheckCircle2, Clock3, CreditCard, RefreshCw, Wallet, } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { PageHeader } from "../common/PageHeader";
import { StatItem, StatsCards } from "../common/StatsCards";
import { useGetDashboardSummaryQuery, useGetRecentCollectionsQuery, useGetRecentNotificationsQuery, } from "@/features/dashboard/dashboardApi";
import NotificationsTable from "./NotificationsTable";
import CollectionTable from "./CollectionTable";
import SectionHeader from "./SectionHeader";
import getErrorMessage from "./getErrorMessage";

const formatMoney = (amount: number | null | undefined) => `₹${Number(amount ?? 0).toLocaleString("en-IN")}`;

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

const PAGE_SIZE = 10;
function Pagination({
  page,
  totalItems,
  onPageChange,
}: {
  page: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const start = totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, totalItems);

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-[var(--hs-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-[var(--hs-text-secondary)]">
        Showing <span className="font-semibold text-[var(--hs-text)]">{start}–{end}</span> of{" "}
        <span className="font-semibold text-[var(--hs-text)]">{totalItems}</span> records
      </p>
      {totalItems > PAGE_SIZE && (
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="inline-flex h-9 items-center rounded-lg border border-[var(--hs-border)] bg-[var(--hs-white)] px-3 text-xs font-semibold text-[var(--hs-text)] transition hover:border-[var(--hs-primary)] hover:bg-[var(--hs-background)] disabled:cursor-not-allowed disabled:opacity-40"
          >Previous</button>
          <span className="min-w-20 rounded-lg bg-[var(--hs-background)] px-3 py-2 text-center text-xs font-semibold text-[var(--hs-text)]">{page} / {totalPages}</span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="inline-flex h-9 items-center rounded-lg border border-[var(--hs-border)] bg-[var(--hs-white)] px-3 text-xs font-semibold text-[var(--hs-text)] transition hover:border-[var(--hs-primary)] hover:bg-[var(--hs-background)] disabled:cursor-not-allowed disabled:opacity-40"
          >Next</button>
        </div>
      )}
    </div>
  );
}

export function OverviewSection({
  onNavigateToApprovals,
  onNavigateToAddCustomer,
}: {
  onNavigateToApprovals: () => void;
  onNavigateToAddCustomer: () => void;
}) {

  const [collectionStatus, setCollectionStatus] = useState("ALL");
  const [collectionPage, setCollectionPage] = useState(1);
  const [notificationPage, setNotificationPage] = useState(1);

  const summaryQuery = useGetDashboardSummaryQuery();
  const collectionsQuery = useGetRecentCollectionsQuery();
  const notificationsQuery = useGetRecentNotificationsQuery();

  const summary = summaryQuery.data?.summary;
  const allCollections = collectionsQuery.data?.collections ?? [];
  const notifications = notificationsQuery.data?.notifications ?? [];

  const collections = useMemo(
    () => collectionStatus === "ALL"
      ? allCollections
      : allCollections.filter((item) => item.status.toUpperCase() === collectionStatus),
    [allCollections, collectionStatus],
  );

  const collectionTotalPages = Math.max(1, Math.ceil(collections.length / PAGE_SIZE));
  const notificationTotalPages = Math.max(1, Math.ceil(notifications.length / PAGE_SIZE));
  const safeCollectionPage = Math.min(collectionPage, collectionTotalPages);
  const safeNotificationPage = Math.min(notificationPage, notificationTotalPages);

  const visibleCollections = useMemo(
    () => collections.slice((safeCollectionPage - 1) * PAGE_SIZE, safeCollectionPage * PAGE_SIZE),
    [collections, safeCollectionPage],
  );
  const visibleNotifications = useMemo(
    () => notifications.slice((safeNotificationPage - 1) * PAGE_SIZE, safeNotificationPage * PAGE_SIZE),
    [notifications, safeNotificationPage],
  );

  const summaryCards: StatItem[] = [
    {
      label: "Today's collection",
      value: formatMoney(summary?.today.collection_amount),
      helper: summary?.today.date ? `As of ${formatDate(summary.today.date)}` : "Today's total",
      icon: Wallet,
      tone: "primary",
    },

    {
      label: "Approved collection",
      value: formatMoney(summary?.collections.approved_amount),
      helper: "Approved payments",
      icon: CheckCircle2,
      tone: "success",
    },

    {
      label: "Pending approval",
      value: formatMoney(summary?.collections.pending_amount),
      helper: "Requires admin review",
      icon: Clock3,
      tone: "warning",
    },

    {
      label: "Total accounts",
      value: summary?.total_accounts ?? "—",
      helper: "Customer accounts",
      icon: CreditCard,
      tone: "neutral",
    },

  ];

  const errors = [
    summaryQuery.error ? `Summary: ${getErrorMessage(summaryQuery.error)}` : "",
    collectionsQuery.error ? `Collections: ${getErrorMessage(collectionsQuery.error)}` : "",
    notificationsQuery.error ? `Notifications: ${getErrorMessage(notificationsQuery.error)}` : "",
  ].filter(Boolean);

  const isLoading = summaryQuery.isLoading || collectionsQuery.isLoading || notificationsQuery.isLoading;

  return (
    <div className="bg-[var(--hs-white)] text-[var(--hs-text)]">
      <div className="px-[var(--hs-page-padding-x)] py-[var(--hs-page-padding-y)]">

        <PageHeader
          eyebrow="Your collection workspace"
          title="One clear view."
          highlight="Every payment."
          subtitle="Track collections, review approvals, and monitor your customers and staff from live dashboard data."
          action={{
            label: "Add customer",
            onClick: onNavigateToAddCustomer,
          }}
        />

        {isLoading && !summary && allCollections.length === 0 && notifications.length === 0 ? (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[var(--hs-border)] p-10 text-sm text-[var(--hs-text-secondary)]">
            <RefreshCw className="size-4 animate-spin" /> Loading dashboard data...
          </div>
        ) : (
          <>
            <StatsCards items={summaryCards} columns={4} />

            <section className="mt-[var(--hs-section-gap)] grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className="min-w-0 border border-[var(--hs-border)] bg-[var(--hs-white)] p-4 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] sm:p-5">

                <SectionHeader
                  title="Recent collections"
                  description="Latest customer payment records"
                  count={`${allCollections.length} records`}
                />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[var(--hs-background)]/70 p-3">
                  <label htmlFor="collection-status" className="text-xs font-medium text-[var(--hs-text-secondary)]">Filter by status</label>
                  <Select
                    value={collectionStatus}
                    onValueChange={(value) => {
                      setCollectionStatus(value);
                      setCollectionPage(1);
                    }}
                  >
                    <SelectTrigger
                      id="collection-status"
                      className=" h-10 w-full rounded-lg border border-[var(--hs-border)] bg-[var(--hs-white)] px-3 text-sm font-medium text-[var(--hs-text)] shadow-sm transition-colors hover:border-[var(--hs-primary-border)] focus:ring-2 focus:ring-[var(--hs-primary)]/15 focus:ring-offset-0 sm:w-[180px]">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>

                    <SelectContent position="popper" align="end" className="min-w-[180px] rounded-xl border border-[var(--hs-border)] bg-[var(--hs-white)] p-1.5 shadow-lg">
                      <SelectItem value="ALL" className="cursor-pointer rounded-md py-2 text-sm">
                        All statuses
                      </SelectItem>

                      <SelectItem
                        value="APPROVED"
                        className="cursor-pointer rounded-md py-2 text-sm"
                      >
                        Approved
                      </SelectItem>

                      <SelectItem
                        value="PENDING"
                        className="cursor-pointer rounded-md py-2 text-sm"
                      >
                        Pending
                      </SelectItem>

                      <SelectItem
                        value="REJECTED"
                        className="cursor-pointer rounded-md py-2 text-sm"
                      >
                        Rejected
                      </SelectItem>

                      <SelectItem
                        value="REVERSED"
                        className="cursor-pointer rounded-md py-2 text-sm"
                      >
                        Reversed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {collectionsQuery.isLoading ? (
                  <p className="p-8 text-center text-sm text-[var(--hs-text-secondary)]">Loading collections...</p>
                ) : collectionsQuery.error && allCollections.length === 0 ? (
                  <p className="p-8 text-center text-sm text-red-700">{getErrorMessage(collectionsQuery.error)}</p>
                ) : (
                  <>
                    <CollectionTable rows={visibleCollections} />
                    <Pagination
                      page={safeCollectionPage}
                      totalItems={collections.length}
                      onPageChange={setCollectionPage}
                    />
                  </>

                )}
              </div>

              <div className="min-w-0 border border-[var(--hs-border)] bg-[var(--hs-white)] p-4 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] sm:p-5">
                <SectionHeader
                  title="Recent notifications"
                  description="Recent collection and account activity"
                  count={`${notifications.length} notifications`}
                />

                {notificationsQuery.isLoading ? (
                  <p className="p-8 text-center text-sm text-[var(--hs-text-secondary)]">Loading notifications...</p>
                ) : notificationsQuery.error && notifications.length === 0 ? (
                  <p className="p-8 text-center text-sm text-red-700">{getErrorMessage(notificationsQuery.error)}</p>
                ) : (

                  <>
                    <NotificationsTable rows={visibleNotifications} />
                    <Pagination
                      page={safeNotificationPage}
                      totalItems={notifications.length}
                      onPageChange={setNotificationPage}
                    />
                  </>
                )}

              </div>
            </section>

            <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onNavigateToApprovals}
                className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4 text-left transition hover:bg-amber-100">

                <span className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-white text-amber-700"><AlertCircle className="size-5" /></span>
                  <span>

                    <span className="block text-sm font-semibold text-amber-950">Review pending approvals</span>
                    <span className="mt-0.5 block text-xs text-amber-800">Pending amount: {formatMoney(summary?.collections.pending_amount)}</span>
                  </span>

                </span>
                <span className="text-sm font-semibold text-amber-900">Open</span>
              </button>



              <div className="flex items-center gap-3 rounded-xl border border-[var(--hs-border)] bg-[var(--hs-background)]/50 p-4">
                <span className="grid size-10 place-items-center rounded-lg bg-white text-[var(--hs-text-secondary)]"><CalendarDays className="size-5" /></span>
                <span>

                  <span className="block text-sm font-semibold text-[var(--hs-text)]">Dashboard date</span>
                  <span className="mt-0.5 block text-xs text-[var(--hs-text-secondary)]">{formatDate(summary?.today.date)}</span>
                </span>
              </div>
            </section>

          </>

        )}

      </div>

    </div>

  );

}

export default OverviewSection;
