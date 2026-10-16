
"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Header } from "@/components/dashboard/header";
import { OverviewSection } from "@/components/dashboard/sections/overview";
import { PipelineSection } from "@/components/dashboard/sections/pipeline";
import { DealsSection } from "@/components/dashboard/sections/deals";
import { TeamSection } from "@/components/dashboard/sections/team";
import { ApprovalsSection } from "@/components/dashboard/sections/approvals";
import AdminLogin from "@/components/dashboard/AdminLogin";

import {
  AUTH_KEYS,
  baseApi,
  clearStoredSession,
  SESSION_MAX_AGE_MS,
} from "@/lib/baseApi";

export type Section =
  | "overview"
  | "pipeline"
  | "deals"
  | "team"
  | "approvals"
  | "reports"
  | "settings";

export default function Dashboard() {
  const dispatch = useDispatch();

  const [activeSection, setActiveSection] =
    useState<Section>("overview");
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_KEYS.access);
    const startedAt = Number(
      localStorage.getItem(AUTH_KEYS.startedAt),
    );

    const browserSession = sessionStorage.getItem(
      "hisaabsaathi_browser_session",
    );

    const validStart =
      Number.isFinite(startedAt) && startedAt > 0;

    const sessionWithinLimit =
      validStart &&
      Date.now() - startedAt < SESSION_MAX_AGE_MS;

    if (token && browserSession === "active" && sessionWithinLimit) {
      setIsAuthenticated(true);
    } else {
      clearStoredSession();
      sessionStorage.removeItem("hisaabsaathi_browser_session");
      dispatch(baseApi.util.resetApiState());
      setIsAuthenticated(false);
    }

    setAuthChecked(true);
  }, [dispatch]);

  const handleLoginSuccess = useCallback(() => {
    sessionStorage.setItem(
      "hisaabsaathi_browser_session",
      "active",
    );

    setIsAuthenticated(true);
    setActiveSection("overview");
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("hisaabsaathi_browser_session");

    clearStoredSession();
    dispatch(baseApi.util.resetApiState());

    setIsAuthenticated(false);
    setActiveSection("overview");
  }, [dispatch]);

  function renderSection() {
    switch (activeSection) {
      case "overview":
        return (
          <OverviewSection
            onNavigateToApprovals={() => setActiveSection("approvals")}
            onNavigateToAddCustomer={() => setActiveSection("pipeline")}
          />
        );

      case "pipeline":
        return <PipelineSection />;

      case "deals":
        return <DealsSection />;

      case "team":
        return <TeamSection />;

      case "approvals":
        return <ApprovalsSection />;

      default:
        return (
          <OverviewSection
            onNavigateToApprovals={() => setActiveSection("approvals")}
            onNavigateToAddCustomer={() => setActiveSection("pipeline")}
          />
        );
    }
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--hs-background)]">
        <p className="text-sm text-[var(--hs-text-secondary)]">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[var(--hs-background)]">
      <Header
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />

      <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div
          key={activeSection}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
