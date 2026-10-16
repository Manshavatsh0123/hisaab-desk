"use client";

import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { CollectionAccount } from "@/mocks/dailyCollectionResponse";

export type CollectionTableAccount = Pick<
  CollectionAccount,
  | "id"
  | "customerId"
  | "customer"
  | "phone"
  | "account"
  | "scheme"
  | "frequency"
  | "startDate"
  | "amount"
  | "payments"
>;

type DailyCollectionTableProps = {
  accounts: CollectionTableAccount[];
  selectedMonth: string;
  today: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onAddCollection: (accountId: string) => void;
  formatMoney: (amount: number) => string;
  formatDate: (date: string) => string;
  monthLabel: (month: string) => string;
  pageSize?: number;
};

export function DailyCollectionTable({
  accounts,
  selectedMonth,
  today,
  loading = false,
  error = null,
  onRetry,
  onAddCollection,
  formatMoney,
  formatDate,
  monthLabel,
  pageSize = 10,
}: DailyCollectionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [accounts.length, selectedMonth]);

  const safePageSize = Number.isFinite(pageSize) && pageSize > 0
    ? Math.floor(pageSize)
    : 10;
  const totalPages = Math.max(1, Math.ceil(accounts.length / safePageSize));
  const page = Math.min(currentPage, totalPages);
  const pageStart = (page - 1) * safePageSize;
  const visibleAccounts = accounts.slice(pageStart, pageStart + safePageSize);

  const [year, month] = selectedMonth.split("-").map(Number);
  const validMonth =
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    year > 0 &&
    month >= 1 &&
    month <= 12;

  const daysInMonth = validMonth ? new Date(year, month, 0).getDate() : 0;
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const monthPrefix = `${selectedMonth}-`;

  const safeAmount = (value: unknown) => {
    const amount = Number(value ?? 0);
    return Number.isFinite(amount) ? amount : 0;
  };

  const getPayment = (
    payments: Record<string, number> | null | undefined,
    date: string,
  ) => safeAmount(payments?.[date]);

  const getMonthTotal = (
    payments: Record<string, number> | null | undefined,
  ) =>
    Object.entries(payments ?? {}).reduce((sum, [date, value]) => {
      if (!date.startsWith(monthPrefix)) return sum;
      return sum + safeAmount(value);
    }, 0);

  // Totals are calculated from ALL filtered accounts, not only the visible page.
  const getDayTotal = (date: string) =>
    accounts.reduce(
      (sum, account) => sum + getPayment(account.payments, date),
      0,
    );

  const totalCollected = accounts.reduce(
    (sum, account) => sum + getMonthTotal(account.payments),
    0,
  );

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-[var(--hs-border)] bg-[var(--hs-surface)]">
      <header className="flex flex-col gap-3 border-b border-[var(--hs-border)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--hs-primary-light)] text-[var(--hs-primary)]">
            <CalendarDays className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[var(--hs-text)]">
              Daily collection register
            </h2>
            <p className="mt-1 text-sm text-[var(--hs-text-secondary)]">
              Account-wise payment history for {monthLabel(selectedMonth)}.
            </p>
          </div>
        </div>
        <span className="inline-flex w-fit shrink-0 items-center rounded-lg border border-[var(--hs-primary-border)] bg-[var(--hs-primary-light)] px-3 py-2 text-sm font-semibold text-[var(--hs-primary)]">
          {monthLabel(selectedMonth)}
        </span>
      </header>

      {loading ? (
        <div className="flex min-h-52 flex-col items-center justify-center gap-3 p-6 text-center" role="status">
          <div className="size-8 animate-spin rounded-full border-2 border-[var(--hs-primary-border)] border-t-[var(--hs-primary)]" />
          <p className="text-sm text-[var(--hs-text-secondary)]">Loading collection records…</p>
        </div>
      ) : error ? (
        <div className="flex min-h-52 flex-col items-center justify-center gap-3 p-6 text-center" role="alert">
          <AlertCircle className="size-9 text-[var(--hs-primary)]" />
          <p className="font-semibold text-[var(--hs-text)]">Could not load collections</p>
          <p className="max-w-lg break-words text-sm text-[var(--hs-text-secondary)]">{error}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[var(--hs-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--hs-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]/30 focus-visible:ring-offset-2"
            >
              <RefreshCw className="size-4" /> Try again
            </button>
          )}
        </div>
      ) : !validMonth ? (
        <div className="p-8 text-center text-sm text-[var(--hs-text-secondary)]">
          Please select a valid collection month.
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex min-h-52 flex-col items-center justify-center p-6 text-center">
          <CalendarDays className="size-9 text-[var(--hs-text-muted)]" />
          <p className="mt-3 font-semibold text-[var(--hs-text)]">No accounts found</p>
          <p className="mt-1 text-sm text-[var(--hs-text-secondary)]">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[1500px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[var(--hs-background)] text-[11px] font-semibold uppercase tracking-wide text-[var(--hs-text-secondary)]">
                <th className="sticky left-0 z-20 min-w-16 border-b border-r border-[var(--hs-border)] bg-[var(--hs-background)] px-4 py-3 text-center">IN</th>
                <th className="sticky left-16 z-20 min-w-64 border-b border-r border-[var(--hs-border)] bg-[var(--hs-background)] px-4 py-3">Customer / account</th>
                <th className="min-w-28 border-b border-[var(--hs-border)] px-3 py-3">Frequency</th>
                <th className="min-w-32 border-b border-[var(--hs-border)] px-3 py-3">Start date</th>
                <th className="min-w-28 border-b border-[var(--hs-border)] px-3 py-3 text-right">Installment</th>
                {days.map((day) => {
                  const date = `${selectedMonth}-${String(day).padStart(2, "0")}`;
                  const isToday = date === today;
                  return (
                    <th key={day} className={`min-w-20 border-b border-[var(--hs-border)] px-2 py-3 text-center ${isToday ? "bg-[var(--hs-primary-light)] text-[var(--hs-primary)]" : ""}`}>
                      <span className="block">{day}</span>
                      <span className="mt-1 block text-[10px] font-normal normal-case">
                        {new Date(year, month - 1, day).toLocaleDateString("en-IN", { weekday: "short" })}
                      </span>
                    </th>
                  );
                })}
                <th className="min-w-32 border-b border-[var(--hs-border)] px-3 py-3 text-right">Month total</th>
                <th className="sticky right-0 z-20 min-w-40 border-b border-l border-[var(--hs-border)] bg-[var(--hs-background)] px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleAccounts.map((account, index) => (
                <tr key={account.id} className="group transition-colors hover:bg-[var(--hs-hover)]">
                  <td className="sticky left-0 z-10 border-b border-r border-[var(--hs-border-light)] bg-white px-4 py-3 text-center align-top font-semibold tabular-nums text-[var(--hs-text-secondary)] group-hover:bg-[var(--hs-hover)]">
                    {pageStart + index + 1}
                  </td>
                  <td className="sticky left-16 z-10 border-b border-r border-[var(--hs-border-light)] bg-white px-4 py-3 align-top group-hover:bg-[var(--hs-hover)]">
                    <p className="font-semibold text-[var(--hs-text)]">{account.customer || "Unknown customer"}</p>
                    <p className="mt-1 text-xs text-[var(--hs-text-secondary)]">
                      {account.account || "No account number"}{account.scheme ? ` · ${account.scheme}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-[var(--hs-text-muted)]">{account.phone || "No phone number"}</p>
                  </td>
                  <td className="border-b border-[var(--hs-border-light)] px-3 py-3 align-top text-[var(--hs-text-secondary)]">{account.frequency || "—"}</td>
                  <td className="border-b border-[var(--hs-border-light)] px-3 py-3 align-top text-[var(--hs-text-secondary)]">{account.startDate ? formatDate(account.startDate) : "—"}</td>
                  <td className="border-b border-[var(--hs-border-light)] px-3 py-3 text-right align-top font-semibold tabular-nums text-[var(--hs-text)]">{formatMoney(safeAmount(account.amount))}</td>
                  {days.map((day) => {
                    const date = `${selectedMonth}-${String(day).padStart(2, "0")}`;
                    const paid = getPayment(account.payments, date);
                    const isFuture = date > today;
                    return (
                      <td key={day} className={`border-b border-[var(--hs-border-light)] px-2 py-3 text-center align-top tabular-nums ${date === today ? "bg-[var(--hs-primary-light)]/50" : ""}`}>
                        {paid > 0 ? (
                          <span title={`${formatDate(date)}: ${formatMoney(paid)}`} className="inline-flex min-w-14 justify-center rounded-md bg-[var(--hs-success-light)] px-2 py-1 text-xs font-semibold text-[var(--hs-success)]">
                            {formatMoney(paid)}
                          </span>
                        ) : (
                          <span className={isFuture ? "text-[var(--hs-text-muted)]" : "text-[var(--hs-border)]"}>—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="border-b border-[var(--hs-border-light)] px-3 py-3 text-right align-top font-bold tabular-nums text-[var(--hs-text)]">{formatMoney(getMonthTotal(account.payments))}</td>
                  <td className="sticky right-0 z-10 border-b border-l border-[var(--hs-border-light)] bg-white px-3 py-3 text-center align-top group-hover:bg-[var(--hs-hover)]">
                    <button
                      type="button"
                      onClick={() => onAddCollection(account.id)}
                      aria-label={`Add collection for ${account.customer || "customer"}`}
                      className="inline-flex min-h-9 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[var(--hs-primary)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--hs-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]/30 focus-visible:ring-offset-2"
                    >
                      <Plus className="size-4" />
                      Add collection
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[var(--hs-background)] font-semibold">
                <td colSpan={5} className="border-t border-[var(--hs-border)] px-4 py-3 text-[var(--hs-text)]">Total collected by date</td>
                {days.map((day) => {
                  const date = `${selectedMonth}-${String(day).padStart(2, "0")}`;
                  const total = getDayTotal(date);
                  return <td key={day} className="border-t border-[var(--hs-border)] px-2 py-3 text-center text-xs tabular-nums">{total > 0 ? formatMoney(total) : "—"}</td>;
                })}
                <td className="border-t border-[var(--hs-border)] px-3 py-3 text-right tabular-nums text-[var(--hs-success)]">{formatMoney(totalCollected)}</td>
                <td className="sticky right-0 border-t border-l border-[var(--hs-border)] bg-[var(--hs-background)] px-3 py-3 text-center text-xs text-[var(--hs-text-secondary)]">{accounts.length} account{accounts.length === 1 ? "" : "s"}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {!loading && !error && validMonth && accounts.length > 0 && (
        <nav
          aria-label="Collection table pagination"
          className="flex flex-col gap-3 border-t border-[var(--hs-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        >
          <p className="text-xs text-[var(--hs-text-secondary)]">
            Showing{" "}
            <span className="font-semibold text-[var(--hs-text)]">
              {pageStart + 1}–{Math.min(pageStart + safePageSize, accounts.length)}
            </span>{" "}
            of <span className="font-semibold text-[var(--hs-text)]">{accounts.length}</span> accounts
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-label="Previous page"
              onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
              disabled={page <= 1}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-[var(--hs-border)] bg-white px-3 text-sm font-medium text-[var(--hs-text)] transition hover:bg-[var(--hs-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <span aria-live="polite" className="min-w-20 text-center text-xs font-semibold text-[var(--hs-text)]">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              aria-label="Next page"
              onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
              disabled={page >= totalPages}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-[var(--hs-border)] bg-white px-3 text-sm font-medium text-[var(--hs-text)] transition hover:bg-[var(--hs-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </nav>
      )}

      {!loading && !error && validMonth && accounts.length > 0 && (
        <footer className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--hs-border)] px-4 py-3 text-xs text-[var(--hs-text-secondary)] sm:px-5">
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-[var(--hs-success)]" />
            Recorded payment
          </span>
          <span>— No payment recorded</span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-[var(--hs-primary)]" />
            Highlighted column is today
          </span>
        </footer>
      )}
    </section>
  );
}
