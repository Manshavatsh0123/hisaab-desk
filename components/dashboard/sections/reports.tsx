"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Download,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ReportPeriod = "Daily" | "Weekly" | "Monthly";
type Status = "Paid" | "Due" | "Overdue";

type PaymentMap = Record<string, number>;

type CustomerReport = {
  id: string;
  customer: string;
  phone: string;
  account: string;
  scheme: string;
  maturityDate: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "Yearly";
  dailyAmount: number;
  weeklyAmount: number;
  monthlyAmount: number;
  yearlyAmount: number;
  payments: PaymentMap;
  status: Status;
};

/*
 * Connect this array to your real customer + payment data.
 *
 * payments:
 *   "2026-09-01": 500
 *   "2026-09-02": 500
 *
 * A missing date means that no payment was recorded on that date.
 */
const customerReports: CustomerReport[] = [
  {
    id: "CUS-001",
    customer: "Rahul Kumar",
    phone: "9876543210",
    account: "00121",
    scheme: "RD",
    maturityDate: "18 Sep 2028",
    frequency: "Monthly",
    dailyAmount: 0,
    weeklyAmount: 0,
    monthlyAmount: 500,
    yearlyAmount: 0,
    payments: {
      "2026-09-01": 500,
      "2026-09-04": 500,
      "2026-09-06": 500,
      "2026-09-09": 500,
      "2026-09-12": 500,
      "2026-09-15": 500,
      "2026-09-18": 500,
      "2026-09-22": 500,
      "2026-09-25": 500,
      "2026-09-29": 500,
    },
    status: "Paid",
  },
  {
    id: "CUS-002",
    customer: "Priya Sharma",
    phone: "9876543211",
    account: "00221",
    scheme: "RD",
    maturityDate: "04 Jan 2029",
    frequency: "Monthly",
    dailyAmount: 0,
    weeklyAmount: 0,
    monthlyAmount: 1000,
    yearlyAmount: 0,
    payments: {},
    status: "Due",
  },
  {
    id: "CUS-003",
    customer: "Amit Verma",
    phone: "9876543212",
    account: "00318",
    scheme: "RD",
    maturityDate: "22 Mar 2028",
    frequency: "Weekly",
    dailyAmount: 0,
    weeklyAmount: 500,
    monthlyAmount: 0,
    yearlyAmount: 0,
    payments: {
      "2026-09-01": 500,
      "2026-09-03": 500,
      "2026-09-08": 500,
      "2026-09-10": 500,
      "2026-09-15": 500,
      "2026-09-17": 500,
      "2026-09-22": 500,
      "2026-09-24": 500,
      "2026-09-29": 500,
    },
    status: "Paid",
  },
  {
    id: "CUS-004",
    customer: "Neha Devi",
    phone: "9876543213",
    account: "00411",
    scheme: "PPF",
    maturityDate: "12 Jul 2032",
    frequency: "Yearly",
    dailyAmount: 0,
    weeklyAmount: 0,
    monthlyAmount: 0,
    yearlyAmount: 5000,
    payments: {},
    status: "Overdue",
  },
];

const periods: ReportPeriod[] = [
  "Daily",
  "Weekly",
  "Monthly",
];

const MONTH_OPTIONS = [
  { value: "2026-09", label: "September 2026" },
  { value: "2026-08", label: "August 2026" },
  { value: "2026-07", label: "July 2026" },
];

const WEEK_OPTIONS = [
  {
    value: "2026-09-28",
    label: "28 Sep – 04 Oct 2026",
  },
  {
    value: "2026-09-21",
    label: "21 – 27 Sep 2026",
  },
  {
    value: "2026-09-14",
    label: "14 – 20 Sep 2026",
  },
];

const DAILY_OPTIONS = [
  { value: "2026-09-30", label: "30 September 2026" },
  { value: "2026-09-29", label: "29 September 2026" },
  { value: "2026-09-28", label: "28 September 2026" },
];

const selectClass =
  "h-10 w-full appearance-none rounded-lg border border-[#d8e2db] bg-white px-3 pr-9 text-sm text-[#466257] outline-none transition focus:border-[#0b4a35] focus:ring-2 focus:ring-[#0b4a35]/10";

const money = (value: number) =>
  value > 0
    ? `₹${value.toLocaleString("en-IN")}`
    : "—";

