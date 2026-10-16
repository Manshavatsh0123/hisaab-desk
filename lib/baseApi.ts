
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api";

export const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const AUTH_KEYS = {
  access: "hisaabsaathi_token",
  refresh: "hisaabsaathi_refresh_token",
  user: "hisaabsaathi_user",
  startedAt: "hisaabsaathi_session_started_at",
  expiresAt: "hisaabsaathi_token_expires_at",
} as const;

function clearStoredSession() {
  if (typeof window === "undefined") return;

  Object.values(AUTH_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

function sessionHasExpired(): boolean {
  if (typeof window === "undefined") return true;

  const startedAt = Number(
    localStorage.getItem(AUTH_KEYS.startedAt),
  );

  if (!startedAt || !Number.isFinite(startedAt)) return true;

  return Date.now() - startedAt >= SESSION_MAX_AGE_MS;
}

function saveTokens(session: {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
}) {
  localStorage.setItem(AUTH_KEYS.access, session.access_token);
  localStorage.setItem(AUTH_KEYS.refresh, session.refresh_token);

  const expiresAt =
    session.expires_at ??
    (session.expires_in
      ? Math.floor(Date.now() / 1000) + session.expires_in
      : undefined);

  if (expiresAt) {
    localStorage.setItem(
      AUTH_KEYS.expiresAt,
      String(expiresAt),
    );
  } else {
    localStorage.removeItem(AUTH_KEYS.expiresAt);
  }
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl,

  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(AUTH_KEYS.access);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return headers;
  },
});

let refreshPromise: Promise<boolean> | null = null;

const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const requestUrl =
    typeof args === "string" ? args : args.url;

  const isAuthRequest =
    requestUrl.includes("/auth/login") ||
    requestUrl.includes("/auth/refresh");

  if (
    typeof window !== "undefined" &&
    !isAuthRequest &&
    localStorage.getItem(AUTH_KEYS.access) &&
    sessionHasExpired()
  ) {
    clearStoredSession();
    api.dispatch(baseApi.util.resetApiState());

    return {
      error: {
        status: 401,
        data: { message: "Your session expired. Please log in again." },
      },
    };
  }

  let result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.error?.status !== 401 ||
    isAuthRequest ||
    typeof window === "undefined"
  ) {
    return result;
  }

  const refreshToken = localStorage.getItem(AUTH_KEYS.refresh);

  if (!refreshToken) {
    clearStoredSession();
    api.dispatch(baseApi.util.resetApiState());
    return result;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshResult = await rawBaseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.error || !refreshResult.data) {
        clearStoredSession();
        api.dispatch(baseApi.util.resetApiState());
        return false;
      }

      const data = refreshResult.data as {
        access_token?: string;
        refresh_token?: string;
        expires_at?: number;
        expires_in?: number;
      };

      if (!data.access_token || !data.refresh_token) {
        clearStoredSession();
        api.dispatch(baseApi.util.resetApiState());
        return false;
      }

      saveTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
        expires_in: data.expires_in,
      });

      return true;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  const refreshed = await refreshPromise;

  if (!refreshed) return result;

  // Retry the original request once with the new access token.
  result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    clearStoredSession();
    api.dispatch(baseApi.util.resetApiState());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    "Staff",
    "Customer",
    "Collection",
    "Approval",
    "Notification",
  ],
  endpoints: () => ({}),
});

export { clearStoredSession, saveTokens };
