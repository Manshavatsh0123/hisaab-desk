"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Plus, RefreshCw, Search, Users, Wallet, IndianRupee, Clock, Phone, Eye, MoreHorizontal } from "lucide-react";
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
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function mapStaffRecord(record: StaffRecord): StaffMember {
  return {
    id: record.staff_code || record.id,
    name: record.full_name || "Unnamed staff",
    username: record.username || "—",
    phone: record.phone || "—",
    // The provided GET API does not return email or collection statistics.
    email: "",
    status: record.status?.toUpperCase() === "ACTIVE" ? "Active" : "Inactive",
    createdDate: formatCreatedDate(record.created_at),
    totalCollection: 0,
    pendingApproval: 0,
    todayCollection: 0,
  };
}

function getApiErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") return "Something went wrong. Please try again.";
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
  if (value.status === "FETCH_ERROR") return "Cannot connect to the backend. Check that the API server is running.";
  return value.message || value.error || "Request failed. Please try again.";
}


function AgentStatus({ value }: { value: "Active" | "Inactive" }) {
  const active = value === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200"
      }`}
    >
      <span className={`size-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
      {value}
    </span>
  );
}

function AgentTable({
  rows,
  onView,
  onMore,
}: {
  rows: StaffMember[];
  onView: (member: StaffMember) => void;
  onMore: (member: StaffMember) => void;
}) {
  const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;
  const initials = (name: string) =>
    name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase() || "ST";

  return (
    <div className="min-w-0">
      {/* Mobile and tablet: compact responsive staff cards */}
      <div className="grid grid-cols-1 gap-3 bg-slate-50/70 p-3 sm:grid-cols-2 sm:p-4 xl:hidden">
        {rows.map((agent) => (
          <article key={agent.id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-sm font-bold text-[var(--hs-primary)] ring-1 ring-rose-100">
                {initials(agent.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{agent.name}</p>
                <p className="mt-0.5 truncate text-xs text-slate-500">{agent.id} · @{agent.username}</p>
                <div className="mt-2"><AgentStatus value={agent.status} /></div>
              </div>
              <button
                type="button"
                aria-label={`More actions for ${agent.name}`}
                onClick={() => onMore(agent)}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]"
              >
                <MoreHorizontal className="size-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Contact</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-700">
                  <Phone className="size-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{agent.phone || "—"}</span>
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Today</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{money(agent.todayCollection)}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">This month</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{money(agent.totalCollection)}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Pending</p>
                <p className={`mt-1 text-sm font-semibold ${agent.pendingApproval > 0 ? "text-amber-700" : "text-slate-700"}`}>
                  {agent.pendingApproval}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => onView(agent)}
              className="mt-4 h-9 w-full rounded-lg border-slate-200 text-sm font-semibold text-slate-700 hover:border-[var(--hs-primary-border)] hover:bg-[var(--hs-primary-light)] hover:text-[var(--hs-primary)]"
            >
              <Eye className="mr-2 size-4" />
              View staff details
            </Button>
          </article>
        ))}
      </div>

      {/* Desktop: polished data table */}
      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full min-w-[1000px] border-separate border-spacing-0 text-left">
          <thead>
            <tr className="bg-slate-50/70">
              {["Staff member", "Contact", "Status", "Today", "This month", "Pending", "Actions"].map((heading, index) => (
                <th
                  key={heading}
                  scope="col"
                  className={`whitespace-nowrap border-b border-slate-200 px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 ${index === 6 ? "text-right" : ""}`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((agent) => (
              <tr key={agent.id} className="group transition-colors hover:bg-slate-50/60">
                <td className="border-b border-slate-100 px-5 py-4">
                  <div className="flex min-w-[210px] items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-xs font-bold text-[var(--hs-primary)] ring-1 ring-rose-100">{initials(agent.name)}</div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{agent.name}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{agent.id} <span className="px-1 text-slate-300">·</span> @{agent.username}</p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-slate-100 px-5 py-4">
                  <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-slate-600"><Phone className="size-3.5 text-slate-400" />{agent.phone || "—"}</span>
                </td>
                <td className="border-b border-slate-100 px-5 py-4"><AgentStatus value={agent.status} /></td>
                <td className="border-b border-slate-100 px-5 py-4">
                  <p className="whitespace-nowrap text-sm font-semibold tabular-nums text-slate-900">{money(agent.todayCollection)}</p>
                  <p className="mt-1 text-xs text-slate-400">{agent.todayCollection > 0 ? "Collection recorded" : "No data yet"}</p>
                </td>
                <td className="border-b border-slate-100 px-5 py-4">
                  <p className="whitespace-nowrap text-sm font-semibold tabular-nums text-slate-900">{money(agent.totalCollection)}</p>
                  <p className="mt-1 text-xs text-slate-400">Available data</p>
                </td>
                <td className="border-b border-slate-100 px-5 py-4">
                  <span className={`inline-flex min-w-7 items-center justify-center rounded-md px-2 py-1 text-sm font-semibold tabular-nums ${agent.pendingApproval > 0 ? "bg-amber-50 text-amber-700" : "text-slate-600"}`}>{agent.pendingApproval}</span>
                </td>
                <td className="border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => onView(agent)} className="h-9 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:border-[var(--hs-primary-border)] hover:bg-[var(--hs-primary-light)] hover:text-[var(--hs-primary)]">
                      <Eye className="mr-1.5 size-3.5" /> View
                    </Button>
                    <button type="button" aria-label={`More actions for ${agent.name}`} onClick={() => onMore(agent)} className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:border hover:border-slate-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]">
                      <MoreHorizontal className="size-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="px-4 py-12 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Users className="size-5" /></div>
          <p className="mt-3 text-sm font-semibold text-slate-800">No agents found</p>
          <p className="mt-1 text-xs text-slate-500">No agents match these filters. Try adjusting your search or status.</p>
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
  const inactiveCount = staff.filter((member => member.status === "Inactive")).length;
  const pendingCount = staff.reduce((total, member) => total + member.pendingApproval, 0);

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...staff]
      .filter((member) => {
        const matchesSearch =
          !query ||
          `${member.name} ${member.username} ${member.id} ${member.phone} ${member.email}`
            .toLowerCase()
            .includes(query);
        const matchesStatus = statusFilter === "All" || member.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "Name") return a.name.localeCompare(b.name);
        if (sortBy === "Pending Approvals") return b.pendingApproval - a.pendingApproval;
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

  const createStaff = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

    if (!/^[a-z0-9._-]{3,}$/.test(cleanUsername)) {
      setFormError("Username must be at least 3 characters and contain only letters, numbers, dots, underscores, or hyphens.");
      return;
    }

    if (cleanPhone && !/^[+]?[0-9 ()-]{10,}$/.test(cleanPhone)) {
      setFormError("Enter a valid phone number.");
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


  const toggleStatus = (_id: string) => {
    setPageError("Staff status cannot be changed because no status-update API was provided.");
  };

  const dealStats = [
    { label: "Total staff", value: data?.pagination.total ?? staff.length, helper: "Registered accounts", icon: Users },
    { label: "Active staff", value: activeCount, helper: "Currently active", icon: Wallet },
    { label: "Inactive staff", value: inactiveCount, helper: "Currently inactive", icon: IndianRupee },
    { label: "Pending approvals", value: pendingCount, helper: "Approval queue", icon: Clock },
  ];

  const apiError = listError ? getApiErrorMessage(listError) : "";

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[1440px] flex-col gap-5 px-3 py-4 pb-8 sm:gap-5 sm:px-5 sm:py-6 lg:px-8 lg:py-7">
      <div className="min-w-0">
        <PageHeader
          eyebrow="Admin workspace / Field agents"
          title="Field agent"
          highlight="register"
          subtitle="Manage collection access, daily activity and approvals."
          action={{ label: "Add Agent", onClick: openCreateForm, icon: <Plus className="size-4" /> }}
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {dealStats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3.5 py-3.5 transition-colors hover:border-slate-300 sm:px-4"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <Icon className="size-[17px]" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">{item.label}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-xl font-semibold leading-none tracking-tight text-slate-800 sm:text-2xl">{item.value}</span>
                    <span className="hidden truncate text-[11px] text-slate-400 2xl:inline">{item.helper}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Card className="mt-5 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-none">
          <CardHeader className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-semibold text-[var(--hs-text)]">Collection Agents</CardTitle>
                  <span className="rounded-md bg-[var(--hs-background)] px-2 py-1 text-xs font-medium text-[var(--hs-text-secondary)]">
                    {data?.pagination.total ?? filteredStaff.length}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--hs-text-secondary)]">
                  Manage staff profiles and collection access
                </p>
              </div>

              <div className="grid w-full gap-2 sm:grid-cols-2 xl:w-auto xl:min-w-[570px] xl:grid-cols-[minmax(210px,1fr)_120px_160px]">
                <div className="relative sm:col-span-2 xl:col-span-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--hs-text-muted)]" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name, staff ID or phone"
                    className="h-9 rounded-lg border-slate-200 bg-slate-50/60 pl-9 text-sm shadow-none focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]/15"
                  />
                </div>
                <SelectControl ariaLabel="Filter agents by status" value={statusFilter} onChange={setStatusFilter} options={["All", "Active", "Inactive"]} />
                <SelectControl
                  ariaLabel="Sort collection agents"
                  value={sortBy}
                  onChange={setSortBy}
                  options={["Today's Collection", "This Month", "Total Collection", "Pending Approvals", "Name"]}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
              <span className="text-[var(--hs-text-secondary)]">
                Showing <strong className="text-[var(--hs-text)]">{filteredStaff.length}</strong> of{" "}
                <strong className="text-[var(--hs-text)]">{data?.pagination.total ?? staff.length}</strong> agents
              </span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { setSearch(""); setStatusFilter("All"); setSortBy("Name"); }} className="font-medium text-[var(--hs-primary)] hover:underline">
                  Reset filters
                </button>
                <Button type="button" variant="outline" size="sm" disabled={isFetching} onClick={() => void refetch()} className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-medium shadow-none hover:bg-slate-50">
                  <RefreshCw className={`mr-1 size-3.5 ${isFetching ? "animate-spin" : ""}`} /> Refresh
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="min-w-0 p-0">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 p-10 text-sm text-[var(--hs-text-secondary)] sm:p-12">
                <RefreshCw className="size-4 animate-spin" /> Loading staff...
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
              <AgentTable
                rows={filteredStaff}
                onView={setSelectedStaff}
                onMore={(member) => {
                  setPageError(`More actions for ${member.name} are not available yet.`);
                  setSuccessMessage("");
                }}
              />
            )}
          </CardContent>
        </Card>

        

        {isFormOpen && (
          <CreateAgentModal
            form={form}
            error={formError}
            onChange={updateForm}
            onClose={closeCreateForm}
            onSubmit={createStaff}
          />
        )}

        {selectedStaff && (
          <StaffDetail member={selectedStaff} onClose={() => setSelectedStaff(null)} onToggle={toggleStatus} />
        )}
      </div>
    </div>
  );
}

export default TeamSection;
