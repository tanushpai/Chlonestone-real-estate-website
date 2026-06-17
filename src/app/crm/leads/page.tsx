"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle,
  FileText,
  Heart,
  Calendar,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  User,
  Building,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Agent {
  id: number;
  name: string;
  photoUrl: string;
  role: string;
}

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  interestType: string; // 'wishlist' | 'brochure' | 'viewing' | 'guide' | 'contact'
  role: string | null; // 'investor' | 'end-user'
  funding: string | null; // 'cash' | 'mortgage' | 'installments'
  timeframe: string | null; // 'immediate' | '3-6months' | 'exploring'
  message: string | null;
  projectName: string | null;
  status: string; // 'New' | 'Contacted' | 'Viewing Scheduled' | 'Follow-up Required' | 'Closed Won' | 'Lost'
  notes: string;
  assignedAgentId: number | null;
  assignedAgent?: Agent | null;
  createdAt: string;
}

export default function CrmLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [notesText, setNotesText] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id?: number; name: string; email: string; role: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedStatus]);

  const loadLeads = async (userObj?: any) => {
    setLoading(true);
    try {
      const user = userObj || (typeof window !== "undefined" && localStorage.getItem("chlonestone_user") ? JSON.parse(localStorage.getItem("chlonestone_user")!) : null);
      const leadsUrl = user && user.role === "agent" && user.id
        ? `/api/leads?agentId=${user.id}`
        : "/api/leads";
      const res = await fetch(leadsUrl);
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
        // Sync selected lead if open
        if (selectedLead) {
          const updatedSelected = data.find((l: Lead) => l.id === selectedLead.id);
          if (updatedSelected) {
            setSelectedLead(updatedSelected);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load leads", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAgents = async () => {
    try {
      const res = await fetch("/api/agents");
      if (res.ok) {
        const data = await res.json();
        setAgents(data);
      }
    } catch (error) {
      console.error("Failed to load agents", error);
    }
  };

  useEffect(() => {
    let user = null;
    const stored = localStorage.getItem("chlonestone_user");
    if (stored) {
      user = JSON.parse(stored);
      setCurrentUser(user);
    }
    loadLeads(user);
    loadAgents();
  }, []);

  useEffect(() => {
    if (selectedLead) {
      setNotesText(selectedLead.notes || "");
    } else {
      setNotesText("");
    }
  }, [selectedLead?.id]);

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete lead "${name}"?`)) {
      try {
        const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
        if (res.ok) {
          setSuccessMsg(`Deleted lead ${name}`);
          if (selectedLead?.id === id) setSelectedLead(null);
          loadLeads();
          setTimeout(() => setSuccessMsg(""), 3000);
        }
      } catch (error) {
        alert("Failed to delete lead");
      }
    }
  };

  const handleUpdateLeadField = async (leadId: number, fields: Partial<Lead>) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, ...updated } : l)));
        setSelectedLead(updated);
        setSuccessMsg("Lead updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (error) {
      console.error("Failed to update lead", error);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNotes(true);
    await handleUpdateLeadField(selectedLead.id, { notes: notesText });
    setSavingNotes(false);
  };

  const getInterestBadgeColor = (type: string) => {
    switch (type) {
      case "wishlist":
        return "bg-pink-50 text-pink-700 border-pink-100";
      case "brochure":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "viewing":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "guide":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  const getInterestIcon = (type: string) => {
    switch (type) {
      case "wishlist":
        return <Heart className="h-3 w-3" />;
      case "brochure":
        return <FileText className="h-3 w-3" />;
      case "viewing":
        return <Calendar className="h-3 w-3" />;
      case "guide":
        return <Sparkles className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Contacted":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Viewing Scheduled":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Follow-up Required":
        return "bg-red-50 text-red-700 border-red-200";
      case "Closed Won":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Lost":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default: // "New"
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const filteredLeads = leads.filter((l) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      l.name.toLowerCase().includes(query) ||
      l.email.toLowerCase().includes(query) ||
      (l.phone && l.phone.includes(query)) ||
      (l.projectName && l.projectName.toLowerCase().includes(query));

    const matchesType = selectedType === "all" || l.interestType === selectedType;
    const matchesStatus = selectedStatus === "all" || l.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const leadStatuses = ["New", "Contacted", "Viewing Scheduled", "Follow-up Required", "Closed Won", "Lost"];

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-heading">
            Leads & Inquiries Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track customer registrations, wishlists, brochure downloads, status pipelines, and assigned property consultants.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-1.5 text-xs text-slate-600 font-semibold shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
          <span>{leads.length} Total Captured Leads</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Options bar */}
      <div className="bg-white border p-4 rounded-3xl shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name, email, phone, or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs rounded-xl h-10 border-slate-200"
            />
          </div>

          {/* Lead Status Filter Strip */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto py-1">
            <span className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Filter className="h-3 w-3" /> Status:
            </span>
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                selectedStatus === "all"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
              }`}
            >
              All Statuses
            </button>
            {leadStatuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  selectedStatus === status
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                }`}
              >
                <span>{status}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t pt-3 flex items-center gap-2 overflow-x-auto">
          <span className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter className="h-3 w-3" /> Interest Type:
          </span>
          {["all", "wishlist", "brochure", "viewing", "guide", "contact"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                selectedType === type
                  ? "bg-primary text-white border-primary"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
              }`}
            >
              <span className="capitalize">{type === "all" ? "All Types" : type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Leads Table (2/3) + Details Panel (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table column */}
        <div className="lg:col-span-2 bg-white border rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading leads database...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No leads found matching criteria.</div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="p-4">Contact</th>
                    <th className="p-4">Interest Info</th>
                    <th className="p-4">Pipeline Status</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Assigned Agent</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLeads.slice((currentPage - 1) * leadsPerPage, currentPage * leadsPerPage).map((l) => (
                    <tr 
                      key={l.id} 
                      onClick={() => setSelectedLead(l)}
                      className={`hover:bg-slate-50/50 transition cursor-pointer ${
                        selectedLead?.id === l.id ? "bg-slate-50 font-medium" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{l.name}</div>
                        <div className="text-[0.7rem] text-slate-400 mt-0.5">{l.email}</div>
                        {l.phone && <div className="text-[0.7rem] text-slate-400">{l.phone}</div>}
                      </td>
                      <td className="p-4">
                        {l.projectName ? (
                          <span className="font-semibold text-slate-700">{l.projectName}</span>
                        ) : (
                          <span className="text-slate-400 italic">General Site lead</span>
                        )}
                        {l.timeframe && (
                          <p className="text-[0.65rem] text-slate-500 mt-0.5">Timeframe: {l.timeframe}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[0.65rem] font-bold ${getStatusBadgeColor(l.status)}`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[0.65rem] font-bold uppercase ${getInterestBadgeColor(l.interestType)}`}>
                          {getInterestIcon(l.interestType)}
                          {l.interestType}
                        </span>
                      </td>
                      <td className="p-4">
                        {l.assignedAgent ? (
                          <div className="flex items-center gap-1.5">
                            <img 
                              src={l.assignedAgent.photoUrl} 
                              alt={l.assignedAgent.name} 
                              className="h-5.5 w-5.5 rounded-full object-cover border"
                            />
                            <span className="font-semibold text-slate-700">{l.assignedAgent.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(l.id, l.name);
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {Math.ceil(filteredLeads.length / leadsPerPage) > 1 && (
            <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
              <p className="text-[11px] text-slate-500 font-medium">
                Showing <span className="font-semibold text-slate-800">{Math.min((currentPage - 1) * leadsPerPage + 1, filteredLeads.length)}</span> to{" "}
                <span className="font-semibold text-slate-800">{Math.min(currentPage * leadsPerPage, filteredLeads.length)}</span> of{" "}
                <span className="font-semibold text-slate-800">{filteredLeads.length}</span> leads
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-7 w-7 p-0 rounded-lg bg-white"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                {Array.from({ length: Math.ceil(filteredLeads.length / leadsPerPage) }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`h-7 w-7 p-0 rounded-lg font-bold text-[11px] ${
                      currentPage === page ? "bg-slate-900 text-white" : "bg-white"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filteredLeads.length / leadsPerPage), p + 1))}
                  disabled={currentPage === Math.ceil(filteredLeads.length / leadsPerPage)}
                  className="h-7 w-7 p-0 rounded-lg bg-white"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Lead Details sidebar */}
        <div className="lg:col-span-1 bg-white border rounded-3xl p-6 shadow-sm flex flex-col justify-between h-fit min-h-[500px]">
          {selectedLead ? (
            <div className="space-y-5">
              <div className="border-b pb-3 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary" /> Lead Profile
                </h3>
                <span className="text-[0.65rem] text-slate-400 font-medium">
                  ID: #{selectedLead.id}
                </span>
              </div>

              {/* General Contact Info */}
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-slate-50 border flex items-center justify-center text-slate-400">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[0.6rem] font-bold text-slate-400 uppercase">Full Name</p>
                    <p className="text-xs font-bold text-slate-800">{selectedLead.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-slate-50 border flex items-center justify-center text-slate-400">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[0.6rem] font-bold text-slate-400 uppercase">Email Address</p>
                    <p className="text-xs font-semibold text-slate-600">{selectedLead.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-slate-50 border flex items-center justify-center text-slate-400">
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[0.6rem] font-bold text-slate-400 uppercase">Phone Number</p>
                    <p className="text-xs font-semibold text-slate-600">
                      {selectedLead.phone || <span className="text-slate-400 italic">None Provided</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Salesforce Core CRM: Pipeline Status Control */}
              <div className="border-t pt-3 space-y-2">
                <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">
                  Pipeline Status
                </label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleUpdateLeadField(selectedLead.id, { status: e.target.value })}
                  className="w-full text-xs rounded-xl border-slate-200 h-9 bg-slate-50 hover:bg-slate-100 border px-3 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {leadStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Salesforce Core CRM: Assigned Consultant Selector */}
              <div className="border-t pt-3 space-y-2">
                <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">
                  Assigned Property Consultant
                </label>
                <select
                  value={selectedLead.assignedAgentId || ""}
                  disabled={currentUser?.role === "agent"}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleUpdateLeadField(selectedLead.id, { assignedAgentId: val ? parseInt(val, 10) : null });
                  }}
                  className="w-full text-xs rounded-xl border-slate-200 h-9 bg-slate-50 hover:bg-slate-100 border px-3 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <option value="">-- Select Agent --</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Intent Info Box */}
              <div className="bg-slate-50/70 border rounded-2xl p-3.5 space-y-2.5">
                <div>
                  <p className="text-[0.6rem] font-bold text-slate-400 uppercase">Interest Type</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[0.65rem] font-bold uppercase mt-1 ${getInterestBadgeColor(selectedLead.interestType)}`}>
                    {getInterestIcon(selectedLead.interestType)}
                    {selectedLead.interestType}
                  </span>
                </div>

                {selectedLead.projectName && (
                  <div>
                    <p className="text-[0.6rem] font-bold text-slate-400 uppercase">Target Property</p>
                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Building className="h-3.5 w-3.5 text-primary" /> {selectedLead.projectName}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-1">
                  {selectedLead.role && (
                    <div>
                      <p className="text-[0.6rem] font-bold text-slate-400 uppercase">Buyer Role</p>
                      <p className="text-xs font-semibold text-slate-700 capitalize">{selectedLead.role}</p>
                    </div>
                  )}
                  {selectedLead.funding && (
                    <div>
                      <p className="text-[0.6rem] font-bold text-slate-400 uppercase">Funding</p>
                      <p className="text-xs font-semibold text-slate-700 capitalize">{selectedLead.funding}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              {selectedLead.message && (
                <div className="space-y-1.5">
                  <p className="text-[0.6rem] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> Inquiry Message
                  </p>
                  <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 space-y-1">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedLead.message}
                    </p>
                  </div>
                </div>
              )}

              {/* No message fallback */}
              {!selectedLead.message && (
                <div className="bg-slate-50/70 border border-dashed border-slate-200 rounded-xl px-3 py-2.5">
                  <p className="text-[0.65rem] text-slate-400 italic">No message provided with this inquiry.</p>
                </div>
              )}

              {/* Follow-Up / Internal Agent Notes */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">
                    Internal Follow-Up Notes
                  </label>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="text-[0.65rem] text-primary hover:text-blue-800 font-bold uppercase transition"
                  >
                    {savingNotes ? "Saving..." : "Save Note"}
                  </button>
                </div>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Record viewing feedback, negotiation offers, or next actions here..."
                  className="w-full text-xs rounded-xl border-slate-200 p-2.5 bg-slate-50 hover:bg-slate-100 border h-20 focus:outline-none focus:ring-1 focus:ring-primary leading-normal resize-none"
                />
              </div>

              <Button
                variant="outline"
                className="w-full text-xs rounded-xl border-slate-200 hover:bg-slate-50"
                onClick={() => {
                  window.location.href = `mailto:${selectedLead.email}?subject=Chlonestone Real Estate Inquiry`;
                }}
              >
                Draft Email Response
              </Button>
            </div>
          ) : (
            <div className="my-auto text-center space-y-2">
              <Users className="h-8 w-8 text-slate-300 mx-auto" />
              <h4 className="text-xs font-bold text-slate-400 uppercase">No Lead Selected</h4>
              <p className="text-[0.65rem] text-slate-400 max-w-[180px] mx-auto leading-relaxed">
                Click on any lead record row to view detailed profile specs, update deal pipelines, assign consultants, or log follow-up notes.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
