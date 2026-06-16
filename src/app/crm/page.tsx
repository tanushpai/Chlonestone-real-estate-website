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
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { getProjects } from "@/lib/dataService";
import { Button } from "@/components/ui/button";

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
}

export default function CrmDashboardPage() {
  const [projectCount, setProjectCount] = useState(0);
  const [leadsList, setLeadsList] = useState<DBLead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [guideUrl, setGuideUrl] = useState("");
  const [guideUploading, setGuideUploading] = useState(false);

  useEffect(() => {
    getProjects().then((all) => {
      setProjectCount(all.length);
    });

    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeadsList(data);
        setLoadingLeads(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingLeads(false);
      });

    // Load dynamic guideUrl settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setGuideUrl(data.guideUrl || ""))
      .catch((err) => console.error(err));
  }, []);

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

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Top Banner with action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-heading">
            Welcome Back, Agent
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here's the current active inventory and lead funnel metrics for your agency.
          </p>
        </div>
        <Link href="/crm/projects/new">
          <Button size="sm" className="bg-primary hover:bg-blue-800 text-white rounded-xl gap-2 font-semibold">
            <Plus className="h-4 w-4" />
            Add New Project
          </Button>
        </Link>
      </div>

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

      {/* Pipeline Funnel */}
      <div className="bg-white border p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Sales Pipeline Funnel
        </h3>
        
        <div className="grid grid-cols-6 gap-2 text-center text-[0.65rem] sm:text-xs">
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
            <p className="font-bold text-blue-700">New</p>
            <p className="text-lg font-extrabold text-slate-800 mt-1">
              {getStatusCount("New")}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl">
            <p className="font-bold text-amber-700">Contacted</p>
            <p className="text-lg font-extrabold text-slate-800 mt-1">
              {getStatusCount("Contacted")}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-100 p-3 rounded-xl">
            <p className="font-bold text-purple-700">Viewing Scheduled</p>
            <p className="text-lg font-extrabold text-slate-800 mt-1">
              {getStatusCount("Viewing Scheduled")}
            </p>
          </div>
          <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
            <p className="font-bold text-red-700">Follow-up Req.</p>
            <p className="text-lg font-extrabold text-slate-800 mt-1">
              {getStatusCount("Follow-up Required")}
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
            <p className="font-bold text-emerald-700">Closed Won</p>
            <p className="text-lg font-extrabold text-slate-800 mt-1">
              {getStatusCount("Closed Won")}
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <p className="font-bold text-slate-500">Lost</p>
            <p className="text-lg font-extrabold text-slate-800 mt-1">
              {getStatusCount("Lost")}
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

    </div>
  );
}
