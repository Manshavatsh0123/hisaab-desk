"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  IndianRupee,
  Plus,
  RefreshCw,
  Search,
  Users,
  Wallet,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../common/PageHeader";
import SelectControl from "../common/SelectControl";
import StaffDetail from "../common/StaffDetail";
import CreateAgentModal from "../common/CreateAgentModal";
import StaffCard from "./StaffCard";
import StaffTableRow from "../common/StaffTableRow";
import EmptyState from "../common/EmptyState";
import TableHead from "../common/TableHead";
import {
  useCreateStaffMutation,
  useGetAdminStaffQuery,
  type StaffRecord,
} from "@/features/staff/staffApi";

interface StaffMember {
  id: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  status: "Active" | "Inactive";
  createdDate: string;
  totalCollection: number;
  pendingApproval: number;
  todayCollection: number;
}

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  status: "Active" as StaffMember["status"],
};

function formatCreatedDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function mapStaffRecord(record: StaffRecord): StaffMember {
  return {
    id: record.staff_code || record.id,
    name: record.full_name || "Unnamed staff",
    username: record.username || "—",
    phone: record.phone || "—",
    // The current GET API does not return email or collection statistics.
    email: "",
    status: record.status?.toUpperCase() === "ACTIVE" ? "Active" : "Inactive",
    createdDate: formatCreatedDate(record.created_at),
    totalCollection: 0,
    pendingApproval: 0,
    todayCollection: 0,
  };
}

function getApiErrorMessage(error: unknown): string {
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
  if (value.status === 401) {
    return "Your session has expired. Please sign in again.";
  }
  if (value.status === 403) {
    return "Only an authenticated admin can manage staff.";
  }
  if (value.status === 409) {
    return "This username already exists. Choose another username.";
  }
  if (value.status === "FETCH_ERROR") {
    return "Cannot connect to the backend. Check that the API server is running.";
  }

  return value.message || value.error || "Request failed. Please try again.";
}

