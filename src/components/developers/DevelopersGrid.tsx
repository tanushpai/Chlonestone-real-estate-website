"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Developer {
  name: string;
  slug: string;
  logoUrl?: string;
  description: string;
  completedProjects: number;
  onTimeRate: string;
  projectCount: number;
}

interface DevelopersGridProps {
  developers: Developer[];
}

const slugify = (text: string) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

export default function DevelopersGrid({ developers }: DevelopersGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const devsPerPage = 10;

  const totalPages = Math.ceil(developers.length / devsPerPage);
  const paginatedDevs = developers.slice(
    (currentPage - 1) * devsPerPage,
    currentPage * devsPerPage
  );

  return (
    <div className="space-y-10">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {paginatedDevs.map((dev) => {
          const slug = dev.slug || slugify(dev.name);
          
          let developerLogo = dev.logoUrl;
          
          if (slug === "emaar") {
            developerLogo = "https://upload.wikimedia.org/wikipedia/commons/e/e3/Emaar_Properties_Logo.svg";
          } else if (slug === "sobha") {
            developerLogo = "https://upload.wikimedia.org/wikipedia/commons/b/ba/Sobha_Realty_Logo.svg";
          } else if (slug === "damac") {
            developerLogo = "https://upload.wikimedia.org/wikipedia/commons/e/ea/DAMAC_Properties_Logo.svg";
          }

          return (
            <div 
              key={slug}
              className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Dedicated Logo Header Container */}
              <div className="relative h-44 w-full bg-slate-50 flex items-center justify-center p-4 border-b border-slate-100/60">
                {developerLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={developerLogo}
                    alt={dev.name}
                    className="h-full w-full object-contain max-h-[130px] max-w-[250px]"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Award className="h-6 w-6" />
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-slate-900 font-heading">
                      {dev.name}
                    </h2>
                    
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 uppercase tracking-wider">
                      {dev.projectCount} {dev.projectCount === 1 ? 'Project' : 'Projects'}
                    </span>
                  </div>
                  
                  <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6">
                    {dev.description}
                  </p>
                </div>

                {/* Stats & Link */}
                <div className="border-t pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed</p>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">{dev.completedProjects.toLocaleString("en-US")}+ Units</p>
                    </div>
                    <div className="bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">On-Time Rate</p>
                      <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{dev.onTimeRate}</p>
                    </div>
                  </div>

                  <Link 
                    href={`/developers/${slug}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 text-xs sm:text-sm transition shadow-sm"
                  >
                    View Developer Profile
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="font-semibold text-slate-800">{Math.min((currentPage - 1) * devsPerPage + 1, developers.length)}</span> to{" "}
            <span className="font-semibold text-slate-800">{Math.min(currentPage * devsPerPage, developers.length)}</span> of{" "}
            <span className="font-semibold text-slate-800">{developers.length}</span> developers
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 p-0 rounded-xl font-bold ${
                  currentPage === page ? "bg-slate-900 text-white" : ""
                }`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-9 w-9 p-0 rounded-xl"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
