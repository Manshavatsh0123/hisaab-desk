"use client";

import { useMemo, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Plus, RefreshCw, Search, Users, Wallet, IndianRupee, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../common/PageHeader";
import { StatItem, StatsCards } from "../common/StatsCards";
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

export function TeamSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Name");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
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

  const pageCount = Math.max(1, Math.ceil(filteredStaff.length / pageSize));
  const visibleStaff = filteredStaff.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const changeSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const changeStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

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

  const dealStats: StatItem[] = [
    { label: "Total staff", value: data?.pagination.total ?? staff.length, helper: "Staff returned by the API", icon: Users, tone: "neutral" },
    { label: "Active staff", value: activeCount, helper: "Status from staff profiles", icon: Wallet, tone: "success" },
    { label: "Inactive staff", value: inactiveCount, helper: "Status from staff profiles", icon: IndianRupee, tone: "primary" },
    { label: "Pending approvals", value: pendingCount, helper: "Not included in the provided staff API", icon: Clock, tone: "warning" },
  ];

  const apiError = listError ? getApiErrorMessage(listError) : "";

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 pb-8">
      <div className="px-[var(--hs-page-padding-x)] py-[var(--hs-page-padding-y)]">
        <PageHeader
          eyebrow="Admin workspace / Field agents"
          title="Field agent"
          highlight="register"
          subtitle="Manage collection access, daily activity and approvals."
          action={{ label: "Add Agent", onClick: openCreateForm, icon: <Plus className="size-4" /> }}
        />

        <StatsCards items={dealStats} columns={4} />

        <Card className="mt-5 overflow-hidden rounded-sm border border-[var(--hs-border)] bg-white shadow-sm">
          <CardHeader className="px-4 sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--hs-primary-light)] text-[var(--hs-primary)]">
                  <Users className="size-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base font-semibold tracking-tight text-[var(--hs-text)] sm:text-lg">
                      Collection Agents
                    </CardTitle>

                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-[6px] border border-[var(--hs-primary-border)] bg-[var(--hs-primary-light)] px-2 text-xs font-semibold tabular-nums text-[var(--hs-primary)]">
                      {data?.pagination.total ?? filteredStaff.length}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-[var(--hs-text-muted)] sm:text-sm">
                    Manage your field team and collection activity
                  </p>
                </div>
              </div>

              <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-[minmax(220px,1fr)_140px_auto] lg:w-auto lg:min-w-[620px]">
                <div className="relative min-w-0">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--hs-text-muted)]" />
                  <Input
                    value={search}
                    onChange={(event) => changeSearch(event.target.value)}
                    placeholder="Search name, staff ID or phone"
                    aria-label="Search staff"
                    className="h-10 w-full rounded-sm border-[var(--hs-border)] bg-[var(--hs-background)]/40 pl-10 pr-3 text-sm shadow-none transition-colors placeholder:text-[var(--hs-text-muted)] hover:border-[var(--hs-primary-border)] hover:bg-white focus-visible:border-[var(--hs-primary)] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]/15 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="min-w-0">
                  <SelectControl
                    ariaLabel="Filter staff by status"
                    value={statusFilter}
                    onChange={changeStatusFilter}
                    options={["All", "Active", "Inactive"]}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  disabled={isFetching}
                  onClick={() => void refetch()}
                  className="h-10 rounded-sm border-[var(--hs-border)] bg-white px-3 text-sm font-medium text-[var(--hs-text)] shadow-none hover:border-[var(--hs-primary-border)] hover:bg-[var(--hs-primary-light)] hover:text-[var(--hs-primary)]"
                >
                  <RefreshCw className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 p-12 text-sm text-[var(--hs-text-secondary)]">
                <RefreshCw className="size-4 animate-spin" /> Loading staff...
              </div>
            ) : apiError && staff.length === 0 ? (
              <div className="p-10 text-center text-sm text-red-700">{apiError}</div>
            ) : (
              <>
                <div className="grid gap-3 bg-[var(--hs-background)]/40 p-3 md:hidden">
                  {visibleStaff.map((member) => (
                    <StaffCard key={member.id} member={member} onView={setSelectedStaff} onToggle={toggleStatus} />
                  ))}
                </div>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[1000px] text-left">
                    <thead>
                      <tr className="border-b border-[var(--hs-border)] bg-[var(--hs-primary-light)]/55">
                        <TableHead>Staff</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Today</TableHead>
                        <TableHead>This month</TableHead>
                        <TableHead>Pending</TableHead>
                        <TableHead align="right">Actions</TableHead>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--hs-border-light)] [&>tr:nth-child(even)]:bg-slate-50/60 [&>tr]:transition-colors [&>tr:hover]:bg-[var(--hs-primary-light)]/60">
                      {visibleStaff.map((member) => (
                        <StaffTableRow key={member.id} member={member} onView={setSelectedStaff} onToggle={toggleStatus} />
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredStaff.length === 0 && (
                  <EmptyState search={search} onClear={() => { setSearch(""); setStatusFilter("All"); setCurrentPage(1); }} />
                )}
              </>
            )}
          </CardContent>

          {!isLoading && !apiError && filteredStaff.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-[var(--hs-border-light)] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-[var(--hs-text-secondary)]">
                Page <span className="font-semibold text-[var(--hs-text)]">{currentPage}</span> of{" "}
                <span className="font-semibold text-[var(--hs-text)]">{pageCount}</span>
              </p>

              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  className="h-9 rounded-sm border-[var(--hs-border)] px-3"
                >
                  <ChevronLeft className="mr-1 size-4" />
                  Previous
                </Button>

                <span className="min-w-8 text-center text-sm font-medium text-[var(--hs-text)]">
                  {currentPage}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= pageCount}
                  onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                  className="h-9 rounded-sm border-[var(--hs-border)] px-3"
                >
                  Next
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </div>
            </div>
          )}
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
