"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface AuthModalConfig {
  interestType: string;
  projectName: string;
  onSuccess?: () => void;
}

export default function AuthLeadCaptureModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<AuthModalConfig | null>(null);

  // View state: "signin" | "register" | "forgot"
  const [view, setView] = useState<"signin" | "register" | "forgot">("signin");

  // Sign In States
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInEmailError, setSignInEmailError] = useState("");
  const [signInPasswordError, setSignInPasswordError] = useState("");

  // Register States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmailError, setRegEmailError] = useState("");
  const [regPasswordError, setRegPasswordError] = useState("");

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<AuthModalConfig>;
      setConfig(customEvent.detail);
      setIsOpen(true);
      setSuccess(false);
      setForgotSuccess(false);
      setView(customEvent.detail?.interestType === "navbar-signin" ? "signin" : "register");
      
      // Reset fields & errors
      setSignInEmail("");
      setSignInPassword("");
      setSignInEmailError("");
      setSignInPasswordError("");
      setRegName("");
      setRegEmail("");
      setRegPhone("");
      setRegPassword("");
      setRegEmailError("");
      setRegPasswordError("");
      setForgotEmail("");
      setForgotEmailError("");
    };

    window.addEventListener("open-auth-lead-capture", handleOpen);
    return () => {
      window.removeEventListener("open-auth-lead-capture", handleOpen);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setConfig(null);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(signInEmail)) {
      setSignInEmailError("Enter a valid email");
      valid = false;
    } else {
      setSignInEmailError("");
    }

    if (signInPassword.length < 4) {
      setSignInPasswordError("Min 4 characters");
      valid = false;
    } else {
      setSignInPasswordError("");
    }

    if (!valid) return;

    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      });

      if (res.ok) {
        const userObj = await res.json();
        localStorage.setItem("chlonestone_user", JSON.stringify(userObj));
        setSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          if (userObj.role === "admin") {
            router.push("/crm");
          } else {
            if (config?.onSuccess) config.onSuccess();
          }
          window.dispatchEvent(new Event("auth-state-change"));
        }, 1500);
      } else {
        const errData = await res.json();
        alert(errData.error || "Authentication failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!regName.trim()) {
      alert("Full name is required.");
      return;
    }

    if (!validateEmail(regEmail)) {
      setRegEmailError("Enter a valid email");
      valid = false;
    } else {
      setRegEmailError("");
    }

    if (regPassword.length < 4) {
      setRegPasswordError("Min 4 characters");
      valid = false;
    } else {
      setRegPasswordError("");
    }

    if (!valid) return;

    setLoading(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: regPhone || null,
          password: regPassword,
          interestType: config?.interestType || "registration",
          projectName: config?.projectName || null,
          role: "investor",
          funding: "cash",
          timeframe: "immediate",
          message: `Registered via action: ${config?.interestType}`,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Failed to submit registration");
        if (errData.error?.toLowerCase().includes("already registered")) {
          setSignInEmail(regEmail);
          setView("signin");
        }
        return;
      }

      const userObj = {
        name: regName,
        email: regEmail,
        role: "client",
        avatar: null,
      };

      localStorage.setItem("chlonestone_user", JSON.stringify(userObj));
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        window.dispatchEvent(new Event("auth-state-change"));
        if (config?.onSuccess) config.onSuccess();
      }, 1500);
    } catch (err) {
      alert("Failed to connect to registration server.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(forgotEmail)) {
      setForgotEmailError("Enter a valid email");
      return;
    }
    setForgotEmailError("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (res.ok) {
        setForgotSuccess(true);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to initiate password reset.");
      }
    } catch (err) {
      alert("Failed to connect to password reset server.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-[420px] w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 text-slate-800">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white">
              <CheckCircle2 className="h-8 w-8 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold font-serif">Success!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Redirecting and loading your customized dashboard details...
            </p>
          </div>
        ) : view === "signin" ? (
          /* Sign In View */
          <form onSubmit={handleSignInSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-serif text-slate-950 font-normal">Sign in to Chlonestone</h2>
              <p className="text-[0.78rem] leading-relaxed text-slate-500">
                Continue with your account to unlock saved items, alerts and the customer dashboard.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-900">Email</label>
              <Input
                type="text"
                placeholder="you@example.com"
                value={signInEmail}
                onChange={(e) => {
                  setSignInEmail(e.target.value);
                  if (signInEmailError) setSignInEmailError("");
                }}
                className={`text-xs rounded-lg border h-10 ${
                  signInEmailError ? "border-red-500 focus-visible:ring-red-400" : "border-slate-200"
                }`}
              />
              {signInEmailError && <p className="text-[0.7rem] text-red-600 font-medium">{signInEmailError}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-900">Password</label>
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-[0.7rem] text-slate-500 hover:underline hover:text-slate-800"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={signInPassword}
                onChange={(e) => {
                  setSignInPassword(e.target.value);
                  if (signInPasswordError) setSignInPasswordError("");
                }}
                className={`text-xs rounded-lg border h-10 ${
                  signInPasswordError ? "border-red-500 focus-visible:ring-red-400" : "border-slate-200"
                }`}
              />
              {signInPasswordError && <p className="text-[0.7rem] text-red-600 font-medium">{signInPasswordError}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111322] hover:bg-slate-900 text-white font-bold h-11 rounded-lg text-xs"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setView("register")}
                className="font-semibold text-slate-950 hover:underline"
              >
                Create new account
              </button>
            </div>
          </form>
        ) : view === "register" ? (
          /* Create Account View */
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-serif text-slate-950 font-normal">Create your account</h2>
              <p className="text-[0.78rem] leading-relaxed text-slate-500">
                Continue with your account to unlock saved items, alerts and the customer dashboard.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-900">Full name</label>
              <Input
                type="text"
                placeholder="e.g. Sarah Connor"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                className="text-xs rounded-lg border border-slate-200 h-10"
              />
            </div>

            {/* Email & Phone side-by-side in grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-900">Email</label>
                <Input
                  type="text"
                  placeholder="you@example.com"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (regEmailError) setRegEmailError("");
                  }}
                  className={`text-xs rounded-lg border h-10 ${
                    regEmailError ? "border-red-500 focus-visible:ring-red-400" : "border-slate-200"
                  }`}
                />
                {regEmailError && <p className="text-[0.7rem] text-red-600 font-medium">{regEmailError}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-900">Phone</label>
                <Input
                  type="tel"
                  placeholder=""
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="text-xs rounded-lg border border-slate-200 h-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-900">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => {
                  setRegPassword(e.target.value);
                  if (regPasswordError) setRegPasswordError("");
                }}
                className={`text-xs rounded-lg border h-10 ${
                  regPasswordError ? "border-red-500 focus-visible:ring-red-400" : "border-slate-200"
                }`}
              />
              {regPasswordError && <p className="text-[0.7rem] text-red-600 font-medium">{regPasswordError}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111322] hover:bg-slate-900 text-white font-bold h-11 rounded-lg text-xs"
            >
              {loading ? "Creating..." : "Create account"}
            </Button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("signin")}
                className="font-semibold text-slate-950 hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        ) : (
          /* Forgot Password View */
          <form onSubmit={handleForgotSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-serif text-slate-950 font-normal">Reset password</h2>
              <p className="text-[0.78rem] leading-relaxed text-slate-500">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 space-y-1.5 animate-in fade-in duration-200">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Reset Link Sent
                </p>
                <p className="text-[0.7rem] text-slate-500">
                  Please check your inbox at <strong>{forgotEmail}</strong>. We have simulated sending your reset password credentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotSuccess(false);
                    setView("signin");
                  }}
                  className="pt-2 text-xs font-semibold text-slate-800 hover:underline block"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-900">Email Address</label>
                  <Input
                    type="text"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      if (forgotEmailError) setForgotEmailError("");
                    }}
                    className={`text-xs rounded-lg border h-10 ${
                      forgotEmailError ? "border-red-500 focus-visible:ring-red-400" : "border-slate-200"
                    }`}
                  />
                  {forgotEmailError && <p className="text-[0.7rem] text-red-600 font-medium">{forgotEmailError}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#111322] hover:bg-slate-900 text-white font-bold h-11 rounded-lg text-xs"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </Button>

                <div className="text-center text-xs">
                  <button
                    type="button"
                    onClick={() => setView("signin")}
                    className="font-semibold text-slate-500 hover:underline hover:text-slate-800"
                  >
                    Back to sign in
                  </button>
                </div>
              </>
            )}
          </form>
        )}

      </div>
    </div>
  );
}
