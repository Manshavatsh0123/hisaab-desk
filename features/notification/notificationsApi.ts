import { baseApi } from "@/lib/baseApi";

export interface AdminNotification {
  id: string;
  recipient_id: string;
  payment_id: string | null;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  success: boolean;
  message?: string;
  notifications: AdminNotification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaymentActionResponse {
  success: boolean;
  message?: string;
  payment?: {
    id: string;
    status: string;
    amount?: number | string;
    payment_date?: string;
    receipt_number?: string | null;
    rejection_reason?: string | null;
    [key: string]: unknown;
  };
}

export interface MarkNotificationReadResponse {
  success: boolean;
  message?: string;
  notification?: AdminNotification;
}

export interface GetNotificationsParams {
  unread_only?: boolean;
  page?: number;
  limit?: number;
}

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query<
      NotificationsResponse,
      GetNotificationsParams | void
    >({
      query: (params) => ({
        url: "/admin/notifications",
        method: "GET",
        params: {
          unread_only: params?.unread_only ? "true" : "false",
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
        },
      }),
      providesTags: (result) => [
        { type: "Approval", id: "LIST" },
        ...(result?.notifications ?? []).map((notification) => ({
          type: "Approval" as const,
          id: notification.id,
        })),
      ],
    }),

    approveAdminCollection: builder.mutation<PaymentActionResponse, string>({
      query: (paymentId) => ({
        url: `/admin/collections/${encodeURIComponent(paymentId)}/approve`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Approval", id: "LIST" }],
    }),

    rejectAdminCollection: builder.mutation<
      PaymentActionResponse,
      { paymentId: string; rejection_reason: string }
    >({
      query: ({ paymentId, rejection_reason }) => ({
        url: `/admin/collections/${encodeURIComponent(paymentId)}/reject`,
        method: "POST",
        body: { rejection_reason },
      }),
      invalidatesTags: [{ type: "Approval", id: "LIST" }],
    }),

    markNotificationAsRead: builder.mutation<
      MarkNotificationReadResponse,
      string
    >({
      query: (notificationId) => ({
        url: `/admin/notifications/${encodeURIComponent(notificationId)}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, notificationId) => [
        { type: "Approval", id: "LIST" },
        { type: "Approval", id: notificationId },
      ],
    }),
  }),
});

export const {
  useGetAdminNotificationsQuery,
  useLazyGetAdminNotificationsQuery,
  useApproveAdminCollectionMutation,
  useRejectAdminCollectionMutation,
  useMarkNotificationAsReadMutation,
} = notificationsApi;
