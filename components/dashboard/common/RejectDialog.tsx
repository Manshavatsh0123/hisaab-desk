import { Button } from "@/components/ui/button";
import { AdminNotification } from "@/features/notification/notificationsApi";
import { AlertCircle, X } from "lucide-react";
import parseNotificationMessage from "./parseNotificationMessage";


export default function RejectDialog({
  notification,
  reason,
  onReasonChange,
  onCancel,
  onConfirm,
  submitting,
  error,
}: {
  notification: AdminNotification;
  reason: string;
  onReasonChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  submitting: boolean;
  error: string;
}) {
  const details = parseNotificationMessage(notification.message);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-3 backdrop-blur-sm sm:p-4">
      <button
        type="button"
        aria-label="Close rejection dialog"
        onClick={onCancel}
        disabled={submitting}
        className="absolute inset-0 cursor-default"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-dialog-title"
        className="relative my-auto max-h-[95dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--hs-border)] bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--hs-border-light)] p-5">
          <div>
            <h2 id="reject-dialog-title" className="text-lg font-bold text-[var(--hs-text)]">
              Reject collection
            </h2>
            <p className="mt-1 text-sm text-[var(--hs-text-secondary)]">
              Add a short reason for the collection agent.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg p-1.5 text-[var(--hs-text-muted)] hover:bg-[var(--hs-background)]"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-xl bg-[var(--hs-background)] p-3 text-sm">
            <p className="font-semibold text-[var(--hs-text)]">{details.customer}</p>
            <p className="mt-1 text-[var(--hs-text-secondary)]">
              Collected by {details.agent}
              {details.amount ? ` · ${details.amount}` : ""}
            </p>
          </div>

          <div>
            <label htmlFor="rejection-reason" className="mb-2 block text-sm font-medium text-[var(--hs-text)]">
              Rejection reason <span className="text-[var(--hs-primary)]">*</span>
            </label>
            <textarea
              id="rejection-reason"
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              placeholder="Enter reason..."
              rows={4}
              maxLength={1000}
              disabled={submitting}
              className="w-full resize-y rounded-lg border border-[var(--hs-border)] px-3 py-2.5 text-sm text-[var(--hs-text)] outline-none placeholder:text-[var(--hs-text-muted)] focus:border-[var(--hs-primary)] focus:ring-2 focus:ring-[var(--hs-primary)]/10 disabled:opacity-60"
            />
            <p className="mt-1 text-right text-xs text-[var(--hs-text-muted)]">
              {reason.length}/1000
            </p>
          </div>

          {error && (
            <p role="alert" className="flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[var(--hs-border-light)] p-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting} className="h-9 rounded-lg">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={submitting || !reason.trim()}
            className="h-9 rounded-lg bg-[var(--hs-primary)] px-4 font-semibold !text-white hover:bg-[var(--hs-primary-dark)] disabled:opacity-50"
          >
            {submitting ? "Rejecting..." : "Confirm rejection"}
          </Button>
        </div>
      </section>
    </div>
  );
}