function FeedbackBanner({
  message,
  type,
  onDismiss,
}: {
  message: string;
  type: "error" | "success";
  onDismiss: () => void;
}) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex min-w-0 items-start gap-3 rounded-xl border p-3 text-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      )}
      <p className="min-w-0 flex-1 break-words">{message}</p>
      <button
        type="button"
        aria-label="Dismiss message"
        onClick={onDismiss}
        className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function TeamSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Name");
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    data,
    error: listError,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdminStaffQuery({
    page: 1,
    limit: 100,
    search: search.trim() || undefined,
    status: statusFilter,
  });

  const [createStaffRequest, createState] = useCreateStaffMutation();

  const staff = useMemo(
    () => (data?.staff ?? []).map(mapStaffRecord),
    [data?.staff],
  );

  const activeCount = staff.filter((member) => member.status === "Active").length;
  const inactiveCount = staff.filter(
    (member) => member.status === "Inactive",
  ).length;

  // The supplied staff endpoint does not include approval counts.
  const pendingCount = staff.reduce(
    (total, member) => total + member.pendingApproval,
    0,
  );

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...staff]
      .filter((member) => {
        const matchesSearch =
          !query ||
          `${member.name} ${member.username} ${member.id} ${member.phone} ${member.email}`
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "All" || member.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "Name") return a.name.localeCompare(b.name);
        if (sortBy === "Pending Approvals") {
          return b.pendingApproval - a.pendingApproval;
        }
        if (sortBy === "Total Collection" || sortBy === "This Month") {
          return b.totalCollection - a.totalCollection;
        }
        return b.todayCollection - a.todayCollection;
      });
  }, [search, staff, sortBy, statusFilter]);

  const updateForm = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
    setPageError("");
    setSuccessMessage("");
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setFormError("");
    setPageError("");
    setSuccessMessage("");
    setSelectedStaff(null);
    setIsFormOpen(true);
  };

  const closeCreateForm = () => {
    if (createState.isLoading) return;
    setForm(emptyForm);
    setFormError("");
    setIsFormOpen(false);
  };

  const createStaff = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (createState.isLoading) return;

    setFormError("");
    setPageError("");
    setSuccessMessage("");

    const cleanName = form.name.trim();
    const cleanUsername = form.username.trim().toLowerCase();
    const cleanPhone = form.phone.trim();

    if (!cleanName || !cleanUsername || !form.password) {
      setFormError("Full name, username, and password are required.");
      return;
    }

    if (!/^[a-z0-9._-]{3,30}$/.test(cleanUsername)) {
      setFormError(
        "Username must be 3–30 characters and contain only letters, numbers, dots, underscores, or hyphens.",
      );
      return;
    }

    if (cleanPhone && !/^[+]?[0-9 ()-]{10,20}$/.test(cleanPhone)) {
      setFormError("Enter a valid phone number.");
      return;
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setFormError("Enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      const response = await createStaffRequest({
        full_name: cleanName,
        username: cleanUsername,
        phone: cleanPhone || null,
        password: form.password,
      }).unwrap();

      if (!response.success || !response.staff) {
        throw new Error(
          response.message || "Staff creation response was incomplete.",
        );
      }

      setIsFormOpen(false);
      setForm(emptyForm);
      setSuccessMessage(
        `${response.staff.full_name || cleanName} was created successfully.`,
      );
      await refetch();
    } catch (requestError) {
      setFormError(getApiErrorMessage(requestError));
    }
  };

  const toggleStatus = (_id: string) => {
    setPageError(
      "Staff status cannot be changed because no status-update API was provided.",
    );
    setSuccessMessage("");
  };

  const totalStaff = data?.pagination.total ?? staff.length;

  const apiError = listError ? getApiErrorMessage(listError) : "";

  const statItems = [
    {
      label: "Total staff",
      value: totalStaff,
      helper: "Staff accounts",
      icon: Users,
      iconClass: "bg-slate-100 text-slate-600",
    },
    {
      label: "Active staff",
      value: activeCount,
      helper: "Currently active",
      icon: Wallet,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Inactive staff",
      value: inactiveCount,
      helper: "Currently inactive",
      icon: IndianRupee,
      iconClass: "bg-rose-50 text-rose-700",
    },
    {
      label: "Pending approvals",
      value: pendingCount,
      helper: "Based on available data",
      icon: Clock,
      iconClass: "bg-amber-50 text-amber-700",
    },
  ];

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setSortBy("Name");
  };

  return (
    <section className="mx-auto w-full min-w-0 max-w-[1440px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-7">
      <div className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:gap-6">
        <PageHeader
          eyebrow="Admin workspace / Field agents"
          title="Field agent"
          highlight="register"
          subtitle="Manage collection access, daily activity and approvals."
          action={{
            label: "Add Agent",
            onClick: openCreateForm,
            icon: <Plus className="size-4" />,
          }}
        />

        {(pageError || successMessage) && (
          <FeedbackBanner
            message={pageError || successMessage}
            type={pageError ? "error" : "success"}
            onDismiss={() => {
              setPageError("");
              setSuccessMessage("");
            }}
          />
        )}

        {/* Responsive stats: 2 columns on mobile, 4 on wide screens. */}
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {statItems.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.label}
                className="min-w-0 overflow-hidden rounded-xl border border-[var(--hs-border)] bg-white shadow-sm"
              >
                <CardContent className="flex min-w-0 items-start justify-between gap-2 p-3 sm:p-4 lg:p-5">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-[var(--hs-text-secondary)] sm:text-sm">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold leading-none tracking-tight text-[var(--hs-text)] sm:text-3xl">
                      {item.value}
                    </p>
                    <p className="mt-2 hidden truncate text-xs text-[var(--hs-text-muted)] sm:block">
                      {item.helper}
                    </p>
                  </div>
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-10 ${item.iconClass}`}
                  >
                    <Icon className="size-4 sm:size-5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="min-w-0 overflow-hidden rounded-xl border border-[var(--hs-border)] bg-white shadow-sm">
          <CardHeader className="border-b border-[var(--hs-border)] p-4 sm:p-5">
            <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-semibold text-[var(--hs-text)] sm:text-lg">
                    Collection Agents
                  </CardTitle>
                  <span className="rounded-md bg-[var(--hs-background)] px-2 py-1 text-xs font-medium text-[var(--hs-text-secondary)]">
                    {totalStaff}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--hs-text-secondary)]">
                  Manage staff profiles and access details.
                </p>
              </div>

              <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:w-auto xl:min-w-[600px] xl:grid-cols-[minmax(220px,1fr)_130px_175px]">
                <div className="relative min-w-0">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--hs-text-muted)]" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name, ID or phone"
                    aria-label="Search staff"
                    className="h-10 min-w-0 rounded-lg border-[var(--hs-border)] pl-9 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]/20"
                  />
                </div>

                <SelectControl
                  ariaLabel="Filter agents by status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={["All", "Active", "Inactive"]}
                />

                <SelectControl
                  ariaLabel="Sort collection agents"
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    "Today's Collection",
                    "This Month",
                    "Total Collection",
                    "Pending Approvals",
                    "Name",
                  ]}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-[var(--hs-border-light)] pt-3 text-xs sm:flex-row sm:items-center sm:justify-between">
              <span className="text-[var(--hs-text-secondary)]">
                Showing{" "}
                <strong className="text-[var(--hs-text)]">
                  {filteredStaff.length}
                </strong>{" "}
                of{" "}
                <strong className="text-[var(--hs-text)]">{totalStaff}</strong>{" "}
                agents
              </span>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="font-medium text-[var(--hs-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]"
                >
                  Reset filters
                </button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isFetching}
                  onClick={() => void refetch()}
                  className="h-9"
                >
                  <RefreshCw
                    className={`mr-1.5 size-3.5 ${
                      isFetching ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="min-w-0 p-0">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 p-10 text-sm text-[var(--hs-text-secondary)] sm:p-12">
                <RefreshCw className="size-4 animate-spin" />
                Loading staff...
              </div>
            ) : apiError && staff.length === 0 ? (
              <div className="flex flex-col items-center gap-3 p-8 text-center sm:p-12">
                <AlertCircle className="size-8 text-red-500" />
                <p className="max-w-lg text-sm text-red-700">{apiError}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void refetch()}
                  disabled={isFetching}
                >
                  Try again
                </Button>
              </div>
            ) : (
              <>
                {/* Cards on phones, tablets and smaller laptops. */}
                <div className="grid min-w-0 grid-cols-1 gap-3 bg-[var(--hs-background)]/40 p-3 sm:grid-cols-2 sm:p-4 xl:hidden">
                  {filteredStaff.map((member) => (
                    <StaffCard
                      key={member.id}
                      member={member}
                      onView={setSelectedStaff}
                      onToggle={toggleStatus}
                    />
                  ))}
                </div>

                {/* Full data table only on wide desktop screens. */}
                <div className="hidden min-w-0 overflow-x-auto xl:block">
                  <table className="w-full min-w-[1000px] text-left">
                    <thead>
                      <tr className="border-b border-[var(--hs-border)] bg-[var(--hs-background)]">
                        <TableHead>Staff</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Today</TableHead>
                        <TableHead>This month</TableHead>
                        <TableHead>Pending</TableHead>
                        <TableHead align="right">Actions</TableHead>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--hs-border-light)]">
                      {filteredStaff.map((member) => (
                        <StaffTableRow
                          key={member.id}
                          member={member}
                          onView={setSelectedStaff}
                          onToggle={toggleStatus}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredStaff.length === 0 && (
                  <EmptyState
                    search={search}
                    onClear={() => {
                      setSearch("");
                      setStatusFilter("All");
                    }}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {isFormOpen && (
        <CreateAgentModal
          form={form}
          error={formError}
          onChange={updateForm}
          onClose={closeCreateForm}
          onSubmit={createStaff}
          isSubmitting={createState.isLoading}
        />
      )}

      {selectedStaff && (
        <StaffDetail
          member={selectedStaff}
          onClose={() => setSelectedStaff(null)}
          onToggle={toggleStatus}
        />
      )}
    </section>
  );
}

export default TeamSection;
