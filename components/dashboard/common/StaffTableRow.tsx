
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Phone } from "lucide-react";
import StatusBadge from "./StatusBadge";
import getInitials from "./getInitials";
import { money } from "./staff.utils";

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


export default function StaffTableRow({

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

    <tr className="group border-b border-[var(--hs-border-light)] last:border-0 hover:bg-[var(--hs-hover)]">

      <td className="px-4 py-4 lg:px-5">

        <button

          type="button"

          onClick={() => onView(member)}

          className="flex min-w-[210px] items-center gap-3 text-left"

        >

          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--hs-primary-light)] text-xs font-bold text-[var(--hs-text)] ring-1 ring-[var(--hs-border)]">

            {initials}

          </div>



          <div className="min-w-0">

            <p className="truncate text-sm font-bold text-[var(--hs-text)] group-hover:text-[var(--hs-primary)]">

              {member.name}

            </p>



            <p className="mt-0.5 truncate text-xs text-[var(--hs-text-muted)]">

              {member.id} · @{member.username}

            </p>

          </div>

        </button>

      </td>



      <td className="px-4 py-4 lg:px-5">

        <div className="flex items-center gap-2 whitespace-nowrap text-sm text-[var(--hs-text-secondary)]">

          <Phone className="size-3.5 text-[var(--hs-text-muted)]" />

          {member.phone}

        </div>

      </td>



      <td className="px-4 py-4 lg:px-5">

        <StatusBadge status={member.status} />

      </td>



      <td className="px-4 py-4 lg:px-5">

        <p className="text-sm font-bold text-[var(--hs-text)]">

          {money(member.todayCollection)}

        </p>

      </td>



      <td className="px-4 py-4 lg:px-5">

        <p className="text-sm font-bold text-[var(--hs-text)]">

          {money(member.totalCollection)}

        </p>

      </td>



      <td className="px-4 py-4 lg:px-5">

        {member.pendingApproval > 0 ? (

          <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-[var(--hs-warning-light)] px-2 py-1 text-xs font-bold text-[var(--hs-warning)]">

            {member.pendingApproval}

          </span>

        ) : (

          <span className="text-sm font-medium text-[var(--hs-text-muted)]">

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

            className="h-9 rounded-md px-2.5 text-xs font-bold text-[var(--hs-text)] hover:bg-[var(--hs-primary-light)]"

          >

            <Eye className="size-4" />

            View

          </Button>



          <Button

            type="button"

            variant="ghost"

            size="icon"

            onClick={() => onToggle(member.id)}

            className="size-9 rounded-md text-[var(--hs-text-secondary)] hover:bg-[var(--hs-primary-light)] hover:text-[var(--hs-text)]"

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