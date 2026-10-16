
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
    CalendarDays,
    Check,
    Copy,
    Eye,
    EyeOff,
    KeyRound,
    Mail,
    Phone,
    ShieldCheck,
    UserRound,
    Wallet,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
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

interface StaffDetailProps {
    member: StaffMember;
    onClose: () => void;
    onToggle: (id: string) => void;
    onResetPassword?: (id: string) => void;
}

const panel =
    "min-w-0 rounded-[8px] border border-[var(--hs-border)] bg-white";

export default function StaffDetail({
    member,
    onClose,
    onToggle,
    onResetPassword,
}: StaffDetailProps) {
    const [mounted, setMounted] = useState(false);
    const [showUsername, setShowUsername] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setMounted(true);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const copyUsername = async () => {
        if (!member.username || member.username === "—") return;

        try {
            await navigator.clipboard.writeText(member.username);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    };

    const initials =
        member.name
            ?.trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase() || "SA";

    // Portal places the drawer above the dashboard navbar and its stacking context.
    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999]">
            {/* Overlay */}
            <button
                type="button"
                aria-label="Close staff profile"
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/35"
            />

            {/* Drawer */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="staff-profile-title"
                className="absolute inset-y-0 right-0 flex h-[100dvh] w-full flex-col overflow-hidden border-l border-[var(--hs-border)] bg-white shadow-2xl sm:w-[94vw] sm:max-w-[1100px] xl:max-w-[1250px]"
            >
                {/* Fixed header: never covered by the dashboard navbar */}
                <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-[var(--hs-border)] bg-white px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="grid size-11 shrink-0 place-items-center rounded-[8px] bg-[var(--hs-primary-light)] text-sm font-bold text-[var(--hs-primary)]">
                            {initials}
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--hs-primary)]">
                                Field agent profile
                            </p>

                            <h2
                                id="staff-profile-title"
                                className="truncate text-lg font-bold text-[var(--hs-text)] sm:text-xl"
                            >
                                {member.name}
                            </h2>

                            <p className="truncate text-xs text-[var(--hs-text-secondary)]">
                                Staff ID: {member.id} · @{member.username || "—"}
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Close staff profile"
                        className="size-9 shrink-0 rounded-[8px]"
                    >
                        <X className="size-4" />
                    </Button>
                </header>

                {/* Only this content region scrolls when necessary */}
                <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--hs-background)] p-3 sm:p-5">
                    <div className="space-y-4">
                        {/* Status */}
                        <section className={`${panel} flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4`}>
                            <div className="flex min-w-0 items-center gap-3">
                                <StatusBadge status={member.status} />
                                <span className="hidden truncate text-xs text-[var(--hs-text-secondary)] sm:inline">
                                    Agent account status
                                </span>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onToggle(member.id)}
                                className="h-9 shrink-0 rounded-[8px] text-xs font-semibold"
                            >
                                {member.status === "Active" ? "Deactivate" : "Activate"}
                            </Button>
                        </section>

                        {/* Statistics */}
                        <section>
                            <div className="mb-2">
                                <h3 className="text-sm font-bold text-[var(--hs-text)]">
                                    Collection overview
                                </h3>
                                <p className="mt-0.5 text-xs text-[var(--hs-text-secondary)]">
                                    Summary of recorded activity.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                <Stat
                                    label="Today"
                                    value={money(member.todayCollection)}
                                    icon={<Wallet className="size-4" />}
                                />
                                <Stat
                                    label="This month"
                                    value={money(member.totalCollection)}
                                    icon={<CalendarDays className="size-4" />}
                                />
                                <Stat
                                    label="Pending approvals"
                                    value={String(member.pendingApproval)}
                                    icon={<ShieldCheck className="size-4" />}
                                />
                                <Stat
                                    label="Account"
                                    value={member.status}
                                    icon={<UserRound className="size-4" />}
                                />
                            </div>
                        </section>

                        {/* Credentials and contact details */}
                        <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-2">
                            <section className={`${panel} overflow-hidden`}>
                                <SectionHeading
                                    icon={<KeyRound className="size-4" />}
                                    title="Login credentials"
                                    subtitle="Agent sign-in information"
                                />

                                <div className="space-y-3 p-3 sm:p-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-[var(--hs-text-secondary)]">
                                            Username
                                        </label>

                                        <div className="flex min-w-0 items-center gap-1.5">
                                            <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-[8px] border border-[var(--hs-border)] bg-white px-2.5">
                                                <UserRound className="size-4 shrink-0 text-[var(--hs-text-muted)]" />
                                                <span className="truncate text-sm font-medium text-[var(--hs-text)]">
                                                    {showUsername
                                                        ? member.username || "Not provided"
                                                        : "••••••••"}
                                                </span>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                aria-label={showUsername ? "Hide username" : "Show username"}
                                                onClick={() => setShowUsername((value) => !value)}
                                                className="size-10 shrink-0 rounded-[8px]"
                                            >
                                                {showUsername ? (
                                                    <EyeOff className="size-4" />
                                                ) : (
                                                    <Eye className="size-4" />
                                                )}
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                aria-label="Copy username"
                                                disabled={!member.username || member.username === "—"}
                                                onClick={copyUsername}
                                                className="size-10 shrink-0 rounded-[8px]"
                                            >
                                                {copied ? (
                                                    <Check className="size-4 text-emerald-600" />
                                                ) : (
                                                    <Copy className="size-4" />
                                                )}
                                            </Button>
                                        </div>

                                        {copied && (
                                            <p role="status" className="mt-1 text-xs text-emerald-700">
                                                Username copied
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-[var(--hs-text-secondary)]">
                                            Password
                                        </label>

                                        <div className="flex items-start gap-2 rounded-[8px] bg-[var(--hs-background)] p-3">
                                            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--hs-success)]" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-[var(--hs-text)]">
                                                    Password protected
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-[var(--hs-text-secondary)]">
                                                    Existing passwords cannot be retrieved from a securely
                                                    hashed database.
                                                </p>
                                            </div>
                                        </div>

                                        {onResetPassword && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => onResetPassword(member.id)}
                                                className="mt-2 h-9 w-full rounded-[8px] border-[var(--hs-primary-border)] text-xs font-semibold text-[var(--hs-primary)] hover:bg-[var(--hs-primary-light)]"
                                            >
                                                <KeyRound className="mr-2 size-3.5" />
                                                Reset password
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className={`${panel} overflow-hidden`}>
                                <SectionHeading
                                    icon={<UserRound className="size-4" />}
                                    title="Agent information"
                                    subtitle="Contact and account details"
                                />

                                <div className="divide-y divide-[var(--hs-border-light)]">
                                    <InfoRow
                                        icon={<Phone className="size-4" />}
                                        label="Phone number"
                                        value={member.phone || "Not provided"}
                                    />
                                    <InfoRow
                                        icon={<Mail className="size-4" />}
                                        label="Email address"
                                        value={member.email || "Not provided"}
                                    />
                                    <InfoRow
                                        icon={<CalendarDays className="size-4" />}
                                        label="Date created"
                                        value={member.createdDate || "Not available"}
                                    />
                                </div>
                            </section>
                        </div>
                    </div>
                </main>

                {/* Fixed footer */}
                <footer className="z-10 flex shrink-0 justify-end border-t border-[var(--hs-border)] bg-white px-4 py-3 sm:px-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="h-9 min-w-24 rounded-[8px] font-semibold"
                    >
                        Close
                    </Button>
                </footer>
            </aside>
        </div>,
        document.body
    );
}

