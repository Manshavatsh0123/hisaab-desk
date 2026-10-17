
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { useAdminLoginMutation } from "@/features/auth/authApi";
import { AUTH_KEYS, saveTokens } from "@/lib/baseApi";

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

    if (error) setError("");
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
      const data = await adminLogin({ email, password }).unwrap();
      const session = data.session;

      if (!session?.access_token || !session?.refresh_token) {
        setError(
          "The server did not return both authentication tokens. Please check the login API."
        );
        return;
      }

      saveTokens(session);

      localStorage.setItem(
        AUTH_KEYS.startedAt,
        String(Date.now())
      );

      localStorage.setItem(
        AUTH_KEYS.user,
        JSON.stringify({
          user: data.user,
          profile: data.profile,
        })
      );

      onLoginSuccess();
    } catch (err: unknown) {
      console.error("Login error:", err);

      const apiError = err as {
        data?: { message?: string; error?: string };
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
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#edf7fc] px-3 py-4 sm:px-6 sm:py-6">
      {/* Soft, layered background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_8%_8%,rgba(255,255,255,0.98),transparent_42%),radial-gradient(ellipse_at_95%_90%,rgba(140,201,232,0.38),transparent_42%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/4 size-64 rounded-full bg-white/60 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-1/4 size-72 rounded-full bg-[#c9252d]/[0.04] blur-3xl"
      />

      {/* Main login card */}
      <section className="relative z-10 grid w-full max-w-[1160px] overflow-hidden rounded-[28px] border border-white/90 bg-white/95 p-2.5 shadow-[0_30px_90px_rgba(54,92,117,0.15)] sm:p-3 lg:grid-cols-[1fr_0.92fr] lg:gap-2 lg:p-3">
        {/* Left illustration */}
        <div className="relative hidden min-h-0 overflow-hidden rounded-[21px] bg-[#edf5fa] lg:block">
          <Image
            src="/Login1.png"
            alt="HisaabSaathi collection and customer management"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 560px"
            className="object-cover"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#26364d]/10 via-transparent to-white/[0.03]"
          />

          {/* Small image caption */}
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/60 bg-white/85 p-4 shadow-lg backdrop-blur-md xl:bottom-6 xl:left-6 xl:right-6">
            <div className="flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#fff1f1]">
                <CheckCircle2 className="size-5 text-[#c9252d]" />
              </div>

              <div>
                <p className="text-sm font-bold text-[#26364d]">
                  Every collection, clearly recorded
                </p>
                <p className="mt-1 text-xs leading-5 text-[#718096]">
                  Your customers, payments and account history in one place.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right login panel */}
        <div className="flex items-center justify-center px-4 py-6 sm:px-9 sm:py-8 lg:px-8 lg:py-5 xl:px-12">
          <div className="w-full max-w-[370px]">
            {/* Mobile logo */}
            <div className="mb-5 flex justify-center lg:hidden">
              <div className="relative h-[66px] w-full max-w-[230px]">
                <Image
                  src="/Logo1.png"
                  alt="HisaabSaathi"
                  fill
                  priority
                  sizes="230px"
                  className="object-contain"
                />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-7 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f3c8ca] bg-[#fff5f5] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#b6222a]">
                <Sparkles className="size-3.5" />
                Administrator portal
              </div>

              <h1 className="text-[32px] font-extrabold leading-tight tracking-[-0.04em] text-[#202c3d] sm:text-[36px]">
                Welcome back<span className="text-[#c9252d]">.</span>
              </h1>

              <p className="mx-auto mt-3 max-w-[300px] text-sm leading-6 text-[#7b8797]">
                Sign in to manage your customers, collections and account records.
              </p>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[13px] font-semibold text-[#34445a]"
                >
                  Email address
                </label>

                <div className="group relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#97a2b1] transition-colors group-focus-within:text-[#c9252d]" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="username"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="h-[52px] w-full rounded-[14px] border border-[#e5eaf0] bg-[#f7f9fb] pl-11 pr-4 text-sm text-[#26364d] outline-none transition-colors placeholder:text-[#a0aab7] hover:border-[#cbd4df] focus:border-[#c9252d] focus:bg-white focus:ring-4 focus:ring-[#c9252d]/[0.08]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[13px] font-semibold text-[#34445a]"
                >
                  Password
                </label>

                <div className="group relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#97a2b1] transition-colors group-focus-within:text-[#c9252d]" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="h-[52px] w-full rounded-[14px] border border-[#e5eaf0] bg-[#f7f9fb] pl-11 pr-12 text-sm text-[#26364d] outline-none transition-colors placeholder:text-[#a0aab7] hover:border-[#cbd4df] focus:border-[#c9252d] focus:bg-white focus:ring-4 focus:ring-[#c9252d]/[0.08]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-2.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-xl text-[#8994a3] transition-colors hover:bg-[#edf1f5] hover:text-[#26364d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9252d]/30"
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
                  className="flex items-start gap-2.5 rounded-[14px] border border-[#f3c8ca] bg-[#fff1f1] p-3.5 text-sm text-[#a91f26]"
                >
                  <XCircle className="mt-0.5 size-4 shrink-0" />
                  <p className="leading-5">{error}</p>
                </div>
              )}

              {/* Sign in */}
              <button
                type="submit"
                disabled={isLoading}
                className="group flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[14px] bg-[#c9252d] px-4 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(201,37,45,0.18)] transition-colors hover:bg-[#a91f26] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c9252d]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="size-[18px] animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to your account
                    <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Security note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8792a1]">
              <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
              <span>Secure administrator access</span>
            </div>

            <div className="mt-5 border-t border-[#edf0f3] pt-4 text-center">
              <p className="text-xs text-[#9aa3af]">
                HisaabSaathi · Admin workspace
              </p>
              <p className="mt-1.5 text-[10px] text-[#b0b8c2]">
                Digital Collection &amp; Record Book
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