function statusClass(status: Status) {
  if (status === "Paid") {
    return "border-[#c9dfd5] bg-[#edf7f1] text-[#176044]";
  }

  if (status === "Overdue") {
    return "border-[#f0d0d0] bg-[#fff5f5] text-[#a33a3a]";
  }

  return "border-[#d8e2db] bg-[#f4f7f5] text-[#667a70]";
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

function getMonthDays(month: string) {
  const [year, monthNumber] = month
    .split("-")
    .map(Number);

  const daysInMonth = new Date(
    year,
    monthNumber,
    0,
  ).getDate();

  return Array.from(
    { length: daysInMonth },
    (_, index) => {
      const day = index + 1;
      return {
        key: `${month}-${String(day).padStart(2, "0")}`,
        label: String(day),
        fullLabel: new Date(
          year,
          monthNumber - 1,
          day,
        ).toLocaleDateString("en-IN", {
          weekday: "short",
          day: "2-digit",
        }),
      };
    },
  );
}

function getWeekDays(startDate: string) {
  const start = new Date(`${startDate}T00:00:00`);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    return {
      key,
      label: date.toLocaleDateString("en-IN", {
        weekday: "short",
      }),
      fullLabel: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
    };
  });
}

function getActiveAmount(record: CustomerReport) {
  if (record.frequency === "Daily") {
    return record.dailyAmount;
  }

  if (record.frequency === "Weekly") {
    return record.weeklyAmount;
  }

  if (record.frequency === "Monthly") {
    return record.monthlyAmount;
  }

  return record.yearlyAmount;
}

function getPeriodPayment(
  record: CustomerReport,
  keys: string[],
) {
  return keys.reduce(
    (total, key) =>
      total + (record.payments[key] || 0),
    0,
  );
}

function getMonthLabel(month: string) {
  return (
    MONTH_OPTIONS.find(
      (option) => option.value === month,
    )?.label || month
  );
}

