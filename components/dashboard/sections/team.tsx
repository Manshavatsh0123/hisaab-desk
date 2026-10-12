"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Users, Wallet, IndianRupee, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "../common/PageHeader";
import { StatItem, StatsCards } from "../common/StatsCards";
import SelectControl from "../common/SelectControl";
import StaffDetail from "../common/StaffDetail";
import CreateAgentModal from "../common/CreateAgentModal";
import StaffCard from "./StaffCard";
import StaffTableRow from "../common/StaffTableRow";
import EmptyState from "../common/EmptyState";
import TableHead from "../common/TableHead";

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

const initialStaff: StaffMember[] = [
  {
    id: "STF-0001",
    name: "Rahul Kumar",
    username: "rahul01",
    phone: "+91 98765 43210",
    email: "rahul@company.com",
    status: "Active",
    createdDate: "12 Jun 2024",
    totalCollection: 184500,
    todayCollection: 12500,
    pendingApproval: 2,
  },

  {
    id: "STF-0002",
    name: "Priya Sharma",
    username: "priya02",
    phone: "+91 98123 45678",
    email: "priya@company.com",
    status: "Active",
    createdDate: "18 Jun 2024",
    totalCollection: 142300,
    todayCollection: 8400,
    pendingApproval: 1,
  },

  {
    id: "STF-0003",
    name: "Amit Verma",
    username: "amit03",
    phone: "+91 97654 32109",
    email: "amit@company.com",
    status: "Inactive",
    createdDate: "02 May 2024",
    totalCollection: 98500,
    todayCollection: 0,
    pendingApproval: 0,
  },
];

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

export function TeamSection() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Today's Collection");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const activeCount = staff.filter((member) => member.status === "Active").length;
  const inactiveCount = staff.filter((member) => member.status === "Inactive",).length;

  const pendingCount = staff.reduce((total, member) => total + member.pendingApproval,
    0,
  );

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...staff]
      .filter((member) => {

        const matchesSearch = !query || `${member.name} ${member.username} ${member.id} ${member.phone} ${member.email}`
          .toLowerCase()
          .includes(query);

        const matchesStatus = statusFilter === "All" || member.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "Name") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "Pending Approvals") {
          return b.pendingApproval - a.pendingApproval;
        }
        if (sortBy === "Total Collection") {
          return b.totalCollection - a.totalCollection;
        }
        if (sortBy === "This Month") {
          return b.totalCollection - a.totalCollection;
        }
        return b.todayCollection - a.todayCollection;
      });
  }, [search, staff, sortBy, statusFilter]);

  const updateForm = (
    field: keyof typeof emptyForm,
    value: string,
  ) => {

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setError("");
    setSelectedStaff(null);
    setIsFormOpen(true);
  };

  const closeCreateForm = () => {
    setForm(emptyForm);
    setError("");
    setIsFormOpen(false);
  };


  const createStaff = (event: React.FormEvent<HTMLFormElement>,) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.username.trim() ||
      !form.password
    ) {
      setError("Name, username, and password are required.",);
      return;
    }

    if (!/^\+?[0-9 ()-]{10,}$/.test(form.phone.trim())) {
      setError("Enter a valid phone number.");
      return;
    }

    if (
      staff.some(
        (member) =>
          member.username.toLowerCase() ===
          form.username.trim().toLowerCase(),
      )
    ) {
      setError("This username is already in use.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const nextId = `STF-${String(
      staff.length + 1,
    ).padStart(4, "0")}`;

    const newStaff: StaffMember = {
      id: nextId,
      name: form.name.trim(),
      username: form.username.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      status: form.status,
      createdDate: "Today",
      totalCollection: 0,
      todayCollection: 0,
      pendingApproval: 0,
    };

    setStaff((current) => [...current, newStaff]);
    closeCreateForm();
  };


  const toggleStatus = (id: string) => {
    setStaff((current) =>
      current.map((member) =>
        member.id === id
          ? {
            ...member,
            status:
              member.status === "Active"
                ? "Inactive"
                : "Active",
          }
          : member,
      ),
    );

    setSelectedStaff((current) => {
      if (!current || current.id !== id) return current;

      return {
        ...current,
        status:
          current.status === "Active"
            ? "Inactive"
            : "Active",
      };
    });
  };

  const dealStats: StatItem[] = [
    {
      label: "Total customers",
      value: 524,
      helper: "Unique customers in results",
      icon: Users,
      tone: "neutral",
    },
    {
      label: "Collected this month",
      value: "₹4,000",
      helper: "Based on recorded payments",
      icon: Wallet,
      tone: "success",
    },
    {
      label: "Installment value",
      value: "₹8,000",
      helper: "Total installment amount for filtered accounts",
      icon: IndianRupee,
      tone: "primary",
    },
    {
      label: "Pending accounts",
      value: 12,
      helper: "Due this month, with no payment recorded",
      icon: Clock,
      tone: "warning",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6  pb-8">
      <div className=" px-[var(--hs-page-padding-x)] py-[var(--hs-page-padding-y)] ">
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

        <StatsCards items={dealStats} columns={4} />

        <Card className="mt-5 overflow-hidden rounded-xl border border-[var(--hs-border)] bg-white shadow-sm">
          <CardHeader className="border-b border-[var(--hs-border)] p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-semibold text-[var(--hs-text)]">
                    Collection Agents
                  </CardTitle>
                  <span className="rounded-md bg-[var(--hs-background)] px-2 py-1 text-xs font-medium text-[var(--hs-text-secondary)]">
                    {filteredStaff.length}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--hs-text-secondary)]">
                  Staff details, collection performance and pending approvals
                </p>
              </div>

              <div className="grid w-full gap-2 sm:grid-cols-2 xl:w-auto xl:min-w-[600px] xl:grid-cols-[minmax(220px,1fr)_130px_175px]">
                <div className="relative sm:col-span-2 xl:col-span-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--hs-text-muted)]" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name, staff ID or phone"
                    className="h-10 rounded-lg border-[var(--hs-border)] pl-9 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]/20"
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

            <div className="mt-4 flex items-center justify-between border-t border-[var(--hs-border-light)] pt-3 text-xs">
              <span className="text-[var(--hs-text-secondary)]">
                Showing <strong className="text-[var(--hs-text)]">{filteredStaff.length}</strong> of{" "}
                <strong className="text-[var(--hs-text)]">{staff.length}</strong> agents
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setSortBy("Today's Collection");
                }}
                className="font-medium text-[var(--hs-primary)] hover:underline"
              >
                Reset filters
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Mobile */}
            <div className="grid gap-3 bg-[var(--hs-background)]/40 p-3 md:hidden">
              {filteredStaff.map((member) => (
                <StaffCard
                  key={member.id}
                  member={member}
                  onView={setSelectedStaff}
                  onToggle={toggleStatus}
                />
              ))}
            </div>

            {/* Desktop and tablet */}
            <div className="hidden overflow-x-auto md:block">
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
          </CardContent>
        </Card>

        {isFormOpen && (
          <CreateAgentModal
            form={form}
            error={error}
            onChange={updateForm}
            onClose={closeCreateForm}
            onSubmit={createStaff}
          />
        )}

        {selectedStaff && (
          <StaffDetail
            member={selectedStaff}
            onClose={() => setSelectedStaff(null)}
            onToggle={toggleStatus}
          />

        )}
      </div>

    </div>

  );

}



















export default TeamSection;