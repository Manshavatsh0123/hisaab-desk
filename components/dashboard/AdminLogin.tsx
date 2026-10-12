
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useAdminLoginMutation } from "@/features/auth/authApi";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({
  onLoginSuccess,
}: AdminLoginProps) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }

    setError("");

    try {
      const data = await adminLogin({
        email,
        password,
      }).unwrap();

      const token = data.session?.access_token;

      if (!token) {
        setError("The server did not return an access token.");
        return;
      }

      // Save authentication details.
      localStorage.setItem("hisaabsaathi_token", token);
      localStorage.setItem("hisaabsaathi_user", JSON.stringify(data));

      // Notify page.tsx to render the dashboard.
      onLoginSuccess();
    } catch (err: unknown) {
      const apiError = err as {
        data?: {
          message?: string;
          error?: string;
        };
        error?: string;
        status?: string | number;
      };

      if (apiError?.data?.message) {
        setError(apiError.data.message);
      } else if (apiError?.data?.error) {
        setError(apiError.data.error);
      } else if (apiError?.status === "FETCH_ERROR") {
        setError("Unable to connect to the server. Please try again.");
      } else if (apiError?.status === "PARSING_ERROR") {
        setError("Invalid response received from the server.");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }
  }

  return (
    <main className="relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#f8f8f9] px-4 py-6">
      {/* Soft background layers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full bg-[#c9252d]/10 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 size-[460px] rounded-full bg-[#e7b9bc]/35 blur-[110px]"
      />

      {/* Translucent overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-white/20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c9252d]/[0.06]"
      />

      {/* Login card */}
      <section className="relative z-10 w-full max-w-[410px]">
        <div className="rounded-[24px] border border-white/90 bg-white/80 p-6 shadow-[0_24px_80px_rgba(38,54,77,0.12)] backdrop-blur-2xl sm:p-9">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center">
            <img
              src="/Logo_Hisaab.png"
              alt="HisaabSaathi"
              className="h-20 w-auto max-w-[240px] object-contain"
            />
          </div>

          {/* Heading */}
          <div className="mb-7 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--hs-text)]">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-[var(--hs-text-secondary)]">
              Sign in to continue to your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[var(--hs-text)]"
              >
                Email address
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-[var(--hs-text-muted)]" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className="h-12 w-full rounded-xl border border-[var(--hs-border)] bg-white/85 pl-10 pr-3 text-sm text-[var(--hs-text)] outline-none transition placeholder:text-[var(--hs-text-muted)] focus:border-[var(--hs-primary)] focus:ring-4 focus:ring-[var(--hs-primary)]/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[var(--hs-text)]"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-[var(--hs-text-muted)]" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-[var(--hs-border)] bg-white/85 pl-10 pr-11 text-sm text-[var(--hs-text)] outline-none transition placeholder:text-[var(--hs-text-muted)] focus:border-[var(--hs-primary)] focus:ring-4 focus:ring-[var(--hs-primary)]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-[var(--hs-text-muted)] transition hover:bg-[var(--hs-background)] hover:text-[var(--hs-text)]"
                >
                  {showPassword ? (
                    <EyeOff className="size-[17px]" />
                  ) : (
                    <Eye className="size-[17px]" />
                  )}
                </button>
              </div>
            </div>

            {/* API error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-[var(--hs-primary-border)] bg-[var(--hs-danger-light)] p-3 text-sm text-[var(--hs-danger)]"
              >
                <XCircle className="mt-0.5 size-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--hs-primary)] text-sm font-semibold text-white shadow-[0_5px_15px_rgba(201,37,45,0.18)] transition duration-200 hover:bg-[var(--hs-primary-dark)] hover:shadow-[0_7px_20px_rgba(201,37,45,0.23)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--hs-primary)]/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Security note */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[var(--hs-text-muted)]">
            <ShieldCheck className="size-3.5 text-[var(--hs-success)]" />
            Secure administrator access
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-[var(--hs-text-muted)]">
          HisaabSaathi · Admin workspace
        </p>
      </section>
    </main>
  );
}
