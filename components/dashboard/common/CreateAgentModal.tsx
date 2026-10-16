
"use client";

import { useId, useState, type FormEvent } from "react";
import type { StaffForm } from "./staff.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FormField from "./FormField";

import {
  UserPlus,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

interface CreateAgentModalProps {
  form: StaffForm;
  error: string;
  onChange: (field: keyof StaffForm, value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
}

export default function CreateAgentModal({
  form,
  error,
  onChange,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CreateAgentModalProps) {
  const id = useId();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const inputClass =
    "h-10 w-full rounded-md border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[var(--hs-primary)] focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]/15";

  const labelClass =
    "mb-1.5 block text-[13px] font-semibold text-slate-600";

  const validateAndSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError("");

    const name = form.name.trim();
    const phone = form.phone.trim().replace(/[\s()-]/g, "");
    const email = form.email.trim();
    const username = form.username.trim();

    if (
      !name ||
      !form.phone.trim() ||
      !username ||
      !form.password ||
      !form.confirmPassword
    ) {
      setValidationError("Please fill in all required fields.");
      return;
    }

    if (name.length < 2) {
      setValidationError("Full name must contain at least 2 characters.");
      return;
    }

    if (!/^(?:\+91)?[6-9]\d{9}$/.test(phone)) {
      setValidationError("Please enter a valid Indian mobile number.");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username)) {
      setValidationError(
        "Username must be 3–30 characters, using letters, numbers, dots, underscores or hyphens."
      );
      return;
    }

    if (form.password.length < 6) {
      setValidationError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setValidationError("Password and confirm password do not match.");
      return;
    }

    onSubmit(event);
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  const displayedError = validationError || error;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-950/55 p-3 sm:p-5" onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        handleClose();
      }
    }}
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className="flex max-h-[calc(100dvh-24px)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-2xl sm:max-h-[calc(100dvh-40px)]"
      >
        {/* Compact header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--hs-primary-light)] text-[var(--hs-primary)]">
              <UserPlus className="size-[18px]" />
            </div>

            <div>
              <h2
                id={`${id}-title`}
                className="text-lg font-bold leading-6 text-[var(--hs-text)]"
              >
                Create Staff
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Add a field agent and create login credentials.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close modal"
            disabled={isSubmitting}
            onClick={handleClose}
            className="size-8 shrink-0 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="size-4" />
          </Button>
        </div>

        <form
          noValidate
          onSubmit={validateAndSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Compact form body */}
          <CardContent className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:overflow-y-hidden sm:px-6 sm:py-5">
            <div className="grid grid-cols-1 gap-x-5 gap-y-3.5 sm:grid-cols-2 sm:gap-y-4">
              <FormField label="Full name *">
                <Input
                  id={`${id}-name`}
                  name="name"
                  required
                  autoFocus
                  autoComplete="name"
                  maxLength={100}
                  value={form.name}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    onChange("name", e.target.value);
                    setValidationError("");
                  }}
                  placeholder="Enter full name"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Phone number *">
                <Input
                  id={`${id}-phone`}
                  name="phone"
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={20}
                  value={form.phone}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    onChange("phone", e.target.value);
                    setValidationError("");
                  }}
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Email address">
                <Input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  value={form.email}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    onChange("email", e.target.value);
                    setValidationError("");
                  }}
                  placeholder="name@example.com (optional)"
                  className={inputClass}
                />
              </FormField>

              <div className="hidden sm:block" aria-hidden="true" />

              {/* Credentials heading */}
              <div className="mt-1 border-t border-slate-100 pt-3 sm:col-span-2 sm:mt-0">
                <h3 className="text-sm font-bold text-[var(--hs-text)]">
                  Login Credentials
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Set the username and password for staff access.
                </p>
              </div>

              <FormField label="Username *">
                <Input
                  id={`${id}-username`}
                  name="username"
                  required
                  minLength={3}
                  maxLength={30}
                  autoComplete="username"
                  spellCheck={false}
                  value={form.username}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    onChange("username", e.target.value);
                    setValidationError("");
                  }}
                  placeholder="Enter username"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Password *">
                <div className="relative">
                  <Input
                    id={`${id}-password`}
                    name="password"
                    required
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={6}
                    maxLength={128}
                    value={form.password}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      onChange("password", e.target.value);
                      setValidationError("");
                    }}
                    placeholder="Minimum 6 characters"
                    className={`${inputClass} pr-10`}
                  />

                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    disabled={isSubmitting}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Confirm password *">
                  <div className="relative">
                    <Input
                      id={`${id}-confirm-password`}
                      name="confirmPassword"
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={6}
                      maxLength={128}
                      value={form.confirmPassword}
                      disabled={isSubmitting}
                      aria-invalid={
                        form.confirmPassword.length > 0 &&
                        form.password !== form.confirmPassword
                      }
                      aria-describedby={`${id}-password-hint`}
                      onChange={(e) => {
                        onChange("confirmPassword", e.target.value);
                        setValidationError("");
                      }}
                      placeholder="Re-enter password"
                      className={`${inputClass} pr-10`}
                    />

                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      aria-pressed={showConfirmPassword}
                      disabled={isSubmitting}
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>

                  <div
                    id={`${id}-password-hint`}
                    className="mt-1.5 min-h-4"
                    aria-live="polite"
                  >
                    {form.confirmPassword.length > 0 &&
                      (form.password === form.confirmPassword ? (
                        <p className="flex items-center gap-1 text-[11px] text-emerald-700">
                          <CheckCircle2 className="size-3.5" />
                          Passwords match
                        </p>
                      ) : (
                        <p className="text-[11px] text-red-600">
                          Passwords do not match.
                        </p>
                      ))}
                  </div>
                </FormField>
              </div>
            </div>

            {/* Validation/API error */}
            {displayedError && (
              <div
                role="alert"
                aria-live="assertive"
                className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p className="min-w-0 break-words">{displayedError}</p>
              </div>
            )}
          </CardContent>

          {/* Always-visible footer */}
          <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-200 bg-slate-50/70 px-4 py-3 sm:px-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleClose}
              className="h-10 rounded-md border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-md bg-[var(--hs-primary)] px-5 text-sm font-semibold text-white hover:bg-[var(--hs-primary-dark)] disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 size-4" />
                  Create Staff
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
