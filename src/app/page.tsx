"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Building, 
  ShieldCheck, 
  TrendingUp, 
  MapPin, 
  Download, 
  Check, 
  Send,
  Sparkles,
  Calculator
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import SearchBar from "@/components/home/SearchBar";
import ProjectCard from "@/components/projects/ProjectCard";
import { getProjects } from "@/lib/dataService";
import { Project } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [trendingProjects, setTrendingProjects] = useState<Project[]>([]);
  const [guideForm, setGuideForm] = useState({ name: "", email: "", phone: "" });
  const [isGuideSubmitting, setIsGuideSubmitting] = useState(false);
  const [isGuideDownloaded, setIsGuideDownloaded] = useState(false);
  const [guideUrl, setGuideUrl] = useState("");

  const handleOpenTools = (e: React.MouseEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem("chlonestone_user");
    if (!stored) {
      window.dispatchEvent(
        new CustomEvent("open-auth-lead-capture", {
          detail: {
            interestType: "homepage-tools",
            projectName: "Homepage Calculators Banner",
            onSuccess: () => {
              window.dispatchEvent(new Event("open-tools-sidebar"));
            }
          },
        })
      );
    } else {
      window.dispatchEvent(new Event("open-tools-sidebar"));
    }
  };

  useEffect(() => {
    // Read from database API service to include newly CRM-added projects
    getProjects().then((all) => {
      setTrendingProjects(all.slice(0, 3));
    });

    // Fetch dynamic guide URL from settings API
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setGuideUrl(data.guideUrl || ""))
      .catch((err) => console.error(err));
  }, []);

  const handleGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideForm.name || !guideForm.email || !guideForm.phone) {
      alert("Name, Email, and Phone are required.");
      return;
    }
    setIsGuideSubmitting(true);

    try {
      // Log lead
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: guideForm.name,
          email: guideForm.email,
          phone: guideForm.phone,
          interestType: "guide",
          projectName: "Dubai Off-Plan Investor Guide 2026",
        }),
      });

      setIsGuideSubmitting(false);
      setIsGuideDownloaded(true);

      // Trigger download
      const targetGuide = guideUrl || "/uploads/dubai-off-plan-investor-guide-2026.pdf";
      const link = document.createElement("a");
      link.href = targetGuide;
      link.setAttribute("target", "_blank");
      link.setAttribute("download", "Dubai_Off_Plan_Investor_Guide_2026.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      setIsGuideSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="bg-background">
        {/* Hero & Search wrapper */}
        <div className="relative">
          <Hero />
          <SearchBar />
        </div>

        {/* Services & Features Section */}
        <section className="bg-background pt-28 pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Our Capabilities
              </span>
              <h2 className="text-4xl font-semibold font-heading tracking-tight text-slate-900 mt-2">
                Premium Advisory Services
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                Chlonestone coordinates developer acquisitions, portfolio growth modeling, and asset resales across Dubai's most prestigious communities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Off-Plan Advisory */}
              <div className="p-6 bg-white border rounded-[1.75rem] shadow-soft hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 transition duration-300 flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 bg-indigo-50/50 rounded-2xl flex items-center justify-center text-primary mb-4">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">Off-Plan Property Advisory</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">
                    Discover Dubai&apos;s latest off-plan developments with expert guidance on payment plans, project locations, developer reputation, and investment potential.
                  </p>
                </div>
                <Link href="/services" className="text-xs font-bold text-primary mt-4 hover:underline">
                  Learn more &rarr;
                </Link>
              </div>

              {/* Private Resale */}
              <div className="p-6 bg-white border rounded-[1.75rem] shadow-soft hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 transition duration-300 flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 bg-indigo-50/50 rounded-2xl flex items-center justify-center text-primary mb-4">
                    <Building className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">Investment Advisory</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">
                    Identify high-growth investment opportunities across Dubai&apos;s most sought-after communities with insights on rental yields and future appreciation.
                  </p>
                </div>
                <Link href="/services" className="text-xs font-bold text-primary mt-4 hover:underline">
                  Learn more &rarr;
                </Link>
              </div>

              {/* Portfolio Strategy */}
              <div className="p-6 bg-white border rounded-[1.75rem] shadow-soft hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 transition duration-300 flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 bg-indigo-50/50 rounded-2xl flex items-center justify-center text-primary mb-4">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">Mortgage Assistance</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">
                    Get support in finding suitable mortgage solutions, understanding financing options, and navigating the home-buying process with confidence.
                  </p>
                </div>
                <Link href="/services" className="text-xs font-bold text-primary mt-4 hover:underline">
                  Learn more &rarr;
                </Link>
              </div>

              {/* Property Administration */}
              <div className="p-6 bg-white border rounded-[1.75rem] shadow-soft hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 transition duration-300 flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 bg-indigo-50/50 rounded-2xl flex items-center justify-center text-primary mb-4">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">Property Resale Services</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">
                    Buy or sell residential properties with professional market guidance, property valuation support, and seamless transaction assistance.
                  </p>
                </div>
                <Link href="/services" className="text-xs font-bold text-primary mt-4 hover:underline">
                  Learn more &rarr;
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Trending Launches Section */}
        <section className="bg-[#0B0C1E] text-white py-16 sm:py-24 border-t border-slate-900">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  New Releases
                </span>
                <h2 className="text-3xl font-bold font-heading text-white sm:text-4xl mt-1">
                  Trending Off-Plan launches
                </h2>
                <p className="text-sm text-slate-400 mt-2">
                  Explore hot pre-construction opportunities from Dubai's master developers.
                </p>
              </div>
              <Link 
                href="/projects" 
                className="text-sm font-bold text-blue-400 hover:text-blue-300 transition"
              >
                View all listings
              </Link>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {trendingProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Calculators Section */}
        <section className="bg-[#0B0C1E] text-white py-16 sm:py-20 border-t border-slate-900">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full text-blue-400">
                  Investor Sandbox
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-heading text-white">
                  Free Dubai Real Estate ROI & Mortgage Planner
                </h2>
                <p className="text-sm text-slate-350 leading-relaxed max-w-xl">
                  Analyze property investments on-the-fly. Run quick computations for monthly mortgage payments or estimate your Gross/Net yields on off-plan projects in under 10 seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button 
                    onClick={handleOpenTools}
                    className="bg-primary hover:bg-blue-600 text-white font-bold rounded-xl px-6 py-5 text-sm h-auto flex items-center gap-2 border-0 shadow-lg shadow-blue-500/25"
                  >
                    <Calculator className="h-4 w-4" />
                    Open Financial Sandbox
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-950/40 border border-slate-800 rounded-3xl space-y-3">
                  <div className="font-bold text-lg font-heading text-blue-400">Mortgage Estimator</div>
                  <p className="text-xs text-slate-450 leading-relaxed">Estimate interest payments, loan tenures, and monthly installments instantly.</p>
                </div>
                <div className="p-6 bg-slate-950/40 border border-slate-800 rounded-3xl space-y-3">
                  <div className="font-bold text-lg font-heading text-blue-400">Rental Yield Calculator</div>
                  <p className="text-xs text-slate-450 leading-relaxed">Calculate gross and net annual returns based on service charges and average rent.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advisory Strengths Columns */}
        <section className="bg-slate-50 border-y py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Why Chlonestone
              </span>
              <h2 className="text-3xl font-bold font-heading text-slate-900 mt-1">
                Invest with Confidence
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                We help investors and homebuyers make informed decisions through verified projects, transparent pricing, and expert market guidance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-center flex flex-col items-center">
                <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Verified & Secure Projects</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  Every project featured by Chlonestone undergoes verification to ensure regulatory compliance, developer credibility, and buyer confidence.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-center flex flex-col items-center">
                <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                  <Building className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Direct Developer Pricing</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  Access official developer pricing, exclusive launch offers, and flexible payment plans with complete transparency and no hidden costs.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-center flex flex-col items-center">
                <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Investment Insights</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  Receive expert guidance on rental demand, community growth trends, and long-term investment potential across Dubai's leading developments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Lead capture booklet gate */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-[2rem] bg-[#0B0C1E] text-white p-8 sm:p-12 relative overflow-hidden border border-slate-900 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Visual background circle accents */}
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

            <div className="max-w-md relative z-10 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Free Investor Resource
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                Dubai Off-Plan Investor Guide 2026
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download the complete catalog detailing rental yield statistics, tax laws, payment structures, and top community growth reviews.
              </p>
            </div>

            <div className="w-full max-w-sm relative z-10 bg-slate-950/45 p-6 rounded-2xl border border-slate-900">
              {isGuideDownloaded ? (
                <div className="text-center py-6 space-y-3">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-bold">Download Link Unlocked!</h4>
                  <p className="text-xs text-slate-400">The PDF has been sent to your email and is downloading now.</p>
                </div>
              ) : (
                <form onSubmit={handleGuideSubmit} className="space-y-3">
                  <Input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={guideForm.name}
                    onChange={(e) => setGuideForm({ ...guideForm, name: e.target.value })}
                    className="bg-slate-900 border-slate-800 text-white rounded-xl placeholder:text-slate-500 h-10 text-xs"
                  />
                  <Input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={guideForm.email}
                    onChange={(e) => setGuideForm({ ...guideForm, email: e.target.value })}
                    className="bg-slate-900 border-slate-800 text-white rounded-xl placeholder:text-slate-500 h-10 text-xs"
                  />
                  <Input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={guideForm.phone}
                    onChange={(e) => setGuideForm({ ...guideForm, phone: e.target.value })}
                    className="bg-slate-900 border-slate-800 text-white rounded-xl placeholder:text-slate-500 h-10 text-xs"
                  />
                  <Button 
                    type="submit" 
                    disabled={isGuideSubmitting}
                    className="w-full bg-primary hover:bg-blue-800 text-white font-semibold rounded-xl h-10 text-xs transition duration-300"
                  >
                    {isGuideSubmitting ? "Generating Download..." : "Get Free Guide"}
                    <Download className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </form>
              )}
            </div>

          </div>
        </section>

      </main>
    </>
  );
}