"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ServicesPage() {
  // Newsletter subscription
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscriberPhone, setSubscriberPhone] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscriberSuccess, setSubscriberSuccess] = useState("");

  // Auto-fill logged-in user email on mount if any
  useEffect(() => {
    const stored = localStorage.getItem("chlonestone_user");
    if (stored) {
      const u = JSON.parse(stored);
      if (u && u.email) {
        setSubscriberEmail(u.email);
      }
      if (u && u.phone) {
        setSubscriberPhone(u.phone);
      }
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail || !subscriberPhone) {
      alert("Email and Phone are required.");
      return;
    }
    setSubscribing(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscriberEmail, phone: subscriberPhone }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubscriberSuccess(data.message || "Successfully subscribed!");
      } else {
        alert(data.error || "Failed to subscribe.");
      }
    } catch (err) {
      alert("Error submitting subscription request.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-16 lg:pt-32 bg-slate-50/50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12 sm:space-y-16">
          
          {/* Header section */}
          <div className="mb-8 max-w-2xl">
            <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl font-heading text-slate-900">
              Tailored Real Estate Services
            </h1>
            <p className="mt-3 text-slate-500 text-sm sm:text-base leading-relaxed">
              From developer off-plan acquisitions to private resale assets and property management, we provide specialized advisory services built on transparency.
            </p>
          </div>

          {/* Core Services Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Service 1 */}
            <div className="p-6 sm:p-8 bg-white border rounded-3xl shadow-sm space-y-4 hover:border-primary/40 transition">
              <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Off-Plan Property Advisory</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Discover Dubai&apos;s latest off-plan developments with expert guidance on payment plans, project locations, developer reputation, and investment potential.
              </p>
            </div>

            {/* Service 2 */}
            <div className="p-6 sm:p-8 bg-white border rounded-3xl shadow-sm space-y-4 hover:border-primary/40 transition">
              <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Investment Advisory</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Identify high-growth investment opportunities across Dubai&apos;s most sought-after communities with insights on rental yields and future appreciation.
              </p>
            </div>

            {/* Service 3 */}
            <div className="p-6 sm:p-8 bg-white border rounded-3xl shadow-sm space-y-4 hover:border-primary/40 transition">
              <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Mortgage Assistance</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Get support in finding suitable mortgage solutions, understanding financing options, and navigating the home-buying process with confidence.
              </p>
            </div>

            {/* Service 4 */}
            <div className="p-6 sm:p-8 bg-white border rounded-3xl shadow-sm space-y-4 hover:border-primary/40 transition">
              <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Property Resale Services</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Buy or sell residential properties with professional market guidance, property valuation support, and seamless transaction assistance.
              </p>
            </div>

          </section>

          {/* Newsletter Subscription Section */}
          <section className="bg-gradient-to-br from-[#0F1123] to-[#1E293B] text-white border rounded-3xl p-6 sm:p-10 shadow-lg space-y-6 text-center max-w-4xl mx-auto">
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl font-extrabold sm:text-3xl font-heading text-white">
                Subscribe to Off-Plan Launches
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Be the first to receive notifications and brochure materials when new properties are published on the platform.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              {subscriberSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl p-4 text-xs font-semibold">
                  {subscriberSuccess}
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2 max-w-sm mx-auto">
                  <Input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={subscriberEmail}
                    onChange={(e) => setSubscriberEmail(e.target.value)}
                    className="rounded-xl bg-white/5 border-white/10 text-white placeholder-slate-400 h-11 focus:ring-primary text-xs sm:text-sm"
                  />
                  <Input
                    type="tel"
                    required
                    placeholder="Enter your phone number"
                    value={subscriberPhone}
                    onChange={(e) => setSubscriberPhone(e.target.value)}
                    className="rounded-xl bg-white/5 border-white/10 text-white placeholder-slate-400 h-11 focus:ring-primary text-xs sm:text-sm"
                  />
                  <Button
                    type="submit"
                    disabled={subscribing}
                    className="rounded-xl bg-primary hover:bg-blue-800 text-white h-11 px-6 font-semibold w-full text-xs sm:text-sm mt-1"
                  >
                    {subscribing ? "Subscribing..." : "Subscribe Now"}
                  </Button>
                </form>
              )}
            </div>
          </section>

          {/* CTA Footer */}
          <section className="text-center py-6 border-t space-y-4">
            <h3 className="text-xl font-bold text-slate-900 font-heading">Secure premium investment advisory today</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our experts can help review developers and source primary launch allocation inventory.
            </p>
            <Link href="tel:+971503483366">
              <Button className="rounded-xl px-6 bg-[#111827] text-white mt-2">Connect with Advisor</Button>
            </Link>
          </section>

        </div>
      </main>
    </>
  );
}

