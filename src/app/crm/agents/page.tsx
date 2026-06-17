"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Save, Plus, Trash2, X, Upload, Phone, Mail, UserCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Agent {
  id?: number;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  role: string;
  systemRole?: string;
  isBlocked?: boolean;
}

export default function CrmAgentsPage() {
  const [agentsList, setAgentsList] = useState<Agent[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 10;

  // Form input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [role, setRole] = useState("Property Consultant");
  const [password, setPassword] = useState("");
  const [systemRole, setSystemRole] = useState("AGENT");
  const [isBlocked, setIsBlocked] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadAgents = async () => {
    try {
      const res = await fetch("/api/agents");
      if (res.ok) {
        const data = await res.json();
        setAgentsList(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("chlonestone_user");
    if (stored) {
      const u = JSON.parse(stored);
      if (u.role !== "admin") {
        alert("Access denied: Administrators only.");
        window.location.href = "/crm";
        return;
      }
    } else {
      window.location.href = "/";
      return;
    }
    loadAgents();
  }, []);

  const handleStartEdit = (a: Agent) => {
    setEditingId(a.id || null);
    setIsCreating(false);
    setName(a.name);
    setEmail(a.email);
    setPhone(a.phone);
    setPhotoUrl(a.photoUrl);
    setRole(a.role);
    setPassword("");
    setSystemRole(a.systemRole || "AGENT");
    setIsBlocked(a.isBlocked || false);
  };

  const handleStartCreate = () => {
    setEditingId(null);
    setIsCreating(true);
    setName("");
    setEmail("");
    setPhone("");
    setPhotoUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2");
    setRole("Property Consultant");
    setPassword("");
    setSystemRole("AGENT");
    setIsBlocked(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setPhotoUrl(data.url);
    } catch (err) {
      alert("Failed to upload agent photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !email || !phone) {
      alert("Please fill in the agent's name, email, and phone number.");
      return;
    }

    const payload: any = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      photoUrl: photoUrl.trim(),
      role: role.trim(),
      systemRole,
      isBlocked,
    };

    if (password.trim()) {
      payload.password = password.trim();
    } else if (isCreating) {
      alert("Please enter a temporary login password for the new agent.");
      return;
    }

    const isNew = !editingId;
    const url = isNew ? "/api/agents" : `/api/agents/${editingId}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save agent profile");
      }

      setEditingId(null);
      setIsCreating(false);
      setSuccessMsg(`Successfully saved agent ${name}!`);
      loadAgents();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error: any) {
      alert(`Error saving agent information: ${error.message}`);
    }
  };

  const handleDelete = async (id: number, agentName: string) => {
    if (!confirm(`Are you sure you want to delete agent profile for "${agentName}"?`)) return;

    try {
      const res = await fetch(`/api/agents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete agent");
      setSuccessMsg(`Deleted agent ${agentName}`);
      loadAgents();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      alert("Error deleting agent.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 text-slate-800">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-heading">
            Agents Directory Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your company representatives, contact details, roles, and credentials.
          </p>
        </div>
        {!editingId && !isCreating && (
          <Button 
            onClick={handleStartCreate}
            className="bg-primary hover:bg-blue-800 text-white font-semibold rounded-xl text-xs gap-1.5 h-10 px-4"
          >
            <Plus className="h-4 w-4" /> Add Agent Representative
          </Button>
        )}
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600 animate-bounce" />
          {successMsg}
        </div>
      )}

      {/* Editor Panel */}
      {(editingId || isCreating) && (
        <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center border-b pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {isCreating ? "New Agent Representative" : `Edit Agent: ${name}`}
              </h3>
            </div>
            <button 
              onClick={() => { setEditingId(null); setIsCreating(false); }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Col: Photo Upload */}
            <div className="flex flex-col items-center justify-center p-4 border rounded-2xl bg-slate-50/50 space-y-4">
              <div className="relative h-28 w-28 rounded-full overflow-hidden border shadow-sm bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"} alt="Agent" className="object-cover w-full h-full" />
              </div>
              <div className="space-y-1.5 text-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  id="agent-photo-upload" 
                  className="hidden" 
                  disabled={uploading}
                />
                <label 
                  htmlFor="agent-photo-upload" 
                  className="inline-flex items-center gap-1.5 justify-center bg-white border hover:bg-slate-50 border-slate-350 text-slate-700 rounded-xl text-xs font-semibold px-4 h-9 cursor-pointer transition shadow-sm select-none"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {uploading ? "Uploading..." : "Upload Photo"}
                </label>
              </div>
            </div>

            {/* Right Col: Fields */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <Input 
                    type="text" 
                    required 
                    placeholder="e.g. Elena Rostova" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Representative Role *</label>
                  <Input 
                    type="text" 
                    required 
                    placeholder="e.g. Senior Property Consultant" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <Input 
                    type="email" 
                    required 
                    placeholder="e.g. elena@chlonestone.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Mobile Phone Number *</label>
                  <Input 
                    type="tel" 
                    required 
                    placeholder="e.g. +971507654321" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Photo URL (Manual fallback)</label>
                <Input 
                  type="text" 
                  placeholder="https://images.unsplash.com..." 
                  value={photoUrl} 
                  onChange={(e) => setPhotoUrl(e.target.value)} 
                />
              </div>

              {/* Login & Roles Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Login Password</label>
                  <Input 
                    type="password" 
                    placeholder={isCreating ? "Set password" : "Leave blank to keep current"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">System Role</label>
                  <select
                    value={systemRole}
                    onChange={(e) => setSystemRole(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="AGENT">Agent</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Access Status</label>
                  <select
                    value={isBlocked ? "blocked" : "active"}
                    onChange={(e) => setIsBlocked(e.target.value === "blocked")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="active">Active (Access Allowed)</option>
                    <option value="blocked">Blocked (Suspended)</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => { setEditingId(null); setIsCreating(false); }}
              className="rounded-xl h-10 px-4 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSave}
              className="bg-primary hover:bg-blue-800 text-white font-bold h-10 px-6 rounded-xl flex gap-1.5"
            >
              <Save className="h-4 w-4" /> Save Representative
            </Button>
          </div>
        </div>
      )}

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agentsList.slice((currentPage - 1) * agentsPerPage, currentPage * agentsPerPage).map((agent) => (
          <div key={agent.id} className="bg-white border rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md transition">
            
            {/* Header info */}
            <div className="flex gap-4 items-center">
              <div className="relative h-14 w-14 rounded-full overflow-hidden border bg-slate-50 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={agent.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"} alt={agent.name} className="object-cover w-full h-full" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                  {agent.name}
                  {agent.isBlocked && (
                    <span className="text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase font-bold">Blocked</span>
                  )}
                  {agent.systemRole === "ADMIN" && (
                    <span className="text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase font-bold">Admin</span>
                  )}
                </h4>
                <p className="text-[10px] bg-slate-100 border text-slate-600 px-2 py-0.5 rounded-full font-bold inline-block mt-0.5 uppercase tracking-wider">{agent.role}</p>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Details */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="truncate">{agent.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{agent.phone}</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleStartEdit(agent)}
                className="flex-1 rounded-xl text-xs font-bold h-9"
              >
                Edit Details
              </Button>
              <button
                type="button"
                onClick={() => handleDelete(agent.id!, agent.name)}
                className="h-9 w-9 flex items-center justify-center border text-red-650 hover:bg-red-50 hover:border-red-200 rounded-xl transition flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {!isCreating && editingId === null && Math.ceil(agentsList.length / agentsPerPage) > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="font-semibold text-slate-800">{Math.min((currentPage - 1) * agentsPerPage + 1, agentsList.length)}</span> to{" "}
            <span className="font-semibold text-slate-800">{Math.min(currentPage * agentsPerPage, agentsList.length)}</span> of{" "}
            <span className="font-semibold text-slate-800">{agentsList.length}</span> agents
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0 rounded-xl bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.ceil(agentsList.length / agentsPerPage) }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 p-0 rounded-xl font-bold ${
                  currentPage === page ? "bg-slate-900 text-white" : "bg-white"
                }`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(Math.ceil(agentsList.length / agentsPerPage), p + 1))}
              disabled={currentPage === Math.ceil(agentsList.length / agentsPerPage)}
              className="h-9 w-9 p-0 rounded-xl bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
