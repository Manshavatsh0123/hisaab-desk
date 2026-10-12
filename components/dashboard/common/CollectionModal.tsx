"use client";

import type { ReactNode } from "react";
import {
  CheckCircle2,
  CreditCard,
  Search,
  ShieldCheck,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

export type CollectionAccount = {
  id: string;
  customerName: string;
  installmentAmount: number;
  remainingDue: number;
  totalPaid: number;
  status: string;
};

type CollectionModalProps = {
  open: boolean;
  onClose: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  account: CollectionAccount | null;
  amount: string;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
  submitting?: boolean;
};

const formatMoney = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;

export function CollectionModal({
  open,
  onClose,
  searchValue,
  onSearchChange,
  account,
  amount,
  onAmountChange,
  onSubmit,
  submitting = false,
}: CollectionModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#172337]/45 p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-dialog-title"
    >
      <div className="flex max-h-[calc(100dvh-40px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[var(--hs-border)] bg-white shadow-2xl">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--hs-border)] bg-white px-5 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--hs-primary)] text-white">
              <CreditCard className="size-5" />
            </div>

            <div>
              <h2
                id="collection-dialog-title"
                className="text-lg font-bold text-[var(--hs-text)]"
              >
                Add collection
              </h2>
              <p className="text-xs text-[var(--hs-text-secondary)]">
                Select an account and record a collection.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close collection dialog"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-[var(--hs-text-secondary)] transition-colors hover:bg-[var(--hs-background)] hover:text-[var(--hs-primary)]"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form body */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-white p-5 sm:p-6">
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">

            {/* Customer and account */}
            <div className="space-y-4 lg:col-span-7">
              <div>
                <label
                  htmlFor="collection-customer"
                  className="mb-2 block text-sm font-semibold text-[var(--hs-text)]"
                >
                  Search customer or account
                  <span className="ml-1 text-[var(--hs-primary)]">*</span>
                </label>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--hs-text-muted)]" />

                  <input
                    id="collection-customer"
                    value={searchValue}
                    onChange={(event) =>
                      onSearchChange(event.target.value)
                    }
                    placeholder="Name, phone or account ID"
                    className="h-11 w-full rounded-lg border border-[var(--hs-border)] bg-white pl-9 pr-3 text-sm text-[var(--hs-text)] outline-none transition focus:border-[var(--hs-primary)] focus:ring-2 focus:ring-[var(--hs-primary-light)]"
                  />
                </div>

                <p className="mt-1.5 text-xs text-[var(--hs-text-muted)]">
                  Search and select the correct customer account.
                </p>
              </div>

              <section className="overflow-hidden rounded-lg border border-[var(--hs-border)] bg-white">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--hs-border)] bg-[var(--hs-background)] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <UserRound className="size-4 text-[var(--hs-primary)]" />
                    <h3 className="text-sm font-semibold text-[var(--hs-text)]">
                      Selected account
                    </h3>
                  </div>

                  <span className="text-xs text-[var(--hs-text-muted)]">
                    Account details
                  </span>
                </div>

                {account ? (
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--hs-primary-light)] text-sm font-bold text-[var(--hs-primary)]">
                        {account.customerName
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[var(--hs-text)]">
                          {account.customerName}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--hs-text-muted)]">
                          Account ID: {account.id}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-[var(--hs-background)] px-2.5 py-1 text-xs font-medium text-[var(--hs-text-secondary)]">
                        {account.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-[var(--hs-background)] p-3">
                        <p className="text-xs text-[var(--hs-text-secondary)]">
                          Installment amount
                        </p>
                        <p className="mt-1.5 text-lg font-bold text-[var(--hs-text)]">
                          {formatMoney(account.installmentAmount)}
                        </p>
                      </div>

                      <div className="rounded-lg bg-[var(--hs-primary-light)] p-3">
                        <p className="text-xs text-[var(--hs-text-secondary)]">
                          Remaining due
                        </p>
                        <p className="mt-1.5 text-lg font-bold text-[var(--hs-primary)]">
                          {formatMoney(account.remainingDue)}
                        </p>
                      </div>

                      <div className="rounded-lg border border-[var(--hs-border)] p-3">
                        <p className="text-xs text-[var(--hs-text-secondary)]">
                          Total paid
                        </p>
                        <p className="mt-1.5 text-base font-semibold text-[var(--hs-success)]">
                          {formatMoney(account.totalPaid)}
                        </p>
                      </div>

                      <div className="rounded-lg border border-[var(--hs-border)] p-3">
                        <p className="text-xs text-[var(--hs-text-secondary)]">
                          Account status
                        </p>
                        <p className="mt-1.5 text-base font-semibold text-[var(--hs-text)]">
                          {account.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <UserRound className="mx-auto size-8 text-[var(--hs-text-muted)]" />
                    <p className="mt-2 text-sm font-medium text-[var(--hs-text)]">
                      No account selected
                    </p>
                    <p className="mt-1 text-xs text-[var(--hs-text-muted)]">
                      Search for a customer and select their account first.
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* Collection details */}
            <div className="space-y-4 lg:col-span-5">
              <section className="rounded-lg border border-[var(--hs-border)] bg-white p-4">
                <div className="flex items-center gap-2">
                  <Wallet className="size-4 text-[var(--hs-primary)]" />
                  <h3 className="text-sm font-semibold text-[var(--hs-text)]">
                    Collection details
                  </h3>
                </div>

                <label
                  htmlFor="collection-amount"
                  className="mb-2 mt-4 block text-sm font-semibold text-[var(--hs-text)]"
                >
                  Collection amount
                  <span className="ml-1 text-[var(--hs-primary)]">*</span>
                </label>

                <div className="flex h-14 items-center overflow-hidden rounded-lg border border-[var(--hs-border)] bg-white transition focus-within:border-[var(--hs-primary)] focus-within:ring-2 focus-within:ring-[var(--hs-primary-light)]">
                  <span className="flex h-full items-center border-r border-[var(--hs-border)] bg-[var(--hs-background)] px-4 text-lg font-semibold text-[var(--hs-text-secondary)]">
                    ₹
                  </span>

                  <input
                    id="collection-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(event) =>
                      onAmountChange(event.target.value)
                    }
                    placeholder="Enter amount"
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-xl font-bold text-[var(--hs-text)] outline-none"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-[var(--hs-text-muted)]">
                  Enter the amount received for the selected account.
                </p>
              </section>

              <div className="flex items-start gap-3 rounded-lg border border-[var(--hs-primary-border)] bg-[var(--hs-primary-light)] p-3.5">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[var(--hs-primary)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--hs-text)]">
                    Verify collection details
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--hs-text-secondary)]">
                    Check the selected account and amount before adding the collection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed footer */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[var(--hs-border)] bg-white px-5 py-3 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="h-10 rounded-lg border border-[var(--hs-border)] bg-white px-5 text-sm font-semibold text-[var(--hs-text-secondary)] transition hover:bg-[var(--hs-background)] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={
              submitting ||
              !account ||
              !amount ||
              !Number.isFinite(Number(amount)) ||
              Number(amount) <= 0
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--hs-primary)] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--hs-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 className="size-4" />
            {submitting ? "Adding collection..." : "Add Collection"}
          </button>
        </div>
      </div>
    </div>
  );
}