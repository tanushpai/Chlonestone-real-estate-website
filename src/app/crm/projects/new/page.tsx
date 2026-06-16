"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Save, Sparkles, Plus, Trash2, Image as ImageIcon, MapPin, Building, Shield, X } from "lucide-react";
import Link from "next/link";
import { saveProject, getDbDevelopers, DbDeveloper } from "@/lib/dataService";
import { Project } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CrmNewProjectPage() {
  const router = useRouter();
  
  // Form States
  const [name, setName] = useState("");
  const [developer, setDeveloper] = useState("Emaar");
  const [community, setCommunity] = useState("Downtown Dubai");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [startingPrice, setStartingPrice] = useState("AED 1,900,000");
  const [handover, setHandover] = useState("Q2 2028");
  const [escrowNumber, setEscrowNumber] = useState("");
  const [reraPermit, setReraPermit] = useState("RERA-8472918");
  const [description, setDescription] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [imagesList, setImagesList] = useState<string[]>([
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
    "https://images.unsplash.com/photo-1464146072230-91cabc968266"
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Specifications
  const [amenities, setAmenities] = useState<string[]>([
    "Swimming Pool",
    "Modern Fitness Center",
    "Lush Landscaped Parks",
    "24/7 Security"
  ]);
  const [newAmenity, setNewAmenity] = useState("");



  const [locationHighlights, setLocationHighlights] = useState<{ landmark: string; driveTime: string }[]>([
    { landmark: "Burj Khalifa", driveTime: "10 mins" },
    { landmark: "DXB Airport", driveTime: "18 mins" }
  ]);
  const [newLandmark, setNewLandmark] = useState("");
  const [newDriveTime, setNewDriveTime] = useState("");

  const [unitMix, setUnitMix] = useState<{ beds: string; sqftRange: string; priceRange: string; availability: number }[]>([
    { beds: "1 Bedroom", sqftRange: "720 - 850 SqFt", priceRange: "AED 1.9M", availability: 12 },
    { beds: "2 Bedrooms", sqftRange: "1,150 - 1,300 SqFt", priceRange: "AED 3.2M", availability: 6 }
  ]);
  const [newUnitBeds, setNewUnitBeds] = useState("1 Bedroom");
  const [newUnitSqft, setNewUnitSqft] = useState("");
  const [newUnitPrice, setNewUnitPrice] = useState("");
  const [newUnitAvailability, setNewUnitAvailability] = useState("");

  // Developer Profile
  const [devProfileName, setDevProfileName] = useState("");
  const [devProfileDesc, setDevProfileDesc] = useState("");
  const [devProfileCompleted, setDevProfileCompleted] = useState<number>(0);
  const [devProfileOnTime, setDevProfileOnTime] = useState("");
  const [devProfileLogoUrl, setDevProfileLogoUrl] = useState("");
  
  // Agent & Developer States
  const [agentsList, setAgentsList] = useState<{ id: number; name: string; role: string }[]>([]);
  const [agentId, setAgentId] = useState<string>("");
  const [dbDevelopers, setDbDevelopers] = useState<DbDeveloper[]>([]);

  useEffect(() => {
    const fetchAgentsAndDevs = async () => {
      try {
        const res = await fetch("/api/agents");
        if (res.ok) {
          const agents = await res.json();
          setAgentsList(agents);
        }
      } catch (err) {
        console.error("Failed to fetch agents:", err);
      }

      try {
        const devs = await getDbDevelopers();
        setDbDevelopers(devs);
        if (devs.length > 0) {
          setDeveloper(devs[0].name);
        }
      } catch (err) {
        console.error("Failed to fetch developers:", err);
      }
    };
    fetchAgentsAndDevs();
  }, []);
  
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [brochureUrl, setBrochureUrl] = useState("");
  const [floorPlanUrl, setFloorPlanUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [brochureUploading, setBrochureUploading] = useState(false);
  const [floorPlanUploading, setFloorPlanUploading] = useState(false);
  const [qrCodeUploading, setQrCodeUploading] = useState(false);

  const handleQrCodeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrCodeUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setQrCodeUrl(data.url);
    } catch (err) {
      alert("Failed to upload QR Code image");
    } finally {
      setQrCodeUploading(false);
    }
  };

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBrochureUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setBrochureUrl(data.url);
    } catch (err) {
      alert("Failed to upload brochure file");
    } finally {
      setBrochureUploading(false);
    }
  };

  const handleFloorPlanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFloorPlanUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFloorPlanUrl(data.url);
    } catch (err) {
      alert("Failed to upload floor plan file");
    } finally {
      setFloorPlanUploading(false);
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImagesList([...imagesList, newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImagesList(imagesList.filter((_, i) => i !== index));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setThumbnailImage(data.url);
    } catch (err) {
      alert("Failed to upload thumbnail image");
    } finally {
      setThumbnailUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImagesList((prev) => [...prev, data.url]);
    } catch (err) {
      alert("Failed to upload gallery image");
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setDevProfileLogoUrl(data.url);
    } catch (err) {
      alert("Failed to upload developer logo");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleAddAmenity = () => {
    if (!newAmenity.trim()) return;
    if (!amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
    }
    setNewAmenity("");
  };

  const handleRemoveAmenity = (name: string) => {
    setAmenities(amenities.filter((a) => a !== name));
  };

  const handleAddHighlight = () => {
    if (!newLandmark.trim() || !newDriveTime.trim()) return;
    setLocationHighlights([...locationHighlights, { landmark: newLandmark.trim(), driveTime: newDriveTime.trim() }]);
    setNewLandmark("");
    setNewDriveTime("");
  };

  const handleRemoveHighlight = (idx: number) => {
    setLocationHighlights(locationHighlights.filter((_, i) => i !== idx));
  };

  const handleAddUnit = () => {
    if (!newUnitSqft.trim() || !newUnitPrice.trim() || !newUnitAvailability.trim()) return;
    setUnitMix([
      ...unitMix,
      {
        beds: newUnitBeds,
        sqftRange: newUnitSqft.trim(),
        priceRange: newUnitPrice.trim(),
        availability: parseInt(newUnitAvailability, 10) || 0
      }
    ]);
    setNewUnitSqft("");
    setNewUnitPrice("");
    setNewUnitAvailability("");
  };

  const handleRemoveUnit = (idx: number) => {
    setUnitMix(unitMix.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startingPrice || !description) {
      alert("Please fill in the project name, price, and description.");
      return;
    }

    const selectedDev = dbDevelopers.find(d => d.name.toLowerCase() === developer.toLowerCase()) || dbDevelopers[0];
    const devProfile = selectedDev ? {
      name: selectedDev.name,
      description: selectedDev.description,
      completedProjects: selectedDev.completedProjects,
      onTimeRate: selectedDev.onTimeRate,
      logoUrl: selectedDev.logoUrl || undefined
    } : {
      name: developer,
      description: "",
      completedProjects: 0,
      onTimeRate: "",
      logoUrl: undefined
    };

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newProject: Partial<Project> = {
      slug,
      name,
      developer,
      communityName: community,
      community,
      location: "Dubai",
      propertyType,
      startingPrice,
      handover,
      paymentPlan: "80/20",
      image: thumbnailImage || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
      images: imagesList,
      description,
      reraPermit,
      escrowNumber: escrowNumber || null,
      totalUnits: "240 Units",
      coordinates: { lat: 25.1972, lng: 55.2744 },
      paymentPlanDetails: [
        { milestone: "On Booking", percentage: 10 },
        { milestone: "During Construction", percentage: 70 },
        { milestone: "On Handover", percentage: 20 }
      ],
      unitMix,
      amenities,
      locationHighlights,
      agentId: agentId ? parseInt(agentId, 10) : null,
      developerProfile: devProfile,
      brochureUrl: brochureUrl || null,
      floorPlanUrl: floorPlanUrl || null,
      qrCodeUrl: qrCodeUrl || null
    };

    try {
      await saveProject(newProject as Project);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/crm/projects");
      }, 1500);
    } catch (err) {
      alert("Failed to save project Listing");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      
      {/* Back button header */}
      <div className="flex items-center gap-3">
        <Link 
          href="/crm/projects"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border text-slate-500 hover:text-slate-800 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900 font-heading">
          Create New Off-Plan Project
        </h1>
      </div>

      {isSuccess ? (
        <div className="bg-white border rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle className="h-7 w-7 animate-bounce" />
          </div>
          <h2 className="text-xl font-bold text-slate-950 font-heading">Project Listed Successfully!</h2>
          <p className="text-xs text-slate-500">Redirecting to project inventory list...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          
          <div className="flex items-center gap-2 border-b pb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Project Core Specifications</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Project Name *</label>
              <Input
                type="text"
                required
                placeholder="e.g. Sobha Creek Vistas"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Starting Price *</label>
              <Input
                type="text"
                required
                placeholder="e.g. AED 1,900,000"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Developer</label>
              <select
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                className="w-full text-xs rounded-xl border border-border p-2.5 bg-slate-50/50"
              >
                {dbDevelopers.map((dev) => (
                  <option key={dev.id} value={dev.name}>
                    {dev.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Community Location</label>
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full text-xs rounded-xl border border-border p-2.5 bg-slate-50/50"
              >
                <option value="Downtown Dubai">Downtown Dubai</option>
                <option value="Dubai Marina">Dubai Marina</option>
                <option value="Palm Jumeirah">Palm Jumeirah</option>
                <option value="Ras Al Khor">Ras Al Khor</option>
                <option value="Dubailand">Dubailand</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full text-xs rounded-xl border border-border p-2.5 bg-slate-50/50"
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Assigned Agent</label>
              <select
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full text-xs rounded-xl border border-border p-2.5 bg-slate-50/50"
              >
                <option value="">No Agent Assigned</option>
                {agentsList.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Handover Date (e.g. Q4 2028)</label>
              <Input
                type="text"
                placeholder="e.g. Q4 2028"
                value={handover}
                onChange={(e) => setHandover(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">RERA Permit Number</label>
              <Input
                type="text"
                placeholder="RERA-XXXXX"
                value={reraPermit}
                onChange={(e) => setReraPermit(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">DLD Escrow Number</label>
              <Input
                type="text"
                placeholder="ESCROW-XXXXX"
                value={escrowNumber}
                onChange={(e) => setEscrowNumber(e.target.value)}
              />
            </div>
          </div>



          {/* Main Thumbnail & Media */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Main Thumbnail</label>
              <div className="flex gap-4 items-center">
                {thumbnailImage ? (
                  <div className="relative rounded-xl overflow-hidden border bg-white h-16 w-24 shadow-sm flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbnailImage} alt="Thumbnail preview" className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <div className="h-16 w-24 bg-slate-50 border border-dashed rounded-xl flex items-center justify-center text-[10px] text-slate-400 flex-shrink-0">
                    No Image
                  </div>
                )}
                
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      id="thumbnail-upload-input"
                      disabled={thumbnailUploading}
                    />
                    <label
                      htmlFor="thumbnail-upload-input"
                      className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold px-4 h-10 cursor-pointer transition select-none"
                    >
                      {thumbnailUploading ? "Uploading..." : "Upload Thumbnail Image"}
                    </label>
                  </div>
                  {thumbnailImage && (
                    <p className="text-[10px] text-slate-400 truncate max-w-md">{thumbnailImage}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30 space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-bold text-slate-900 uppercase">Gallery Images list</h4>
              </div>

              {imagesList.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imagesList.map((imgUrl, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border bg-white aspect-[1.6] shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgUrl} alt={`Gallery ${idx}`} className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 bg-red-600 rounded-lg text-white hover:bg-red-700 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No gallery images uploaded yet.</p>
              )}

              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                    id="gallery-upload-input"
                    disabled={galleryUploading}
                  />
                  <label
                    htmlFor="gallery-upload-input"
                    className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold px-5 h-10 cursor-pointer transition select-none"
                  >
                    {galleryUploading ? "Uploading..." : "Upload Gallery Image"}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Upload (Brochure & Floor Plans) */}
          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30 space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-bold text-slate-900 uppercase">Documents & Marketing Collateral</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Brochure Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Project Brochure (PDF)</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleBrochureUpload}
                      className="hidden"
                      id="brochure-upload-input"
                      disabled={brochureUploading}
                    />
                    <label
                      htmlFor="brochure-upload-input"
                      className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold py-3 cursor-pointer transition select-none"
                    >
                      {brochureUploading ? "Uploading Brochure..." : "Upload Brochure PDF"}
                    </label>
                  </div>
                  {brochureUrl && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 border border-emerald-200 rounded font-semibold truncate max-w-[150px]">
                      Uploaded
                    </span>
                  )}
                </div>
                {brochureUrl && (
                  <p className="text-[10px] text-slate-400 truncate">{brochureUrl}</p>
                )}
              </div>

              {/* Floor Plan Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Floor Plans Document (PDF)</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFloorPlanUpload}
                      className="hidden"
                      id="floorplan-upload-input"
                      disabled={floorPlanUploading}
                    />
                    <label
                      htmlFor="floorplan-upload-input"
                      className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold py-3 cursor-pointer transition select-none"
                    >
                      {floorPlanUploading ? "Uploading Floor Plans..." : "Upload Floor Plans PDF"}
                    </label>
                  </div>
                  {floorPlanUrl && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 border border-emerald-200 rounded font-semibold truncate max-w-[150px]">
                      Uploaded
                    </span>
                  )}
                </div>
                {floorPlanUrl && (
                  <p className="text-[10px] text-slate-400 truncate">{floorPlanUrl}</p>
                )}
              </div>

              {/* QR Code Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Project QR Code (Optional Image)</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrCodeUpload}
                      className="hidden"
                      id="qrcode-upload-input"
                      disabled={qrCodeUploading}
                    />
                    <label
                      htmlFor="qrcode-upload-input"
                      className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold py-3 cursor-pointer transition select-none"
                    >
                      {qrCodeUploading ? "Uploading QR Code..." : "Upload QR Code Image"}
                    </label>
                  </div>
                  {qrCodeUrl && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 border border-emerald-200 rounded font-semibold truncate max-w-[150px]">
                      Uploaded
                    </span>
                  )}
                </div>
                {qrCodeUrl && (
                  <div className="flex items-center gap-2 mt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrCodeUrl} alt="QR Code Preview" className="h-10 w-10 object-contain border rounded p-0.5 bg-white" />
                    <p className="text-[10px] text-slate-400 truncate flex-1">{qrCodeUrl}</p>
                    <button
                      type="button"
                      onClick={() => setQrCodeUrl("")}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30 space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Shield className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-bold text-slate-900 uppercase">Property Amenities</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <span key={amenity} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border">
                  {amenity}
                  <button type="button" onClick={() => handleRemoveAmenity(amenity)} className="text-red-500 hover:text-red-700">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add amenity (e.g. Wellness Spa)"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                className="text-xs rounded-xl h-10 flex-1"
              />
              <Button type="button" onClick={handleAddAmenity} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-4 text-xs">
                Add Amenity
              </Button>
            </div>
          </div>

          {/* Location highlights landmarks */}
          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30 space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-bold text-slate-900 uppercase">Nearby Locations (Proximity drive-times)</h4>
            </div>
            {locationHighlights.length > 0 && (
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
                    {locationHighlights.map((hl, idx) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/50">
                        <td className="p-3 font-medium text-slate-900">{hl.landmark}</td>
                        <td className="p-3 text-slate-500">{hl.driveTime}</td>
                        <td className="p-3 text-right">
                          <button type="button" onClick={() => handleRemoveHighlight(idx)} className="text-red-500 hover:text-red-700">
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
                placeholder="Landmark (e.g. Dubai Marina)"
                value={newLandmark}
                onChange={(e) => setNewLandmark(e.target.value)}
                className="text-xs rounded-xl h-10"
              />
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Drive time (e.g. 15 mins)"
                  value={newDriveTime}
                  onChange={(e) => setNewDriveTime(e.target.value)}
                  className="text-xs rounded-xl h-10 flex-1"
                />
                <Button type="button" onClick={handleAddHighlight} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-4 text-xs">
                  Add Landmark
                </Button>
              </div>
            </div>
          </div>

          {/* Unit Mix Pricing options */}
          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30 space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Building className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-bold text-slate-900 uppercase">Unit Mix & Pricing Options</h4>
            </div>
            {unitMix.length > 0 && (
              <div className="border rounded-xl bg-white overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="p-3 font-semibold text-slate-700">Unit Type</th>
                      <th className="p-3 font-semibold text-slate-700">Size Range</th>
                      <th className="p-3 font-semibold text-slate-700">Starting Price</th>
                      <th className="p-3 font-semibold text-slate-700">Availability</th>
                      <th className="p-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {unitMix.map((mix, idx) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-900">{mix.beds}</td>
                        <td className="p-3 text-slate-500">{mix.sqftRange}</td>
                        <td className="p-3 font-semibold text-slate-850">{mix.priceRange}</td>
                        <td className="p-3 text-slate-500">{mix.availability} units left</td>
                        <td className="p-3 text-right">
                          <button type="button" onClick={() => handleRemoveUnit(idx)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <select
                value={newUnitBeds}
                onChange={(e) => setNewUnitBeds(e.target.value)}
                className="text-xs rounded-xl border border-border p-2.5 bg-slate-55"
              >
                <option value="1 Bedroom">1 Bedroom</option>
                <option value="2 Bedrooms">2 Bedrooms</option>
                <option value="3 Bedrooms">3 Bedrooms</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Villa">Villa</option>
              </select>
              <Input
                type="text"
                placeholder="Size range (e.g. 750 - 900 SqFt)"
                value={newUnitSqft}
                onChange={(e) => setNewUnitSqft(e.target.value)}
                className="text-xs rounded-xl h-10"
              />
              <Input
                type="text"
                placeholder="Price range (e.g. AED 2.5M - 3.1M)"
                value={newUnitPrice}
                onChange={(e) => setNewUnitPrice(e.target.value)}
                className="text-xs rounded-xl h-10"
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Units left"
                  value={newUnitAvailability}
                  onChange={(e) => setNewUnitAvailability(e.target.value)}
                  className="text-xs rounded-xl h-10 flex-1"
                />
                <Button type="button" onClick={handleAddUnit} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-4 text-xs">
                  Add Option
                </Button>
              </div>
            </div>
          </div>


          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Description Pitch *</label>
            <textarea
              rows={4}
              required
              placeholder="Highlight luxury layouts, high projected ROIs, and landmark advantages..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border p-3 text-xs bg-slate-50/30 focus:outline-none"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-blue-800 text-white font-bold h-12 rounded-xl shadow-md gap-2"
          >
            <Save className="h-4 w-4" />
            Publish Project Listing
          </Button>

        </form>
      )}

    </div>
  );
}
