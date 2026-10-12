import type {
  StaffMember,
  StaffSortOption,
  StaffStatusFilter,
} from "./staff.types";

/**
 * Format a number as Indian Rupees.
 * Example: 12500 -> ₹12,500
 */
export function money(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  return `₹${safeAmount.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Generate initials from a person's name.
 * Example: Rahul Kumar -> RK
 */
export function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2) || "FA"
  );
}

/**
 * Filter staff by search query and status,
 * then sort according to the selected option.
 */
export function filterAndSortStaff(
  staff: StaffMember[],
  search: string,
  statusFilter: StaffStatusFilter,
  sortBy: StaffSortOption,
): StaffMember[] {
  const query = search.trim().toLowerCase();

  return staff
    .filter((member) => {
      const searchableText = [
        member.name,
        member.username,
        member.id,
        member.phone,
        member.email,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        member.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Name":
          return a.name.localeCompare(b.name);

        case "Pending Approvals":
          return b.pendingApproval - a.pendingApproval;

        case "This Month":
        case "Total Collection":
          return b.totalCollection - a.totalCollection;

        case "Today's Collection":
        default:
          return b.todayCollection - a.todayCollection;
      }
    });
}

/**
 * Validate the create-agent form.
 */
export function validateStaffForm(
  form: {
    name: string;
    phone: string;
    username: string;
    password: string;
    confirmPassword: string;
  },
  staff: StaffMember[],
): string {
  if (
    !form.name.trim() ||
    !form.username.trim() ||
    !form.password
  ) {
    return "Name, username, and password are required.";
  }

  const phoneDigits = form.phone.replace(/\D/g, "");

  if (phoneDigits.length < 10) {
    return "Enter a valid phone number.";
  }

  const usernameExists = staff.some(
    (member) =>
      member.username.toLowerCase() ===
      form.username.trim().toLowerCase(),
  );

  if (usernameExists) {
    return "This username is already in use.";
  }

  if (form.password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  if (form.password !== form.confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
}
