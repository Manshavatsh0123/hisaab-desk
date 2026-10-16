
"use client";

import { useEffect, useState } from "react";
import type { Section } from "@/app/page";
import {
  Bell,
  LayoutDashboard,
  PlusCircle,
  ContactRound,
  Users,
  ClipboardCheck,
  BarChart3,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  onLogout: () => void;
}

const navItems: {
  id: Section;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "pipeline", label: "Add Customer", icon: PlusCircle },
    { id: "deals", label: "Customers", icon: ContactRound },
    { id: "team", label: "Field Agents", icon: Users },
    { id: "approvals", label: "Approvals", icon: ClipboardCheck },
  ];

export function Header({
  activeSection,
  onSectionChange,
  onLogout,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setConfirmLogout(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Close the drawer when navigating to another section.
  function navigateTo(section: Section) {
    onSectionChange(section);
    setMobileMenuOpen(false);
  }

  function handleLogout() {
    setConfirmLogout(false);
    setMobileMenuOpen(false);
    onLogout();
  }

  // Prevent background scrolling while the drawer is open.
  useEffect(() => {
    if (!mobileMenuOpen && !confirmLogout) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen, confirmLogout]);

  const navButtonClass = (active: boolean) =>
    `relative inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5
    whitespace-nowrap rounded-xl px-2 py-2 text-[11px] font-semibold
    transition-all duration-200 focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]/30
    xl:px-2.5 xl:text-xs 2xl:px-3 2xl:text-[13px]
    ${active
      ? "bg-[var(--hs-primary-light)] text-[var(--hs-primary)]"
      : "text-[var(--hs-text-secondary)] hover:bg-[var(--hs-background)] hover:text-[var(--hs-primary)]"
    }`;

  return (
    <>
      {/* Main header */}
      <header
        className={`sticky z-40 transition-all duration-300 ${isScrolled
          ? "top-0 px-2 pt-2 sm:px-4 lg:px-5"
          : "top-0 px-0"
          }`}
      >
        <nav
          aria-label="Main navigation"
          className={`relative mx-auto transition-all duration-300 ${isScrolled
            ? "max-w-[1540px] rounded-xl border border-[var(--hs-border)] bg-white/95 shadow-lg shadow-slate-900/[0.05] backdrop-blur-xl sm:rounded-2xl"
            : "w-full border-b border-[var(--hs-border-light)] bg-white"
            }`}
        >
          {/* Main navbar row */}
          <div
            className={`flex min-h-[64px] items-center justify-between gap-2 px-3 transition-all duration-300 sm:gap-3 sm:px-5 lg:px-6 ${isScrolled ? "sm:min-h-[66px]" : "sm:min-h-[74px]"
              }`}
          >
            {/* Logo */}
            <button
              type="button"
              onClick={() => navigateTo("overview")}
              aria-label="Go to HisaabSaathi overview"
              className="group flex shrink-0 items-center text-left"
            >
              <span className="flex h-20 w-80 shrink-0 items-center justify-start">
                <Image
                  src="/Logo1.png"
                  alt="HisaabSaathi Logo"
                  width={256}
                  height={288}
                  priority
                  className="h-32 w-40 object-contain object-left md:h-72 md:w-64"
                />
              </span>
            </button>

            <div className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
              <div className="flex items-center gap-0.5 2xl:gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigateTo(item.id)}
                      aria-current={active ? "page" : undefined}
                      className={navButtonClass(active)}
                    >
                      <Icon className="size-4 shrink-0" />
                      {item.label}

                      {active && (
                        <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-[var(--hs-primary)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right-side actions */}
            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                aria-label="Open approvals"
                title="Approvals"
                onClick={() => navigateTo("approvals")}
                className="group flex size-9 items-center justify-center rounded-xl text-[var(--hs-text-secondary)] transition-colors hover:bg-[var(--hs-primary-light)] hover:text-[var(--hs-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]/30 sm:size-10"
              >
                <Bell
                  className="size-[18px] transition-transform duration-200 group-hover:-rotate-6 sm:size-[19px]"
                  strokeWidth={1.8}
                />
              </button>

              <span className="mx-1 hidden h-6 w-px bg-[var(--hs-border)] sm:block" />

              <button
                type="button"
                aria-label="Logout"
                title="Logout"
                onClick={() => setConfirmLogout(true)}
                className="group flex size-9 items-center justify-center rounded-xl text-[var(--hs-text-secondary)] transition-colors hover:bg-red-50 hover:text-[var(--hs-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]/30 sm:size-10"
              >
                <LogOut
                  className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5 sm:size-[19px]"
                  strokeWidth={1.8}
                />
              </button>

              {/* Mobile and tablet menu */}
              <button
                type="button"
                aria-label={
                  mobileMenuOpen
                    ? "Close navigation"
                    : "Open navigation"
                }
                aria-controls="mobile-navigation"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((value) => !value)}
                className="flex size-9 items-center justify-center rounded-xl text-[var(--hs-text-secondary)] transition-colors hover:bg-[var(--hs-background)] hover:text-[var(--hs-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]/30 sm:size-10 xl:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile and tablet side drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] xl:hidden">
  
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-slate-950/40 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <aside
            id="mobile-navigation"
            aria-label="Dashboard navigation"
            className="absolute inset-y-0 right-0 flex h-[100dvh] w-[min(84vw,360px)] flex-col border-l border-[var(--hs-border)] bg-white shadow-2xl sm:w-[min(60vw,400px)] md:w-[min(48vw,440px)]"
          >
            {/* Drawer header */}
            <div className="flex min-h-[68px] shrink-0 items-center justify-between gap-3 border-b border-[var(--hs-border-light)] px-4 sm:px-5">
              <img
                src="/Logo1.png"
                alt="HisaabSaathi"
                className="h-10 w-36 object-contain object-left"
              />

              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setMobileMenuOpen(false)}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl text-[var(--hs-text-secondary)] transition hover:bg-[var(--hs-background)] hover:text-[var(--hs-primary)]"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Navigation options */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
              <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--hs-text-muted)]">
                Main menu
              </p>

              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-current={active ? "page" : undefined}
                      onClick={() => navigateTo(item.id)}
                      className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition-colors sm:px-4 ${active
                        ? "border-[var(--hs-primary-border)] bg-[var(--hs-primary-light)] text-[var(--hs-primary)]"
                        : "border-transparent text-[var(--hs-text-secondary)] hover:border-[var(--hs-border)] hover:bg-[var(--hs-background)] hover:text-[var(--hs-primary)]"
                        }`}
                    >
                      <Icon className="size-[19px] shrink-0" />
                      <span className="flex-1">{item.label}</span>

                      {active && (
                        <span className="size-2 shrink-0 rounded-full bg-[var(--hs-primary)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer footer */}
            <div className="shrink-0 border-t border-[var(--hs-border-light)] p-4 sm:p-5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setConfirmLogout(true);
                }}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[var(--hs-primary-border)] px-4 py-3 text-sm font-semibold text-[var(--hs-primary)] transition-colors hover:bg-[var(--hs-primary-light)]"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Logout confirmation */}
      {confirmLogout && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setConfirmLogout(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-2xl border border-[var(--hs-border)] bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--hs-primary-light)] text-[var(--hs-primary)]">
              <LogOut className="size-6" />
            </div>

            <h2
              id="logout-title"
              className="mt-4 text-lg font-bold text-[var(--hs-text)]"
            >
              Log out of HisaabSaathi?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--hs-text-secondary)]">
              You will be signed out of your administrator session and
              need to log in again to access the dashboard.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={() => setConfirmLogout(false)}
                className="min-h-10 rounded-xl border border-[var(--hs-border)] px-4 py-2.5 text-sm font-semibold text-[var(--hs-text-secondary)] transition hover:bg-[var(--hs-background)]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--hs-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--hs-primary-dark)]"
              >
                <LogOut className="size-4" />
                Yes, logout
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}