import { baseApi } from "@/lib/baseApi";

export interface DashboardSummary {
  total_customers: number;
  total_staff: number;
  total_accounts: number;
  today: {
    date: string;
    collection_amount: number;
  };
  collections: {
    approved_amount: number;
    pending_amount: number;
    rejected_amount: number;
    reversed_amount: number;
  };
}

export interface DashboardSummaryResponse {
  success: boolean;
  summary: DashboardSummary;
}

export interface RecentCollection {
  id: string;
  customer: {
    id: string;
    customer_code: string | null;
    name: string | null;
  } | null;
  account: {
    id: string;
    account_number: string | null;
    scheme: string | null;
    account_name: string | null;
  } | null;
  amount: number;
  payment_date: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "REVERSED" | string;
  receipt_number: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  reversed_at: string | null;
  created_at: string;
}

export interface RecentCollectionsResponse {
  success: boolean;
  collections: RecentCollection[];
}

export interface RecentNotification {
  id: string;
  recipient_id: string | null;
  payment_id: string | null;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface RecentNotificationsResponse {
  success: boolean;
  notifications: RecentNotification[];
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummaryResponse, void>({
      query: () => "/admin/dashboard/summary",
    }),

    getRecentCollections: builder.query<RecentCollectionsResponse, void>({
      query: () => "/admin/dashboard/recent-collections",
    }),

    getRecentNotifications: builder.query<RecentNotificationsResponse, void>({
      query: () => "/admin/dashboard/recent-notifications",
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetRecentCollectionsQuery,
  useGetRecentNotificationsQuery,
} = dashboardApi;
