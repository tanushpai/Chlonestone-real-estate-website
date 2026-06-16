"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Reset token is missing from the link URL.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
          // Open sign in modal automatically
          window.dispatchEvent(
            new CustomEvent("open-auth-lead-capture", {
              detail: {
                interestType: "navbar-signin",
                projectName: "Navbar Sign In",
              },
            })
          );
        }, 2000);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to reset password. The link may have expired.");
      }
    } catch (err) {
      setError("Failed to connect to reset server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-white border rounded-2xl p-6 text-center space-y-4 max-w-md w-full shadow-sm text-slate-800">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-650">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-900">Invalid Link</h2>
        <p className="text-xs text-slate-500">
          This password reset link is invalid. Please request a new link from the login panel.
        </p>
        <Button onClick={() => router.push("/")} className="w-full bg-[#111322] hover:bg-slate-900 text-white rounded-lg h-10 text-xs">
          Return to Home Page
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl max-w-[400px] w-full p-6 sm:p-8 border shadow-xl text-slate-850">
      {success ? (
        <div className="py-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold font-serif text-slate-900">Password Reset Complete!</h2>
          <p className="text-xs text-slate-500">
            Your password has been updated. Redirecting you to sign in...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif text-slate-950 font-normal">Set new password</h2>
            <p className="text-[0.76rem] leading-relaxed text-slate-500">
              Please choose a new secure password for your Chlonestone account.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-650 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-900">New Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-xs rounded-lg border border-slate-200 h-10"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-900">Confirm Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="text-xs rounded-lg border border-slate-200 h-10"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111322] hover:bg-slate-900 text-white font-bold h-11 rounded-lg text-xs flex gap-2 justify-center"
          >
            <Lock className="h-3.5 w-3.5" />
            {loading ? "Updating..." : "Reset Password"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
        <Suspense fallback={<div className="text-xs text-slate-400 font-semibold uppercase">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </main>
    </>
  );
}
