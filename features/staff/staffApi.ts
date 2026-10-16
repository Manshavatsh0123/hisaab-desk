import { baseApi } from "@/lib/baseApi";

export interface CreateStaffRequest {
  full_name: string;
  username: string;
  phone?: string | null;
  password: string;
}

export interface StaffRecord {
  id: string;
  user_id: string;
  staff_code: string;
  full_name: string | null;
  username: string | null;
  phone: string | null;
  role: string;
  status: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface StaffListResponse {
  success: boolean;
  message?: string;
  staff: StaffRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateStaffResponse {
  success: boolean;
  message?: string;
  staff?: StaffRecord;
}

export interface StaffListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStaff: builder.query<StaffListResponse, StaffListParams | void>({
      query: (params) => ({
        url: "/admin/staff",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 100,
          ...(params?.search?.trim() ? { search: params.search.trim() } : {}),
          ...(params?.status && params.status !== "All"
            ? { status: params.status.toUpperCase() }
            : {}),
        },
      }),
      providesTags: (result) => [
        { type: "Staff", id: "LIST" },
        ...(result?.staff ?? []).map((staff) => ({
          type: "Staff" as const,
          id: staff.id,
        })),
      ],
    }),

    createStaff: builder.mutation<CreateStaffResponse, CreateStaffRequest>({
      query: (body) => ({
        url: "/staff",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Staff", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAdminStaffQuery,
  useLazyGetAdminStaffQuery,
  useCreateStaffMutation,
} = staffApi;
