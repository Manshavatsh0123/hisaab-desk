import { Bell } from "lucide-react";

export default function EmptyState() {
    return (
        <div className="flex flex-col items-center px-5 py-12 text-center sm:py-14">
            <span className="grid size-11 place-items-center rounded-full bg-[var(--hs-background)] text-[var(--hs-text-muted)]">
                <Bell aria-hidden="true" className="size-5" />
            </span>
            <h3 className="mt-3 text-sm font-semibold text-[var(--hs-text)]">
                No pending collections
            </h3>
            <p className="mt-1 max-w-sm text-sm text-[var(--hs-text-secondary)]">
                You’re all caught up. New pending submissions will appear here automatically.
            </p>
        </div>
    );
}