function SectionHeading({
    icon,
    title,
    subtitle,
}: {
    icon: ReactNode;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="flex items-center gap-3 border-b border-[var(--hs-border-light)] px-3 py-3 sm:px-4">
            <div className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-[var(--hs-primary-light)] text-[var(--hs-primary)]">
                {icon}
            </div>
            <div className="min-w-0">
                <h3 className="text-sm font-bold text-[var(--hs-text)]">{title}</h3>
                <p className="mt-0.5 truncate text-xs text-[var(--hs-text-secondary)]">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

function Stat({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: ReactNode;
}) {
    return (
        <div className={`${panel} p-3`}>
            <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-[var(--hs-text-secondary)]">
                    {label}
                </span>
                <span className="shrink-0 text-[var(--hs-primary)]">{icon}</span>
            </div>
            <p className="mt-1 truncate text-base font-bold text-[var(--hs-text)] sm:text-lg">
                {value}
            </p>
        </div>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex min-w-0 items-center gap-3 px-3 py-3 sm:px-4">
            <div className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-[var(--hs-background)] text-[var(--hs-text-secondary)]">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--hs-text-muted)]">
                    {label}
                </p>
                <p className="mt-1 break-words text-sm font-medium text-[var(--hs-text)]">
                    {value}
                </p>
            </div>
        </div>
    );
}
