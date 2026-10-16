
"use client";

import {
    CalendarDays,
    Download,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

import SelectControl from "./SelectControl";

type AccountFiltersProps<
    TStatus extends string,
    TFrequency extends string,
> = {
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
    description = "Search and filter customer accounts.",
}: AccountFiltersProps<TStatus, TFrequency>) {
    const hasFilters =
        searchQuery.trim() !== "" ||
        statusFilter !== allStatusValue ||
        frequencyFilter !== allFrequencyValue;

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter(allStatusValue);
        setFrequencyFilter(allFrequencyValue);
    };

    const inputClass =
        "h-10 w-full min-w-0 rounded-[8px] border border-[var(--hs-border)] bg-white text-sm text-[var(--hs-text)] transition placeholder:text-[var(--hs-text-muted)] hover:border-[var(--hs-primary-border)] focus:border-[var(--hs-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--hs-primary)]/10";

    const statusLabelsForSelect = statusOptions.map((option) => {
        if (option === "all") return "All statuses";

        return statusLabels[option] ?? option;
    });

    const frequencyLabelsForSelect = frequencyOptions.map((option) => {
        if (option === "all") return "All frequencies";

        return option.charAt(0).toUpperCase() + option.slice(1);
    });

    const selectedStatusLabel =
        statusFilter === allStatusValue
            ? "All statuses"
            : statusLabels[statusFilter] ?? statusFilter;

    const selectedFrequencyLabel =
        frequencyFilter === allFrequencyValue
            ? "All frequencies"
            : frequencyFilter;

    return (
        <section className="rounded-[8px] border border-[var(--hs-border)] bg-white p-4 sm:p-5 mt-4 mb-4">
            {/* Heading */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-[var(--hs-primary-light)] text-[var(--hs-primary)]">
                        <SlidersHorizontal className="size-[18px]" />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-[var(--hs-text)]">
                            Search & filters
                        </h3>
                        <p className="mt-0.5 text-xs text-[var(--hs-text-secondary)]">
                            {description}
                        </p>
                    </div>
                </div>

                <span className="inline-flex shrink-0 items-center rounded-[8px] border border-[var(--hs-primary-border)] bg-[var(--hs-primary-light)] px-2.5 py-1 text-xs font-semibold text-[var(--hs-primary)]">
                    {resultCount} {resultLabel}
                </span>
            </div>

            {/* Controls */}
            <div className="mt-5 grid grid-cols-1 items-center gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_165px_175px_175px_auto]">
                {/* Search */}
                <div className="relative min-w-0 sm:col-span-2 xl:col-span-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--hs-text-muted)]" />

                    <input
                        aria-label="Search customers and accounts"
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search name, customer ID, account..."
                        className={`${inputClass} pl-10 pr-9`}
                    />

                    {searchQuery && (
                        <button
                            type="button"
                            aria-label="Clear search"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-[6px] text-[var(--hs-text-muted)] hover:bg-[var(--hs-primary-light)] hover:text-[var(--hs-primary)]"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                {/* Status dropdown */}
                <SelectControl
                    ariaLabel="Filter by payment status"
                    value={selectedStatusLabel}
                    onChange={(label) => {
                        const index = statusOptions.findIndex(
                            (option) => (statusLabels[option] ?? option) === label
                        );

                        if (index >= 0) setStatusFilter(statusOptions[index]);
                    }}
                    options={statusLabelsForSelect}
                    placeholder="All statuses"
                />

                {/* Frequency dropdown */}
                <SelectControl
                    ariaLabel="Filter by collection frequency"
                    value={selectedFrequencyLabel}
                    onChange={(value) => {
                        if (frequencyOptions.includes(value as TFrequency)) {
                            setFrequencyFilter(value as TFrequency);
                        }
                    }}
                    options={[...frequencyOptions]}
                    placeholder="All frequencies"
                />

                {/* Month picker */}
                <label className="flex h-10 min-w-0 items-center gap-2 rounded-[8px] border border-[var(--hs-border)] bg-white px-3 transition hover:border-[var(--hs-primary-border)] focus-within:border-[var(--hs-primary)] focus-within:ring-2 focus-within:ring-[var(--hs-primary)]/10">
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
                        className="w-full min-w-0 bg-transparent text-sm text-[var(--hs-text)] outline-none"
                    />
                </label>

                {/* Export */}
                <button
                    type="button"
                    onClick={onExport}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[var(--hs-primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--hs-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]/30 focus-visible:ring-offset-2"
                >
                    <Download className="size-4 shrink-0" />
                    Export CSV
                </button>
            </div>

            {/* Footer */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--hs-border-light)] pt-3">
                <p className="text-xs text-[var(--hs-text-secondary)]">
                    Showing{" "}
                    <span className="font-semibold text-[var(--hs-text)]">
                        {resultCount}
                    </span>{" "}
                    {resultLabel}
                </p>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1.5 rounded-[6px] px-2 py-1 text-xs font-semibold text-[var(--hs-primary)] transition hover:bg-[var(--hs-primary-light)]"
                    >
                        <X className="size-3.5" />
                        Clear filters
                    </button>
                )}
            </div>
        </section>
    );
}
