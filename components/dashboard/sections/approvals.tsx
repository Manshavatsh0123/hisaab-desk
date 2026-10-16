"use client";

import { useCallback, useMemo, useState } from "react";
import {
  AlertCircle,
  Bell,
  Check,
  Clock3,
  RefreshCw,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "../common/PageHeader";

import {
  useApproveAdminCollectionMutation,
  useGetAdminNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useRejectAdminCollectionMutation,
  type AdminNotification,
} from "../../../features/notification/notificationsApi";
import RejectDialog from "../common/RejectDialog";
import EmptyState from "./EmptyState";
import NotificationItem from "../common/NotificationItem";

const POLLING_INTERVAL = 15_000;
const PAGE_SIZE = 20;

function getErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Something went wrong. Please try again.";
  }

  const value = error as {
    status?: string | number;
    data?: { message?: string; error?: string };
    error?: string;
    message?: string;
  };

  if (value.data?.message) return value.data.message;
  if (value.data?.error) return value.data.error;
  if (value.status === 401) return "Your session has expired. Please sign in again.";
  if (value.status === 403) return "You do not have permission to perform this action.";
  if (value.status === "FETCH_ERROR") return "Cannot connect to the server. Check that the backend is running.";

  return value.message || value.error || "Request failed. Please try again.";
}

