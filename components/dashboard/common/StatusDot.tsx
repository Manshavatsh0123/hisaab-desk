export default function StatusDot({ unread }: { unread: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${unread ? "text-[var(--hs-primary)]" : "text-[var(--hs-text-muted)]"
                }`}
        >
            <span
                className={`size-1.5 rounded-full ${unread ? "bg-[var(--hs-primary)]" : "bg-[var(--hs-text-muted)]"
                    }`}
            />
            {unread ? "New" : "Seen"}
        </span>
    );
}