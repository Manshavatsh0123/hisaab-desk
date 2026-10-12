"use client";

import type { LucideIcon } from "lucide-react";
import { AlertCircle, CalendarDays, Plus, RefreshCw } from "lucide-react";
import type { CollectionAccount, CollectionStatus } from "@/mocks/dailyCollectionResponse";

export type CollectionTableAccount = Pick<
  CollectionAccount,
  "id" | "customerId" | "customer" | "phone" | "account" | "scheme" |
  "frequency" | "startDate" | "amount" | "payments" | "status"
>;

export type CollectionStatusConfig = {
  label: string;
  className: string;
  icon: LucideIcon;
};

type DailyCollectionTableProps = {
  accounts: CollectionTableAccount[];
  selectedMonth: string;
  today: string;
  statusConfig: Record<CollectionStatus, CollectionStatusConfig>;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onAddPayment: (accountId: string) => void;
  formatMoney: (amount: number) => string;
  formatDate: (date: string) => string;
  monthLabel: (month: string) => string;
};

export function DailyCollectionTable({
  accounts,
  selectedMonth,
  today,
  statusConfig,
  loading = false,
  error = null,
  onRetry,
  onAddPayment,
  formatMoney,
  formatDate,
  monthLabel,
}: DailyCollectionTableProps) {
  const [year, month] = selectedMonth.split("-").map(Number);
  const daysInMonth = year && month ? new Date(year, month, 0).getDate() : 0;
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const monthPrefix = `${selectedMonth}-`;

  const monthTotal = (payments: Record<string, number>) =>
    Object.entries(payments ?? {})
      .filter(([date]) => date.startsWith(monthPrefix))
      .reduce((sum, [, value]) => sum + (Number(value) || 0), 0);

  const columnCount = 5 + days.length + 2;

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--hs-border)] bg-[var(--hs-surface)]">
      <div className="flex flex-col gap-3 border-b border-[var(--hs-border)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-5 text-[var(--hs-primary)]" />
            <h2 className="text-base font-bold text-[var(--hs-text)]">Daily collection register</h2>
          </div>
          <p className="mt-1 text-sm text-[var(--hs-text-secondary)]">
            Account-wise payments for {monthLabel(selectedMonth)}. Select “Add payment” to record a collection.
          </p>
        </div>
        <div className="rounded-lg bg-[var(--hs-primary-light)] px-3 py-2 text-sm font-semibold text-[var(--hs-primary)]">
          {monthLabel(selectedMonth)}
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="size-8 animate-spin rounded-full border-2 border-[var(--hs-primary-border)] border-t-[var(--hs-primary)]" />
          <p className="text-sm font-medium text-[var(--hs-text-secondary)]">Loading collection records…</p>
        </div>
      ) : error ? (
        <div className="flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center">
          <AlertCircle className="size-9 text-[var(--hs-danger)]" />
          <p className="font-semibold text-[var(--hs-text)]">Could not load collections</p>
          <p className="max-w-lg text-sm text-[var(--hs-text-secondary)]">{error}</p>
          {onRetry && (
            <button onClick={onRetry} type="button" className="inline-flex items-center gap-2 rounded-lg bg-[var(--hs-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--hs-primary-dark)]">
              <RefreshCw className="size-4" /> Try again
            </button>
          )}
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
          <CalendarDays className="size-10 text-[var(--hs-text-muted)]" />
          <p className="mt-3 font-semibold text-[var(--hs-text)]">No accounts found</p>
          <p className="mt-1 text-sm text-[var(--hs-text-secondary)]">Try changing your search or filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1900px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[var(--hs-background)] text-xs uppercase tracking-wide text-[var(--hs-text-secondary)]">
                <th className="sticky left-0 z-20 min-w-28 border-b border-r border-[var(--hs-border)] bg-[var(--hs-background)] px-4 py-3">Customer ID</th>
                <th className="sticky left-28 z-20 min-w-64 border-b border-r border-[var(--hs-border)] bg-[var(--hs-background)] px-4 py-3">Customer / account</th>
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
                <th className="sticky right-0 z-20 min-w-48 border-b border-l border-[var(--hs-border)] bg-[var(--hs-background)] px-4 py-3">Status / action</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => {
                const status = statusConfig[account.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={account.id} className="group hover:bg-[var(--hs-hover)]">
                    <td className="sticky left-0 z-10 border-b border-r border-[var(--hs-border-light)] bg-[var(--hs-surface)] px-4 py-3 align-top font-semibold text-[var(--hs-text)] group-hover:bg-[var(--hs-hover)]">
                      {account.customerId}
                    </td>
                    <td className="sticky left-28 z-10 border-b border-r border-[var(--hs-border-light)] bg-[var(--hs-surface)] px-4 py-3 align-top group-hover:bg-[var(--hs-hover)]">
                      <p className="font-semibold text-[var(--hs-text)]">{account.customer}</p>
                      <p className="mt-0.5 text-xs text-[var(--hs-text-secondary)]">{account.account} · {account.scheme}</p>
                      <p className="mt-0.5 text-xs text-[var(--hs-text-muted)]">{account.phone}</p>
                    </td>
                    <td className="border-b border-[var(--hs-border-light)] px-3 py-3 align-top text-[var(--hs-text-secondary)]">{account.frequency}</td>
                    <td className="border-b border-[var(--hs-border-light)] px-3 py-3 align-top text-[var(--hs-text-secondary)]">{formatDate(account.startDate)}</td>
                    <td className="border-b border-[var(--hs-border-light)] px-3 py-3 text-right align-top font-semibold tabular-nums">{formatMoney(account.amount)}</td>
                    {days.map((day) => {
                      const date = `${selectedMonth}-${String(day).padStart(2, "0")}`;
                      const paid = Number(account.payments?.[date]) || 0;
                      const isFuture = date > today;
                      return (
                        <td key={day} className={`border-b border-[var(--hs-border-light)] px-2 py-3 text-center align-top tabular-nums ${date === today ? "bg-[var(--hs-primary-light)]/50" : ""}`}>
                          {paid > 0 ? (
                            <span title={`${formatDate(date)}: ${formatMoney(paid)}`} className="inline-flex min-w-14 justify-center rounded-md bg-[var(--hs-success-light)] px-2 py-1 text-xs font-semibold text-[var(--hs-success)]">
                              {formatMoney(paid)}
                            </span>
                          ) : isFuture ? (
                            <span className="text-[var(--hs-text-muted)]">—</span>
                          ) : (
                            <span className="text-[var(--hs-border)]">·</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="border-b border-[var(--hs-border-light)] px-3 py-3 text-right align-top font-bold tabular-nums text-[var(--hs-text)]">{formatMoney(monthTotal(account.payments))}</td>
                    <td className="sticky right-0 z-10 border-b border-l border-[var(--hs-border-light)] bg-[var(--hs-surface)] px-3 py-3 align-top group-hover:bg-[var(--hs-hover)]">
                      <div className="flex flex-col items-start gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                          <StatusIcon className="size-3.5" /> {status.label}
                        </span>
                        <button type="button" onClick={() => onAddPayment(account.id)} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--hs-primary)] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--hs-primary-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--hs-primary-border)]">
                          <Plus className="size-3.5" /> Add payment
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[var(--hs-background)] font-semibold">
                <td colSpan={5} className="border-t border-[var(--hs-border)] px-4 py-3 text-[var(--hs-text)]">Total collected by date</td>
                {days.map((day) => {
                  const date = `${selectedMonth}-${String(day).padStart(2, "0")}`;
                  const total = accounts.reduce((sum, account) => sum + (Number(account.payments?.[date]) || 0), 0);
                  return <td key={day} className="border-t border-[var(--hs-border)] px-2 py-3 text-center text-xs tabular-nums">{total > 0 ? formatMoney(total) : "—"}</td>;
                })}
                <td className="border-t border-[var(--hs-border)] px-3 py-3 text-right tabular-nums text-[var(--hs-success)]">
                  {formatMoney(accounts.reduce((sum, account) => sum + monthTotal(account.payments), 0))}
                </td>
                <td className="sticky right-0 border-t border-l border-[var(--hs-border)] bg-[var(--hs-background)] px-3 py-3 text-xs text-[var(--hs-text-secondary)]">
                  {accounts.length} account{accounts.length === 1 ? "" : "s"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {!loading && !error && accounts.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--hs-border)] px-5 py-3 text-xs text-[var(--hs-text-secondary)]">
          <span className="inline-flex items-center gap-2"><span className="size-2.5 rounded-sm bg-[var(--hs-success)]" /> Recorded payment</span>
          <span>— No payment recorded / future date</span>
          <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5 text-[var(--hs-primary)]" /> Highlighted column is today</span>
        </div>
      )}
    </section>
  );
}
