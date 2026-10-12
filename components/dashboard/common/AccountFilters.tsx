"use client";

import type { ReactNode } from "react";
import {
    CalendarDays,
    Download,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

type AccountFiltersProps<TStatus extends string, TFrequency extends string> = {
    searchQuery: string;
    setSearchQuery: (value: string) => void;

    statusFilter: TStatus;
    setStatusFilter: (value: TStatus) => void;
    statusOptions: readonly TStatus[];
    statusLabels: Partial<Record<TStatus, string>>;
    allStatusValue: TStatus;

    frequencyFilter: TFrequency;
    setFrequencyFilter: (value: TFrequency) => void;
    frequencyOptions: readonly TFrequency[];
    allFrequencyValue: TFrequency;

    selectedMonth: string;
    setSelectedMonth: (value: string) => void;

    onExport: () => void;
    resultCount: number;
    resultLabel?: string;
    description?: string;
};

export function AccountFilters<
    TStatus extends string,
    TFrequency extends string,
>({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    statusOptions,
    statusLabels,
    allStatusValue,
    frequencyFilter,
    setFrequencyFilter,
    frequencyOptions,
    allFrequencyValue,
    selectedMonth,
    setSelectedMonth,
    onExport,
    resultCount,
    resultLabel = "accounts",
    description = "Each account is listed separately, including multiple accounts belonging to the same customer.",
}: AccountFiltersProps<TStatus, TFrequency>) {
    const hasFilters =
        searchQuery.trim() !== "" ||
        statusFilter !== allStatusValue ||
        frequencyFilter !== allFrequencyValue;

    function clearFilters() {
        setSearchQuery("");
        setStatusFilter(allStatusValue);
        setFrequencyFilter(allFrequencyValue);
    }

    const inputClass =
        "h-11 w-full min-w-0 rounded-lg border border-[var(--hs-border)] bg-[var(--hs-white)] px-3 text-sm text-[var(--hs-text)] outline-none transition placeholder:text-[var(--hs-text-muted)] hover:border-[var(--hs-primary-border)] focus:border-[var(--hs-primary)] focus:ring-2 focus:ring-[var(--hs-primary-light)]";

    return (
        <section className="flex flex-col gap-4 rounded-xl border border-[var(--hs-border)] bg-[var(--hs-surface)] p-4 sm:p-5">
            {/* Section heading */}
            <div className="flex items-center gap-2">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--hs-primary-light)] text-[var(--hs-primary)]">
                    <SlidersHorizontal className="size-4" />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-[var(--hs-text)]">
                        Search and filters
                    </h3>
                    <p className="mt-0.5 text-xs text-[var(--hs-text-muted)]">
                        Find accounts using the options below.
                    </p>
                </div>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_170px_175px_175px_auto]">
                {/* Search */}
                <label className="relative block min-w-0 sm:col-span-2 xl:col-span-1">
                    <span className="sr-only">
                        Search customers and accounts
                    </span>

                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--hs-text-muted)]" />

                    <input
                        aria-label="Search customers and accounts"
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search name, customer ID, account no..."
                        className={`${inputClass} pl-10`}
                    />
                </label>

                {/* Status */}
                <select
                    aria-label="Filter by payment status"
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value as TStatus)
                    }
                    className={inputClass}
                >
                    <option value={allStatusValue}>All statuses</option>

                    {statusOptions
                        .filter((value) => value !== allStatusValue)
                        .map((value) => (
                            <option key={value} value={value}>
                                {statusLabels[value] ?? value}
                            </option>
                        ))}
                </select>

                {/* Frequency */}
                <select
                    aria-label="Filter by collection frequency"
                    value={frequencyFilter}
                    onChange={(event) =>
                        setFrequencyFilter(event.target.value as TFrequency)
                    }
                    className={inputClass}
                >
                    <option value={allFrequencyValue}>All frequencies</option>

                    {frequencyOptions
                        .filter((value) => value !== allFrequencyValue)
                        .map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                </select>


                <label className="flex h-11 min-w-0 items-center gap-2 rounded-lg border border-[var(--hs-border)] bg-[var(--hs-white)] px-3 transition hover:border-[var(--hs-primary-border)] focus-within:border-[var(--hs-primary)] focus-within:ring-2 focus-within:ring-[var(--hs-primary-light)]">
                    <CalendarDays className="size-4 shrink-0 text-[var(--hs-text-muted)]" />

                    <span className="sr-only">Collection month</span>

                    <input
                        aria-label="Collection month"
                        type="month"
                        value={selectedMonth}
                        onChange={(event) => {
                            if (event.target.value) {
                                setSelectedMonth(event.target.value);
                            }
                        }}
                        className="min-w-0 w-full bg-transparent text-sm text-[var(--hs-text)] outline-none"
                    />
                </label>

                <button
                    type="button"
                    onClick={onExport}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--hs-border)] bg-[var(--hs-white)] px-4 text-sm font-semibold text-[var(--hs-text)] transition hover:border-[var(--hs-primary-border)] hover:bg-[var(--hs-primary-light)] hover:text-[var(--hs-primary)]"
                >
                    <Download className="size-4" />
                    Export CSV
                </button>
            </div>
        </section>
    );
}