export function ApprovalsSection() {
  const [page, setPage] = useState(1);
  const [rejectingNotification, setRejectingNotification] =
    useState<AdminNotification | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [busyNotificationId, setBusyNotificationId] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const { data, isLoading, isFetching, error, refetch } =
    useGetAdminNotificationsQuery(
      { page, limit: PAGE_SIZE, unread_only: false },
      {
        pollingInterval: POLLING_INTERVAL,
        refetchOnFocus: true,
        refetchOnReconnect: true,
      }
    );

  const [approveCollection] = useApproveAdminCollectionMutation();
  const [rejectCollection, rejectState] = useRejectAdminCollectionMutation();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  const notifications = useMemo(
    () => (data?.notifications ?? []).filter((item) => !dismissedIds.includes(item.id)),
    [data?.notifications, dismissedIds]
  );

  const pagination = data?.pagination;
  const unreadCount = notifications.filter((item) => !item.is_read).length;
  const apiError = error ? getErrorMessage(error) : "";

  const markRead = useCallback(
    async (notification: AdminNotification) => {
      if (notification.is_read) return;
      try {
        // Read state is independent from payment state; never dismiss here.
        await markNotificationAsRead(notification.id).unwrap();
      } catch {
        // Keep the notification visible if this secondary action fails.
      }
    },
    [markNotificationAsRead]
  );

  async function approve(notification: AdminNotification) {
    if (busyNotificationId) return;

    if (!notification.payment_id) {
      setActionError("This notification has no linked payment and cannot be approved.");
      return;
    }

    setActionError("");
    setSuccessMessage("");
    setBusyNotificationId(notification.id);

    try {
      const response = await approveCollection(notification.payment_id).unwrap();
      if (!response.success) throw new Error(response.message || "Payment approval failed.");

      setDismissedIds((current) =>
        current.includes(notification.id) ? current : [...current, notification.id]
      );
      setSuccessMessage(response.message || "Collection approved successfully.");

      void markRead(notification);
      await refetch();
    } catch (requestError) {
      setActionError(getErrorMessage(requestError));
      await refetch();
    } finally {
      setBusyNotificationId(null);
    }
  }

  async function confirmReject() {
    const notification = rejectingNotification;

    if (busyNotificationId) return;

    if (!notification?.payment_id) {
      setActionError("This notification has no linked payment and cannot be rejected.");
      return;
    }

    if (!rejectionReason.trim()) {
      setActionError("Please enter a rejection reason.");
      return;
    }

    setActionError("");
    setSuccessMessage("");
    setBusyNotificationId(notification.id);

    try {
      const response = await rejectCollection({
        paymentId: notification.payment_id,
        rejection_reason: rejectionReason.trim(),
      }).unwrap();

      if (!response.success) throw new Error(response.message || "Payment rejection failed.");

      setDismissedIds((current) =>
        current.includes(notification.id) ? current : [...current, notification.id]
      );
      setRejectingNotification(null);
      setRejectionReason("");
      setSuccessMessage(response.message || "Collection rejected successfully.");

      void markRead(notification);
      await refetch();
    } catch (requestError) {
      setActionError(getErrorMessage(requestError));
      await refetch();
    } finally {
      setBusyNotificationId(null);
    }
  }

  return (
    <section className="mx-auto w-full min-w-0 pb-8">
      <div className="px-[var(--hs-page-padding-x)] py-[var(--hs-page-padding-y)]">
        <PageHeader
          eyebrow="Admin workspace / Approvals"
          title="Collection"
          highlight="approvals"
          subtitle="Review pending staff collections before they are added to your records."
        />

        <section className="mt-6 overflow-hidden rounded-xl border border-[var(--hs-border)] bg-white">
          <header className="flex flex-col gap-3 border-b border-[var(--hs-border-light)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--hs-primary-light)] text-[var(--hs-primary)]">
                <Bell className="size-[18px]" />
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-[var(--hs-text)]">
                  Pending collections
                </h2>
                <p className="mt-1 text-xs text-[var(--hs-text-secondary)]">
                  {pagination?.total ?? notifications.length} awaiting review
                  {" · "}
                  {unreadCount} new
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 text-xs text-[var(--hs-success)] sm:inline-flex">
                <span className="size-1.5 rounded-full bg-[var(--hs-success)]" />
                Live updates
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={() => void refetch()}
                disabled={isFetching}
                className="h-9 rounded-lg border-[var(--hs-border)] px-3 text-xs font-semibold text-[var(--hs-text)]"
              >
                <RefreshCw className={`mr-1.5 size-3.5 ${isFetching ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </header>

          {(actionError || apiError || successMessage) && (
            <div className="space-y-2 px-4 pt-3 sm:px-5">
              {(actionError || apiError) && (
                <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <div className="min-w-0 flex-1">{actionError || apiError}</div>
                  <button type="button" onClick={() => setActionError("")} aria-label="Dismiss error">
                    <X className="size-4" />
                  </button>
                </div>
              )}
              {successMessage && (
                <div role="status" className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                  <Check className="mt-0.5 size-4 shrink-0" />
                  {successMessage}
                </div>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-5 py-14 text-sm text-[var(--hs-text-secondary)]">
              <RefreshCw className="size-4 animate-spin" />
              Loading notifications...
            </div>
          ) : apiError && notifications.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-[var(--hs-text-secondary)]">Could not load notifications.</p>
              <Button type="button" variant="outline" onClick={() => void refetch()} className="mt-3 h-9 rounded-lg">
                Try again
              </Button>
            </div>
          ) : notifications.length ? (
            <div className="divide-y divide-[var(--hs-border-light)]">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  busy={busyNotificationId === notification.id}
                  onMarkRead={() => void markRead(notification)}
                  onApprove={() => void approve(notification)}
                  onReject={() => {
                    setActionError("");
                    setRejectingNotification(notification);
                    setRejectionReason("");
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}

          {pagination && pagination.totalPages > 1 && (
            <footer className="flex flex-col gap-3 border-t border-[var(--hs-border-light)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-[var(--hs-text-secondary)]">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="h-9 rounded-lg text-xs"
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={page >= pagination.totalPages || isFetching}
                  onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
                  className="h-9 rounded-lg text-xs"
                >
                  Next
                </Button>
              </div>
            </footer>
          )}
        </section>
      </div>

      {rejectingNotification && (
        <RejectDialog
          notification={rejectingNotification}
          reason={rejectionReason}
          onReasonChange={setRejectionReason}
          onCancel={() => {
            if (rejectState.isLoading || busyNotificationId) return;
            setRejectingNotification(null);
            setRejectionReason("");
            setActionError("");
          }}
          onConfirm={() => void confirmReject()}
          submitting={rejectState.isLoading || busyNotificationId === rejectingNotification.id}
          error={actionError}
        />
      )}
    </section>
  );
}

export default ApprovalsSection;
