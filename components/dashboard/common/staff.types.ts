
import type { LucideIcon } from "lucide-react";

/* Staff status */
export type StaffStatus = "Active" | "Inactive";

export type StaffStatusFilter = "All" | StaffStatus;

/* Sorting options */
export type StaffSortOption =
  | "Today's Collection"
  | "This Month"
  | "Total Collection"
  | "Pending Approvals"
  | "Name";

/* Staff member data */
export interface StaffMember {
  id: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  status: StaffStatus;
  createdDate: string;
  totalCollection: number;
  todayCollection: number;
  pendingApproval: number;
}

/* Create staff form */
export interface StaffForm {
  name: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  status: StaffStatus;
}

/* Reusable statistics card data */
export interface StatItem {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
  tone?: "neutral" | "success" | "primary" | "warning";
}

/* Shared table/card action callbacks */
export interface StaffActionProps {
  onView: (member: StaffMember) => void;
  onToggle: (id: string) => void;
}
