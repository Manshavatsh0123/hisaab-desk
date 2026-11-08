"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Clock3,
  IndianRupee,
  Plus,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";

import { PageHeader } from "../common/PageHeader";
import { StatsCards, type StatItem } from "../common/StatsCards";
import { AccountFilters } from "../common/AccountFilters";
import { DailyCollectionTable } from "../common/DailyCollectionTable";
import { CollectionModal } from "../common/CollectionModal";
import {
  useGetCollectionAccountsQuery,
  type CollectionAccount,
  type CollectionStatus,
  type Frequency,
  useLazyListCustomersQuery,
  useLazyGetCustomerDetailsQuery,
  useAddAdminCollectionMutation
} from "@/features/customers/customersApi";


const statusConfig: Record<
  CollectionStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  paid: {
    label: "Paid",
    icon: CheckCircle2,
    className:
      "border-[var(--hs-border)] bg-[var(--hs-success-light)] text-[var(--hs-success)]",
  },
  due: {
    label: "Due",
    icon: Clock3,
    className:
      "border-[var(--hs-border)] bg-[var(--hs-warning-light)] text-[var(--hs-warning)]",
  },
  overdue: {
    label: "Overdue",
    icon: XCircle,
    className:
      "border-[var(--hs-primary-border)] bg-[var(--hs-danger-light)] text-[var(--hs-danger)]",
  },
  "not-due": {
    label: "Not due",
    icon: CalendarDays,
    className:
      "border-[var(--hs-border)] bg-[var(--hs-background)] text-[var(--hs-text-secondary)]",
  },
  matured: {
    label: "Matured",
    icon: CheckCircle2,
    className:
      "border-[var(--hs-primary-border)] bg-[var(--hs-primary-light)] text-[var(--hs-primary)]",
  },
};

const frequencyOptions: Array<"all" | Frequency> = [
  "all",
  "Daily",
  "Weekly",
  "Monthly",
];

const statusOptions: Array<"all" | CollectionStatus> = [
  "all",
  "paid",
  "due",
  "overdue",
  "not-due",
  "matured",
];

function localISODate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  if (!value) return "—";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

}

