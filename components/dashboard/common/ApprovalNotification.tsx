import { Button } from "@/components/ui/button";
import { Check, Clock3, X } from "lucide-react";

interface ApprovalEntry {
  id: number;
  initials: string;
  customer: string;
  staff: string;
  cadence: string;
  amount: string;
  time: string;
};

export default function ApprovalNotification({
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
      className={`flex flex-col gap-4 px-4 py-4 transition-colors hover:bg-[var(--hs-hover)] sm:px-5 sm:py-5 lg:flex-row lg:items-center ${!isLast ? "border-b border-[var(--hs-border-light)]" : ""
        }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--hs-primary-light)] text-xs font-bold text-[var(--hs-primary)]">
          {entry.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--hs-text)] sm:text-base">
              {entry.customer}
            </h3>
            <span className="rounded-md bg-[var(--hs-background)] px-2 py-0.5 text-[11px] font-medium text-[var(--hs-text-secondary)]">
              {entry.cadence} collection
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--hs-warning-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--hs-warning)]">
              <span className="size-1.5 rounded-full bg-[var(--hs-warning)]" />
              Pending review
            </span>
          </div>

          <p className="mt-1 text-sm text-[var(--hs-text-secondary)]">
            Collected by <span className="font-medium text-[var(--hs-text)]">{entry.staff}</span>
          </p>

          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--hs-text-muted)]">
            <Clock3 className="size-3.5" />
            Submitted {entry.time}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--hs-border-light)] pt-3 sm:flex-row sm:items-center sm:justify-between lg:border-0 lg:pt-0">
        <div className="sm:min-w-28 sm:text-right">
          <p className="text-[11px] text-[var(--hs-text-muted)]">Collection amount</p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-[var(--hs-text)]">
            {entry.amount}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReject}
            className="h-9 rounded-lg border border-[var(--hs-danger)]/30 bg-[var(--hs-white)] px-3.5 text-xs font-semibold text-[var(--hs-danger)] hover:bg-[var(--hs-danger-light)]"
          >
            <X className="mr-1 size-3.5" />
            Reject
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onApprove}
            className="h-9 rounded-lg bg-[var(--hs-primary)] px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--hs-primary-dark)]"
          >
            <Check className="mr-1 size-3.5" />
            Approve
          </Button>
        </div>
      </div>
    </article>
  );
}