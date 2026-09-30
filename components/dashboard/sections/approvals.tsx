"use client";

import { useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock3,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface ApprovalEntry {
  id: number;
  initials: string;
  customer: string;
  staff: string;
  cadence: string;
  amount: string;
  time: string;
}

const approvalEntries: ApprovalEntry[] = [
  {
    id: 1,
    initials: "RK",
    customer: "Ramesh Kumar",
    staff: "Rajesh Meena",
    cadence: "Daily",
    amount: "₹4,500",
    time: "Today, 10:42 AM",
  },
  {
    id: 2,
    initials: "SD",
    customer: "Sunita Devi",
    staff: "Priya Sharma",
    cadence: "Weekly",
    amount: "₹2,800",
    time: "Today, 09:18 AM",
  },
];

export function ApprovalsSection() {
  const [entries, setEntries] =
    useState<ApprovalEntry[]>(approvalEntries);
  const [rejectingEntry, setRejectingEntry] =
    useState<ApprovalEntry | null>(null);

  const totalAmount = useMemo(
    () =>
      entries.reduce(
        (total, entry) =>
          total +
          Number(
            entry.amount.replace(/[₹,\s]/g, ""),
          ),
        0,
      ),
    [entries],
  );

  const removeEntry = (id: number) => {
    setEntries((current) =>
      current.filter((entry) => entry.id !== id),
    );
  };

  const formatAmount = (amount: number) =>
    `₹${amount.toLocaleString("en-IN")}`;

  return (
    <section className="mx-auto w-full pb-8">
      {/* HEADER */}
      <header className="flex flex-col gap-4 border-b border-[#d8e2db] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#638076]">
            ADMIN WORKSPACE / APPROVALS
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#173b30] sm:text-4xl">
            Collection{" "}
            <span className="bg-[#b9ec4f] px-1.5">
              approvals
            </span>
          </h1>

          <p className="mt-1.5 text-sm text-[#71837a]">
            Review staff collections before they are added
            to your books.
          </p>
        </div>
      </header>

      {/* MOBILE TOTAL */}
      <div className="flex items-center justify-between border-b border-[#edf2ee] py-3 sm:hidden">
        <span className="text-xs font-medium text-[#71837a]">
          Pending amount
        </span>
        <span className="text-sm font-bold text-[#173b30]">
          {formatAmount(totalAmount)}
        </span>
      </div>

      {/* LIST HEADER */}
      <div className="mt-5 flex items-center justify-between border-b border-[#d8e2db] pb-3">
        <div>
          <h2 className="text-base font-bold text-[#173b30]">
            Pending collection
          </h2>
          <p className="mt-0.5 text-xs text-[#87968f]">
            {entries.length
              ? `${entries.length} collection submission${entries.length === 1 ? "" : "s"} waiting for review`
              : "No collection submissions waiting"}
          </p>
        </div>

        {entries.length > 0 && (
          <span className="hidden text-xs font-medium text-[#71837a] sm:block">
            Select an action for each entry
          </span>
        )}
      </div>

      {/* NOTIFICATIONS */}
      {entries.length > 0 ? (
        <div>
          {entries.map((entry, index) => (
            <ApprovalNotification
              key={entry.id}
              entry={entry}
              isLast={index === entries.length - 1}
              onApprove={() => removeEntry(entry.id)}
              onReject={() => setRejectingEntry(entry)}
            />
          ))}
        </div>
      ) : (
        <EmptyApprovals />
      )}

      {rejectingEntry && (
        <RejectConfirmation
          entry={rejectingEntry}
          onCancel={() => setRejectingEntry(null)}
          onConfirm={() => {
            removeEntry(rejectingEntry.id);
            setRejectingEntry(null);
          }}
        />
      )}
    </section>
  );
}

/* =========================================================
   SIMPLE NOTIFICATION ROW
========================================================= */

function ApprovalNotification({
  entry,
  isLast,
  onApprove,
  onReject,
}: {
  entry: ApprovalEntry;
  isLast: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <article
      className={`group py-5 ${!isLast ? "border-b border-[#e5ece8]" : ""
        }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e8f2ed] text-xs font-bold text-[#173b30] ring-1 ring-[#d8e2db]">
            {entry.initials}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-bold text-[#173b30] sm:text-base">
                {entry.customer}
              </h3>

              <span className="rounded-full bg-[#e8f2ed] px-2 py-0.5 text-[10px] font-bold text-[#466257]">
                {entry.cadence}
              </span>
            </div>

            <p className="mt-1 text-sm text-[#71837a]">
              Collected by{" "}
              <span className="font-semibold text-[#526b60]">
                {entry.staff}
              </span>
            </p>

            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#87968f]">
              <Clock3 className="size-3" />
              {entry.time}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[#edf2ee] pt-3 sm:justify-end sm:border-t-0 sm:pt-0 lg:min-w-[390px]">
          <div className="sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#87968f]">
              Collection amount
            </p>

            <p className="mt-0.5 text-lg font-bold tabular-nums text-[#173b30]">
              {entry.amount}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReject}
              className="h-9 rounded-lg border-[#d8e2db] bg-white px-3.5 text-xs font-bold text-[#587067] hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <X className="size-3.5" />
              Reject
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={onApprove}
              className="h-9 rounded-lg bg-[#b9ec4f] px-3.5 text-xs font-bold text-[#173b30] shadow-sm hover:bg-[#c7f467]"
            >
              <Check className="size-3.5" />
              Approve
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyApprovals() {
  return (
    <div className="flex flex-col items-center justify-center border-b border-[#e5ece8] py-16 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-[#e8f2ed] text-[#0b4a35]">
        <CheckCircle2 className="size-6" />
      </div>

      <h3 className="mt-4 text-base font-bold text-[#173b30]">
        All caught up
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-6 text-[#71837a]">
        There are no collection entries waiting for
        approval.
      </p>
    </div>
  );
}


/* =========================================================
   REJECT CONFIRMATION
========================================================= */

function RejectConfirmation({
  entry,
  onCancel,
  onConfirm,
}: {
  entry: ApprovalEntry;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173b30]/40 p-4 backdrop-blur-xl backdrop-saturate-50">
      <button
        type="button"
        aria-label="Close rejection confirmation"
        onClick={onCancel}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-0 bg-white shadow-[0_24px_80px_rgba(10,45,34,0.28)]">
        <div className="border-b border-[#d8e2db] bg-[#f7faf7] px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#638076]">
                REVIEW COLLECTION
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#173b30]">
                Reject collection?
              </h2>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="size-8 rounded-lg text-[#71837a] hover:bg-[#e8f2ed] hover:text-[#173b30]"
              aria-label="Close"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <p className="text-sm leading-6 text-[#71837a]">
            You are about to reject the collection submitted
            for{" "}
            <span className="font-bold text-[#173b30]">
              {entry.customer}
            </span>
            . This entry will not be added to the books.
          </p>

          <div className="mt-4 rounded-xl border border-[#d8e2db] bg-[#f7faf7] px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#173b30]">
                  {entry.customer}
                </p>

                <p className="mt-0.5 text-xs text-[#87968f]">
                  Collected by {entry.staff}
                </p>
              </div>

              <p className="text-base font-bold tabular-nums text-[#173b30]">
                {entry.amount}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#d8e2db] p-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-10 border-[#d8e2db] text-[#587067]"
          >
            Keep for review
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            className="h-10 bg-[#173b30] px-5 font-bold text-white hover:bg-[#0b4a35]"
          >
            Reject collection
          </Button>
        </div>
      </div>
    </div>
  );
}


export default ApprovalsSection;
