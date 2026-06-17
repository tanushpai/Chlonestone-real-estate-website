"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Save, Percent, MapPin, Plus, Trash2, X, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { getCommunities, saveCommunity, deleteCommunity } from "@/lib/dataService";
import { Community } from "@/data/communities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CrmCommunitiesPage() {
  const [communitiesList, setCommunitiesList] = useState<Community[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commsPerPage = 10;
  
  // Edited/created values state
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [image, setImage] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [rentalYield, setRentalYield] = useState("");
  const [growth, setGrowth] = useState("");
  const [popularFor, setPopularFor] = useState("");
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState("");
  const [driveTimes, setDriveTimes] = useState<{ location: string; time: string }[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [newTime, setNewTime] = useState("");

  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = () => {
    getCommunities().then((all) => {
      setCommunitiesList(all);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setName("");
    setTagline("");
    setImage("https://images.unsplash.com/photo-1545324418-cc1a3fa10c05");
    setAvgPrice("AED 1,500,000");
    setRentalYield("6.5%");
    setGrowth("YoY +10.0%");
    setPopularFor("Families & Couples");
    setDescription("");
    setHighlights([]);
    setDriveTimes([]);
  };

  const handleStartEdit = (c: Community) => {
    setIsCreating(false);
    setEditingId(c.id);
    setName(c.name);
    setTagline(c.tagline);
    setImage(c.image);
    setAvgPrice(c.avgPrice);
    setRentalYield(c.rentalYield);
    setGrowth(c.growth);
    setPopularFor(c.popularFor);
    setDescription(c.description);
    setHighlights((c.highlights as string[]) || []);
    setDriveTimes((c.driveTimes as any[]) || []);
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
      setImage(data.url);
    } catch (err) {
      alert("Failed to upload community image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    if (!highlights.includes(newHighlight.trim())) {
      setHighlights([...highlights, newHighlight.trim()]);
    }
    setNewHighlight("");
  };

  const handleRemoveHighlight = (text: string) => {
    setHighlights(highlights.filter((h) => h !== text));
  };

  const handleAddDriveTime = () => {
    if (!newLocation.trim() || !newTime.trim()) return;
    setDriveTimes([...driveTimes, { location: newLocation.trim(), time: newTime.trim() }]);
    setNewLocation("");
    setNewTime("");
  };

  const handleRemoveDriveTime = (idx: number) => {
    setDriveTimes(driveTimes.filter((_, i) => i !== idx));
  };

  const handleSave = async (c: Community) => {
    if (!name || !tagline || !description) {
      alert("Please fill in the community name, tagline and description.");
      return;
    }

    const updated: Community = {
      ...c,
      name,
      tagline,
      image,
      avgPrice,
      rentalYield,
      growth,
      popularFor,
      description,
      highlights,
      driveTimes
    };

    try {
      await saveCommunity(updated);
      setEditingId(null);
      setSuccessMsg(`Successfully updated all details for ${c.name}!`);
      loadData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      alert("Failed to update community details");
    }
  };

  const handleCreateSubmit = async () => {
    if (!name || !tagline || !description) {
      alert("Please fill in the community name, tagline and description.");
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newComm: Partial<Community> = {
      slug,
      name,
      tagline,
      image,
      avgPrice,
      rentalYield,
      growth,
      popularFor,
      description,
      highlights,
      driveTimes
    };

    try {
      await saveCommunity(newComm as Community);
      setIsCreating(false);
      setSuccessMsg(`Successfully created new community "${name}"!`);
      loadData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      alert("Failed to create community");
    }
  };

  const handleDelete = async (id: number, cName: string) => {
    if (!confirm(`Are you sure you want to delete the community "${cName}"? All projects belonging to this community will also lose their community relation.`)) {
      return;
    }

    try {
      await deleteCommunity(id);
      setSuccessMsg(`Successfully deleted ${cName}!`);
      loadData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      alert("Failed to delete community");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      
      {/* Header Panel */}
      <div className="bg-white border p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-heading">
            Communities details Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Adjust neighborhood info, tags, banners, drive times, and ROI/growth rates visible on the public page.
          </p>
        </div>
        <Button 
          onClick={handleStartCreate}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold gap-2 px-4 h-10 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Community
        </Button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-pulse">
          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {isCreating && (
        <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Add New Community</h3>
                <p className="text-[0.65rem] text-slate-400 font-medium">Create a new Area Guide</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => setIsCreating(false)} className="h-8 w-8 p-0 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Core specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Community Name *</label>
                <Input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs h-10 rounded-xl"
                  placeholder="e.g. Dubai Hills Estate"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Tagline *</label>
                <Input 
                  type="text" 
                  value={tagline} 
                  onChange={(e) => setTagline(e.target.value)}
                  className="text-xs h-10 rounded-xl"
                  placeholder="e.g. Where life is in perfect harmony with nature"
                />
              </div>
            </div>

            {/* Banner Image Banner */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Banner Image URL</label>
              <div className="flex gap-2.5 items-center">
                <Input 
                  type="text" 
                  value={image} 
                  onChange={(e) => setImage(e.target.value)}
                  className="text-xs h-10 rounded-xl flex-1"
                  placeholder="Image URL"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload-new"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="image-upload-new"
                    className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold px-4 h-10 cursor-pointer transition select-none"
                  >
                    {uploading ? "Uploading..." : "Upload Banner"}
                  </label>
                </div>
              </div>
            </div>

            {/* Numerical Stats strip */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Avg Sale Price</label>
                <Input 
                  type="text" 
                  value={avgPrice} 
                  onChange={(e) => setAvgPrice(e.target.value)}
                  className="text-xs h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Rental Yield %</label>
                <Input 
                  type="text" 
                  value={rentalYield} 
                  onChange={(e) => setRentalYield(e.target.value)}
                  className="text-xs h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">YoY Price Growth</label>
                <Input 
                  type="text" 
                  value={growth} 
                  onChange={(e) => setGrowth(e.target.value)}
                  className="text-xs h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Ideal For</label>
                <Input 
                  type="text" 
                  value={popularFor} 
                  onChange={(e) => setPopularFor(e.target.value)}
                  className="text-xs h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Description Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Overview Description *</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-border p-3 text-xs bg-slate-50/20 focus:outline-none"
                placeholder="Overview description..."
              />
            </div>

            {/* Key Highlights (taglist) */}
            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30 space-y-4">
              <label className="text-xs font-bold text-slate-900 uppercase">Key Neighborhood Highlights</label>
              <div className="flex flex-wrap gap-2">
                {highlights.map((h) => (
                  <span key={h} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border">
                    {h}
                    <button type="button" onClick={() => handleRemoveHighlight(h)} className="text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  type="text" 
                  placeholder="Add landmark/highlight (e.g. Metro Station nearby)"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  className="text-xs h-10 rounded-xl flex-1"
                />
                <Button type="button" onClick={handleAddHighlight} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-4 text-xs">
                  Add Highlight
                </Button>
              </div>
            </div>

            {/* Transit landmarks drive times */}
            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30 space-y-4">
              <label className="text-xs font-bold text-slate-900 uppercase">Proximity & Transit Landmarks</label>
              {driveTimes.length > 0 && (
                <div className="border rounded-xl bg-white overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b">
                        <th className="p-3 font-semibold text-slate-700">Landmark</th>
                        <th className="p-3 font-semibold text-slate-700">Drive Time</th>
                        <th className="p-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {driveTimes.map((dt, idx) => (
                        <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/50">
                          <td className="p-3 font-medium text-slate-900">{dt.location}</td>
                          <td className="p-3 text-slate-500">{dt.time}</td>
                          <td className="p-3 text-right">
                            <button type="button" onClick={() => handleRemoveDriveTime(idx)} className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input 
                  type="text" 
                  placeholder="Landmark name (e.g. Dubai Marina)"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="text-xs h-10 rounded-xl"
                />
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="Transit time (e.g. 20 mins)"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="text-xs h-10 rounded-xl flex-1"
                  />
                  <Button type="button" onClick={handleAddDriveTime} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-4 text-xs">
                    Add Landmark
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions buttons */}
            <div className="flex gap-2.5 pt-2">
              <Button 
                onClick={handleCreateSubmit}
                className="bg-primary hover:bg-blue-800 text-white rounded-xl text-xs font-bold gap-2 h-11 px-6 shadow-sm"
              >
                <CheckCircle className="h-4 w-4" /> Create Community Area
              </Button>
              <Button 
                onClick={() => setIsCreating(false)}
                variant="ghost"
                className="rounded-xl text-xs text-slate-500 hover:bg-slate-100 h-11 px-5"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Community Editors */}
      <div className="grid gap-6 grid-cols-1">
        {communitiesList.slice((currentPage - 1) * commsPerPage, currentPage * commsPerPage).map((c) => {
          const isEditing = editingId === c.id;
          return (
            <div 
              key={c.id} 
              className="bg-white border rounded-3xl p-6 shadow-sm space-y-6 hover:shadow-md transition duration-300"
            >
              {/* Header Title */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{c.name}</h3>
                    <p className="text-[0.65rem] text-slate-400 font-medium">Community ID: DLD-COMM-{c.id} · Slug: {c.slug}</p>
                  </div>
                </div>
                {!isEditing && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleStartEdit(c)}
                      variant="outline" 
                      size="sm"
                      className="text-xs rounded-xl border-slate-200 hover:bg-slate-50 bg-white"
                    >
                      Edit Area Guide
                    </Button>
                    <Button 
                      onClick={() => handleDelete(c.id, c.name)}
                      variant="ghost" 
                      size="sm"
                      className="text-xs rounded-xl text-red-600 hover:text-red-750 hover:bg-red-50 h-9 w-9 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-6 pt-2 border-t border-slate-100">
                  
                  {/* Core specifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Community Name *</label>
                      <Input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="text-xs h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Tagline *</label>
                      <Input 
                        type="text" 
                        value={tagline} 
                        onChange={(e) => setTagline(e.target.value)}
                        className="text-xs h-10 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Banner Image Banner */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Banner Image URL</label>
                    <div className="flex gap-2.5 items-center">
                      <Input 
                        type="text" 
                        value={image} 
                        onChange={(e) => setImage(e.target.value)}
                        className="text-xs h-10 rounded-xl flex-1"
                        placeholder="Image URL"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id={`image-upload-${c.id}`}
                          disabled={uploading}
                        />
                        <label
                          htmlFor={`image-upload-${c.id}`}
                          className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold px-4 h-10 cursor-pointer transition select-none"
                        >
                          {uploading ? "Uploading..." : "Upload Banner"}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Numerical Stats strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Avg Sale Price</label>
                      <Input 
                        type="text" 
                        value={avgPrice} 
                        onChange={(e) => setAvgPrice(e.target.value)}
                        className="text-xs h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Rental Yield %</label>
                      <Input 
                        type="text" 
                        value={rentalYield} 
                        onChange={(e) => setRentalYield(e.target.value)}
                        className="text-xs h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">YoY Price Growth</label>
                      <Input 
                        type="text" 
                        value={growth} 
                        onChange={(e) => setGrowth(e.target.value)}
                        className="text-xs h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Ideal For (e.g. Families & Investors)</label>
                      <Input 
                        type="text" 
                        value={popularFor} 
                        onChange={(e) => setPopularFor(e.target.value)}
                        className="text-xs h-10 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Overview Description *</label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-border p-3 text-xs bg-slate-50/20 focus:outline-none"
                    />
                  </div>

                  {/* Key Highlights (taglist) */}
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30 space-y-4">
                    <label className="text-xs font-bold text-slate-900 uppercase">Key Neighborhood Highlights</label>
                    <div className="flex flex-wrap gap-2">
                      {highlights.map((h) => (
                        <span key={h} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border">
                          {h}
                          <button type="button" onClick={() => handleRemoveHighlight(h)} className="text-red-500 hover:text-red-700">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        type="text" 
                        placeholder="Add landmark/highlight (e.g. Metro Station nearby)"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        className="text-xs h-10 rounded-xl flex-1"
                      />
                      <Button type="button" onClick={handleAddHighlight} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-4 text-xs">
                        Add Highlight
                      </Button>
                    </div>
                  </div>

                  {/* Transit landmarks drive times */}
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30 space-y-4">
                    <label className="text-xs font-bold text-slate-900 uppercase">Proximity & Transit Landmarks</label>
                    {driveTimes.length > 0 && (
                      <div className="border rounded-xl bg-white overflow-hidden text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b">
                              <th className="p-3 font-semibold text-slate-700">Landmark</th>
                              <th className="p-3 font-semibold text-slate-700">Drive Time</th>
                              <th className="p-3 text-right"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {driveTimes.map((dt, idx) => (
                              <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/50">
                                <td className="p-3 font-medium text-slate-900">{dt.location}</td>
                                <td className="p-3 text-slate-500">{dt.time}</td>
                                <td className="p-3 text-right">
                                  <button type="button" onClick={() => handleRemoveDriveTime(idx)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-4 w-4 inline" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input 
                        type="text" 
                        placeholder="Landmark name (e.g. Dubai Marina)"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="text-xs h-10 rounded-xl"
                      />
                      <div className="flex gap-2">
                        <Input 
                          type="text" 
                          placeholder="Transit time (e.g. 20 mins)"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="text-xs h-10 rounded-xl flex-1"
                        />
                        <Button type="button" onClick={handleAddDriveTime} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-4 text-xs">
                          Add Landmark
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2.5 pt-2">
                    <Button 
                      onClick={() => handleSave(c)}
                      className="bg-primary hover:bg-blue-800 text-white rounded-xl text-xs font-bold gap-2 h-11 px-6 shadow-sm"
                    >
                      <Save className="h-4 w-4" /> Save Area Guide Changes
                    </Button>
                    <Button 
                      onClick={() => setEditingId(null)}
                      variant="ghost"
                      className="rounded-xl text-xs text-slate-500 hover:bg-slate-100 h-11 px-5"
                    >
                      Cancel
                    </Button>
                  </div>

                </div>
              ) : (
                <div className="space-y-4 pt-2 border-t border-slate-50 text-xs">
                  
                  {/* Basic information stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tagline</p>
                      <p className="font-semibold text-slate-800 mt-1">{c.tagline}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ideal For</p>
                      <p className="font-semibold text-slate-850 mt-1">{c.popularFor}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Banner Image</p>
                      <p className="font-medium text-slate-500 mt-1 truncate max-w-[200px]" title={c.image}>{c.image}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="text-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-slate-400 font-bold uppercase tracking-wider scale-[0.85]">Avg Sale Price</p>
                      <p className="font-extrabold text-slate-800 mt-1.5">{c.avgPrice}</p>
                    </div>
                    <div className="text-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-slate-400 font-bold uppercase tracking-wider scale-[0.85] flex items-center justify-center gap-0.5">
                        <Percent className="h-3.5 w-3.5 text-emerald-500" /> ROI Yield
                      </p>
                      <p className="font-extrabold text-emerald-600 mt-1.5">{c.rentalYield}</p>
                    </div>
                    <div className="text-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-slate-400 font-bold uppercase tracking-wider scale-[0.85]">YoY Growth</p>
                      <p className="font-extrabold text-slate-800 mt-1.5">{c.growth}</p>
                    </div>
                  </div>

                  {/* Highlights & Landmark count stats */}
                  <div className="flex gap-4 text-slate-400 font-medium scale-[0.9] origin-left pt-1">
                    <span>• {((c.highlights as string[]) || []).length} Highlights</span>
                    <span>• {((c.driveTimes as any[]) || []).length} Proximity Landmarks</span>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {Math.ceil(communitiesList.length / commsPerPage) > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="font-semibold text-slate-800">{Math.min((currentPage - 1) * commsPerPage + 1, communitiesList.length)}</span> to{" "}
            <span className="font-semibold text-slate-800">{Math.min(currentPage * commsPerPage, communitiesList.length)}</span> of{" "}
            <span className="font-semibold text-slate-800">{communitiesList.length}</span> communities
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
            {Array.from({ length: Math.ceil(communitiesList.length / commsPerPage) }, (_, i) => i + 1).map((page) => (
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
              onClick={() => setCurrentPage((p) => Math.min(Math.ceil(communitiesList.length / commsPerPage), p + 1))}
              disabled={currentPage === Math.ceil(communitiesList.length / commsPerPage)}
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
