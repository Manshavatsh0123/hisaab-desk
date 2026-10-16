import { Button } from "@/components/ui/button";
import { Check, Clock3, RefreshCw, Wallet, X } from "lucide-react";
import StatusDot from "./StatusDot";
import { AdminNotification } from "@/features/notification/notificationsApi";
import parseNotificationMessage from "./parseNotificationMessage";

function formatDateTime(value?: string | null) {
    if (!value) return "Time unavailable";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Time unavailable";

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function NotificationItem({
    notification,
    busy,
    onMarkRead,
    onApprove,
    onReject,
}: {
    notification: AdminNotification;
    busy: boolean;
    onMarkRead: () => void;
    onApprove: () => void;
    onReject: () => void;
}) {
    const details = parseNotificationMessage(notification.message);
    const unread = !notification.is_read;

    return (
        <article
            className={`relative flex min-w-0 flex-col gap-3 px-4 py-4 transition-colors sm:px-5 md:flex-row md:items-center md:gap-4 ${unread ? "bg-[var(--hs-primary-light)]/35" : "bg-white"
                }`}
        >
            {unread && (
                <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 top-0 w-[3px] bg-[var(--hs-primary)]"
                />
            )}

            <div className="flex min-w-0 flex-1 items-start gap-3">
                <span
                    className={`grid size-10 shrink-0 place-items-center rounded-full ${unread
                            ? "bg-white text-[var(--hs-primary)]"
                            : "bg-[var(--hs-background)] text-[var(--hs-text-secondary)]"
                        }`}
                >
                    <Wallet aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="text-sm font-semibold text-[var(--hs-text)]">
                            {notification.title || "New collection"}
                        </h3>
                        <StatusDot unread={unread} />
                    </div>

                    <p className="mt-1 break-words text-sm leading-5 text-[var(--hs-text-secondary)]">
                        <span className="font-medium text-[var(--hs-text)]">{details.agent}</span>
                        {" submitted a collection for "}
                        <span className="font-medium text-[var(--hs-text)]">{details.customer}</span>
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--hs-text-muted)]">
                        <span className="inline-flex items-center gap-1">
                            <Clock3 aria-hidden="true" className="size-3.5" />
                            {formatDateTime(notification.created_at)}
                        </span>

                        {unread && (
                            <button
                                type="button"
                                onClick={onMarkRead}
                                disabled={busy}
                                className="font-medium text-[var(--hs-primary)] underline-offset-2 hover:underline disabled:opacity-50"
                            >
                                Mark as seen
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex min-w-0 flex-col gap-3 border-t border-[var(--hs-border-light)] pt-3 md:w-auto md:shrink-0 md:flex-row md:items-center md:border-0 md:pt-0">
                {details.amount && (
                    <div className="flex items-baseline justify-between gap-3 md:block md:min-w-[82px] md:text-right">
                        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--hs-text-muted)] md:hidden">
                            Amount
                        </span>
                        <span className="text-lg font-bold tabular-nums text-[var(--hs-text)]">
                            {details.amount}
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-2 md:flex">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={busy || !notification.payment_id}
                        onClick={onReject}
                        className="h-9 rounded-lg border-[var(--hs-primary-border)] bg-white px-3 text-xs font-semibold text-[var(--hs-primary)] hover:bg-[var(--hs-primary-light)] disabled:opacity-50"
                    >
                        <X aria-hidden="true" className="mr-1.5 size-3.5" />
                        Reject
                    </Button>

                    <Button
                        type="button"
                        disabled={busy || !notification.payment_id}
                        onClick={onApprove}
                        className="h-9 rounded-lg bg-[var(--hs-primary)] px-3 text-xs font-semibold !text-white hover:bg-[var(--hs-primary-dark)] disabled:opacity-50"
                    >
                        {busy ? (
                            <RefreshCw aria-hidden="true" className="mr-1.5 size-3.5 animate-spin" />
                        ) : (
                            <Check aria-hidden="true" className="mr-1.5 size-3.5" />
                        )}
                        {busy ? "Please wait" : "Approve"}
                    </Button>
                </div>
            </div>
        </article>
    );
}