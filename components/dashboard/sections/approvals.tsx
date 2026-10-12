"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "../common/PageHeader";
import EmptyApprovals from "../common/EmptyApprovals";
import ApprovalNotification from "../common/ApprovalNotification";
import RejectConfirmation from "../common/RejectConfirmation";

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

  const [entries, setEntries] = useState<ApprovalEntry[]>(approvalEntries);
  const [rejectingEntry, setRejectingEntry] = useState<ApprovalEntry | null>(null);

  const totalAmount = useMemo(() =>
    entries.reduce((total, entry) => total + Number(entry.amount.replace(/[₹,\s]/g, ""),), 0,),
    [entries],
  );

  const removeEntry = (id: number) => {
    setEntries((current) => current.filter((entry) => entry.id !== id),
    );
  };

  const formatAmount = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;


  return (

    <section className="mx-auto w-full space-y-6 pb-8">
      <div className=" px-[var(--hs-page-padding-x)] py-[var(--hs-page-padding-y)] ">

        <PageHeader
          eyebrow="Admin workspace / Approvals"
          title="Collection"
          highlight="approvals"
          subtitle="Review staff collections before adding them to your records."
        />

        <div className="flex items-center justify-between gap-3 border-b border-[var(--hs-border)] bg-[var(--hs-surface)] px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-base font-bold text-[var(--hs-text)]">
              Pending collection
            </h2>

            <p className="mt-0.5 text-xs text-[var(--hs-text-muted)]">
              {entries.length
                ? `${entries.length} collection submission${entries.length === 1 ? "" : "s"} waiting for review`
                : "No collection submissions waiting"}
            </p>
          </div>



          {entries.length > 0 && (
            <span className="hidden text-xs font-medium text-[var(--hs-text-secondary)] sm:block">
              Select an action for each entry
            </span>
          )}

        </div>


        {entries.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-[var(--hs-border)] bg-[var(--hs-surface)]">
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
      </div>
    </section>
  );
}

export default ApprovalsSection;
