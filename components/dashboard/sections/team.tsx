"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  Mail,
  KeyRound,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

const money = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;

export function TeamSection() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] =
    useState<StaffMember | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] =
    useState("Today's Collection");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const activeCount = staff.filter(
    (member) => member.status === "Active",
  ).length;

  const inactiveCount = staff.filter(
    (member) => member.status === "Inactive",
  ).length;

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
          statusFilter === "All" ||
          member.status === statusFilter;

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

  const createStaff = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.username.trim() ||
      !form.password
    ) {
      setError(
        "Name, username, and password are required.",
      );
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

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6  pb-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#587067]">
            ADMIN WORKSPACE / FIELD AGENTS
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#173b30] sm:text-4xl">
            Field agent{" "}
            <span className="bg-[#b9ec4f] px-1.5">
              register
            </span>
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b8176] sm:text-[15px]">
            Manage collection access, daily activity and
            approvals from one clear workspace.
          </p>
        </div>

        <Button
          onClick={openCreateForm}
          className="h-11 w-full rounded-sm bg-[#b9ec4f] px-5 font-bold text-[#173b30] shadow-sm hover:bg-[#c7f467] sm:w-auto"
        >
          <Plus className="size-4" />
          Add Agent
        </Button>
      </div>


      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricBox
          label="Total field agents"
          value={staff.length}
          helper="People with access"
          icon={Users}
          tone="white"
        />

        <MetricBox
          label="Active agents"
          value={activeCount}
          helper="Currently working"
          icon={CheckCircle2}
          tone="dark"
        />

        <MetricBox
          label="Inactive agents"
          value={inactiveCount}
          helper="Access paused"
          icon={Users}
          tone="soft"
        />

        <MetricBox
          label="Pending approvals"
          value={pendingCount}
          helper="Need your review"
          icon={CheckCircle2}
          tone="lime"
        />
      </div>

      <Card className="overflow-hidden rounded-2xl border-[#d8e2db] bg-white shadow-[0_2px_12px_rgba(23,59,48,0.05)]">
        <CardHeader className="border-b border-[#d8e2db] bg-[#f7faf7] p-0">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-bold text-[#173b30]">
                  Collection Agents
                </CardTitle>

                <span className="rounded-full bg-[#e8f2ed] px-2.5 py-1 text-[11px] font-bold text-[#466257]">
                  {filteredStaff.length}{" "}
                  {filteredStaff.length === 1
                    ? "agent"
                    : "agents"}
                </span>
              </div>

              <p className="mt-1 text-sm text-[#71837a]">
                Manage collection access, activity and
                approvals.
              </p>
            </div>

            <div className="grid w-full gap-2.5 lg:w-auto lg:grid-cols-[minmax(260px,1fr)_140px_175px]">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#71837a]" />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search agent, ID or phone..."
                  className="h-11 rounded-lg border-[#d8e2db] bg-white pl-10 text-[14px] font-medium text-[#173b30] shadow-none placeholder:text-[#91a098] focus-visible:ring-[#b9ec4f]/40"
                />
              </div>

              <SelectControl
                ariaLabel="Filter by status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={["All", "Active", "Inactive"]}
              />

              <SelectControl
                ariaLabel="Sort agents"
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
        </CardHeader>

        <CardContent className="p-0">
          {/* MOBILE */}
          <div className="grid gap-3 p-3 md:hidden">
            {filteredStaff.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                onView={setSelectedStaff}
                onToggle={toggleStatus}
              />
            ))}
          </div>

          {/* DESKTOP / TABLET */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#d8e2db] bg-[#e8f2ed] text-left">
                  <TableHead>Staff</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Today</TableHead>
                  <TableHead>This month</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead align="right">
                    Actions
                  </TableHead>
                </tr>
              </thead>

              <tbody>
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

      {/* CREATE AGENT MODAL */}
      {isFormOpen && (
        <CreateAgentModal
          form={form}
          error={error}
          onChange={updateForm}
          onClose={closeCreateForm}
          onSubmit={createStaff}
        />
      )}

      {/* DETAIL DRAWER */}
      {selectedStaff && (
        <StaffDetail
          member={selectedStaff}
          onClose={() => setSelectedStaff(null)}
          onToggle={toggleStatus}
        />
      )}
    </div>
  );
}


