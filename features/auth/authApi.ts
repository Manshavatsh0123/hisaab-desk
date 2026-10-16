
import { baseApi } from "@/lib/baseApi";

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  token_type?: string;
}

export interface AdminLoginResponse {
  success?: boolean;
  message?: string;
  user?: {
    id?: string;
    email?: string;
  };
  profile?: {
    id?: string;
    role?: string;
    username?: string;
    full_name?: string;
    status?: string;
  };
  session?: AuthSession;
  [key: string]: unknown;
}

export interface RefreshSessionRequest {
  refresh_token: string;
}

export interface RefreshSessionResponse {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  token_type?: string;
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

    refreshSession: builder.mutation<
      RefreshSessionResponse,
      RefreshSessionRequest
    >({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useAdminLoginMutation,
  useRefreshSessionMutation,
} = authApi;
