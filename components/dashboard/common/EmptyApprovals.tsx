import { CheckCircle2 } from "lucide-react";

export default function EmptyApprovals() {

    return (

        <div className="flex flex-col items-center justify-center rounded-b-xl border-x border-b border-[var(--hs-border)] bg-[var(--hs-surface)] px-5 py-16 text-center">
            <div className="grid size-12 place-items-center rounded-full bg-[var(--hs-primary-light)] text-[var(--hs-primary-dark)]">
                <CheckCircle2 className="size-6" />
            </div>

            <h3 className="mt-4 text-base font-bold text-[var(--hs-text)]"> All caught up </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--hs-text-secondary)]">
                There are no collection entries waiting for approval.
            </p>
        </div>
    );

}