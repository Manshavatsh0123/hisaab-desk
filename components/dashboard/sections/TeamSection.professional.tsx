"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
  IndianRupee,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../common/PageHeader";
import { StatsCards, type StatItem } from "../common/StatsCards";
import SelectControl from "../common/SelectControl";
import CreateAgentModal from "../common/CreateAgentModal";
import { useCreateStaffMutation, useGetAdminStaffQuery, type StaffRecord } from "@/features/staff/staffApi";

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

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

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
    // The current staff-list API does not return email or collection statistics.
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
  if (value.status === 401) return "Your session has expired. Please sign in again.";
  if (value.status === 403) return "Only an authenticated admin can manage staff.";
  if (value.status === 409) return "This username already exists. Choose another username.";
  if (value.status === "FETCH_ERROR") {
    return "Cannot connect to the backend. Check that the API server is running.";
  }
  return value.message || value.error || "Request failed. Please try again.";
}

function StatusBadge({ status }: { status: StaffMember["status"] }) {
  const active = status === "Active";

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200"
      }`}
    >
      <span className={`size-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
      {status}
    </span>
  );
}

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0] ?? "")
      .join("")
      .toUpperCase() || "ST"
  );
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

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-lg border border-slate-100 bg-white p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value || "—"}</p>
      </div>
    </div>
  );
}

function AgentDetailsDialog({
  member,
  onClose,
}: {
  member: StaffMember;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-slate-950/35 p-3 sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="agent-details-title"
        className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--hs-primary)]">
              Staff profile
            </p>
            <h2 id="agent-details-title" className="mt-1 text-xl font-bold text-slate-900">
              Staff details
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close staff details"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-lg font-bold text-[var(--hs-primary)] ring-1 ring-rose-100">
              {initials(member.name)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="break-words text-lg font-bold text-slate-900">{member.name}</h3>
              <p className="mt-0.5 break-all text-sm text-slate-500">@{member.username}</p>
              <div className="mt-2">
                <StatusBadge status={member.status} />
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Staff ID</p>
              <p className="mt-1 break-all text-xs font-bold text-slate-800">{member.id}</p>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="mb-3 text-sm font-bold text-slate-800">Contact & account</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem icon={UserRound} label="Full name" value={member.name} />
              <DetailItem icon={ShieldCheck} label="Username" value={member.username} />
              <DetailItem icon={Phone} label="Phone number" value={member.phone} />
              <DetailItem icon={Mail} label="Email address" value={member.email || "Not provided by API"} />
              <DetailItem icon={Clock} label="Created on" value={member.createdDate} />
              <DetailItem icon={ShieldCheck} label="Account status" value={member.status} />
            </div>
          </div>

          <div className="mt-5">
            <h3 className="mb-3 text-sm font-bold text-slate-800">Collection overview</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 p-3">
                <p className="text-xs text-slate-500">Today</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{money(member.todayCollection)}</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-3">
                <p className="text-xs text-slate-500">This month</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{money(member.totalCollection)}</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-3">
                <p className="text-xs text-slate-500">Pending approvals</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{member.pendingApproval}</p>
              </div>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Collection and approval values show zero because the current staff-list API does not provide these statistics.
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-6">
          <Button type="button" onClick={onClose} className="h-10 bg-[var(--hs-primary)] px-5 text-white hover:bg-[var(--hs-primary-dark)]">
            Done
          </Button>
        </div>
      </section>
    </div>
  );
}

