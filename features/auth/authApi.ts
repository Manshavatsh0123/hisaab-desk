
import { baseApi } from "@/lib/baseApi";

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success?: boolean;
  message?: string;
  session?: {
    access_token?: string;
  };
  [key: string]: unknown;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<
      AdminLoginResponse,
      AdminLoginRequest
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useAdminLoginMutation } = authApi;
