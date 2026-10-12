import { Badge } from "@/components/ui/badge";

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

export default function StatusBadge({

  status,

}: {

  status: StaffMember["status"];

}) {

  return status === "Active" ? (

    <Badge

      variant="outline"

      className="rounded-full border border-[var(--hs-success)]/30 bg-[var(--hs-success-light)] px-2.5 py-1 text-[11px] font-semibold text-[var(--hs-success)]"

    >

      <span className="mr-1.5 size-1.5 rounded-full bg-[var(--hs-success)]" />

      Active

    </Badge>

  ) : (

    <Badge

      variant="outline"

      className="rounded-full border-[var(--hs-border)] bg-[var(--hs-background)] px-2.5 py-1 text-[11px] font-bold text-[var(--hs-text-secondary)]"

    >

      <span className="mr-1.5 size-1.5 rounded-full bg-[var(--hs-text-muted)]" />

      Inactive

    </Badge>

  );

}