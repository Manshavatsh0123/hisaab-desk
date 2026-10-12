
"use client";

import type { FormEvent } from "react";
import type { StaffForm } from "./staff.types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FormField from "./FormField";
import { UserPlus, X } from "lucide-react";

interface CreateAgentModalProps {
  form: StaffForm;
  error: string;
  onChange: (field: keyof StaffForm, value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function CreateAgentModal({
  form,
  error,
  onChange,
  onClose,
  onSubmit,
}: CreateAgentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--hs-text)]/45 p-3 backdrop-blur-sm sm:p-5">
      <Card className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--hs-border)] bg-white shadow-[0_24px_80px_rgba(38,54,77,0.18)]">
        <CardHeader className="border-b border-[var(--hs-border)] bg-[var(--hs-background)] px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--hs-primary)]">
                New field agent
              </p>

              <CardTitle className="mt-1 text-xl font-bold text-[var(--hs-text)]">
                Add agent
              </CardTitle>

              <p className="mt-1 text-sm text-[var(--hs-text-secondary)]">
                Create secure login access for a field agent.
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
              className="size-9 rounded-lg text-[var(--hs-text-secondary)] hover:bg-[var(--hs-primary-light)] hover:text-[var(--hs-text)]"
            >
              <X className="size-4" />
            </Button>
          </div>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="max-h-[65vh] overflow-y-auto p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full name *">
                <Input
                  required
                  value={form.name}
                  onChange={(event) =>
                    onChange("name", event.target.value)
                  }
                  placeholder="Rahul Kumar"
                  className="h-11 border-[var(--hs-border)] text-sm focus-visible:ring-[var(--hs-primary)]/40"
                />
              </FormField>

              <FormField label="Phone number *">
                <Input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    onChange("phone", event.target.value)
                  }
                  placeholder="+91 98765 43210"
                  className="h-11 border-[var(--hs-border)] text-sm focus-visible:ring-[var(--hs-primary)]/40"
                />
              </FormField>

              <FormField label="Email">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    onChange("email", event.target.value)
                  }
                  placeholder="name@company.com"
                  className="h-11 border-[var(--hs-border)] text-sm focus-visible:ring-[var(--hs-primary)]/40"
                />
              </FormField>

              <FormField label="Username *">
                <Input
                  required
                  value={form.username}
                  onChange={(event) =>
                    onChange("username", event.target.value)
                  }
                  placeholder="rahul01"
                  autoComplete="username"
                  className="h-11 border-[var(--hs-border)] text-sm focus-visible:ring-[var(--hs-primary)]/40"
                />
              </FormField>

              <FormField label="Password *">
                <Input
                  required
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={(event) =>
                    onChange("password", event.target.value)
                  }
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  className="h-11 border-[var(--hs-border)] text-sm focus-visible:ring-[var(--hs-primary)]/40"
                />
              </FormField>

              <FormField label="Confirm password *">
                <Input
                  required
                  type="password"
                  minLength={6}
                  value={form.confirmPassword}
                  onChange={(event) =>
                    onChange("confirmPassword", event.target.value)
                  }
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className="h-11 border-[var(--hs-border)] text-sm focus-visible:ring-[var(--hs-primary)]/40"
                />
              </FormField>
            </div>

            <div className="mt-5 rounded-xl border border-[var(--hs-border)] bg-[var(--hs-background)] p-4">
              <p className="text-sm font-bold text-[var(--hs-text)]">
                Access status
              </p>

              <p className="mt-1 text-xs text-[var(--hs-text-secondary)]">
                Choose whether this agent can access the collection
                workspace immediately.
              </p>

              <div className="mt-3 flex gap-2">
                {(["Active", "Inactive"] as const).map((status) => (
                  <Button
                    key={status}
                    type="button"
                    variant="outline"
                    aria-pressed={form.status === status}
                    onClick={() => onChange("status", status)}
                    className={
                      form.status === status
                        ? "border-[var(--hs-primary)] bg-[var(--hs-primary)] text-white hover:bg-[var(--hs-primary-dark)] hover:text-white"
                        : "border-[var(--hs-border)] bg-white text-[var(--hs-text-secondary)]"
                    }
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-[var(--hs-primary-border)] bg-[var(--hs-danger-light)] px-3 py-2.5 text-sm font-medium text-[var(--hs-danger)]"
              >
                {error}
              </div>
            )}
          </CardContent>

          <div className="flex flex-col-reverse gap-2 border-t border-[var(--hs-border)] bg-white p-4 sm:flex-row sm:justify-end sm:p-5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 border-[var(--hs-border)] text-[var(--hs-text-secondary)]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="h-10 bg-[var(--hs-primary)] font-bold text-white hover:bg-[var(--hs-primary-dark)]"
            >
              <UserPlus className="mr-2 size-4" />
              Create staff
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
