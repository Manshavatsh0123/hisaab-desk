import { Button } from "@/components/ui/button";
import { KeyRound, Mail, Phone, Users, X } from "lucide-react";
import DetailStat from "./DetailStat";
import DetailRow from "./DetailRow";
import StatusBadge from "./StatusBadge";
import { Badge } from "@/components/ui/badge";
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

export default function StaffDetail({
    member,
    onClose,
    onToggle,
}: {
    member: StaffMember;
    onClose: () => void;
    onToggle: (id: string) => void;
}) {

    return (

        <div className="fixed inset-0 z-50 bg-[var(--hs-text)]/45 backdrop-blur-xl backdrop-saturate-50">

            <button

                type="button"
                aria-label="Close agent details"
                onClick={onClose}
                className="absolute inset-0 cursor-default"

            />



            <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto border-0 bg-white shadow-[0_24px_80px_rgba(38,54,77,0.18)]">

                <div className="sticky top-0 z-10 border-b border-[var(--hs-border)] bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>

                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--hs-primary)]">
                                Field agent profile
                            </p>



                            <h2 className="mt-1 text-2xl font-bold text-[var(--hs-text)]">

                                {member.name}

                            </h2>



                            <p className="mt-1 text-sm text-[var(--hs-text-secondary)]">

                                {member.id} · @{member.username}

                            </p>

                        </div>



                        <Button

                            variant="ghost"

                            size="icon"

                            onClick={onClose}

                            aria-label="Close staff details"

                            className="size-9 rounded-lg text-[var(--hs-text-secondary)] hover:bg-[var(--hs-primary-light)]"

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
                            className="border-[var(--hs-border)] px-2.5 py-1 text-xs text-[var(--hs-text-secondary)]"
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

                                <h3 className="text-base font-bold text-[var(--hs-text)]">

                                    Agent information

                                </h3>



                                <p className="mt-1 text-xs text-[var(--hs-text-secondary)]">

                                    Account and access details.

                                </p>

                            </div>



                            <Button

                                type="button"

                                variant="outline"

                                size="sm"

                                onClick={() => onToggle(member.id)}

                                className="border-[var(--hs-border)] text-xs font-bold text-[var(--hs-text)]"

                            >

                                {member.status === "Active"

                                    ? "Deactivate"

                                    : "Activate"}

                            </Button>

                        </div>



                        <div className="mt-3 overflow-hidden rounded-xl border border-[var(--hs-border)]">

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

                                <h3 className="text-base font-bold text-[var(--hs-text)]">

                                    Collection history

                                </h3>



                                <p className="mt-1 text-xs text-[var(--hs-text-secondary)]">

                                    Recent collection activity.

                                </p>

                            </div>



                            <Button

                                variant="ghost"

                                size="sm"

                                className="text-xs font-bold text-[var(--hs-text)] hover:bg-[var(--hs-primary-light)]"

                            >

                                <KeyRound className="size-3.5" />

                                Reset password

                            </Button>

                        </div>



                        <div className="mt-3 rounded-xl border border-[var(--hs-border)] bg-[var(--hs-background)] p-4">

                            <div className="flex items-start justify-between gap-3">

                                <div>

                                    <p className="text-sm font-bold text-[var(--hs-text)]">

                                        Customer collection

                                    </p>



                                    <p className="mt-1 text-xs text-[var(--hs-text-secondary)]">

                                        Today · Submitted for approval

                                    </p>

                                </div>



                                <Badge

                                    variant="outline"

                                    className="border-[var(--hs-accent)] bg-[var(--hs-warning-light)] text-[11px] font-bold text-[var(--hs-warning)]"

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