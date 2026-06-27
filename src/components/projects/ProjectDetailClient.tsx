"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Building, 
  Download, 
  Send, 
  Check, 
  X, 
  Phone, 
  MessageSquare, 
  Award, 
  Shield, 
  Compass, 
  Key, 
  ChevronLeft, 
  ChevronRight,
  Info,
  FileText
} from "lucide-react";
import { Project } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const slugify = (text: string) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const agent = (project as any).agent || {
    name: "Ali Al-Mansoori",
    role: "Sales Director",
    phone: "+971503483366",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    email: "ali@chlonestone.com"
  }; 

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Gated Brochure state
  const [brochureEmail, setBrochureEmail] = useState("");
  const [brochureName, setBrochureName] = useState("");
  const [isBrochureSubmitting, setIsBrochureSubmitting] = useState(false);
  const [isBrochureDownloaded, setIsBrochureDownloaded] = useState(false);
  const [showBrochureModal, setShowBrochureModal] = useState(false);

  // Modal display states
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Lead capture state
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "investor",
    funding: "installments",
    timeframe: "immediate",
    message: "",
  });
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);
  const [isLeadSuccess, setIsLeadSuccess] = useState(false);

  // Handle lead submission
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email) {
      alert("Name and Email are required.");
      return;
    }
    setIsLeadSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...leadForm,
          interestType: showViewingModal ? "viewing" : "contact",
          projectName: project.name,
        }),
      });
      if (res.ok) {
        setIsLeadSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLeadSubmitting(false);
    }
  };

  // Handle brochure submission
  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brochureName || !brochureEmail) {
      alert("Please fill in your name and email.");
      return;
    }
    setIsBrochureSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brochureName,
          email: brochureEmail,
          interestType: "brochure",
          projectName: project.name,
        }),
      });
      if (res.ok) {
        setIsBrochureDownloaded(true);
        
        const brochureFile = (project as any).brochureUrl;
        const link = document.createElement("a");
        if (brochureFile) {
          link.href = brochureFile;
          link.setAttribute("target", "_blank");
        } else {
          link.href = "#";
        }
        link.setAttribute("download", `${project.slug}-brochure.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          setShowBrochureModal(false);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsBrochureSubmitting(false);
    }
  };

  const handleViewingClick = () => {
    const user = localStorage.getItem("chlonestone_user");
    if (!user) {
      window.dispatchEvent(
        new CustomEvent("open-auth-lead-capture", {
          detail: {
            interestType: "viewing",
            projectName: project.name,
            onSuccess: () => {
              const stored = JSON.parse(localStorage.getItem("chlonestone_user") || "{}");
              setLeadForm((prev) => ({
                ...prev,
                name: stored.name || "",
                email: stored.email || "",
                phone: stored.phone || "",
              }));
              // Auto submit lead
              fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: stored.name,
                  email: stored.email,
                  phone: stored.phone || null,
                  interestType: "viewing",
                  projectName: project.name,
                  message: "Auto-booked viewing upon registration",
                }),
              }).then(() => {
                setIsLeadSuccess(true);
                setShowViewingModal(true);
              });
            },
          },
        })
      );
    } else {
      const stored = JSON.parse(user);
      setLeadForm((prev) => ({
        ...prev,
        name: stored.name || "",
        email: stored.email || "",
        phone: stored.phone || "",
      }));
      setShowViewingModal(true);
    }
  };

  const handleContactClick = () => {
    const user = localStorage.getItem("chlonestone_user");
    if (!user) {
      window.dispatchEvent(
        new CustomEvent("open-auth-lead-capture", {
          detail: {
            interestType: "contact",
            projectName: project.name,
            onSuccess: () => {
              const stored = JSON.parse(localStorage.getItem("chlonestone_user") || "{}");
              setLeadForm((prev) => ({
                ...prev,
                name: stored.name || "",
                email: stored.email || "",
                phone: stored.phone || "",
              }));
              setShowContactModal(true);
            },
          },
        })
      );
    } else {
      const stored = JSON.parse(user);
      setLeadForm((prev) => ({
        ...prev,
        name: stored.name || "",
        email: stored.email || "",
        phone: stored.phone || "",
      }));
      setShowContactModal(true);
    }
  };

  const handleBrochureClick = () => {
    const user = localStorage.getItem("chlonestone_user");
    if (!user) {
      window.dispatchEvent(
        new CustomEvent("open-auth-lead-capture", {
          detail: {
            interestType: "brochure",
            projectName: project.name,
            onSuccess: () => {
              const stored = JSON.parse(localStorage.getItem("chlonestone_user") || "{}");
              fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: stored.name,
                  email: stored.email,
                  phone: stored.phone || null,
                  interestType: "brochure",
                  projectName: project.name,
                }),
              }).then(() => {
                setIsBrochureDownloaded(true);
                setShowBrochureModal(true);
                
                const brochureFile = (project as any).brochureUrl;
                const link = document.createElement("a");
                if (brochureFile) {
                  link.href = brochureFile;
                  link.setAttribute("target", "_blank");
                } else {
                  link.href = "#";
                }
                link.setAttribute("download", `${project.slug}-brochure.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setTimeout(() => {
                  setShowBrochureModal(false);
                }, 2000);
              });
            },
          },
        })
      );
    } else {
      const stored = JSON.parse(user);
      setBrochureName(stored.name || "");
      setBrochureEmail(stored.email || "");
      setShowBrochureModal(true);
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  const handleInquiryShortcut = (beds: string) => {
    let storedName = "";
    let storedEmail = "";
    let storedPhone = "";
    if (typeof window !== "undefined") {
      const storedStr = localStorage.getItem("chlonestone_user");
      if (storedStr) {
        try {
          const stored = JSON.parse(storedStr);
          storedName = stored.name || "";
          storedEmail = stored.email || "";
          storedPhone = stored.phone || "";
        } catch (e) {}
      }
    }

    setLeadForm({
      name: storedName,
      email: storedEmail,
      phone: storedPhone,
      role: "investor",
      funding: "installments",
      timeframe: "immediate",
      message: `Hi, I am interested in the ${beds} unit at ${project.name}. Please provide availability and pricing details.`,
    });
    
    setShowContactModal(true);
  };

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* 1. GALLERY & LIGHTBOX SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-soft">
        <div 
          className="relative h-[25rem] sm:h-[30rem] lg:h-[35rem] w-full cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={project.images[activeImageIndex]}
            alt={`${project.name} gallery image`}
            fill
            priority
            className="object-contain bg-[#0B0C1E] transition-all duration-700 hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
          
          {/* Gallery navigation overlays */}
          <button 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white transition hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white transition hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Badge overlays */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2">
            <span className="rounded-full bg-slate-900/80 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              {activeImageIndex + 1} / {project.images.length} Photos
            </span>
            <span className="rounded-full bg-primary/90 px-4 py-1.5 text-xs font-semibold text-slate-950 backdrop-blur-md">
              Off-Plan
            </span>
          </div>
        </div>

        {/* Thumbnail Row */}
        <div className="flex gap-2 p-3 overflow-x-auto bg-slate-950">
          {project.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-xl transition duration-200 ${
                activeImageIndex === idx ? "ring-2 ring-primary scale-[0.98]" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt="Thumbnail"
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative w-full max-w-5xl h-[70vh] px-4">
            <Image
              src={project.images[activeImageIndex]}
              alt="Lightbox Main"
              fill
              className="object-contain"
            />
          </div>
          <div className="mt-6 flex items-center gap-6 text-white">
            <button 
              onClick={prevImage}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <span className="text-sm font-semibold tracking-wider">
              {activeImageIndex + 1} / {project.images.length}
            </span>
            <button 
              onClick={nextImage}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* 3. TWO-COLUMN DETAILS & LEAD CAPTURE BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8 lg:space-y-12">
          {/* Address Section (Displayed before About) */}
          {project.address && (
            <section className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 flex items-start gap-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary flex-shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Property Address</h3>
                <p className="text-base sm:text-lg font-semibold text-slate-800 leading-snug">{project.address}</p>
              </div>
            </section>
          )}

          {/* About Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-heading text-slate-900 sm:text-3xl">
              About {project.name}
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {project.description}
            </p>
          </section>

          {/* Handover & Payment Plan Details */}
          <section className="rounded-3xl border border-border bg-slate-50 p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Estimated Handover</p>
                  <p className="text-base font-bold text-slate-850">{project.handover}</p>
                </div>
              </div>
              <div className="flex items-center gap-3.5 border-t pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-6 border-slate-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Payment Plan Ratio</p>
                  <p className="text-base font-bold text-slate-850">{project.paymentPlan} Structure</p>
                </div>
              </div>
            </div>
          </section>

          {/* Amenities Grid */}
          {(project as any).showAmenities !== false && project.amenities && project.amenities.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                Property Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {project.amenities.map((amenity, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition duration-300"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-primary flex-shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Nearby Locations */}
          {(project as any).showNearbyLocations !== false && project.locationHighlights && project.locationHighlights.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                Nearby Locations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.locationHighlights.map((hl, idx) => (
                  <div 
                    key={idx}
                    className="flex justify-between items-center p-3.5 bg-slate-50 border border-border rounded-xl"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-slate-800">{hl.landmark}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 rounded-full bg-slate-100 px-3 py-1">
                      {hl.driveTime}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Unit Mix Table Section */}
          {(project as any).showUnitMix !== false && project.unitMix && project.unitMix.length > 0 && (
            <section id="unit-mix-section" className="space-y-6">
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                Unit Mix & Pricing
              </h2>
              <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-800">Unit Type</TableHead>
                      <TableHead className="font-semibold text-slate-800">Size Range</TableHead>
                      <TableHead className="font-semibold text-slate-800">Starting Price</TableHead>
                      <TableHead className="font-semibold text-slate-800">Availability</TableHead>
                      <TableHead className="text-right font-semibold text-slate-800">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.unitMix.map((mix, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50/50 transition">
                        <TableCell className="font-semibold text-slate-900">{mix.beds}</TableCell>
                        <TableCell className="text-slate-600">{mix.sqftRange}</TableCell>
                        <TableCell className="font-semibold text-slate-950">{mix.priceRange}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                            {mix.availability} units left
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleInquiryShortcut(mix.beds)}
                            className="text-primary hover:text-amber-800 hover:bg-secondary text-xs font-semibold"
                          >
                            Inquire
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
          )}

          {/* Developer Details */}
          <section className="rounded-2xl border border-border bg-slate-50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {project.developerProfile?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.developerProfile.logoUrl}
                  alt={project.developerProfile.name}
                  className="h-10 w-auto object-contain max-w-[120px] flex-shrink-0"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-slate-700 flex-shrink-0">
                  <Award className="h-6 w-6" />
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-slate-800">{project.developerProfile?.name || project.developer}</h3>
                <p className="text-xs text-slate-500 font-medium">Master Builder Profile</p>
              </div>
            </div>
            <Link href={`/developers/${slugify(project.developer)}`}>
              <Button variant="outline" className="w-full sm:w-auto border-slate-300 hover:bg-slate-100 font-semibold text-xs">
                View Developer Properties
              </Button>
            </Link>
          </section>

          {/* Escrow & Regulatory Info */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-slate-100/50 border rounded-2xl">
            <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-500 w-full">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span><strong>RERA Permit:</strong> {project.reraPermit}</span>
              </div>
              {project.escrowNumber && (
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Dubai Escrow Account:</strong> {project.escrowNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-slate-600 flex-shrink-0" />
                <span><strong>Total Size:</strong> {project.totalUnits}</span>
              </div>
            </div>
            {project.qrCodeUrl && (
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.qrCodeUrl}
                  alt="Project QR Code"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </section>
        </div>


        {/* Right Column (1/3) - Sticky mockup sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <div className="rounded-[1.75rem] border border-border bg-white p-6 shadow-soft space-y-6">
              
              {/* Agent Representative Card */}
              <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-slate-200">
                  <Image
                    src={agent.photoUrl}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {agent.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {agent.role}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                {/* Book a viewing */}
                <Button 
                  onClick={handleViewingClick}
                  className="w-full bg-[#111827] hover:bg-slate-800 text-white font-semibold py-6 rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="h-4 w-4" />
                  Book a viewing
                </Button>

                {/* Contact agent */}
                <a 
                  href={`tel:${agent.phone.replace(/\s+/g, "")}`}
                  className="w-full border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm bg-white"
                >
                  <Phone className="h-4 w-4 text-slate-500" />
                  Contact agent
                </a>

                {/* WhatsApp */}
                <a 
                  href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(project.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full border border-emerald-200 hover:bg-emerald-50/50 text-emerald-600 font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm bg-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-emerald-600">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437.002 9.861-4.416 9.863-9.864.001-2.639-1.026-5.122-2.892-6.991C16.376 1.882 13.9 .856 11.26.856 5.823.856 1.396 5.275 1.393 10.722c-.001 1.517.398 2.998 1.157 4.316l-1.095 4.002 4.102-1.076z" />
                    <path d="M17.076 14.372c-.27-.135-1.602-.79-1.85-.88-.25-.09-.432-.135-.615.135-.183.27-.708.88-.868 1.06-.16.18-.32.201-.59.066-2.15-1.061-3.52-2.015-4.662-3.977-.3-.518.3-.481.859-1.6.092-.183.046-.344-.023-.48-.068-.135-.615-1.48-.843-2.025-.222-.533-.448-.46-.615-.468-.16-.008-.344-.01-.527-.01-.183 0-.48.069-.731.344-.251.275-.959.937-.959 2.285 0 1.348.981 2.65 1.119 2.835.137.186 1.93 2.947 4.676 4.133.654.282 1.164.45 1.562.577.657.208 1.256.179 1.729.109.528-.078 1.602-.655 1.83-1.256.228-.601.228-1.119.16-1.227-.069-.108-.251-.173-.522-.308z" />
                  </svg>
                  WhatsApp
                </a>
              </div>

              <hr className="border-slate-100" />

              {/* Document Downloads (Highly Visible Buttons) */}
              <div className="grid grid-cols-2 gap-3 text-xs font-semibold mt-4">
                {/* Floor Plans Button */}
                <button
                  onClick={() => {
                    const fpUrl = (project as any).floorPlanUrl;
                    if (fpUrl) {
                      window.open(fpUrl, "_blank");
                    } else {
                      const el = document.getElementById("unit-mix-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold py-3.5 rounded-xl transition bg-white cursor-pointer select-none"
                >
                  <FileText className="h-4 w-4 text-slate-500" />
                  Floor plans
                </button>

                {/* Download Brochure Button */}
                <button
                  onClick={handleBrochureClick}
                  className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-blue-800 text-white font-semibold py-3.5 rounded-xl transition cursor-pointer select-none"
                >
                  <Download className="h-4 w-4 text-white" />
                  Brochure
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* VIEWING BOOKING MODAL */}
      {showViewingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => { setShowViewingModal(false); setIsLeadSuccess(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            {isLeadSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Viewing Requested!</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your viewing request for <strong>{project.name}</strong> has been registered. An advisor will contact you to schedule a date.
                </p>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => { setShowViewingModal(false); setIsLeadSuccess(false); }}
                >
                  Close Window
                </Button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 font-heading">Book a Private Viewing</h3>
                <p className="text-xs text-slate-500">Submit your schedule preferences for a private project presentation.</p>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Name</label>
                  <Input 
                    type="text" 
                    required 
                    placeholder="John Doe"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Email</label>
                  <Input 
                    type="email" 
                    required 
                    placeholder="john@example.com"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Phone</label>
                  <Input 
                    type="tel" 
                    required 
                    placeholder="+971 50 123 4567"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLeadSubmitting}
                  className="w-full bg-slate-900 text-white font-bold h-11"
                >
                  {isLeadSubmitting ? "Submitting..." : "Schedule Now"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CONTACT AGENT MODAL */}
      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => { setShowContactModal(false); setIsLeadSuccess(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            {isLeadSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Inquiry Sent!</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your message has been delivered to <strong>{agent.name}</strong>. We will contact you shortly.
                </p>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => { setShowContactModal(false); setIsLeadSuccess(false); }}
                >
                  Close Window
                </Button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 font-heading">Contact off-plan agent</h3>
                <p className="text-xs text-slate-500 font-medium text-slate-400">Representative: {agent.name} ({agent.role})</p>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Name</label>
                  <Input 
                    type="text" 
                    required 
                    placeholder="John Doe"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Phone</label>
                  <Input 
                    type="tel" 
                    required 
                    placeholder="+971 50 123 4567"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Your Message</label>
                  <textarea 
                    rows={3}
                    placeholder={`Hello, I'd like more details regarding ${project.name}...`}
                    className="w-full rounded-lg border border-border p-3 text-xs bg-slate-50 focus:outline-none"
                    value={leadForm.message}
                    onChange={(e) => setLeadForm({...leadForm, message: e.target.value})}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLeadSubmitting}
                  className="w-full bg-primary hover:bg-amber-600 text-slate-950 font-bold h-11"
                >
                  {isLeadSubmitting ? "Sending..." : "Submit Inquiry"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* BROCHURE DOWNLOAD MODAL */}
      {showBrochureModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => { setShowBrochureModal(false); setIsBrochureDownloaded(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            {isBrochureDownloaded ? (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Download Started!</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your e-brochure download for <strong>{project.name}</strong> has started automatically.
                </p>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => { setShowBrochureModal(false); setIsBrochureDownloaded(false); }}
                >
                  Close Window
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBrochureSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 font-heading">Download Project Brochure</h3>
                <p className="text-xs text-slate-500">Provide your information below to unlock and download the complete PDF brochure.</p>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <Input 
                    type="text" 
                    required 
                    placeholder="John Doe"
                    value={brochureName}
                    onChange={(e) => setBrochureName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <Input 
                    type="email" 
                    required 
                    placeholder="john@example.com"
                    value={brochureEmail}
                    onChange={(e) => setBrochureEmail(e.target.value)}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isBrochureSubmitting}
                  className="w-full bg-primary hover:bg-amber-600 text-slate-950 font-bold h-11"
                >
                  {isBrochureSubmitting ? "Generating PDF..." : "Unlock & Download Brochure"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
