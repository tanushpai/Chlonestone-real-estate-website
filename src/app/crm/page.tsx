"use client";

import { useState, useEffect } from "react";
import { 
  Building, 
  Users, 
  DollarSign, 
  Compass, 
  TrendingUp, 
  Plus, 
  Calendar,
  CheckCircle,
  Mail,
  Award,
  BarChart3,
  PieChart,
  Clock
} from "lucide-react";
import Link from "next/link";
import { getProjects } from "@/lib/dataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DBLead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  interestType: string;
  projectName: string | null;
  status: string;
  notes: string;
  assignedAgent?: { name: string; photoUrl: string } | null;
  createdAt: string;
  role: string | null;
  funding: string | null;
  dealValue: number | null;
  commissionRate: number | null;
}

export default function CrmDashboardPage() {
  const [projectCount, setProjectCount] = useState(0);
  const [leadsList, setLeadsList] = useState<DBLead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [guideUrl, setGuideUrl] = useState("");
  const [guideUploading, setGuideUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id?: number; name: string; email: string; role: string } | null>(null);

  // New state variables for analytics tab and project prices lookup
  const [activeTab, setActiveTab] = useState<"overview" | "analytics">("overview");
  const [projectsList, setProjectsList] = useState<any[]>([]);

  // Email template states
  const [welcomeSubject, setWelcomeSubject] = useState("");
  const [welcomeBody, setWelcomeBody] = useState("");
  const [guideSubject, setGuideSubject] = useState("");
  const [guideBody, setGuideBody] = useState("");
  const [inquirySubject, setInquirySubject] = useState("");
  const [inquiryBody, setInquiryBody] = useState("");
  const [savingTemplates, setSavingTemplates] = useState(false);

  useEffect(() => {
    let user = null;
    const stored = localStorage.getItem("chlonestone_user");
    if (stored) {
      user = JSON.parse(stored);
      setCurrentUser(user);
    }

    getProjects().then((all) => {
      setProjectCount(all.length);
      setProjectsList(all);
    });

    const leadsUrl = user && user.role === "agent" && user.id
      ? `/api/leads?agentId=${user.id}`
      : "/api/leads";

    fetch(leadsUrl)
      .then((res) => res.json())
      .then((data) => {
        setLeadsList(data);
        setLoadingLeads(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingLeads(false);
      });

    // Load dynamic settings including templates
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setGuideUrl(data.guideUrl || "");
        setWelcomeSubject(data.welcomeSubject || "");
        setWelcomeBody(data.welcomeBody || "");
        setGuideSubject(data.guideSubject || "");
        setGuideBody(data.guideBody || "");
        setInquirySubject(data.inquirySubject || "");
        setInquiryBody(data.inquiryBody || "");
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSaveTemplates = async () => {
    setSavingTemplates(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          welcomeSubject,
          welcomeBody,
          guideSubject,
          guideBody,
          inquirySubject,
          inquiryBody,
        }),
      });
      if (res.ok) {
        alert("Automated Email Templates saved successfully!");
      } else {
        throw new Error("Failed to save templates");
      }
    } catch (err) {
      alert("Error saving templates.");
    } finally {
      setSavingTemplates(false);
    }
  };

  const handleGuideUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGuideUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const uploadData = await res.json();
      
      // Save to settings DB
      const saveRes = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guideUrl: uploadData.url }),
      });
      if (saveRes.ok) {
        setGuideUrl(uploadData.url);
        alert("Investor Guide PDF updated successfully!");
      }
    } catch (err) {
      alert("Failed to upload/update investor guide");
    } finally {
      setGuideUploading(false);
    }
  };

  // Compute pipeline stages
  const getStatusCount = (status: string) => leadsList.filter((l) => l.status === status).length;

  // Follow-ups: leads with "Follow-up Required" or "Viewing Scheduled", or fallback to "New" leads
  const activeFollowUps = leadsList.filter(
    (l) => l.status === "Follow-up Required" || l.status === "Viewing Scheduled"
  );

  const newLeadsNeedContact = leadsList.filter((l) => l.status === "New");

  // Helper to parse price strings
  const parsePrice = (priceStr: string | null): number => {
    if (!priceStr) return 0;
    const cleaned = priceStr.replace(/[^0-9]/g, "");
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  // Helper to get project price by name
  const getProjectPrice = (projName: string | null): number => {
    if (!projName) return 0;
    const project = projectsList.find(p => p.name.toLowerCase() === projName.toLowerCase());
    if (project) {
      return parsePrice(project.startingPrice);
    }
    return 0;
  };

  // Format currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Computations for Analytics
  const activePipelineLeads = leadsList.filter(l => l.status !== "Lost" && l.status !== "Closed Won");
  
  const totalPipelineValue = activePipelineLeads.reduce((sum, lead) => {
    const val = lead.dealValue !== null && lead.dealValue !== undefined ? lead.dealValue : getProjectPrice(lead.projectName);
    return sum + val;
  }, 0);

  const estimatedCommission = activePipelineLeads.reduce((sum, lead) => {
    const val = lead.dealValue !== null && lead.dealValue !== undefined ? lead.dealValue : getProjectPrice(lead.projectName);
    const pct = lead.commissionRate !== null && lead.commissionRate !== undefined ? lead.commissionRate : 2.0;
    return sum + (val * (pct / 100));
  }, 0);

  const closedLeads = leadsList.filter(l => l.status === "Closed Won");
  
  const revenueClosed = closedLeads.reduce((sum, lead) => {
    const val = lead.dealValue !== null && lead.dealValue !== undefined ? lead.dealValue : getProjectPrice(lead.projectName);
    return sum + val;
  }, 0);

  const earnedCommission = closedLeads.reduce((sum, lead) => {
    const val = lead.dealValue !== null && lead.dealValue !== undefined ? lead.dealValue : getProjectPrice(lead.projectName);
    const pct = lead.commissionRate !== null && lead.commissionRate !== undefined ? lead.commissionRate : 2.0;
    return sum + (val * (pct / 100));
  }, 0);

  const conversionRate = leadsList.length > 0 ? (closedLeads.length / leadsList.length) * 100 : 0;

  const getPipelineByProject = () => {
    const projectMap: Record<string, number> = {};
    leadsList.forEach(l => {
      if (l.projectName && l.status !== "Lost") {
        const val = l.dealValue !== null && l.dealValue !== undefined ? l.dealValue : getProjectPrice(l.projectName);
        projectMap[l.projectName] = (projectMap[l.projectName] || 0) + val;
      }
    });
    return Object.entries(projectMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const getAgentPerformance = () => {
    const agentMap: Record<string, { leadsCount: number; activePipeline: number; closedCount: number; earnedComm: number }> = {};
    leadsList.forEach(l => {
      const agentName = l.assignedAgent?.name || "Unassigned";
      if (!agentMap[agentName]) {
        agentMap[agentName] = { leadsCount: 0, activePipeline: 0, closedCount: 0, earnedComm: 0 };
      }
      agentMap[agentName].leadsCount += 1;
      const val = l.dealValue !== null && l.dealValue !== undefined ? l.dealValue : getProjectPrice(l.projectName);
      const pct = l.commissionRate !== null && l.commissionRate !== undefined ? l.commissionRate : 2.0;
      if (l.status !== "Lost" && l.status !== "Closed Won") {
        agentMap[agentName].activePipeline += val;
      }
      if (l.status === "Closed Won") {
        agentMap[agentName].closedCount += 1;
        agentMap[agentName].earnedComm += val * (pct / 100);
      }
    });
    return Object.entries(agentMap)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.earnedComm - a.earnedComm);
  };

  const getFundingDistribution = () => {
    const dist = { installments: 0, mortgage: 0, cash: 0, unspecified: 0 };
    leadsList.forEach(l => {
      const fund = l.funding?.toLowerCase();
      if (fund === "cash") dist.cash += 1;
      else if (fund === "mortgage") dist.mortgage += 1;
      else if (fund === "installments") dist.installments += 1;
      else dist.unspecified += 1;
    });
    return dist;
  };

  const getRoleDistribution = () => {
    const dist = { investor: 0, endUser: 0, unspecified: 0 };
    leadsList.forEach(l => {
      const role = l.role?.toLowerCase();
      if (role === "investor") dist.investor += 1;
      else if (role === "end-user" || role === "enduser") dist.endUser += 1;
      else dist.unspecified += 1;
    });
    return dist;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Top Banner with action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-heading">
            Welcome Back, {currentUser?.name || "Agent"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentUser?.role === "agent" 
              ? "Here are your assigned lead funnel metrics and activity." 
              : "Here's the current active inventory and lead funnel metrics for your agency."}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Tab Toggle Switch */}
          <div className="flex bg-slate-100 border p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeTab === "overview"
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeTab === "analytics"
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Agent Performance
            </button>
          </div>

          <Link href="/crm/projects/new">
            <Button size="sm" className="bg-primary hover:bg-blue-800 text-white rounded-xl gap-2 font-semibold h-9.5">
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </Link>
        </div>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* KPI Stats Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            
            {/* KPI 1 */}
            <div className="bg-white border p-5 rounded-3xl shadow-sm space-y-2 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">Active Inventory</span>
                <div className="h-8 w-8 rounded-xl bg-slate-50 border flex items-center justify-center text-slate-500">
                  <Building className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">{projectCount}</h3>
                <p className="text-[0.65rem] text-slate-400 font-medium">Off-plan developments live</p>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-white border p-5 rounded-3xl shadow-sm space-y-2 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">Total Leads</span>
                <div className="h-8 w-8 rounded-xl bg-slate-50 border flex items-center justify-center text-slate-500">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">{leadsList.length}</h3>
                <p className="text-[0.65rem] text-emerald-600 font-medium">Captured in database</p>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-white border p-5 rounded-3xl shadow-sm space-y-2 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">Deals Won</span>
                <div className="h-8 w-8 rounded-xl bg-emerald-50 border flex items-center justify-center text-emerald-600">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">{getStatusCount("Closed Won")}</h3>
                <p className="text-[0.65rem] text-slate-400 font-medium">Successfully closed deals</p>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-white border p-5 rounded-3xl shadow-sm space-y-2 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">Active Funnel</span>
                <div className="h-8 w-8 rounded-xl bg-amber-50/75 border flex items-center justify-center text-amber-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {leadsList.filter(l => l.status !== "Closed Won" && l.status !== "Lost").length}
                </h3>
                <p className="text-[0.65rem] text-slate-400 font-medium">Leads currently in pipeline</p>
              </div>
            </div>

          </div>

          {/* Interactive Analytics Dashboard Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Funnel Area Chart Card */}
            <div className="bg-white border p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Lead Conversion Pipeline Funnel
                </h3>
                <span className="text-[10px] bg-slate-50 border px-2.5 py-1 rounded-full text-slate-500 font-semibold">
                  Live Funnel
                </span>
              </div>

              <div className="h-64 flex flex-col justify-between">
                {/* SVG Amortization Funnel */}
                <div className="flex-1 relative mt-2 flex items-center justify-center">
                  <svg className="w-full h-full max-h-[200px]" viewBox="0 0 400 180" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="newGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85"/>
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.95"/>
                      </linearGradient>
                      <linearGradient id="contactGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85"/>
                        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.95"/>
                      </linearGradient>
                      <linearGradient id="viewGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85"/>
                        <stop offset="100%" stopColor="#c084fc" stopOpacity="0.95"/>
                      </linearGradient>
                      <linearGradient id="followGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85"/>
                        <stop offset="100%" stopColor="#f87171" stopOpacity="0.95"/>
                      </linearGradient>
                      <linearGradient id="wonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.85"/>
                        <stop offset="100%" stopColor="#34d399" stopOpacity="0.95"/>
                      </linearGradient>
                    </defs>

                    {/* Draw Funnel Stages */}
                    {/* 1. New */}
                    <polygon points="10,10 390,10 350,40 50,40" fill="url(#newGrad)" className="transition duration-300 hover:opacity-90 cursor-pointer" />
                    {/* 2. Contacted */}
                    <polygon points="50,43 350,43 310,73 90,73" fill="url(#contactGrad)" className="transition duration-300 hover:opacity-90 cursor-pointer" />
                    {/* 3. Viewing Scheduled */}
                    <polygon points="90,76 310,76 270,106 130,106" fill="url(#viewGrad)" className="transition duration-300 hover:opacity-90 cursor-pointer" />
                    {/* 4. Follow-up Required */}
                    <polygon points="130,109 270,109 230,139 170,139" fill="url(#followGrad)" className="transition duration-300 hover:opacity-90 cursor-pointer" />
                    {/* 5. Closed Won */}
                    <polygon points="170,142 230,142 210,172 190,172" fill="url(#wonGrad)" className="transition duration-300 hover:opacity-90 cursor-pointer" />

                    {/* Text Labels inside SVG */}
                    <text x="200" y="28" textAnchor="middle" fill="#ffffff" className="text-[10px] font-bold select-none pointer-events-none">
                      New: {getStatusCount("New")}
                    </text>
                    <text x="200" y="61" textAnchor="middle" fill="#ffffff" className="text-[10px] font-bold select-none pointer-events-none">
                      Contacted: {getStatusCount("Contacted")}
                    </text>
                    <text x="200" y="94" textAnchor="middle" fill="#ffffff" className="text-[10px] font-bold select-none pointer-events-none">
                      Viewing: {getStatusCount("Viewing Scheduled")}
                    </text>
                    <text x="200" y="127" textAnchor="middle" fill="#ffffff" className="text-[10px] font-bold select-none pointer-events-none">
                      Follow-ups: {getStatusCount("Follow-up Required")}
                    </text>
                    <text x="200" y="160" textAnchor="middle" fill="#ffffff" className="text-[10px] font-bold select-none pointer-events-none">
                      Won: {getStatusCount("Closed Won")}
                    </text>
                  </svg>
                </div>
                
                <p className="text-[10px] text-slate-400 text-center leading-relaxed mt-2 font-medium">
                  Distribution displays lead stages from Initial Capture through successfully Closed Won accounts.
                </p>
              </div>
            </div>

            {/* Lead Source / Interest Category Bar Chart */}
            <div className="bg-white border p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Lead Source & Interest Categories
                </h3>
                <span className="text-[10px] bg-slate-50 border px-2.5 py-1 rounded-full text-slate-500 font-semibold">
                  Live Categories
                </span>
              </div>

              <div className="h-64 flex flex-col justify-between">
                {/* SVG Bars for Interests */}
                <div className="flex-1 flex flex-col justify-center space-y-3 mt-2">
                  {[
                    { name: "Investor Guide Downloads", key: "guide", color: "bg-blue-600" },
                    { name: "Direct Contact / Inquiry", key: "contact", color: "bg-emerald-600" },
                    { name: "Property Wishlist Saves", key: "wishlist", color: "bg-pink-600" },
                    { name: "Newsletter / Other Signups", key: "other", color: "bg-amber-600" },
                  ].map((cat) => {
                    const count = leadsList.filter(l => {
                      if (cat.key === "guide") return l.interestType === "guide";
                      if (cat.key === "contact") return l.interestType === "contact" || l.interestType === "general";
                      if (cat.key === "wishlist") return l.interestType === "wishlist" || l.interestType === "wishlist-nav" || l.interestType === "wishlist-page";
                      return l.interestType !== "guide" && l.interestType !== "contact" && l.interestType !== "general" && !l.interestType.includes("wishlist");
                    }).length;

                    const maxVal = Math.max(1, ...[
                      leadsList.filter(l => l.interestType === "guide").length,
                      leadsList.filter(l => l.interestType === "contact" || l.interestType === "general").length,
                      leadsList.filter(l => l.interestType === "wishlist" || l.interestType === "wishlist-nav" || l.interestType === "wishlist-page").length,
                      leadsList.filter(l => l.interestType !== "guide" && l.interestType !== "contact" && l.interestType !== "general" && !l.interestType.includes("wishlist")).length,
                    ]);
                    const widthPercent = Math.max(8, (count / maxVal) * 100);

                    return (
                      <div key={cat.key} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-600">
                          <span>{cat.name}</span>
                          <span className="text-slate-800">{count} Leads</span>
                        </div>
                        <div className="w-full bg-slate-50 border border-slate-100 h-6 rounded-full overflow-hidden flex items-center p-0.5">
                          <div 
                            style={{ width: `${widthPercent}%` }} 
                            className={`h-full ${cat.color} rounded-full transition-all duration-1000 flex items-center justify-end px-2.5 shadow-sm`}
                          >
                            {count > 0 && <span className="text-[8px] font-black text-white">{Math.round(widthPercent)}%</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 text-center leading-relaxed mt-2 font-medium">
                  Distribution reflects user engagement across booklets, listing captures, and bookmarks.
                </p>
              </div>
            </div>

          </div>

          {/* Two Column details: Leads & Followups */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Leads (2/3) */}
            <div className="lg:col-span-2 bg-white border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex justify-between items-center">
                <span>Recent Lead Inquiries</span>
                <Link href="/crm/leads" className="text-xs text-primary hover:underline font-semibold">
                  View All
                </Link>
              </h3>
              
              <div className="overflow-x-auto">
                {loadingLeads ? (
                  <p className="text-xs text-slate-400">Loading leads...</p>
                ) : leadsList.length === 0 ? (
                  <p className="text-xs text-slate-400">No leads captured yet.</p>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b text-slate-400 font-semibold">
                        <th className="py-2.5">Name</th>
                        <th className="py-2.5">Email</th>
                        <th className="py-2.5">Project Interest</th>
                        <th className="py-2.5">Pipeline Status</th>
                        <th className="py-2.5 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {leadsList.slice(0, 5).map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/50">
                          <td className="py-3 font-semibold text-slate-800">{lead.name}</td>
                          <td className="py-3 text-slate-500">{lead.email}</td>
                          <td className="py-3 text-slate-700 font-medium">{lead.projectName || "General Inquiry"}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[0.6rem] uppercase ${
                              lead.status === "Closed Won" ? "bg-emerald-50 text-emerald-700 border-emerald-100 border" :
                              lead.status === "Lost" ? "bg-slate-100 text-slate-600 border-slate-200 border" :
                              lead.status === "Follow-up Required" ? "bg-red-50 text-red-700 border-red-100 border" :
                              lead.status === "Viewing Scheduled" ? "bg-purple-50 text-purple-700 border-purple-100 border" :
                              lead.status === "Contacted" ? "bg-amber-50 text-amber-700 border-amber-100 border" :
                              "bg-blue-50 text-blue-700 border-blue-100 border"
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-3 text-right text-slate-400 font-medium">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Follow Ups (1/3) */}
            <div className="lg:col-span-1 bg-white border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-primary" /> Action Items & Follow-ups
              </h3>
              
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {loadingLeads ? (
                  <p className="text-xs text-slate-400">Loading follow-ups...</p>
                ) : activeFollowUps.length === 0 && newLeadsNeedContact.length === 0 ? (
                  <div className="p-4 text-center border border-dashed rounded-2xl bg-slate-50/50">
                    <p className="text-xs font-semibold text-slate-600">All caught up!</p>
                    <p className="text-[0.65rem] text-slate-400 mt-1">No active leads require follow-ups right now.</p>
                  </div>
                ) : (
                  <>
                    {/* Active follow-ups list */}
                    {activeFollowUps.map((l) => (
                      <Link href="/crm/leads" key={l.id} className="block hover:opacity-90 transition">
                        <div className={`p-3 border rounded-xl space-y-1 ${
                          l.status === "Follow-up Required" ? "bg-red-50/50 border-red-100" : "bg-purple-50/50 border-purple-100"
                        }`}>
                          <div className="flex justify-between items-center">
                            <span className={`text-[0.55rem] font-bold px-1.5 py-0.5 rounded uppercase ${
                              l.status === "Follow-up Required" ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"
                            }`}>
                              {l.status}
                            </span>
                            {l.assignedAgent && (
                              <span className="text-[0.55rem] text-slate-400 font-medium">
                                {l.assignedAgent.name}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-800">Contact {l.name}</h4>
                          <p className="text-[0.65rem] text-slate-500 line-clamp-2">
                            {l.notes || `No follow-up notes logged yet. Interested in ${l.projectName || "General inquiry"}.`}
                          </p>
                        </div>
                      </Link>
                    ))}

                    {/* Suggested actions for new leads */}
                    {newLeadsNeedContact.map((l) => (
                      <Link href="/crm/leads" key={l.id} className="block hover:opacity-90 transition">
                        <div className="p-3 bg-blue-50/30 border border-blue-100 rounded-xl space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[0.55rem] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase">
                              New Inquiry
                            </span>
                            <span className="text-[0.55rem] text-slate-400 font-medium">
                              {new Date(l.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800">Qualify {l.name}</h4>
                          <p className="text-[0.65rem] text-slate-500">
                            Interested in {l.projectName || "General site content"}. Send details or call.
                          </p>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Investor Guide Manager (1/3) */}
            <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-4 h-fit">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="h-4.5 w-4.5 text-primary" /> Global Investor Guide
              </h3>
              <p className="text-xs text-slate-500 leading-normal">
                Upload the latest version of the <strong>Dubai Off-Plan Investor Guide</strong> PDF. This document will be instantly downloadable by visitors on the public home page booklet form.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleGuideUpload}
                      className="hidden"
                      id="guide-upload-input"
                      disabled={guideUploading}
                    />
                    <label
                      htmlFor="guide-upload-input"
                      className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold py-3 cursor-pointer transition select-none"
                    >
                      {guideUploading ? "Uploading Guide..." : "Upload Guide PDF"}
                    </label>
                  </div>
                  {guideUrl && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 border border-emerald-200 rounded font-semibold">
                      Active
                    </span>
                  )}
                </div>
                {guideUrl ? (
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Current Live Path</p>
                    <p className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded border truncate font-mono select-all" title={guideUrl}>
                      {guideUrl}
                    </p>
                  </div>
                ) : (
                  <p className="text-[10px] text-red-500 italic">No guide PDF uploaded yet. Booklet form downloads will use a simulated PDF.</p>
                )}
              </div>
            </div>

          </div>

          {/* Email Templates Manager Section */}
          <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-6">
            <div className="border-b pb-3 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Automated Email Templates Manager</h3>
                <p className="text-[10px] text-slate-400">Configure client-facing email confirmations and booklet deliveries. Use dynamic tags <code>{"{{CLIENT_NAME}}"}</code>, <code>{"{{PROJECT_NAME}}"}</code>, and <code>{"{{GUIDE_URL}}"}</code>.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Welcome Email Template */}
              <div className="space-y-3.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">1. Newsletter Welcome</h4>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Subject</label>
                    <Input
                      type="text"
                      value={welcomeSubject}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWelcomeSubject(e.target.value)}
                      className="text-xs bg-white rounded-xl h-9 border-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Email Body</label>
                    <textarea
                      value={welcomeBody}
                      onChange={(e) => setWelcomeBody(e.target.value)}
                      rows={6}
                      className="w-full text-xs bg-white rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-1 focus:ring-primary font-sans text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Guide Email Template */}
              <div className="space-y-3.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">2. Booklet Booklet Delivery</h4>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Subject</label>
                    <Input
                      type="text"
                      value={guideSubject}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGuideSubject(e.target.value)}
                      className="text-xs bg-white rounded-xl h-9 border-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Email Body</label>
                    <textarea
                      value={guideBody}
                      onChange={(e) => setGuideBody(e.target.value)}
                      rows={6}
                      className="w-full text-xs bg-white rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-1 focus:ring-primary font-sans text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Inquiry Email Template */}
              <div className="space-y-3.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">3. Property Listing Inquiry</h4>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Subject</label>
                    <Input
                      type="text"
                      value={inquirySubject}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInquirySubject(e.target.value)}
                      className="text-xs bg-white rounded-xl h-9 border-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Email Body</label>
                    <textarea
                      value={inquiryBody}
                      onChange={(e) => setInquiryBody(e.target.value)}
                      rows={6}
                      className="w-full text-xs bg-white rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-1 focus:ring-primary font-sans text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <Button
                onClick={handleSaveTemplates}
                disabled={savingTemplates}
                className="bg-primary hover:bg-blue-800 text-white rounded-xl px-6 font-semibold animate-pulse-hover"
              >
                {savingTemplates ? "Saving..." : "Save Email Templates"}
              </Button>
            </div>
          </div>
        </>
      ) : (
        /* Agent Performance & Lead Tracking Tab */
        <div className="space-y-6 md:space-y-8 animate-fade-in">
          
          {/* Performance KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            
            {/* KPI 1: Active Pipeline Value */}
            <div className="bg-white border p-5 rounded-3xl shadow-sm space-y-2 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">Active Pipeline</span>
                <div className="h-8 w-8 rounded-xl bg-blue-50 border flex items-center justify-center text-blue-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{formatCurrency(totalPipelineValue)}</h3>
                <p className="text-[0.65rem] text-slate-400 font-medium">Pipeline of active deals</p>
              </div>
            </div>

            {/* KPI 2: Total Leads */}
            <div className="bg-white border p-5 rounded-3xl shadow-sm space-y-2 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">Assigned Leads</span>
                <div className="h-8 w-8 rounded-xl bg-amber-50 border flex items-center justify-center text-amber-600">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{leadsList.length} Leads</h3>
                <p className="text-[0.65rem] text-amber-600 font-medium">Total leads in CRM</p>
              </div>
            </div>

            {/* KPI 3: Closed Won Sales */}
            <div className="bg-white border p-5 rounded-3xl shadow-sm space-y-2 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">Closed Revenue</span>
                <div className="h-8 w-8 rounded-xl bg-emerald-50 border flex items-center justify-center text-emerald-600">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{formatCurrency(revenueClosed)}</h3>
                <p className="text-[0.65rem] text-slate-400 font-medium">Total sales revenue won</p>
              </div>
            </div>

            {/* KPI 4: Conversion Rate */}
            <div className="bg-white border p-5 rounded-3xl shadow-sm space-y-2 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">Conversion Rate</span>
                <div className="h-8 w-8 rounded-xl bg-emerald-100 border flex items-center justify-center text-emerald-700">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{conversionRate.toFixed(1)}%</h3>
                <p className="text-[0.65rem] text-emerald-600 font-medium">Leads converted to Closed Won</p>
              </div>
            </div>

          </div>

          {/* Leaderboard or Personal Sales metrics card */}
          {currentUser?.role === "admin" ? (
            /* Admin view: Property Consultants Performance Leaderboard */
            <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-4">
              <div className="border-b pb-3 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="h-4.5 w-4.5 text-primary" /> Property Consultants Performance Tracking
                </h3>
                <span className="text-[10px] bg-slate-50 border px-2.5 py-1 rounded-full text-slate-500 font-semibold">
                  Sorted by Closed Sales
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-2.5">Consultant Name</th>
                      <th className="py-2.5">Assigned Leads</th>
                      <th className="py-2.5">Active Pipeline Value</th>
                      <th className="py-2.5">Deals Closed Won</th>
                      <th className="py-2.5 text-right">Lead Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {getAgentPerformance().map((agent) => {
                      const agentConv = agent.leadsCount > 0 ? (agent.closedCount / agent.leadsCount) * 100 : 0;
                      return (
                        <tr key={agent.name} className="hover:bg-slate-50/50">
                          <td className="py-3 font-semibold text-slate-800">{agent.name}</td>
                          <td className="py-3 text-slate-600 font-medium">{agent.leadsCount} Leads</td>
                          <td className="py-3 text-slate-700 font-bold">{formatCurrency(agent.activePipeline)}</td>
                          <td className="py-3 font-semibold text-emerald-600">{agent.closedCount} Closed</td>
                          <td className="py-3 text-right font-black text-slate-900">
                            {agentConv.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Agent view: Personal Sales Milestones & Conversion Rate */
            <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-4">
              <div className="border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="h-4.5 w-4.5 text-primary" /> My Performance Tracking & Milestones
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Conversion Ratio */}
                <div className="bg-slate-50 border p-4 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">My Deal Conversion Rate</p>
                    <h4 className="text-2xl font-black text-slate-900 mt-1">{conversionRate.toFixed(1)}%</h4>
                  </div>
                  <p className="text-[9px] text-slate-450 leading-relaxed mt-4 font-semibold">
                    The ratio of assigned lead inquiries successfully moved to "Closed Won" status. Target is &gt; 10%.
                  </p>
                </div>

                {/* Next Milestone */}
                <div className="bg-slate-50 border p-4 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Sales Target Milestone</p>
                    <h4 className="text-sm font-bold text-slate-800 mt-1">10 Deals Closed Won</h4>
                  </div>
                  <div className="space-y-1 mt-4">
                    <div className="flex justify-between text-[9px] font-bold text-slate-500">
                      <span>Milestone Progress</span>
                      <span>{Math.min(100, Math.round((closedLeads.length / 10) * 100))}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${Math.min(100, (closedLeads.length / 10) * 100)}%` }} 
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Pipeline Health */}
                <div className="bg-slate-50 border p-4 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Pipeline Health Status</p>
                    <h4 className="text-sm font-bold text-slate-850 mt-1">
                      {totalPipelineValue > 20000000 ? "Outstanding" : totalPipelineValue > 10000000 ? "Strong" : "Action Required"}
                    </h4>
                  </div>
                  <p className="text-[9px] text-slate-450 leading-relaxed mt-4 font-semibold">
                    Active pipeline total value is calculated from the starting prices of your leads' properties of interest.
                  </p>
                </div>

              </div>
            </div>
          )
        }</div>
      )}

    </div>
  );
}
