"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Brain,
  Loader2,
  LockKeyhole,
} from "lucide-react";

import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    ready,
    setReady,
  ] = useState(false);

  useEffect(() => {
    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (event) => {
          if (
            event ===
            "PASSWORD_RECOVERY"
          ) {
            setReady(true);
          }
        },
      );

    void supabase.auth
      .getSession()
      .then(
        ({
          data,
        }) => {
          if (
            data.session
          ) {
            setReady(true);
          }
        },
      );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!password) {
      toast.error(
        "Enter a new password.",
      );

      return;
    }

    if (
      password.length < 6
    ) {
      toast.error(
        "Password must be at least 6 characters.",
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      toast.error(
        "Passwords do not match.",
      );

      return;
    }

    setLoading(true);

    try {
      const {
        error,
      } =
        await supabase.auth.updateUser(
          {
            password,
          },
        );

      if (error) {
        toast.error(
          "Could not update your password.",
        );

        return;
      }

      toast.success(
        "Password updated successfully.",
      );

      await supabase.auth.signOut();

      window.location.href =
        "/auth";
    } catch (error) {
      console.error(
        "PASSWORD UPDATE ERROR:",
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
            Reset your password
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/15 bg-white/[0.04] p-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white">
            Choose a new password
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Enter a new password for your
            CreatorOS account.
          </p>

          {!ready ? (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-black/20 p-4">
              <Loader2
                size={17}
                className="animate-spin text-emerald-400"
              />

              <p className="text-sm text-zinc-400">
                Verifying reset link...
              </p>
            </div>
          ) : (
            <form
              onSubmit={
                handleSubmit
              }
              className="mt-6 space-y-4"
            >
              <div>
                <label className="text-xs font-medium text-zinc-400">
                  New Password
                </label>

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
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    disabled={loading}
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
                <label className="text-xs font-medium text-zinc-400">
                  Confirm Password
                </label>

                <div className="relative mt-2">
                  <LockKeyhole
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                  />

                  <input
                    type="password"
                    value={
                      confirmPassword
                    }
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value,
                      )
                    }
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    disabled={loading}
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
                disabled={loading}
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
                ) : (
                  <LockKeyhole
                    size={17}
                  />
                )}

                {loading
                  ? "Updating..."
                  : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}