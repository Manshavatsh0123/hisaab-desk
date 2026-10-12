
"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { OverviewSection } from "@/components/dashboard/sections/overview";
import { PipelineSection } from "@/components/dashboard/sections/pipeline";
import { DealsSection } from "@/components/dashboard/sections/deals";
import { TeamSection } from "@/components/dashboard/sections/team";
import { ApprovalsSection } from "@/components/dashboard/sections/approvals";
import { ReportsSection } from "@/components/dashboard/sections/reports";
import { SettingsSection } from "@/components/dashboard/sections/settings";
import AdminLogin from "@/components/dashboard/AdminLogin";

export type Section =
  | "overview"
  | "pipeline"
  | "deals"
  | "team"
  | "approvals"
  | "reports"
  | "settings";

export default function Dashboard() {
  const [activeSection, setActiveSection] =
    useState<Section>("overview");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for an existing login when the page loads.
  useEffect(() => {
    const token = localStorage.getItem("hisaabsaathi_token");

    setIsAuthenticated(Boolean(token));
    setAuthChecked(true);
  }, []);

  // Called by AdminLogin after successful authentication.
  function handleLoginSuccess() {
    setIsAuthenticated(true);
    setActiveSection("overview");
  }

  const renderSection = () => {
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

      case "reports":
        return <ReportsSection />;

      case "settings":
        return <SettingsSection />;

      default:
        return (
          <OverviewSection
            onNavigateToApprovals={() => setActiveSection("approvals")}
            onNavigateToAddCustomer={() => setActiveSection("pipeline")}
          />
        );
    }
  };

  // Avoid showing the login or dashboard before checking storage.
  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Checking authentication...
        </p>
      </div>
    );
  }

  // Show login if there is no saved token.
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Render the dashboard on the current page after login.
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div
        className={`flex w-full min-w-0 flex-1 flex-col transition-all duration-300 ease-out ${
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        }`}
      >
        <Header
          activeSection={activeSection}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        <main className="min-w-0 flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          <div
            key={activeSection}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