function AgentTable({
  rows,
  onView,
}: {
  rows: StaffMember[];
  onView: (member: StaffMember) => void;
}) {
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-1 gap-3 bg-slate-50/60 p-3 sm:grid-cols-2 sm:p-4 xl:hidden">
        {rows.map((member) => (
          <article
            key={member.id}
            className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm"
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-xs font-bold text-[var(--hs-primary)]">
                {initials(member.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{member.name}</p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {member.id} · @{member.username}
                </p>
                <div className="mt-2"><StatusBadge status={member.status} /></div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Phone</p>
                <p className="mt-1 truncate text-sm font-medium text-slate-700">{member.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Joined</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{member.createdDate}</p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => onView(member)}
              className="mt-4 h-9 w-full border-slate-200 text-sm font-semibold text-slate-700 hover:border-[var(--hs-primary-border)] hover:bg-[var(--hs-primary-light)] hover:text-[var(--hs-primary)]"
            >
              <Eye className="mr-2 size-4" />
              View details
            </Button>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full min-w-[950px] border-separate border-spacing-0 text-left">
          <thead>
            <tr className="bg-slate-50">
              {["Staff member", "Contact", "Status", "Joined", "Today", "This month", "Pending", "Actions"].map((heading, index) => (
                <th
                  key={heading}
                  scope="col"
                  className={`whitespace-nowrap border-b border-slate-200 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.07em] text-slate-500 ${
                    index === 7 ? "text-right" : ""
                  }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((member) => (
              <tr key={member.id} className="transition-colors hover:bg-slate-50/70">
                <td className="border-b border-slate-100 px-4 py-4">
                  <div className="flex min-w-[200px] items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-xs font-bold text-[var(--hs-primary)]">
                      {initials(member.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{member.name}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{member.id} · @{member.username}</p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-slate-100 px-4 py-4">
                  <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-slate-600">
                    <Phone className="size-3.5 text-slate-400" /> {member.phone}
                  </span>
                </td>
                <td className="border-b border-slate-100 px-4 py-4"><StatusBadge status={member.status} /></td>
                <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-600">{member.createdDate}</td>
                <td className="border-b border-slate-100 px-4 py-4 text-sm font-semibold tabular-nums text-slate-900">{money(member.todayCollection)}</td>
                <td className="border-b border-slate-100 px-4 py-4 text-sm font-semibold tabular-nums text-slate-900">{money(member.totalCollection)}</td>
                <td className="border-b border-slate-100 px-4 py-4">
                  <span className={`inline-flex min-w-7 justify-center rounded-md px-2 py-1 text-sm font-semibold ${member.pendingApproval > 0 ? "bg-amber-50 text-amber-700" : "text-slate-500"}`}>
                    {member.pendingApproval}
                  </span>
                </td>
                <td className="border-b border-slate-100 px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onView(member)}
                      className="h-9 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:border-[var(--hs-primary-border)] hover:bg-[var(--hs-primary-light)] hover:text-[var(--hs-primary)]"
                    >
                      <Eye className="mr-1.5 size-3.5" /> View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="px-4 py-12 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Users className="size-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-800">No staff found</p>
          <p className="mt-1 text-xs text-slate-500">Try changing your search or status filter.</p>
        </div>
      )}
    </div>
  );
}

export function TeamSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
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
  const inactiveCount = staff.filter((member) => member.status === "Inactive").length;
  const pendingCount = staff.reduce((total, member) => total + member.pendingApproval, 0);

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();

    return staff.filter((member) => {
      const matchesSearch =
        !query ||
        `${member.name} ${member.username} ${member.id} ${member.phone} ${member.email}`
          .toLowerCase()
          .includes(query);
      const matchesStatus = statusFilter === "All" || member.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, staff, statusFilter]);

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

    if (!cleanName || !cleanUsername || !form.password || !cleanPhone) {
      setFormError("Please fill in the full name, phone number, username, and password.");
      return;
    }
    if (!/^[a-z0-9._-]{3,30}$/.test(cleanUsername)) {
      setFormError("Username must be 3–30 characters and contain only letters, numbers, dots, underscores, or hyphens.");
      return;
    }
    if (!/^[+]?[0-9 ()-]{10,20}$/.test(cleanPhone)) {
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
        phone: cleanPhone,
        password: form.password,
      }).unwrap();

      if (!response.success || !response.staff) {
        throw new Error(response.message || "Staff creation response was incomplete.");
      }

      setIsFormOpen(false);
      setForm(emptyForm);
      setSuccessMessage(`${response.staff.full_name || cleanName} was created successfully.`);
      await refetch();
    } catch (requestError) {
      setFormError(getApiErrorMessage(requestError));
    }
  };

  const totalStaff = data?.pagination.total ?? staff.length;
  const apiError = listError ? getApiErrorMessage(listError) : "";

  const statItems: StatItem[] = [
    { label: "Total staff", value: totalStaff, helper: "Staff accounts", icon: Users, tone: "neutral" },
    { label: "Active staff", value: activeCount, helper: "Currently active", icon: Wallet, tone: "success" },
    { label: "Inactive staff", value: inactiveCount, helper: "Currently inactive", icon: IndianRupee, tone: "primary" },
    { label: "Pending approvals", value: pendingCount, helper: "Not provided by staff API", icon: Clock, tone: "warning" },
  ];

  return (
    <section className="mx-auto w-full min-w-0 max-w-[1440px] px-3 py-4 pb-8 sm:px-5 sm:py-6 lg:px-8 lg:py-7">
      <div className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:gap-6">
        <PageHeader
          eyebrow="Admin workspace / Field agents"
          title="Field agent"
          highlight="register"
          subtitle="Manage collection access, daily activity and approvals."
          action={{
            label: "Add Agent",
            onClick: () => {
              setForm(emptyForm);
              setFormError("");
              setIsFormOpen(true);
            },
            icon: <Plus className="size-4" />,
          }}
        />

        <div className="space-y-3">
          {pageError && (
            <FeedbackBanner
              message={pageError}
              type="error"
              onDismiss={() => setPageError("")}
            />
          )}
          {successMessage && (
            <FeedbackBanner
              message={successMessage}
              type="success"
              onDismiss={() => setSuccessMessage("")}
            />
          )}
        </div>

        <StatsCards items={statItems} columns={4} />

        <Card className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold text-slate-900 sm:text-lg">
                    Collection Agents
                  </CardTitle>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                    {totalStaff}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Search and view your registered field agents.
                </p>
              </div>

              <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_160px] lg:w-auto lg:min-w-[440px]">
                <div className="relative min-w-0">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name, staff ID or phone"
                    aria-label="Search staff"
                    className="h-10 rounded-lg border-slate-200 bg-slate-50/50 pl-9 text-sm shadow-none focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]/20"
                  />
                </div>
                <SelectControl
                  ariaLabel="Filter staff by status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={["All", "Active", "Inactive"]}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 text-xs sm:flex-row sm:items-center sm:justify-between">
              <p className="text-slate-500">
                Showing <strong className="text-slate-800">{filteredStaff.length}</strong> of{" "}
                <strong className="text-slate-800">{totalStaff}</strong> agents
                {isFetching && !isLoading ? <span className="ml-2 text-slate-400">Updating…</span> : null}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="font-semibold text-[var(--hs-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]"
                >
                  Reset
                </button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isFetching}
                  onClick={() => void refetch()}
                  className="h-9 rounded-lg border-slate-200 text-slate-600"
                >
                  <RefreshCw className={`mr-1.5 size-3.5 ${isFetching ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="min-w-0 p-0">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-500 sm:p-12">
                <RefreshCw className="size-4 animate-spin" />
                Loading staff...
              </div>
            ) : apiError && staff.length === 0 ? (
              <div className="flex flex-col items-center gap-3 p-8 text-center sm:p-12">
                <AlertCircle className="size-8 text-red-500" />
                <p className="max-w-lg text-sm text-red-700">{apiError}</p>
                <Button type="button" variant="outline" onClick={() => void refetch()} disabled={isFetching}>
                  Try again
                </Button>
              </div>
            ) : (
              <AgentTable rows={filteredStaff} onView={setSelectedStaff} />
            )}
          </CardContent>
        </Card>
      </div>

      {isFormOpen && (
        <CreateAgentModal
          form={form}
          error={formError}
          onChange={updateForm}
          onClose={() => {
            if (createState.isLoading) return;
            setIsFormOpen(false);
            setFormError("");
          }}
          onSubmit={createStaff}
          isSubmitting={createState.isLoading}
        />
      )}

      {selectedStaff && (
        <AgentDetailsDialog
          member={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </section>
  );
}

export default TeamSection;
