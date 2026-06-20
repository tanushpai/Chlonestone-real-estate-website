"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, TrendingUp, Percent, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Community } from "@/data/communities";
import { getCommunities } from "@/lib/dataService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "apartments" | "villas">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const commsPerPage = 10;

  useEffect(() => {
    getCommunities().then((comms) => {
      setCommunities(comms);
    });
  }, []);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType]);
  // Reset page when queries change
  const handleFilterReset = () => {
    setCurrentPage(1);
  };

  // Filter logic
  const filteredCommunities = communities.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = 
      selectedType === "all" ||
      (selectedType === "apartments" && c.popularFor.toLowerCase().includes("apartment")) ||
      (selectedType === "villas" && c.popularFor.toLowerCase().includes("villa"));

    return matchesSearch && matchesType;
  });

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-16 lg:pt-32 bg-slate-50/50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          {/* Header section */}
          <div className="mb-8 max-w-2xl">
            <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl font-heading text-slate-900">
              Dubai Neighborhood Guides
            </h1>
            <p className="mt-3 text-slate-500 text-sm sm:text-base leading-relaxed">
              Find your ideal neighborhood. Read area reviews, average property pricing, estimated rental yields, and drive times to key hotspots.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center justify-between bg-white border p-4 rounded-2xl shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search neighborhood name..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); handleFilterReset(); }}
                className="pl-10 h-11 bg-slate-50/50 rounded-xl"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                onClick={() => { setSelectedType("all"); handleFilterReset(); }}
                size="sm"
                className="rounded-xl px-4"
              >
                All Areas
              </Button>
              <Button
                variant={selectedType === "apartments" ? "default" : "outline"}
                onClick={() => { setSelectedType("apartments"); handleFilterReset(); }}
                size="sm"
                className="rounded-xl px-4"
              >
                Apartments
              </Button>
              <Button
                variant={selectedType === "villas" ? "default" : "outline"}
                onClick={() => { setSelectedType("villas"); handleFilterReset(); }}
                size="sm"
                className="rounded-xl px-4"
              >
                Villas
              </Button>
            </div>
          </div>

          {/* Grid of cards */}
          {filteredCommunities.length > 0 ? (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCommunities.slice((currentPage - 1) * commsPerPage, currentPage * commsPerPage).map((c) => (
                  <Link key={c.id} href={`/communities/${c.slug}`}>
                    <div className="group h-full overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-sm hover:shadow-lg transition duration-300 flex flex-col cursor-pointer">
                      
                      {/* Image */}
                      <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                        <Image
                          src={c.image}
                          alt={c.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <span className="text-xs font-semibold bg-primary/95 text-slate-950 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {c.popularFor.split(" ")[0]}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="text-xl font-bold font-heading text-slate-900 line-clamp-1 group-hover:text-primary transition">
                            {c.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {c.tagline}
                          </p>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-3 gap-2 border-t pt-4 text-[0.65rem] sm:text-xs">
                          <div className="text-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <p className="text-slate-400 font-semibold uppercase tracking-wider scale-[0.9]">Avg Sale</p>
                            <p className="font-bold text-slate-800 mt-0.5 truncate">{c.avgPrice.replace("AED ", "")}</p>
                          </div>
                          <div className="text-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <p className="text-slate-400 font-semibold uppercase tracking-wider scale-[0.9] flex items-center justify-center gap-0.5">
                              <Percent className="h-3 w-3 text-emerald-500" /> Yield
                            </p>
                            <p className="font-bold text-emerald-600 mt-0.5">{c.rentalYield}</p>
                          </div>
                          <div className="text-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <p className="text-slate-400 font-semibold uppercase tracking-wider scale-[0.9] flex items-center justify-center gap-0.5">
                              <TrendingUp className="h-3 w-3 text-primary" /> Growth
                            </p>
                            <p className="font-bold text-slate-800 mt-0.5 truncate">{c.growth.replace("YoY ", "")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination Controls */}
              {Math.ceil(filteredCommunities.length / commsPerPage) > 1 && (
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
                  <p className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-semibold text-slate-800">{Math.min((currentPage - 1) * commsPerPage + 1, filteredCommunities.length)}</span> to{" "}
                    <span className="font-semibold text-slate-800">{Math.min(currentPage * commsPerPage, filteredCommunities.length)}</span> of{" "}
                    <span className="font-semibold text-slate-800">{filteredCommunities.length}</span> communities
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
                    {Array.from({ length: Math.ceil(filteredCommunities.length / commsPerPage) }, (_, i) => i + 1).map((page) => (
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
                      onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filteredCommunities.length / commsPerPage), p + 1))}
                      disabled={currentPage === Math.ceil(filteredCommunities.length / commsPerPage)}
                      className="h-9 w-9 p-0 rounded-xl"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white border rounded-3xl shadow-sm">
              <MapPin className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-950">No Communities Found</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting your filters or typing another name.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 rounded-xl"
                onClick={() => { setSearchQuery(""); setSelectedType("all"); }}
              >
                Reset Search
              </Button>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
