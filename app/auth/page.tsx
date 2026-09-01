"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Brain,
  Loader2,
  LockKeyhole,
  Mail,
  UserPlus,
} from "lucide-react";

import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [mode, setMode] =
    useState<
      "login" | "signup"
    >("login");

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    resettingPassword,
    setResettingPassword,
  ] = useState(false);

  async function handleForgotPassword() {
    const trimmedEmail =
      email.trim();

    if (!trimmedEmail) {
      toast.error(
        "Enter your email first.",
      );

      return;
    }

    if (resettingPassword) {
      return;
    }

    setResettingPassword(true);

    try {
      const {
        error,
      } =
        await supabase.auth.resetPasswordForEmail(
          trimmedEmail,
          {
            redirectTo:
              `${window.location.origin}/auth/reset-password`,
          },
        );

      if (error) {
        const message =
          error.message.toLowerCase();

        if (
          message.includes(
            "too many requests",
          ) ||
          message.includes(
            "rate limit",
          )
        ) {
          toast.error(
            "Too many reset attempts. Try again shortly.",
          );

          return;
        }

        toast.error(
          "Could not send the password reset email.",
        );

        return;
      }

      toast.success(
        "Password reset email sent.",
        {
          description:
            "Check your inbox for a link to reset your password.",
        },
      );
    } catch (error) {
      console.error(
        "PASSWORD RESET ERROR:",
        error,
      );

      toast.error(
        "Something went wrong. Please try again.",
      );
    } finally {
      setResettingPassword(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !email.trim() ||
      !password.trim()
    ) {
      toast.error(
        "Enter your email and password.",
      );

      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const {
          data,
          error,
        } =
          await supabase.auth.signUp({
            email:
              email.trim(),

            password,
          });

        if (error) {
          const message =
            error.message.toLowerCase();

          if (
            message.includes(
              "user already registered",
            )
          ) {
            toast.error(
              "An account with this email already exists.",
            );

            return;
          }

          if (
            message.includes(
              "password should be at least",
            )
          ) {
            toast.error(
              "Your password is too short.",
            );

            return;
          }

          if (
            message.includes(
              "too many requests",
            ) ||
            message.includes(
              "rate limit",
            )
          ) {
            toast.error(
              "Too many attempts. Try again shortly.",
            );

            return;
          }

          toast.error(
            "Could not create your account. Please try again.",
          );

          return;
        }

        if (
          data.user &&
          !data.session
        ) {
          toast.success(
            "Account created. Check your email to confirm your account before logging in.",
          );
        } else {
          toast.success(
            "Account created.",
          );
        }

        setMode("login");
        setPassword("");

        return;
      }

      const {
        error,
      } =
        await supabase.auth.signInWithPassword(
          {
            email:
              email.trim(),

            password,
          },
        );

      if (error) {
        const message =
          error.message.toLowerCase();

        if (
          message.includes(
            "invalid login credentials",
          )
        ) {
          toast.error(
            "Email or password is incorrect.",
          );

          return;
        }

        if (
          message.includes(
            "email not confirmed",
          )
        ) {
          toast.error(
            "Please confirm your email before logging in.",
          );

          return;
        }

        if (
          message.includes(
            "too many requests",
          ) ||
          message.includes(
            "rate limit",
          )
        ) {
          toast.error(
            "Too many login attempts. Try again shortly.",
          );

          return;
        }

        toast.error(
          "Could not log in. Please try again.",
        );

        return;
      }

      toast.success(
        "Welcome back.",
      );

      window.location.href =
        "/";
    } catch (error) {
      console.error(
        "UNEXPECTED AUTH ERROR:",
        error,
      );

      toast.error(
        "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10">
            <Brain
              size={26}
              className="text-emerald-400"
            />
          </div>

          <h1 className="mt-4 text-3xl font-bold text-white">
            CreatorOS
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Your creator intelligence
            platform
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/15 bg-white/[0.04] p-6 backdrop-blur-xl">
          <div className="flex rounded-xl border border-white/[0.07] bg-black/20 p-1">
            <button
              type="button"
              onClick={() =>
                setMode("login")
              }
              disabled={
                loading ||
                resettingPassword
              }
              className={
                mode === "login"
                  ? "flex-1 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-black"
                  : "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-500 transition hover:text-white"
              }
            >
              Log In
            </button>

            <button
              type="button"
              onClick={() =>
                setMode("signup")
              }
              disabled={
                loading ||
                resettingPassword
              }
              className={
                mode === "signup"
                  ? "flex-1 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-black"
                  : "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-500 transition hover:text-white"
              }
            >
              Create Account
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-white">
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {mode === "login"
                ? "Log in to access your CreatorOS account."
                : "Create an account to start analyzing your content."}
            </p>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-6 space-y-4"
          >
            <div>
              <label className="text-xs font-medium text-zinc-400">
                Email
              </label>

              <div className="relative mt-2">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={
                    loading ||
                    resettingPassword
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/30
                    py-3
                    pl-10
                    pr-4
                    text-sm
                    text-white
                    outline-none
                    transition
                    placeholder:text-zinc-700
                    focus:border-emerald-400/40
                    disabled:opacity-60
                  "
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-400">
                  Password
                </label>

                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() =>
                      void handleForgotPassword()
                    }
                    disabled={
                      loading ||
                      resettingPassword
                    }
                    className="
                      text-xs
                      font-medium
                      text-emerald-400
                      transition
                      hover:text-emerald-300
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {resettingPassword
                      ? "Sending..."
                      : "Forgot password?"}
                  </button>
                )}
              </div>

              <div className="relative mt-2">
                <LockKeyhole
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  placeholder="Enter your password"
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  disabled={
                    loading ||
                    resettingPassword
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/30
                    py-3
                    pl-10
                    pr-4
                    text-sm
                    text-white
                    outline-none
                    transition
                    placeholder:text-zinc-700
                    focus:border-emerald-400/40
                    disabled:opacity-60
                  "
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                resettingPassword
              }
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-emerald-400
                px-4
                py-3
                text-sm
                font-semibold
                text-black
                transition
                hover:bg-emerald-300
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : mode ===
                "login" ? (
                <LockKeyhole
                  size={17}
                />
              ) : (
                <UserPlus
                  size={17}
                />
              )}

              {loading
                ? "Please wait..."
                : mode ===
                  "login"
                ? "Log In"
                : "Create Account"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs leading-5 text-zinc-600">
            By creating an account,
            you agree to CreatorOS
            terms and privacy policy.
          </p>
        </div>
      </div>
    </main>
  );
}