import { Card, CardContent } from "@/components/ui/card";
import getInitials from "../common/getInitials";
import StatusBadge from "../common/StatusBadge";
import { Eye, Mail, Phone } from "lucide-react";
import MiniStat from "../common/MiniStat";
import { Button } from "@/components/ui/button";
import { money } from "../common/staff.utils";

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


export default function StaffCard({
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

    <Card className="overflow-hidden rounded-xl border-[var(--hs-border)] bg-[var(--hs-surface)] shadow-sm">

      <div className="h-1 bg-[var(--hs-primary)]" />



      <CardContent className="p-4">

        <div className="flex items-start justify-between gap-3">

          <div className="flex min-w-0 items-center gap-3">

            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--hs-primary-light)] text-sm font-bold text-[var(--hs-text)]">

              {initials}

            </div>



            <div className="min-w-0">

              <button

                type="button"

                onClick={() => onView(member)}

                className="block max-w-full truncate text-left text-[15px] font-bold text-[var(--hs-text)]"

              >

                {member.name}

              </button>



              <p className="mt-0.5 truncate text-xs text-[var(--hs-text-muted)]">

                {member.id} · @{member.username}

              </p>

            </div>

          </div>



          <StatusBadge status={member.status} />

        </div>



        <div className="mt-4 grid gap-2 rounded-lg bg-[var(--hs-background)] p-3">

          <div className="flex items-center gap-2 text-sm text-[var(--hs-text-secondary)]">

            <Phone className="size-3.5 text-[var(--hs-text-secondary)]" />

            <span className="truncate">{member.phone}</span>

          </div>



          {member.email && (

            <div className="flex items-center gap-2 text-sm text-[var(--hs-text-secondary)]">

              <Mail className="size-3.5 text-[var(--hs-text-secondary)]" />

              <span className="truncate">{member.email}</span>

            </div>

          )}

        </div>



        <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-lg border border-[var(--hs-border)]">

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



        <div className="mt-4 flex gap-2 border-t border-[var(--hs-border-light)] pt-3">

          <Button

            type="button"

            variant="outline"

            onClick={() => onView(member)}

            className="h-10 flex-1 border-[var(--hs-border)] bg-white text-sm font-bold text-[var(--hs-text)] hover:bg-[var(--hs-background)]"

          >

            <Eye className="size-4" />

            View details

          </Button>



          <Button

            type="button"

            variant="ghost"

            onClick={() => onToggle(member.id)}

            className="h-10 px-3 text-xs font-bold text-[var(--hs-text-secondary)] hover:bg-[var(--hs-background)] hover:text-[var(--hs-text)]"

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