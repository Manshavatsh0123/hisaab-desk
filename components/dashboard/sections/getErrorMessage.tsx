export default function getErrorMessage(error: unknown) {

  if (!error || typeof error !== "object") return "Unable to load dashboard data.";

  const value = error as {
    status?: string | number;
    data?: { message?: string; error?: string };
    error?: string;
  };

  if (value.data?.message) return value.data.message;
  if (value.data?.error) return value.data.error;
  if (value.status === 401) return "Your session has expired. Please sign in again.";
  if (value.status === 403) return "You do not have permission to view the admin dashboard.";
  if (value.status === "FETCH_ERROR") return "Cannot connect to the backend. Check that your API server is running.";
  return value.error || "Unable to load dashboard data.";
}