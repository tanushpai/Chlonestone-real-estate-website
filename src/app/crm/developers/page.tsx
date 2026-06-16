"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Save, Award, Plus, Trash2, X, Upload } from "lucide-react";
import { getDbDevelopers, saveDbDeveloper, deleteDbDeveloper, DbDeveloper } from "@/lib/dataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CrmDevelopersPage() {
  const [devList, setDevList] = useState<DbDeveloper[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // States for form inputs
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [completedProjects, setCompletedProjects] = useState<number>(0);
  const [onTimeRate, setOnTimeRate] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = () => {
    getDbDevelopers().then((all) => {
      setDevList(all);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartEdit = (d: DbDeveloper) => {
    setEditingId(d.id || null);
    setIsCreating(false);
    setName(d.name);
    setSlug(d.slug);
    setDescription(d.description);
    setCompletedProjects(d.completedProjects);
    setOnTimeRate(d.onTimeRate);
    setLogoUrl(d.logoUrl || "");
  };

  const handleStartCreate = () => {
    setEditingId(null);
    setIsCreating(true);
    setName("");
    setSlug("");
    setDescription("");
    setCompletedProjects(0);
    setOnTimeRate("");
    setLogoUrl("");
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
      setLogoUrl(data.url);
    } catch (err) {
      alert("Failed to upload developer logo");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !description) {
      alert("Please fill in the developer name and description.");
      return;
    }

    const calculatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newDev: DbDeveloper = {
      ...(editingId ? { id: editingId } : {}),
      name: name.trim(),
      slug: calculatedSlug,
      description: description.trim(),
      completedProjects: Number(completedProjects) || 0,
      onTimeRate: onTimeRate.trim() || "N/A",
      logoUrl: logoUrl.trim() || null
    };

    try {
      await saveDbDeveloper(newDev);
      setEditingId(null);
      setIsCreating(false);
      setSuccessMsg(`Successfully saved developer ${name}!`);
      loadData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      alert("Failed to save developer profile");
    }
  };

  const handleDelete = async (id: number, devName: string) => {
    if (!confirm(`Are you sure you want to delete developer ${devName}?`)) return;
    try {
      await deleteDbDeveloper(id);
      setSuccessMsg(`Successfully deleted developer ${devName}!`);
      loadData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      alert("Failed to delete developer profile");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      
      {/* Header Panel */}
      <div className="bg-white border p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-heading">
            Developers profile Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage off-plan real estate developer companies, their biographies, and delivery stats.
          </p>
        </div>
        {!isCreating && editingId === null && (
          <Button 
            onClick={handleStartCreate}
            className="bg-primary hover:bg-blue-800 text-white rounded-xl text-xs font-semibold gap-2 h-10 px-4"
          >
            <Plus className="h-4 w-4" /> Add Developer
          </Button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Editor / Creation Panel */}
      {(isCreating || editingId !== null) && (
        <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {isCreating ? "Create Developer Profile" : "Edit Developer Profile"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Developer Name *</label>
              <Input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-10 rounded-xl"
                placeholder="e.g. Emaar Properties"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Slug (URL string)</label>
              <Input 
                type="text" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)}
                className="text-xs h-10 rounded-xl"
                placeholder="e.g. emaar-properties (leave blank to auto-generate)"
              />
            </div>
          </div>

          {/* Logo upload (without surrounding gray box border/background wrapper) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Developer logo Image</label>
            <div className="flex gap-4 items-center">
              {logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={logoUrl} 
                  alt="Logo preview" 
                  className="h-12 w-auto object-contain max-w-[120px]" 
                />
              )}
              <div className="flex-1 flex gap-2">
                <Input 
                  type="text" 
                  value={logoUrl} 
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="text-xs h-10 rounded-xl flex-1"
                  placeholder="Paste logo URL or upload image"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="dev-logo-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="dev-logo-upload"
                    className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold px-4 h-10 cursor-pointer transition select-none"
                  >
                    {uploading ? "Uploading..." : "Upload Logo"}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Completed Projects (Units count)</label>
              <Input 
                type="number" 
                value={completedProjects} 
                onChange={(e) => setCompletedProjects(parseInt(e.target.value, 10) || 0)}
                className="text-xs h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">On-Time Delivery Rate (e.g. 97.4%)</label>
              <Input 
                type="text" 
                value={onTimeRate} 
                onChange={(e) => setOnTimeRate(e.target.value)}
                className="text-xs h-10 rounded-xl"
                placeholder="e.g. 97.4%"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Developer biography Description *</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border p-3 text-xs bg-slate-50/20 focus:outline-none"
              placeholder="Provide a detailed history and biography profile of this developer..."
            />
          </div>

          <div className="flex gap-2.5">
            <Button 
              onClick={handleSave}
              className="bg-primary hover:bg-blue-800 text-white rounded-xl text-xs font-bold gap-2 h-11 px-6 shadow-sm"
            >
              <Save className="h-4 w-4" /> Save Profile
            </Button>
            <Button 
              onClick={() => {
                setEditingId(null);
                setIsCreating(false);
              }}
              variant="ghost"
              className="rounded-xl text-xs text-slate-500 hover:bg-slate-100 h-11 px-5"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Grid List of Developers */}
      {!isCreating && editingId === null && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {devList.map((d) => (
            <div 
              key={d.id} 
              className="bg-white border rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Render developer logo image ONLY, not inside that box wrapper! */}
                    {d.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={d.logoUrl} 
                        alt={d.name} 
                        className="h-10 w-auto object-contain max-w-[100px] flex-shrink-0" 
                      />
                    ) : (
                      <div className="h-10 w-10 bg-secondary rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                        <Award className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{d.name}</h3>
                      <p className="text-[0.65rem] text-slate-400 font-medium">Slug: {d.slug}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(d.id!, d.name)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition"
                    title="Delete developer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed mt-3">
                  {d.description}
                </p>
              </div>

              <div className="border-t pt-4 flex items-center justify-between gap-4">
                <div className="flex gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-slate-400">Completed: </span>
                    <span className="text-slate-800">{d.completedProjects}+ Units</span>
                  </div>
                  <div>
                    <span className="text-slate-400">On-Time: </span>
                    <span className="text-emerald-600">{d.onTimeRate}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleStartEdit(d)}
                  variant="outline" 
                  size="sm"
                  className="text-xs rounded-xl border-slate-200 hover:bg-slate-50 bg-white"
                >
                  Edit Profile
                </Button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
