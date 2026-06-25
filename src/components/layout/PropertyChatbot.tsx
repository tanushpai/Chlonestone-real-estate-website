"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, X, ArrowRight, Check, Send, Sparkles, Building, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Project {
  id: number;
  slug: string;
  name: string;
  developer: string;
  communityName: string;
  propertyType: string;
  startingPrice: string;
  image: string;
  handover: string;
  paymentPlan: string;
}

export default function PropertyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Quiz Choices
  const [objective, setObjective] = useState("");
  const [size, setSize] = useState("");
  const [budget, setBudget] = useState("");
  const [lifestyle, setLifestyle] = useState("");

  // Lead Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submittingLead, setSubmittingLead] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Recommended Projects
  const [recommended, setRecommended] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error loading projects for chatbot:", err));
  }, []);

  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[^0-9]/g, "");
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const getRecommendations = () => {
    // Filter projects based on choices
    let filtered = [...projects];

    // Filter by budget
    if (budget === "under-1.5") {
      filtered = filtered.filter((p) => parsePrice(p.startingPrice) < 1500000);
    } else if (budget === "1.5-3") {
      filtered = filtered.filter((p) => {
        const val = parsePrice(p.startingPrice);
        return val >= 1500000 && val <= 3000000;
      });
    } else if (budget === "3-6") {
      filtered = filtered.filter((p) => {
        const val = parsePrice(p.startingPrice);
        return val >= 3000000 && val <= 6000000;
      });
    } else if (budget === "above-6") {
      filtered = filtered.filter((p) => parsePrice(p.startingPrice) > 6000000);
    }

    // Filter by property size / type
    if (size === "villa") {
      filtered = filtered.filter((p) => p.propertyType.toLowerCase().includes("villa") || p.propertyType.toLowerCase().includes("townhouse"));
    } else if (size === "penthouse") {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes("towers") || p.name.toLowerCase().includes("vela") || p.name.toLowerCase().includes("opus") || p.propertyType.toLowerCase().includes("penthouse"));
    } else if (size === "small") {
      filtered = filtered.filter((p) => p.propertyType.toLowerCase().includes("apartment") || p.propertyType.toLowerCase().includes("studio"));
    }

    // Filter by lifestyle / community
    if (lifestyle === "waterfront") {
      filtered = filtered.filter((p) => 
        p.communityName.toLowerCase().includes("marina") || 
        p.communityName.toLowerCase().includes("palm") || 
        p.communityName.toLowerCase().includes("beachfront") ||
        p.communityName.toLowerCase().includes("khor")
      );
    } else if (lifestyle === "urban") {
      filtered = filtered.filter((p) => 
        p.communityName.toLowerCase().includes("downtown") || 
        p.communityName.toLowerCase().includes("bay")
      );
    } else if (lifestyle === "green") {
      filtered = filtered.filter((p) => 
        p.communityName.toLowerCase().includes("dubailand") || 
        p.communityName.toLowerCase().includes("hartland")
      );
    }

    // If no matches, fall back to top projects matching budget or just top 3 projects
    if (filtered.length === 0) {
      filtered = projects.slice(0, 3);
    }

    // Limit to top 3 recommendations
    setRecommended(filtered.slice(0, 3));
  };

  const handleNextStep = (next: number) => {
    setStep(next);
    if (next === 5) {
      getRecommendations();
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert("Please fill in all details to get the investment guide and brochures.");
      return;
    }
    setSubmittingLead(true);

    const matchNames = recommended.map((r) => r.name).join(", ");
    const customMessage = `Captured via Virtual Advisor Quiz.\n- Purchase Intent: ${objective}\n- Target Bed/Size: ${size}\n- Budget Range: ${budget}\n- Community Vibe: ${lifestyle}\n- Recommended: ${matchNames}`;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          interestType: "guide",
          projectName: recommended[0]?.name || "General Off-Plan Recommendation",
          message: customMessage,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        throw new Error("Failed to submit lead");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting details. Please try again.");
    } finally {
      setSubmittingLead(false);
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setObjective("");
    setSize("");
    setBudget("");
    setLifestyle("");
    setName("");
    setEmail("");
    setPhone("");
    setSubmitted(false);
    setRecommended([]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Advisor Chat"
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0F1123] border border-slate-700/60 text-white shadow-soft transition-all duration-300 hover:scale-110 hover:shadow-xl hover:bg-[#151833] active:scale-95 group"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-slate-300 transition-transform duration-300" />
        ) : (
          <div className="relative flex items-center justify-center h-10 w-10">
            <Image
              src="/Chlonestone_logo.png"
              alt="Chlonestone Advisor"
              width={28}
              height={28}
              className="object-contain transition-transform group-hover:scale-105"
            />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
          </div>
        )}
        
        {/* Tooltip */}
        {!isOpen && (
          <span className="absolute right-16 scale-0 rounded-none bg-slate-950/90 border border-slate-800 px-3.5 py-2 text-[10px] font-bold text-white uppercase tracking-wider transition-all duration-200 group-hover:scale-100 whitespace-nowrap">
            Find Property Advisor
          </span>
        )}
      </button>
 
      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 md:right-8 z-50 w-[350px] sm:w-[380px] h-[520px] bg-[#0F1123]/98 text-slate-200 border border-slate-800 shadow-2xl flex flex-col rounded-none animate-fade-in font-sans">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 relative flex items-center justify-center">
                <Image
                  src="/Chlonestone_logo.png"
                  alt="Chlonestone Logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">Chlonestone Advisor</h4>
                <p className="text-[9px] text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online Assistant
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
 
          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-slate-900/60 border border-slate-800 p-4 space-y-3">
                  <p className="text-xs leading-relaxed text-slate-300">
                    Welcome to **Chlonestone Real Estate Dubai**. 
                  </p>
                  <p className="text-xs leading-relaxed text-slate-350">
                    Answer 4 quick questions about your property specifications, and our virtual advisor will suggest matching off-plan launch allocations in under 30 seconds.
                  </p>
                </div>
                <Button 
                  onClick={() => handleNextStep(1)} 
                  className="w-full bg-primary hover:bg-blue-800 text-white rounded-none font-bold uppercase tracking-wider text-[10px] h-11 gap-1.5"
                >
                  Begin Advisory Session <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
 
            {/* Step 1: Objective */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 1 of 4 · Purchase Intent</p>
                <h5 className="text-sm font-bold text-white leading-snug">What is your primary purchasing objective in Dubai?</h5>
                <div className="space-y-2.5 pt-1">
                  {[
                    { label: "Capital Appreciation & High Rental Yield (Investment)", value: "investment" },
                    { label: "Luxury Private Residence or Holiday Home (End-User)", value: "living" }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setObjective(opt.value);
                        handleNextStep(2);
                      }}
                      className="w-full text-left p-4 border border-slate-800 bg-slate-900/30 hover:border-primary hover:bg-slate-900 transition text-xs font-semibold text-slate-350"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
 
            {/* Step 2: Size */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 2 of 4 · Layout Specs</p>
                <h5 className="text-sm font-bold text-white leading-snug">Which property category matches your portfolio criteria?</h5>
                <div className="space-y-2.5 pt-1">
                  {[
                    { label: "Studios & 1-2 Bedroom Executive Suites", value: "small" },
                    { label: "Elite Penthouses, Duplexes & Architect Lofts", value: "penthouse" },
                    { label: "Lush Waterfront Townhouses & Signature Villas", value: "villa" }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSize(opt.value);
                        handleNextStep(3);
                      }}
                      className="w-full text-left p-4 border border-slate-800 bg-slate-900/30 hover:border-primary hover:bg-slate-900 transition text-xs font-semibold text-slate-350"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
 
            {/* Step 3: Budget */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 3 of 4 · Budget Allocation</p>
                <h5 className="text-sm font-bold text-white leading-snug">Specify your allocated capital investment budget:</h5>
                <div className="space-y-2.5 pt-1">
                  {[
                    { label: "Entry Level (Under AED 1.5 Million)", value: "under-1.5" },
                    { label: "Mid-Tier Luxury (AED 1.5M - AED 3 Million)", value: "1.5-3" },
                    { label: "Premium Luxury (AED 3M - AED 6 Million)", value: "3-6" },
                    { label: "Ultra-High-Net-Worth (AED 6 Million +)", value: "above-6" }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setBudget(opt.value);
                        handleNextStep(4);
                      }}
                      className="w-full text-left p-4 border border-slate-800 bg-slate-900/30 hover:border-primary hover:bg-slate-900 transition text-xs font-semibold text-slate-350"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
 
            {/* Step 4: Lifestyle */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 4 of 4 · Neighborhood Vibe</p>
                <h5 className="text-sm font-bold text-white leading-snug">Choose your preferred neighborhood environment:</h5>
                <div className="space-y-2.5 pt-1">
                  {[
                    { label: "Waterfront Marina, Sandy Beachfront or Bluewaters Canal", value: "waterfront" },
                    { label: "Metropolitan Business Hub & Iconic Downtown Skylines", value: "urban" },
                    { label: "Tranquil Golf Estates, Family Parks & Green Havens", value: "green" }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setLifestyle(opt.value);
                        handleNextStep(5);
                      }}
                      className="w-full text-left p-4 border border-slate-800 bg-slate-900/30 hover:border-primary hover:bg-slate-900 transition text-xs font-semibold text-slate-350"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
 
            {/* Step 5: Recommendations & Lead Capture */}
            {step === 5 && (
              <div className="space-y-4 animate-fade-in">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-1.5">
                  Top Matches Found ({recommended.length})
                </h5>

                {/* Recommended List */}
                <div className="space-y-3">
                  {recommended.map((proj) => (
                    <div key={proj.id} className="flex gap-2.5 border border-slate-850 p-2.5 bg-slate-900/25">
                      <div className="relative h-14 w-20 bg-slate-900 border border-slate-800 flex-shrink-0">
                        <Image
                          src={proj.image}
                          alt={proj.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h6 className="text-[11px] font-bold text-white truncate">{proj.name}</h6>
                        <p className="text-[9px] text-slate-400 truncate">{proj.developer} · {proj.communityName}</p>
                        <div className="flex justify-between items-center pt-1.5">
                          <span className="text-[10px] font-extrabold text-white">{proj.startingPrice}</span>
                          <Link 
                            href={`/projects/${proj.slug}`} 
                            target="_blank"
                            className="text-[9px] text-primary hover:underline font-bold uppercase tracking-wider flex items-center gap-0.5"
                          >
                            Details <ChevronRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lead Form Gate */}
                {!submitted ? (
                  <form onSubmit={handleLeadSubmit} className="border-t border-slate-800 pt-3 space-y-2.5">
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Submit your info to instantly download developer brochures and payment plan breakdowns for these recommended units.
                    </p>
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Your Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-8.5 text-xs bg-slate-900 border-slate-800 rounded-none text-slate-200"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-8.5 text-xs bg-slate-900 border-slate-800 rounded-none text-slate-200"
                        required
                      />
                      <Input
                        type="tel"
                        placeholder="Phone Number (e.g. +9715...)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-8.5 text-xs bg-slate-900 border-slate-800 rounded-none text-slate-200"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submittingLead}
                      className="w-full bg-primary hover:bg-blue-800 text-white rounded-none font-bold uppercase tracking-wider text-[9px] h-9"
                    >
                      {submittingLead ? "Submitting..." : "Get Investment Materials"}
                    </Button>
                  </form>
                ) : (
                  <div className="p-4 border border-dashed border-emerald-500 bg-emerald-950/20 text-center rounded-none space-y-2">
                    <p className="text-[11px] font-bold text-emerald-400">Request Received Successfully!</p>
                    <p className="text-[9px] text-slate-400">
                      An off-plan advisor will dispatch the booklets, ROI models, and payment terms to you shortly.
                    </p>
                    <Button
                      onClick={resetQuiz}
                      className="bg-slate-800 hover:bg-slate-700 text-white rounded-none font-bold uppercase tracking-wider text-[9px] h-8.5 px-4"
                    >
                      Start New Search
                    </Button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer branding */}
          <div className="p-3 border-t border-slate-800 text-center bg-slate-950/60 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
            Powered by Chlonestone Real Estate
          </div>

        </div>
      )}
    </>
  );
}
