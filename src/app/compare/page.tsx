"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Scale, ArrowLeft, Building, Calendar, CreditCard, Landmark, Check, HelpCircle, Mail, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  id: number;
  slug: string;
  name: string;
  developer: string;
  communityName: string;
  location: string;
  propertyType: string;
  startingPrice: string;
  handover: string;
  paymentPlan: string;
  image: string;
  description: string;
  reraPermit: string;
  escrowNumber: string | null;
  totalUnits: string;
  amenities: string[];
}

export default function ComparePage() {
  const [compared, setCompared] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComparedProjects = async () => {
      try {
        const compareStr = localStorage.getItem("chlonestone_compare");
        const compareIds: number[] = compareStr ? JSON.parse(compareStr) : [];

        if (compareIds.length === 0) {
          setCompared([]);
          setLoading(false);
          return;
        }

        const res = await fetch("/api/projects");
        if (res.ok) {
          const allProjects: Project[] = await res.json();
          const filtered = allProjects.filter((p) => compareIds.includes(p.id));
          setCompared(filtered);
        }
      } catch (err) {
        console.error("Failed to load compared projects:", err);
      } finally {
        setLoading(false);
      }
    };

    loadComparedProjects();
  }, []);

  const handleRemove = (id: number) => {
    try {
      const compareStr = localStorage.getItem("chlonestone_compare");
      const compareIds: number[] = compareStr ? JSON.parse(compareStr) : [];
      const updated = compareIds.filter((item) => item !== id);
      localStorage.setItem("chlonestone_compare", JSON.stringify(updated));
      setCompared((prev) => prev.filter((p) => p.id !== id));
      window.dispatchEvent(new Event("compare-change"));
    } catch (err) {
      console.error(err);
    }
  };

  // Extract all unique amenities across compared projects
  const allAmenities = Array.from(
    new Set(compared.flatMap((p) => p.amenities || []))
  ).sort();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline uppercase tracking-wider">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Listings
        </Link>

        {/* Page Header */}
        <div className="border-b pb-6 space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 font-heading tracking-tight flex items-center gap-2">
            <Scale className="h-7 w-7 text-primary" /> Property Comparison Engine
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl">
            Evaluate Dubai off-plan investment details, structural attributes, starting prices, and handover dates side-by-side.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Gathering property specifications...
          </div>
        ) : compared.length === 0 ? (
          <div className="bg-white border p-12 text-center space-y-6 shadow-sm rounded-none">
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Scale className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 uppercase">No Properties Selected</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Add up to 3 projects from our off-plan listing directory to compare starting prices, handovers, developer plans, and yields.
              </p>
            </div>
            <Link href="/projects">
              <Button className="bg-primary hover:bg-blue-800 text-white rounded-none font-bold uppercase tracking-wider text-[10px] h-10 px-6">
                Browse Projects
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white border shadow-sm rounded-none overflow-hidden">
            
            {/* Grid Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                
                {/* Headers */}
                <thead>
                  <tr className="border-b bg-slate-50/70">
                    <th className="p-5 font-bold uppercase tracking-wider text-slate-400 w-1/4">Specification</th>
                    {compared.map((proj) => (
                      <th key={proj.id} className="p-5 border-l w-1/4 relative group min-w-[240px]">
                        <button
                          onClick={() => handleRemove(proj.id)}
                          className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-600 transition"
                          title="Remove from comparison"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="space-y-3">
                          <div className="relative aspect-[16/10] w-full bg-slate-100 border overflow-hidden">
                            <Image
                              src={proj.image}
                              alt={proj.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-sm line-clamp-1">{proj.name}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-0.5">
                              {proj.developer}
                            </p>
                          </div>
                        </div>
                      </th>
                    ))}
                    {/* Fill blank columns if less than 3 compared */}
                    {compared.length < 3 && Array.from({ length: 3 - compared.length }).map((_, i) => (
                      <th key={`empty-${i}`} className="p-5 border-l w-1/4 text-center bg-slate-50/30 min-w-[240px]">
                        <div className="border border-dashed border-slate-200 py-12 px-4 space-y-3">
                          <HelpCircle className="h-7 w-7 text-slate-350 mx-auto" />
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Empty Slot</p>
                          <Link href="/projects">
                            <span className="text-[9px] text-primary hover:underline font-bold uppercase tracking-wider">
                              + Add Project
                            </span>
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body Rows */}
                <tbody className="divide-y">
                  
                  {/* Pricing */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/20 uppercase tracking-wider">Starting Price</td>
                    {compared.map((proj) => (
                      <td key={proj.id} className="p-5 border-l font-extrabold text-slate-950 text-sm">
                        {proj.startingPrice}
                      </td>
                    ))}
                    {compared.length < 3 && Array.from({ length: 3 - compared.length }).map((_, i) => (
                      <td key={`empty-price-${i}`} className="p-5 border-l bg-slate-50/10"></td>
                    ))}
                  </tr>

                  {/* Community / Location */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/20 uppercase tracking-wider">Community</td>
                    {compared.map((proj) => (
                      <td key={proj.id} className="p-5 border-l font-semibold text-slate-700">
                        {proj.communityName}
                      </td>
                    ))}
                    {compared.length < 3 && Array.from({ length: 3 - compared.length }).map((_, i) => (
                      <td key={`empty-comm-${i}`} className="p-5 border-l bg-slate-50/10"></td>
                    ))}
                  </tr>

                  {/* Handover Estimate */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/20 uppercase tracking-wider">Handover Schedule</td>
                    {compared.map((proj) => (
                      <td key={proj.id} className="p-5 border-l font-semibold text-slate-700 flex items-center gap-1.5 pt-6">
                        <Calendar className="h-4 w-4 text-amber-600" /> {proj.handover}
                      </td>
                    ))}
                    {compared.length < 3 && Array.from({ length: 3 - compared.length }).map((_, i) => (
                      <td key={`empty-handover-${i}`} className="p-5 border-l bg-slate-50/10"></td>
                    ))}
                  </tr>

                  {/* Payment Plan */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/20 uppercase tracking-wider">Payment Structure</td>
                    {compared.map((proj) => (
                      <td key={proj.id} className="p-5 border-l font-semibold text-slate-700 flex items-center gap-1.5 pt-6">
                        <CreditCard className="h-4 w-4 text-emerald-600" /> {proj.paymentPlan}
                      </td>
                    ))}
                    {compared.length < 3 && Array.from({ length: 3 - compared.length }).map((_, i) => (
                      <td key={`empty-plan-${i}`} className="p-5 border-l bg-slate-50/10"></td>
                    ))}
                  </tr>

                  {/* Property Type */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/20 uppercase tracking-wider">Property Category</td>
                    {compared.map((proj) => (
                      <td key={proj.id} className="p-5 border-l font-semibold text-slate-700">
                        {proj.propertyType}
                      </td>
                    ))}
                    {compared.length < 3 && Array.from({ length: 3 - compared.length }).map((_, i) => (
                      <td key={`empty-type-${i}`} className="p-5 border-l bg-slate-50/10"></td>
                    ))}
                  </tr>

                  {/* Total Units */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/20 uppercase tracking-wider">Development Density</td>
                    {compared.map((proj) => (
                      <td key={proj.id} className="p-5 border-l font-medium text-slate-600">
                        {proj.totalUnits}
                      </td>
                    ))}
                    {compared.length < 3 && Array.from({ length: 3 - compared.length }).map((_, i) => (
                      <td key={`empty-density-${i}`} className="p-5 border-l bg-slate-50/10"></td>
                    ))}
                  </tr>

                  {/* RERA Permit */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/20 uppercase tracking-wider">RERA Permit ID</td>
                    {compared.map((proj) => (
                      <td key={proj.id} className="p-5 border-l font-mono text-[10px] text-slate-400 select-all">
                        {proj.reraPermit}
                      </td>
                    ))}
                    {compared.length < 3 && Array.from({ length: 3 - compared.length }).map((_, i) => (
                      <td key={`empty-permit-${i}`} className="p-5 border-l bg-slate-50/10"></td>
                    ))}
                  </tr>

                  {/* escrow */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/20 uppercase tracking-wider">Escrow Code</td>
                    {compared.map((proj) => (
                      <td key={proj.id} className="p-5 border-l font-mono text-[10px] text-slate-400 select-all">
                        {proj.escrowNumber || "Not Applicable / Completed"}
                      </td>
                    ))}
                    {compared.length < 3 && Array.from({ length: 3 - compared.length }).map((_, i) => (
                      <td key={`empty-escrow-${i}`} className="p-5 border-l bg-slate-50/10"></td>
                    ))}
                  </tr>

                  {/* Amenities Side-by-Side Check List */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/25 uppercase tracking-wider vertical-align-top">
                      Development Amenities
                    </td>
                    {compared.map((proj) => (
                      <td key={proj.id} className="p-5 border-l space-y-1.5 font-semibold text-slate-700">
                        <div className="space-y-1">
                          {proj.amenities && proj.amenities.map((amenity) => (
                            <div key={amenity} className="flex items-center gap-1.5 text-xs text-slate-650">
                              <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                    {compared.length < 3 && Array.from({ length: 3 - compared.length }).map((_, i) => (
                      <td key={`empty-amenities-${i}`} className="p-5 border-l bg-slate-50/10"></td>
                    ))}
                  </tr>

                  {/* Action row (WhatsApp / Brochure Inquiries) */}
                  <tr className="bg-slate-50/20">
                    <td className="p-5 font-bold text-slate-900 uppercase tracking-wider">Consult Advisor</td>
                    {compared.map((proj) => (
                      <td key={proj.id} className="p-5 border-l space-y-2">
                        <a
                          href={`https://wa.me/971503483366?text=${encodeURIComponent(
                            `Hello, I would like to check availability and payment terms for ${proj.name}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-250 py-2.5 transition"
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current text-emerald-700">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437.002 9.861-4.416 9.863-9.864.001-2.639-1.026-5.122-2.892-6.991C16.376 1.882 13.9 .856 11.26.856 5.823.856 1.396 5.275 1.393 10.722c-.001 1.517.398 2.998 1.157 4.316l-1.095 4.002 4.102-1.076z" />
                            <path d="M17.076 14.372c-.27-.135-1.602-.79-1.85-.88-.25-.09-.432-.135-.615.135-.183.27-.708.88-.868 1.06-.16.18-.32.201-.59.066-2.15-1.061-3.52-2.015-4.662-3.977-.3-.518.3-.481.859-1.6.092-.183.046-.344-.023-.48-.068-.135-.615-1.48-.843-2.025-.222-.533-.448-.46-.615-.468-.16-.008-.344-.01-.527-.01-.183 0-.48.069-.731.344-.251.275-.959.937-.959 2.285 0 1.348.981 2.65 1.119 2.835.137.186 1.93 2.947 4.676 4.133.654.282 1.164.45 1.562.577.657.208 1.256.179 1.729.109.528-.078 1.602-.655 1.83-1.256.228-.601.228-1.119.16-1.227-.069-.108-.251-.173-.522-.308z" />
                          </svg>
                          WhatsApp Booking
                        </a>
                        <Link href={`/projects/${proj.slug}`}>
                          <Button className="w-full bg-primary hover:bg-blue-800 text-white rounded-none font-bold uppercase tracking-wider text-[10px] h-9">
                            View Full Details
                          </Button>
                        </Link>
                      </td>
                    ))}
                    {compared.length < 3 && Array.from({ length: 3 - compared.length }).map((_, i) => (
                      <td key={`empty-actions-${i}`} className="p-5 border-l"></td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