function formatMoney(value: number) {

  return `₹${(Number(value) || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

}

function getCurrentMonthValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getRecentMonths(count = 7) {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: date.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
      year: date.getFullYear(),
    };
  });
}

function monthLabel(monthValue: string) {

  const [year, month] = monthValue.split("-").map(Number);

  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

}

function getMonthCollected(account: CollectionAccount, month: string) {
  const prefix = `${month}-`;
  return Object.entries(account.payments ?? {})
    .filter(([date]) => date.startsWith(prefix))
    .reduce((total, [, value]) => total + (Number(value) || 0), 0);
}

const EMPTY_COLLECTION_ACCOUNTS: CollectionAccount[] = [];

function getQueryErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "object" && error !== null) {
    const apiError = error as {
      status?: string | number;
      error?: string;
      data?: { message?: string; error?: string };
    };

    if (apiError.data?.message) return apiError.data.message;
    if (apiError.data?.error) return apiError.data.error;
    if (apiError.error) return apiError.error;

    if (apiError.status === 401) {
      return "Your session is invalid or expired. Please sign in again.";
    }
    if (apiError.status === 403) {
      return "You do not have permission to view customer accounts.";
    }
    if (apiError.status === "FETCH_ERROR") {
      return "Cannot connect to the API server. Check that the backend is running.";
    }
  }

  return "Unable to load customer accounts. Please try again.";
}

export function DealsSection() {

  const {
    data: queryAccounts,
    isLoading: accountsLoading,
    isFetching: accountsFetching,
    error: queryError,
    refetch,
  } = useGetCollectionAccountsQuery({ page: 1, limit: 100 });

  const apiAccounts = queryAccounts ?? EMPTY_COLLECTION_ACCOUNTS;

  const [accounts, setAccounts] = useState<CollectionAccount[]>([]);

  useEffect(() => {
    setAccounts((current) => {
      if (current === apiAccounts) return current;

      return apiAccounts;
    });
  }, [apiAccounts]);

  const accountsError = getQueryErrorMessage(queryError);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CollectionStatus>("all");

  const [frequencyFilter, setFrequencyFilter] = useState<"all" | Frequency>("all");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());
  const recentMonths = useMemo(() => getRecentMonths(7), []);



  const [collectionOpen, setCollectionOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sortAscending, setSortAscending] = useState(false);
  const [formError, setFormError] = useState("");
  const today = localISODate();
  const filteredAccounts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return [...accounts]
      .filter((account) => {
        const matchesSearch =
          !query ||
          [
            account.customer,
            account.customerId,
            account.phone,
            account.account,
            account.scheme,
          ].some((value) => String(value ?? "").toLowerCase().includes(query));

        const matchesStatus =
          statusFilter === "all" || account.status === statusFilter;

        const matchesFrequency =
          frequencyFilter === "all" ||
          account.frequency === frequencyFilter;
        return matchesSearch && matchesStatus && matchesFrequency;
      })

      .sort((a, b) =>
        sortAscending ? a.amount - b.amount : b.amount - a.amount,
      );
  }, [
    accounts,
    searchQuery,
    statusFilter,
    frequencyFilter,
    sortAscending,
  ]);

  const summary = useMemo(() => {

    const customerCount = new Set(
      filteredAccounts.map((account) => account.customerId),
    ).size;

    const collected = filteredAccounts.reduce(
      (sum, account) => sum + getMonthCollected(account, selectedMonth),
      0,
    );

    const expected = filteredAccounts.reduce(
      (sum, account) => sum + (Number(account.amount) || 0),
      0,
    );

    const monthPrefix = `${selectedMonth}-`;

    const pending = filteredAccounts.filter((account) => {
      if (!account.nextDue?.startsWith(monthPrefix)) return false;
      return getMonthCollected(account, selectedMonth) < account.amount;
    }).length;

    return { customerCount, collected, expected, pending };
  }, [filteredAccounts, selectedMonth]);

  const selectedApiAccount =
    accounts.find((account) => account.id === selectedAccountId) ?? null;
  const modalAccount = selectedApiAccount
    ? {
      id: selectedApiAccount.account,
      customerName: selectedApiAccount.customer,
      installmentAmount: selectedApiAccount.amount,
      remainingDue: Math.max(
        0,
        selectedApiAccount.amount -
        (selectedApiAccount.payments?.[today] ?? 0),
      ),

      totalPaid: Object.values(selectedApiAccount.payments ?? {}).reduce(
        (sum, value) => sum + (Number(value) || 0),
        0,
      ),

      status: statusConfig[selectedApiAccount.status]?.label ??
        selectedApiAccount.status,
    }
    : null;

  const accountSearchMatch = useMemo(() => {
    const query = selectedCustomer.trim().toLowerCase();
    if (!query) return selectedApiAccount;

    return (

      accounts.find((account) => {

        const fields = [
          account.customer,
          account.customerId,
          account.phone,
          account.account,
          account.scheme,
        ];

        return fields.some((field) =>

          String(field ?? "").toLowerCase().includes(query),

        );

      }) ?? null

    );

  }, [accounts, selectedCustomer, selectedApiAccount]);

  const effectiveModalAccount = accountSearchMatch
    ? {

      id: accountSearchMatch.account,
      customerName: accountSearchMatch.customer,
      installmentAmount: accountSearchMatch.amount,

      remainingDue: Math.max(
        0,
        accountSearchMatch.amount -
        (accountSearchMatch.payments?.[today] ?? 0),

      ),

      totalPaid: Object.values(accountSearchMatch.payments ?? {}).reduce(
        (sum, value) => sum + (Number(value) || 0),

        0,

      ),

      status: statusConfig[accountSearchMatch.status]?.label ??
        accountSearchMatch.status,

    }

    : null;

  function openCollection(accountId?: string) {

    const account =

      accounts.find((item) => item.id === accountId) ??
      filteredAccounts[0] ??
      accounts[0] ??
      null;

    setSelectedAccountId(account?.id ?? "");
    setSelectedCustomer("");
    setAmount(account ? String(account.amount) : "");
    setFormError("");
    setCollectionOpen(true);

  }

  function closeCollection() {
    if (submitting) return;
    setCollectionOpen(false);
    setSelectedCustomer("");
    setFormError("");
  }

  async function handleAddCollection() {

    const chosenAccount = accountSearchMatch;
    const numericAmount = Number(amount);

    if (!chosenAccount) {
      setFormError("Search for a customer/account that exists in the list.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setFormError("Enter an amount greater than ₹0.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      await new Promise((resolve) => setTimeout(resolve, 250));
      const paymentDate = today;
      setAccounts((current) =>
        current.map((account) => {
          if (account.id !== chosenAccount.id) return account;
          const nextPayments = {
            ...account.payments,
            [paymentDate]:
              (Number(account.payments?.[paymentDate]) || 0) + numericAmount,
          };

          const monthCollected = Object.entries(nextPayments)
            .filter(([date]) => date.startsWith(`${paymentDate.slice(0, 7)}-`))
            .reduce((sum, [, value]) => sum + (Number(value) || 0), 0);

          const status: CollectionStatus =
            monthCollected >= account.amount ? "paid" : "due";
          return { ...account, payments: nextPayments, status };
        }),

      );

      setSelectedAccountId(chosenAccount.id);
      setCollectionOpen(false);
      setSelectedCustomer("");
      setAmount("");
    } catch {
      setFormError("Payment could not be saved. Please try again.");
    } finally {
      setSubmitting(false);

    }

  }

  function exportCsv() {

    const headers = [
      "Customer ID",
      "Customer",
      "Phone",
      "Account No.",
      "Scheme",
      "Frequency",
      "Start Date",
      "Installment",
      "Payment Date",
      "Amount",
    ];

    const rows = filteredAccounts.flatMap((account) => {
      const monthPayments = Object.entries(account.payments ?? {})
        .filter(
          ([date, value]) =>
            date.startsWith(`${selectedMonth}-`) && value > 0,
        )
        .sort(([a], [b]) => a.localeCompare(b));

      if (monthPayments.length === 0) {

        return [
          [
            account.customerId,
            account.customer,
            account.phone,
            account.account,
            account.scheme,
            account.frequency,
            account.startDate,
            account.amount,
            "",
            0,
          ],

        ];

      }

      return monthPayments.map(([date, value]) => [
        account.customerId,
        account.customer,
        account.phone,
        account.account,
        account.scheme,
        account.frequency,
        account.startDate,
        account.amount,
        date,
        value,
      ]);

    });

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `collection-register-${selectedMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const dealStats: StatItem[] = [
    {
      label: "Total customers",
      value: summary.customerCount,
      helper: "Unique customers in filtered results",
      icon: Users,
      tone: "neutral",
    },

    {
      label: "Collected this month",
      value: formatMoney(summary.collected),
      helper: "Based on recorded payments",
      icon: Wallet,
      tone: "success",
    },

    {
      label: "Installment value",
      value: formatMoney(summary.expected),
      helper: "Sum of installments for filtered accounts",
      icon: IndianRupee,
      tone: "primary",
    },

    {
      label: "Pending accounts",
      value: summary.pending,
      helper: "Accounts with an unpaid due this month",
      icon: Clock,
      tone: "warning",
    },
  ];

  return (

    <div className="flex flex-col gap-6 text-[var(--hs-text)]">
      <div className="px-[var(--hs-page-padding-x)] py-[var(--hs-page-padding-y)]">


        <PageHeader
          eyebrow={`Customers / ${monthLabel(selectedMonth)}`}
          title="Customer collection"
          highlight="register"
          subtitle="Track account-wise payments by date."
          action={{
            label: "Add collection",
            onClick: () => openCollection(),
            icon: <Plus className="size-4" />,
          }}
        />

        <StatsCards items={dealStats} columns={4} />


        <AccountFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusOptions={statusOptions}
          statusLabels={Object.fromEntries(
            statusOptions
              .filter((value) => value !== "all")
              .map((value) => [
                value,
                statusConfig[value as CollectionStatus].label,
              ]),
          )}
          allStatusValue="all"
          frequencyFilter={frequencyFilter}
          setFrequencyFilter={setFrequencyFilter}
          frequencyOptions={frequencyOptions}
          allFrequencyValue="all"
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          onExport={exportCsv}
          resultCount={filteredAccounts.length}
          resultLabel="accounts"
        />


        {/* Quick month navigation: current month followed by previous months. */}
        <section
          aria-label="Choose collection month"
          className="overflow-hidden rounded-xl border border-[var(--hs-border)] bg-[var(--hs-surface)]"
        >
          <div className="flex flex-col gap-3 border-b border-[var(--hs-border-light)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--hs-text)]">
                Collection month
              </h3>
              <p className="mt-1 text-xs text-[var(--hs-text-muted)]">
                Select a month to view its daily payment history.
              </p>
            </div>
            <p className="text-sm font-semibold text-[var(--hs-primary)]">
              {monthLabel(selectedMonth)}
            </p>
          </div>

          <div className="overflow-x-auto px-3 py-3">
            <div className="flex min-w-max gap-1" role="group" aria-label="Recent months">
              {recentMonths.map((month, index) => {
                const isSelected = selectedMonth === month.value;
                return (
                  <button
                    key={month.value}
                    type="button"
                    onClick={() => setSelectedMonth(month.value)}
                    aria-pressed={isSelected}
                    className={[
                      "min-w-[88px] rounded-md border px-4 py-2.5 text-center transition-colors",
                      isSelected
                        ? "border-[var(--hs-primary)] bg-[var(--hs-primary)] text-white"
                        : "border-[var(--hs-border)] bg-[var(--hs-surface)] text-[var(--hs-text-secondary)] hover:bg-[var(--hs-primary-light)] hover:text-[var(--hs-primary)]",
                    ].join(" ")}
                  >
                    <span className="block text-sm font-semibold">
                      {index === 0 ? "THIS MONTH" : month.label}
                    </span>
                    <span
                      className={[
                        "mt-0.5 block text-xs",
                        isSelected ? "text-white/80" : "text-[var(--hs-text-muted)]",
                      ].join(" ")}
                    >
                      {month.year}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <DailyCollectionTable
          accounts={filteredAccounts}
          selectedMonth={selectedMonth}
          today={today}
          loading={accountsLoading || accountsFetching}
          error={accountsError}
          onRetry={() => void refetch()}
          onAddCollection={openCollection}
          formatMoney={formatMoney}
          formatDate={formatDate}
          monthLabel={monthLabel}
          pageSize={20}
        />

        <CollectionModal
          open={collectionOpen}
          onClose={closeCollection}
          onSuccess={() => {
            void refetch();
          }}
        />

        {collectionOpen && formError && (
          <div role="alert" className="fixed bottom-5 right-5 z-[60] max-w-sm rounded-lg border border-[var(--hs-primary-border)] bg-[var(--hs-danger-light)] px-4 py-3 text-sm text-[var(--hs-danger)] shadow-lg">
            {formError}
          </div>
        )}

      </div>
    </div>

  );

}

export default DealsSection;