export function ReportsSection() {
  const [period, setPeriod] =
    useState<ReportPeriod>("Monthly");

  const [status, setStatus] = useState<
    "All" | Status
  >("All");

  const [frequency, setFrequency] = useState<
    "All" | CustomerReport["frequency"]
  >("All");

  const [search, setSearch] = useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("2026-09");

  const [selectedWeek, setSelectedWeek] =
    useState("2026-09-28");

  const [selectedDay, setSelectedDay] =
    useState("2026-09-30");

  const dateColumns = useMemo(() => {
    if (period === "Monthly") {
      return getMonthDays(selectedMonth);
    }

    if (period === "Weekly") {
      return getWeekDays(selectedWeek);
    }

    const option = DAILY_OPTIONS.find(
      (item) => item.value === selectedDay,
    );

    return [
      {
        key: selectedDay,
        label: "Day",
        fullLabel:
          option?.label || selectedDay,
      },
    ];
  }, [
    period,
    selectedMonth,
    selectedWeek,
    selectedDay,
  ]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customerReports.filter((record) => {
      const matchesSearch =
        !query ||
        record.customer
          .toLowerCase()
          .includes(query) ||
        record.id.toLowerCase().includes(query) ||
        record.account
          .toLowerCase()
          .includes(query) ||
        record.phone.includes(query);

      const matchesStatus =
        status === "All" ||
        record.status === status;

      const matchesFrequency =
        frequency === "All" ||
        record.frequency === frequency;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesFrequency
      );
    });
  }, [search, status, frequency]);

  const totals = useMemo(() => {
    return filteredRecords.reduce(
      (summary, record) => {
        const paid = getPeriodPayment(
          record,
          dateColumns.map((column) => column.key),
        );

        return {
          expected:
            summary.expected +
            getActiveAmount(record),
          paid: summary.paid + paid,
          customers: summary.customers + 1,
        };
      },
      {
        expected: 0,
        paid: 0,
        customers: 0,
      },
    );
  }, [filteredRecords, dateColumns]);

  const exportExcel = () => {
    /*
     * The export follows the selected view.
     *
     * Monthly:
     *   Customer + account details + 1..30/31 payment columns
     *
     * Weekly:
     *   Customer + account details + 7 date columns
     *
     * Daily:
     *   Customer + account details + selected day payment
     *
     * When no search/status/frequency filter is selected,
     * every customer in customerReports is exported.
     */
    const periodHeaders = dateColumns.map(
      (column) => column.fullLabel,
    );

    const headers = [
      "Customer Name",
      "Customer ID",
      "Phone",
      "Account Number",
      "Scheme",
      "Maturity Date",
      "Frequency",
      "Daily Amount",
      "Weekly Amount",
      "Monthly Amount",
      "Yearly Amount",
      ...periodHeaders,
      "Period Total Paid",
      "Status",
    ];

    const rows = filteredRecords.map((record) => [
      record.customer,
      record.id,
      record.phone,
      record.account,
      record.scheme,
      record.maturityDate,
      record.frequency,
      record.dailyAmount,
      record.weeklyAmount,
      record.monthlyAmount,
      record.yearlyAmount,
      ...dateColumns.map(
        (column) =>
          record.payments[column.key] || 0,
      ),
      getPeriodPayment(
        record,
        dateColumns.map((column) => column.key),
      ),
      record.status,
    ]);

    const escapeCsv = (value: unknown) =>
      `"${String(value).replaceAll('"', '""')}"`;

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) =>
        row.map(escapeCsv).join(","),
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;

    const periodName =
      period === "Monthly"
        ? selectedMonth
        : period === "Weekly"
          ? selectedWeek
          : selectedDay;

    link.download =
      `HisaabSaathi_${period}_Report_${periodName}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      className="mx-auto flex w-full max-w-[1500px] flex-col gap-5"
      aria-labelledby="reports-heading"
    >
      {/* PAGE HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#638076]">
            REPORTS / CUSTOMER COLLECTION
          </p>

          <h1
            id="reports-heading"
            className="mt-1.5 text-3xl font-bold tracking-tight text-[#173b30]"
          >
            Collection{" "}
            <span className="bg-[#b9ec4f] px-1.5">
              reports
            </span>
          </h1>

          <p className="mt-1.5 text-sm text-[#71837a]">
            View every customer payment date-wise,
            just like the collection register.
          </p>
        </div>

        <Button
          type="button"
          onClick={exportExcel}
          className="h-10 w-fit rounded-lg bg-[#0b4a35] px-4 text-sm font-bold text-white shadow-sm hover:bg-[#083d2c]"
        >
          <Download className="size-4" />
          Export Excel
        </Button>
      </header>

      {/* FILTER BAR */}
      <div className="rounded-xl border border-[#d8e2db] bg-white p-3 shadow-[0_2px_8px_rgba(23,59,48,0.04)] sm:p-4">
        <div className="flex flex-col gap-3">
          {/* PERIOD TABS */}
          <div className="flex gap-1 overflow-x-auto border-b border-[#e5ece8] pb-3">
            {periods.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={cn(
                  "shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition",
                  period === item
                    ? "bg-[#0b4a35] text-white"
                    : "text-[#71837a] hover:bg-[#e8f2ed] hover:text-[#173b30]",
                )}
              >
                {item}
              </button>
            ))}
          </div>

          {/* DATE + FILTERS */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(200px,1.35fr)_minmax(180px,1fr)_minmax(150px,0.7fr)_minmax(150px,0.7fr)]">
            {period === "Monthly" && (
              <SelectField
                label="Select Month"
                value={selectedMonth}
                onChange={setSelectedMonth}
                options={MONTH_OPTIONS.map(
                  (item) => item.value,
                )}
                displayOptions={MONTH_OPTIONS.reduce(
                  (map, item) => {
                    map[item.value] = item.label;
                    return map;
                  },
                  {} as Record<string, string>,
                )}
              />
            )}

            {period === "Weekly" && (
              <SelectField
                label="Select Week"
                value={selectedWeek}
                onChange={setSelectedWeek}
                options={WEEK_OPTIONS.map(
                  (item) => item.value,
                )}
                displayOptions={WEEK_OPTIONS.reduce(
                  (map, item) => {
                    map[item.value] = item.label;
                    return map;
                  },
                  {} as Record<string, string>,
                )}
              />
            )}

            {period === "Daily" && (
              <SelectField
                label="Select Date"
                value={selectedDay}
                onChange={setSelectedDay}
                options={DAILY_OPTIONS.map(
                  (item) => item.value,
                )}
                displayOptions={DAILY_OPTIONS.reduce(
                  (map, item) => {
                    map[item.value] = item.label;
                    return map;
                  },
                  {} as Record<string, string>,
                )}
              />
            )}

            <label className="relative md:col-span-1">
              <span className="sr-only">
                Search customer
              </span>

              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#87968f]" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search customer, ID or account..."
                className="h-10 w-full rounded-lg border border-[#d8e2db] bg-white pl-9 pr-3 text-sm text-[#466257] outline-none placeholder:text-[#9aaaA2] focus:border-[#0b4a35] focus:ring-2 focus:ring-[#0b4a35]/10"
              />
            </label>

            <SelectField
              label="Status"
              value={status}
              onChange={(value) =>
                setStatus(value as "All" | Status)
              }
              options={[
                "All",
                "Paid",
                "Due",
                "Overdue",
              ]}
            />

            <SelectField
              label="Frequency"
              value={frequency}
              onChange={(value) =>
                setFrequency(
                  value as
                    | "All"
                    | CustomerReport["frequency"],
                )
              }
              options={[
                "All",
                "Daily",
                "Weekly",
                "Monthly",
                "Yearly",
              ]}
            />
          </div>
        </div>
      </div>

      {/* SIMPLE SUMMARY */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[#d8e2db] pb-3">
        <p className="text-sm font-semibold text-[#173b30]">
          {totals.customers} customers
        </p>

        <p className="text-sm text-[#71837a]">
          Expected{" "}
          <span className="font-semibold text-[#466257]">
            {money(totals.expected)}
          </span>
        </p>

        <p className="text-sm text-[#71837a]">
          Paid in view{" "}
          <span className="font-semibold text-[#176044]">
            {money(totals.paid)}
          </span>
        </p>

        <p className="flex items-center gap-1.5 text-xs text-[#87968f]">
          <CalendarDays className="size-3.5" />
          {period === "Monthly"
            ? getMonthLabel(selectedMonth)
            : period === "Weekly"
              ? WEEK_OPTIONS.find(
                  (item) =>
                    item.value === selectedWeek,
                )?.label
              : DAILY_OPTIONS.find(
                  (item) =>
                    item.value === selectedDay,
                )?.label}
        </p>
      </div>

      {/* REGISTER */}
      <div className="overflow-hidden rounded-xl border border-[#d8e2db] bg-white shadow-[0_2px_8px_rgba(23,59,48,0.04)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#d8e2db] px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-lg font-bold text-[#173b30]">
              Daily collection register
            </h2>

            <p className="mt-0.5 text-xs text-[#87968f]">
              {period === "Monthly"
                ? `Payments from 1 to ${dateColumns.length} · ${getMonthLabel(selectedMonth)}`
                : period === "Weekly"
                  ? "Payment collected on each day of the selected week"
                  : "Payment recorded for the selected date"}
            </p>
          </div>

          <span className="rounded-full bg-[#e8f2ed] px-2.5 py-1 text-xs font-semibold text-[#466257]">
            {filteredRecords.length} customers
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-semibold text-[#173b30]">
              No customer records found
            </p>

            <p className="mt-1 text-xs text-[#87968f]">
              Try changing the search or filters.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP DATE-WISE REGISTER */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#e8f2ed] text-[11px] font-bold uppercase tracking-wide text-[#526b60]">
                    <th className="sticky left-0 z-20 min-w-[250px] border-r border-[#d8e2db] bg-[#e8f2ed] px-4 py-3 text-left">
                      Customer
                    </th>

                    <th className="min-w-[110px] whitespace-nowrap border-r border-[#d8e2db] px-4 py-3 text-left">
                      Account
                    </th>

                    <th className="min-w-[125px] whitespace-nowrap border-r border-[#d8e2db] px-4 py-3 text-left">
                      Maturity
                    </th>

                    <th className="min-w-[100px] whitespace-nowrap border-r border-[#d8e2db] px-4 py-3 text-right">
                      Plan
                    </th>

                    {dateColumns.map((column) => (
                      <th
                        key={column.key}
                        title={column.fullLabel}
                        className="min-w-[58px] border-r border-[#d8e2db] px-2 py-3 text-center"
                      >
                        <span className="block text-xs font-bold text-[#466257]">
                          {column.label}
                        </span>

                        {period !== "Monthly" && (
                          <span className="mt-0.5 block text-[9px] font-medium normal-case text-[#87968f]">
                            {column.fullLabel}
                          </span>
                        )}
                      </th>
                    ))}

                    <th className="min-w-[105px] bg-[#e8f2ed] px-4 py-3 text-right">
                      Total Paid
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.map((record) => (
                    <DateWiseRow
                      key={record.id}
                      record={record}
                      columns={dateColumns}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* TABLET */}
            <div className="hidden overflow-x-auto sm:block lg:hidden">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#e8f2ed] text-[11px] font-bold uppercase tracking-wide text-[#526b60]">
                    <th className="px-4 py-3 text-left">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left">
                      Account
                    </th>
                    <th className="px-4 py-3 text-left">
                      Maturity
                    </th>
                    <th className="px-4 py-3 text-left">
                      Frequency
                    </th>
                    {dateColumns.slice(0, 7).map(
                      (column) => (
                        <th
                          key={column.key}
                          className="px-3 py-3 text-center"
                        >
                          {column.label}
                        </th>
                      ),
                    )}
                    <th className="px-4 py-3 text-right">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-t border-[#e5ece8]"
                    >
                      <td className="px-4 py-4">
                        <p className="font-bold text-[#173b30]">
                          {record.customer}
                        </p>
                        <p className="mt-0.5 text-xs text-[#87968f]">
                          {record.id}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-[#526b60]">
                        {record.account}
                      </td>

                      <td className="px-4 py-4 text-[#71837a]">
                        {record.maturityDate}
                      </td>

                      <td className="px-4 py-4 text-[#526b60]">
                        {record.frequency}
                      </td>

                      {dateColumns
                        .slice(0, 7)
                        .map((column) => (
                          <PaymentCell
                            key={column.key}
                            amount={
                              record.payments[
                                column.key
                              ] || 0
                            }
                            expected={getActiveAmount(
                              record,
                            )}
                          />
                        ))}

                      <td className="px-4 py-4 text-right font-bold text-[#173b30]">
                        {money(
                          getPeriodPayment(
                            record,
                            dateColumns.map(
                              (column) =>
                                column.key,
                            ),
                          ),
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE */}
            <div className="divide-y divide-[#e5ece8] sm:hidden">
              {filteredRecords.map((record) => (
                <MobileCustomerReport
                  key={record.id}
                  record={record}
                  columns={dateColumns}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <p className="text-xs text-[#87968f]">
        Each date is a separate payment column. A dash
        means no payment was recorded on that date. Excel
        export follows the selected Daily, Weekly or Monthly
        view.
      </p>
    </section>
  );
}

/* =========================================================
   DATE-WISE DESKTOP ROW
========================================================= */

function DateWiseRow({
  record,
  columns,
}: {
  record: CustomerReport;
  columns: {
    key: string;
    label: string;
    fullLabel: string;
  }[];
}) {
  const totalPaid = getPeriodPayment(
    record,
    columns.map((column) => column.key),
  );

  return (
    <tr className="border-t border-[#e5ece8] transition hover:bg-[#fbfdfb]">
      <td className="sticky left-0 z-10 border-r border-[#e5ece8] bg-white px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e8f2ed] text-[10px] font-bold text-[#173b30]">
            {initials(record.customer)}
          </div>

          <div className="min-w-0">
            <p className="truncate font-bold text-[#173b30]">
              {record.customer}
            </p>

            <p className="mt-0.5 text-[10px] text-[#87968f]">
              {record.id} · {record.scheme}
            </p>
          </div>
        </div>
      </td>

      <td className="border-r border-[#e5ece8] px-4 py-3.5 font-semibold text-[#526b60]">
        {record.account}
      </td>

      <td className="border-r border-[#e5ece8] px-4 py-3.5 text-xs text-[#71837a]">
        {record.maturityDate}
      </td>

      <td className="border-r border-[#e5ece8] px-4 py-3.5 text-right">
        <p className="font-semibold text-[#173b30]">
          {money(getActiveAmount(record))}
        </p>

        <p className="mt-0.5 text-[9px] text-[#87968f]">
          {record.frequency}
        </p>
      </td>

      {columns.map((column) => (
        <PaymentCell
          key={column.key}
          amount={
            record.payments[column.key] || 0
          }
          expected={getActiveAmount(record)}
        />
      ))}

      <td className="bg-[#f7faf7] px-4 py-3.5 text-right">
        <p className="font-bold tabular-nums text-[#173b30]">
          {money(totalPaid)}
        </p>

        <Badge
          variant="outline"
          className={cn(
            "mt-1 rounded-full px-2 py-0.5 text-[9px] font-bold",
            statusClass(record.status),
          )}
        >
          {record.status}
        </Badge>
      </td>
    </tr>
  );
}

/* =========================================================
   PAYMENT CELL
========================================================= */

function PaymentCell({
  amount,
  expected,
}: {
  amount: number;
  expected: number;
}) {
  const paid = amount > 0;

  return (
    <td
      className={cn(
        "border-r border-[#e5ece8] px-2 py-3 text-center",
        paid
          ? "bg-[#e5f6df]"
          : "bg-[#fff6f6]",
      )}
    >
      <span
        className={cn(
          "text-[11px] font-bold tabular-nums",
          paid
            ? "text-[#176044]"
            : "text-[#b6aaa7]",
        )}
        title={
          paid
            ? `Paid ${money(amount)}`
            : expected > 0
              ? "No payment recorded"
              : "No scheduled amount"
        }
      >
        {paid ? amount.toLocaleString("en-IN") : "·"}
      </span>
    </td>
  );
}

/* =========================================================
   MOBILE CUSTOMER REPORT
========================================================= */

function MobileCustomerReport({
  record,
  columns,
}: {
  record: CustomerReport;
  columns: {
    key: string;
    label: string;
    fullLabel: string;
  }[];
}) {
  const totalPaid = getPeriodPayment(
    record,
    columns.map((column) => column.key),
  );

  return (
    <article className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e8f2ed] text-xs font-bold text-[#173b30]">
            {initials(record.customer)}
          </div>

          <div className="min-w-0">
            <p className="truncate font-bold text-[#173b30]">
              {record.customer}
            </p>

            <p className="mt-0.5 text-[11px] text-[#87968f]">
              {record.id} · Account {record.account}
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className={cn(
            "shrink-0 rounded-full text-[9px] font-bold",
            statusClass(record.status),
          )}
        >
          {record.status}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-b border-[#edf2ee] pb-3">
        <MobileDetail
          label="Maturity"
          value={record.maturityDate}
        />

        <MobileDetail
          label="Plan"
          value={`${money(
            getActiveAmount(record),
          )} / ${record.frequency}`}
        />

        <MobileDetail
          label="Period paid"
          value={money(totalPaid)}
          valueClass="text-[#176044]"
        />

        <MobileDetail
          label="Phone"
          value={record.phone}
        />
      </div>

      <div className="mt-3">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#87968f]">
          {columns.length === 31
            ? "September payment days"
            : "Payment days"}
        </p>

        <div className="grid grid-cols-7 gap-1.5">
          {columns.map((column) => {
            const amount =
              record.payments[column.key] || 0;

            return (
              <div
                key={column.key}
                title={column.fullLabel}
                className={cn(
                  "flex min-h-[42px] flex-col items-center justify-center rounded-md border text-center",
                  amount > 0
                    ? "border-[#cde6c5] bg-[#e5f6df] text-[#176044]"
                    : "border-[#edf0ee] bg-[#fafbfa] text-[#b2bdb8]",
                )}
              >
                <span className="text-[9px] font-semibold">
                  {column.label}
                </span>

                <span className="mt-0.5 text-[9px] font-bold">
                  {amount > 0
                    ? amount.toLocaleString(
                        "en-IN",
                      )
                    : "·"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   SELECT FIELD
========================================================= */

function SelectField({
  label,
  value,
  options,
  displayOptions,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  displayOptions?: Record<string, string>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>

      <select
        aria-label={label}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={selectClass}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {displayOptions?.[option] || option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#87968f]" />
    </label>
  );
}

/* =========================================================
   MOBILE DETAIL
========================================================= */

function MobileDetail({
  label,
  value,
  valueClass = "text-[#173b30]",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-wide text-[#87968f]">
        {label}
      </p>

      <p
        className={cn(
          "mt-0.5 truncate text-xs font-semibold",
          valueClass,
        )}
      >
        {value}
      </p>
    </div>
  );
}

export default ReportsSection;