function MetricBox({
  label,
  value,
  helper,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  helper: string;
  icon: typeof Users;
  tone: "white" | "dark" | "soft" | "lime";
}) {
  const styles = {
    white: {
      wrapper:
        "border-[#d8e2db] bg-white text-[#173b30]",
      label: "text-[#587067]",
      helper: "text-[#71837a]",
      icon: "bg-[#eef5f0] text-[#173b30]",
    },
    dark: {
      wrapper:
        "border-[#0b4a35] bg-[#0b4a35] text-white",
      label: "text-white/70",
      helper: "text-white/70",
      icon: "bg-white/10 text-white",
    },
    soft: {
      wrapper:
        "border-[#d8e2db] bg-[#e8f2ed] text-[#173b30]",
      label: "text-[#466257]",
      helper: "text-[#71837a]",
      icon: "bg-white/70 text-[#173b30]",
    },
    lime: {
      wrapper:
        "border-[#b9ec4f] bg-[#b9ec4f] text-[#173b30]",
      label: "text-[#315341]",
      helper: "text-[#527064]",
      icon: "bg-white/30 text-[#173b30]",
    },
  }[tone];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-4 shadow-[0_2px_8px_rgba(23,59,48,0.04)] sm:p-5 ${styles.wrapper}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-semibold ${styles.label}`}>
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </p>

          <p className={`mt-1 text-xs ${styles.helper}`}>
            {helper}
          </p>
        </div>

        <div
          className={`grid size-9 shrink-0 place-items-center rounded-lg ${styles.icon}`}
        >
          <Icon className="size-4" />
        </div>
      </div>
    </div>
  );
}


function TableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#466257] lg:px-5 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function StaffTableRow({
  member,
  onView,
  onToggle,
}: {
  member: StaffMember;
  onView: (member: StaffMember) => void;
  onToggle: (id: string) => void;
}) {
  const initials = getInitials(member.name);

  return (
    <tr className="group border-b border-[#e5ece8] last:border-0 hover:bg-[#fbfdfb]">
      <td className="px-4 py-4 lg:px-5">
        <button
          type="button"
          onClick={() => onView(member)}
          className="flex min-w-[210px] items-center gap-3 text-left"
        >
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e8f2ed] text-xs font-bold text-[#173b30] ring-1 ring-[#d8e2db]">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#173b30] group-hover:text-[#0b4a35]">
              {member.name}
            </p>

            <p className="mt-0.5 truncate text-xs text-[#7a8d84]">
              {member.id} · @{member.username}
            </p>
          </div>
        </button>
      </td>

      <td className="px-4 py-4 lg:px-5">
        <div className="flex items-center gap-2 whitespace-nowrap text-sm text-[#587067]">
          <Phone className="size-3.5 text-[#7b9086]" />
          {member.phone}
        </div>
      </td>

      <td className="px-4 py-4 lg:px-5">
        <StatusBadge status={member.status} />
      </td>

      <td className="px-4 py-4 lg:px-5">
        <p className="text-sm font-bold text-[#173b30]">
          {money(member.todayCollection)}
        </p>
      </td>

      <td className="px-4 py-4 lg:px-5">
        <p className="text-sm font-bold text-[#173b30]">
          {money(member.totalCollection)}
        </p>
      </td>

      <td className="px-4 py-4 lg:px-5">
        {member.pendingApproval > 0 ? (
          <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-[#fff4d8] px-2 py-1 text-xs font-bold text-[#8a6200]">
            {member.pendingApproval}
          </span>
        ) : (
          <span className="text-sm font-medium text-[#91a098]">
            0
          </span>
        )}
      </td>

      <td className="px-4 py-4 lg:px-5">
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onView(member)}
            className="h-9 rounded-md px-2.5 text-xs font-bold text-[#173b30] hover:bg-[#e8f2ed]"
          >
            <Eye className="size-4" />
            View
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onToggle(member.id)}
            className="size-9 rounded-md text-[#71837a] hover:bg-[#e8f2ed] hover:text-[#173b30]"
            aria-label={
              member.status === "Active"
                ? `Deactivate ${member.name}`
                : `Activate ${member.name}`
            }
            title={
              member.status === "Active"
                ? "Deactivate agent"
                : "Activate agent"
            }
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

/* =========================================================
   MOBILE CARD
========================================================= */

function StaffCard({
  member,
  onView,
  onToggle,
}: {
  member: StaffMember;
  onView: (member: StaffMember) => void;
  onToggle: (id: string) => void;
}) {
  const initials = getInitials(member.name);

  return (
    <Card className="overflow-hidden rounded-xl border-[#d8e2db] bg-white shadow-sm">
      <div className="h-1 bg-[#b9ec4f]" />

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e8f2ed] text-sm font-bold text-[#173b30]">
              {initials}
            </div>

            <div className="min-w-0">
              <button
                type="button"
                onClick={() => onView(member)}
                className="block max-w-full truncate text-left text-[15px] font-bold text-[#173b30]"
              >
                {member.name}
              </button>

              <p className="mt-0.5 truncate text-xs text-[#7a8d84]">
                {member.id} · @{member.username}
              </p>
            </div>
          </div>

          <StatusBadge status={member.status} />
        </div>

        <div className="mt-4 grid gap-2 rounded-lg bg-[#f7faf7] p-3">
          <div className="flex items-center gap-2 text-sm text-[#587067]">
            <Phone className="size-3.5 text-[#71837a]" />
            <span className="truncate">{member.phone}</span>
          </div>

          {member.email && (
            <div className="flex items-center gap-2 text-sm text-[#587067]">
              <Mail className="size-3.5 text-[#71837a]" />
              <span className="truncate">{member.email}</span>
            </div>
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-lg border border-[#d8e2db]">
          <MiniStat
            label="Today"
            value={money(member.todayCollection)}
          />
          <MiniStat
            label="Month"
            value={money(member.totalCollection)}
          />
          <MiniStat
            label="Pending"
            value={String(member.pendingApproval)}
          />
        </div>

        <div className="mt-4 flex gap-2 border-t border-[#edf2ee] pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onView(member)}
            className="h-10 flex-1 border-[#d8e2db] bg-white text-sm font-bold text-[#173b30] hover:bg-[#f7faf7]"
          >
            <Eye className="size-4" />
            View details
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => onToggle(member.id)}
            className="h-10 px-3 text-xs font-bold text-[#587067] hover:bg-[#f7faf7] hover:text-[#173b30]"
          >
            {member.status === "Active"
              ? "Deactivate"
              : "Activate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 border-r border-[#d8e2db] p-2.5 last:border-r-0">
      <p className="truncate text-[10px] font-bold uppercase tracking-wide text-[#87968f]">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-bold text-[#173b30]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
  status,
}: {
  status: StaffMember["status"];
}) {
  return status === "Active" ? (
    <Badge
      variant="outline"
      className="rounded-full border-[#b9ec4f] bg-[#f5fbdc] px-2.5 py-1 text-[11px] font-bold text-[#315341]"
    >
      <span className="mr-1.5 size-1.5 rounded-full bg-[#72a900]" />
      Active
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="rounded-full border-[#d8e2db] bg-[#f7faf7] px-2.5 py-1 text-[11px] font-bold text-[#71837a]"
    >
      <span className="mr-1.5 size-1.5 rounded-full bg-[#9aa9a2]" />
      Inactive
    </Badge>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  search,
  onClear,
}: {
  search: string;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-[#e8f2ed] text-[#173b30]">
        <Search className="size-5" />
      </div>

      <h3 className="mt-4 text-base font-bold text-[#173b30]">
        No field agents found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-[#71837a]">
        {search
          ? "Try another name, username, ID or phone number."
          : "No agents match the selected filters."}
      </p>

      <Button
        type="button"
        variant="outline"
        onClick={onClear}
        className="mt-4 border-[#d8e2db] text-[#173b30]"
      >
        Clear filters
      </Button>
    </div>
  );
}

/* =========================================================
   CREATE AGENT MODAL
========================================================= */

function CreateAgentModal({
  form,
  error,
  onChange,
  onClose,
  onSubmit,
}: {
  form: typeof emptyForm;
  error: string;
  onChange: (
    field: keyof typeof emptyForm,
    value: string,
  ) => void;
  onClose: () => void;
  onSubmit: (
    event: React.FormEvent<HTMLFormElement>,
  ) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173b30]/45 p-3 backdrop-blur-xl backdrop-saturate-50 sm:p-5">
      <Card className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl border-0 bg-white shadow-[0_24px_80px_rgba(10,45,34,0.28)]">
        <CardHeader className="border-b border-[#d8e2db] bg-[#f7faf7] px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#638d17]">
                New field agent
              </p>

              <CardTitle className="mt-1 text-xl font-bold text-[#173b30]">
                Add agent
              </CardTitle>

              <p className="mt-1 text-sm text-[#71837a]">
                Create secure login access for a field agent.
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
              className="size-9 rounded-lg text-[#71837a] hover:bg-[#e8f2ed] hover:text-[#173b30]"
            >
              <X className="size-4" />
            </Button>
          </div>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="max-h-[65vh] overflow-y-auto p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full name *">
                <Input
                  value={form.name}
                  onChange={(event) =>
                    onChange("name", event.target.value)
                  }
                  placeholder="Rahul Kumar"
                  className="h-11 border-[#d8e2db] text-sm focus-visible:ring-[#b9ec4f]/40"
                />
              </FormField>

              <FormField label="Phone number *">
                <Input
                  value={form.phone}
                  onChange={(event) =>
                    onChange("phone", event.target.value)
                  }
                  placeholder="+91 98765 43210"
                  className="h-11 border-[#d8e2db] text-sm focus-visible:ring-[#b9ec4f]/40"
                />
              </FormField>

              <FormField label="Email">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    onChange("email", event.target.value)
                  }
                  placeholder="name@company.com"
                  className="h-11 border-[#d8e2db] text-sm focus-visible:ring-[#b9ec4f]/40"
                />
              </FormField>

              <FormField label="Username *">
                <Input
                  value={form.username}
                  onChange={(event) =>
                    onChange("username", event.target.value)
                  }
                  placeholder="rahul01"
                  className="h-11 border-[#d8e2db] text-sm focus-visible:ring-[#b9ec4f]/40"
                />
              </FormField>

              <FormField label="Password *">
                <Input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    onChange("password", event.target.value)
                  }
                  placeholder="Minimum 6 characters"
                  className="h-11 border-[#d8e2db] text-sm focus-visible:ring-[#b9ec4f]/40"
                />
              </FormField>

              <FormField label="Confirm password *">
                <Input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) =>
                    onChange(
                      "confirmPassword",
                      event.target.value,
                    )
                  }
                  placeholder="Re-enter password"
                  className="h-11 border-[#d8e2db] text-sm focus-visible:ring-[#b9ec4f]/40"
                />
              </FormField>
            </div>

            <div className="mt-5 rounded-xl border border-[#d8e2db] bg-[#f7faf7] p-4">
              <p className="text-sm font-bold text-[#173b30]">
                Access status
              </p>

              <p className="mt-1 text-xs text-[#71837a]">
                Choose whether this agent can access the
                collection workspace immediately.
              </p>

              <div className="mt-3 flex gap-2">
                {(["Active", "Inactive"] as const).map(
                  (status) => (
                    <Button
                      key={status}
                      type="button"
                      variant="outline"
                      onClick={() =>
                        onChange("status", status)
                      }
                      className={
                        form.status === status
                          ? "border-[#0b4a35] bg-[#0b4a35] text-white hover:bg-[#0b4a35] hover:text-white"
                          : "border-[#d8e2db] bg-white text-[#587067]"
                      }
                    >
                      {status}
                    </Button>
                  ),
                )}
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}
          </CardContent>

          <div className="flex flex-col-reverse gap-2 border-t border-[#d8e2db] bg-white p-4 sm:flex-row sm:justify-end sm:p-5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 border-[#d8e2db] text-[#587067]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="h-10 bg-[#b9ec4f] font-bold text-[#173b30] hover:bg-[#c7f467]"
            >
              <UserPlus className="size-4" />
              Create staff
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-[#526b60]">
      {label}
      {children}
    </label>
  );
}

/* =========================================================
   DETAIL DRAWER
========================================================= */

function StaffDetail({
  member,
  onClose,
  onToggle,
}: {
  member: StaffMember;
  onClose: () => void;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-[#173b30]/45 backdrop-blur-xl backdrop-saturate-50">
      <button
        type="button"
        aria-label="Close agent details"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto border-0 bg-white shadow-[0_24px_80px_rgba(10,45,34,0.28)]">
        <div className="sticky top-0 z-10 border-b border-[#d8e2db] bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#638d17]">
                Field agent profile
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#173b30]">
                {member.name}
              </h2>

              <p className="mt-1 text-sm text-[#71837a]">
                {member.id} · @{member.username}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close staff details"
              className="size-9 rounded-lg text-[#71837a] hover:bg-[#e8f2ed]"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={member.status} />

            <Badge
              variant="outline"
              className="border-[#d8e2db] px-2.5 py-1 text-xs text-[#587067]"
            >
              <Phone className="mr-1.5 size-3.5" />
              {member.phone}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DetailStat
              label="Today's collection"
              value={money(member.todayCollection)}
            />

            <DetailStat
              label="This week"
              value="₹42,800"
            />

            <DetailStat
              label="This month"
              value={money(member.totalCollection)}
            />

            <DetailStat
              label="Pending approval"
              value={String(member.pendingApproval)}
            />
          </div>

          <section>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#173b30]">
                  Agent information
                </h3>

                <p className="mt-1 text-xs text-[#71837a]">
                  Account and access details.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onToggle(member.id)}
                className="border-[#d8e2db] text-xs font-bold text-[#173b30]"
              >
                {member.status === "Active"
                  ? "Deactivate"
                  : "Activate"}
              </Button>
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border border-[#d8e2db]">
              <DetailRow
                icon={Mail}
                label="Email"
                value={member.email || "Not provided"}
              />

              <DetailRow
                icon={Phone}
                label="Phone"
                value={member.phone}
              />

              <DetailRow
                icon={Users}
                label="Created"
                value={member.createdDate}
              />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#173b30]">
                  Collection history
                </h3>

                <p className="mt-1 text-xs text-[#71837a]">
                  Recent collection activity.
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-bold text-[#173b30] hover:bg-[#e8f2ed]"
              >
                <KeyRound className="size-3.5" />
                Reset password
              </Button>
            </div>

            <div className="mt-3 rounded-xl border border-[#d8e2db] bg-[#f7faf7] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#173b30]">
                    Customer collection
                  </p>

                  <p className="mt-1 text-xs text-[#71837a]">
                    Today · Submitted for approval
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-[11px] font-bold text-amber-700"
                >
                  Pending
                </Badge>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

function DetailStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#d8e2db] bg-[#f7faf7] p-4">
      <p className="text-xs font-medium text-[#71837a]">
        {label}
      </p>

      <p className="mt-1.5 text-lg font-bold text-[#173b30]">
        {value}
      </p>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#edf2ee] px-4 py-3.5 last:border-b-0">
      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#e8f2ed] text-[#173b30]">
        <Icon className="size-3.5" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#87968f]">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-[#173b30]">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SELECT CONTROL
========================================================= */

function SelectControl({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  ariaLabel: string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-lg border border-[#d8e2db] bg-white px-3 text-sm font-medium text-[#173b30] outline-none transition focus:border-[#173b30] focus:ring-2 focus:ring-[#b9ec4f]/30"
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

  return initials || "FA";
}

export default TeamSection;
