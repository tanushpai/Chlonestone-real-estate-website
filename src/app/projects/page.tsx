"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import FilterSidebar from "@/components/projects/FilterSidebar";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getProjects } from "@/lib/dataService";
import { Project } from "@/data/projects";

function ProjectsPageContent() {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [community, setCommunity] = useState("any");
  const [propertyType, setPropertyType] = useState("any");
  const [developer, setDeveloper] = useState("any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [handoverYear, setHandoverYear] = useState("any");
  const [beds, setBeds] = useState("any");
  const [sortBy, setSortBy] = useState("default");
  const [paymentPlan, setPaymentPlan] = useState("any");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, community, propertyType, developer, minPrice, maxPrice, handoverYear, beds, paymentPlan]);

  // Load projects from dataService on mount
  useEffect(() => {
    getProjects().then((all) => {
      setAllProjects(all);
    });
  }, []);

  // Sync URL search params to states
  useEffect(() => {
    const q = searchParams.get("query");
    const t = searchParams.get("type");
    const p = searchParams.get("price");

    if (q) setSearchQuery(q);
    if (t) setPropertyType(t);
    if (p) {
      if (p === "under-1m") {
        setMinPrice("");
        setMaxPrice("1000000");
      } else if (p === "1m-2m") {
        setMinPrice("1000000");
        setMaxPrice("2000000");
      } else if (p === "2m-5m") {
        setMinPrice("2000000");
        setMaxPrice("5000000");
      } else if (p === "5m-10m") {
        setMinPrice("5000000");
        setMaxPrice("10000000");
      } else if (p === "10m-plus") {
        setMinPrice("10000000");
        setMaxPrice("");
      }
    }
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredProjects = allProjects.filter((project) => {
    // 1. Keyword search (Name, developer, community)
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.communityName || project.community || "").toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Community
    const matchesCommunity = 
      community === "any" || 
      (project.communityName || project.community || "").toLowerCase().includes(community.toLowerCase());

    // 3. Property Type
    const matchesType = 
      propertyType === "any" || 
      project.propertyType.toLowerCase() === propertyType.toLowerCase();

    // 4. Developer
    const matchesDeveloper = 
      developer === "any" || 
      project.developer.toLowerCase() === developer.toLowerCase();

    // 5. Handover Year / Timeline (Dynamic)
    const matchesHandover = 
      handoverYear === "any" || 
      project.handover.toLowerCase() === handoverYear.toLowerCase();

    // 6. Beds filter (1+, 2+, 3+, 4+)
    let matchesBeds = true;
    if (beds !== "any") {
      const minBedsReq = parseInt(beds.replace("+", ""), 10);
      // Check if project has units matching minimum bedrooms required
      matchesBeds = project.unitMix.some((mix) => {
        const mixBeds = parseInt(mix.beds.replace(/[^0-9]/g, ""), 10);
        return !isNaN(mixBeds) && mixBeds >= minBedsReq;
      });
    }

    // 7. Price limits (Parse startingPrice e.g. "AED 2.5M" -> 2500000)
    const parsePrice = (priceStr: string) => {
      const clean = priceStr.replace(/[^0-9.]/g, "");
      const num = parseFloat(clean);
      if (priceStr.includes("M")) return num * 1000000;
      if (priceStr.includes("K")) return num * 1000;
      return num;
    };

    const projectPriceVal = parsePrice(project.startingPrice);
    const minPriceLimit = minPrice ? parseFloat(minPrice) : 0;
    const maxPriceLimit = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = projectPriceVal >= minPriceLimit && projectPriceVal <= maxPriceLimit;

    // 8. Payment Plan
    const matchesPaymentPlan = 
      paymentPlan === "any" || 
      project.paymentPlan === paymentPlan;

    // Keyword search includes address matches
    const matchesSearchWithAddress = matchesSearch || (project.address || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearchWithAddress && matchesCommunity && matchesType && matchesDeveloper && matchesHandover && matchesBeds && matchesPrice && matchesPaymentPlan;
  });

  // Sort
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const parsePrice = (priceStr: string) => {
      const clean = priceStr.replace(/[^0-9.]/g, "");
      const num = parseFloat(clean);
      if (priceStr.includes("M")) return num * 1000000;
      return num;
    };

    if (sortBy === "price-asc") {
      return parsePrice(a.startingPrice) - parsePrice(b.startingPrice);
    }
    if (sortBy === "price-desc") {
      return parsePrice(b.startingPrice) - parsePrice(a.startingPrice);
    }
    if (sortBy === "handover-asc") {
      return a.handover.localeCompare(b.handover);
    }
    return 0; // default order
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setCommunity("any");
    setPropertyType("any");
    setDeveloper("any");
    setMinPrice("");
    setMaxPrice("");
    setHandoverYear("any");
    setBeds("any");
    setSortBy("default");
    setPaymentPlan("any");
  };

  // Dynamic Options
  const communitiesList = Array.from(new Set(allProjects.map(p => p.communityName || p.community || ""))).filter(Boolean).sort();
  const developersList = Array.from(new Set(allProjects.map(p => p.developer))).filter(Boolean).sort();
  const propertyTypesList = Array.from(new Set(allProjects.map(p => p.propertyType))).filter(Boolean).sort();
  const handoverTimelineOptions = Array.from(new Set(allProjects.map(p => p.handover))).filter(Boolean).sort();
  const paymentPlanOptions = Array.from(new Set(allProjects.map(p => p.paymentPlan))).filter(Boolean).sort();

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-16 lg:pt-32 bg-slate-50/50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          {/* Header Section */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:mb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold sm:text-4xl text-slate-900 font-heading">
                Off-Plan Projects in Dubai
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                New launches from leading developers — flexible payment plans, projected ROI and handover timelines.
              </p>

              <p className="mt-2 text-xs font-bold text-primary tracking-wider uppercase">
                {sortedProjects.length} LISTINGS FOUND
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 lg:hidden bg-white"
                  >
                    <Filter className="h-4 w-4 text-slate-600" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <FilterSidebar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    community={community}
                    setCommunity={setCommunity}
                    propertyType={propertyType}
                    setPropertyType={setPropertyType}
                    developer={developer}
                    setDeveloper={setDeveloper}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    handoverYear={handoverYear}
                    setHandoverYear={setHandoverYear}
                    beds={beds}
                    setBeds={setBeds}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    handleReset={handleResetFilters}
                    paymentPlan={paymentPlan}
                    setPaymentPlan={setPaymentPlan}
                    communitiesList={communitiesList}
                    developersList={developersList}
                    propertyTypesList={propertyTypesList}
                    handoverTimelineOptions={handoverTimelineOptions}
                    paymentPlanOptions={paymentPlanOptions}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex gap-4 lg:gap-6">
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden w-80 flex-shrink-0 lg:block">
              <FilterSidebar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                community={community}
                setCommunity={setCommunity}
                propertyType={propertyType}
                setPropertyType={setPropertyType}
                developer={developer}
                setDeveloper={setDeveloper}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                handoverYear={handoverYear}
                setHandoverYear={setHandoverYear}
                beds={beds}
                setBeds={setBeds}
                sortBy={sortBy}
                setSortBy={setSortBy}
                handleReset={handleResetFilters}
                paymentPlan={paymentPlan}
                setPaymentPlan={setPaymentPlan}
                communitiesList={communitiesList}
                developersList={developersList}
                propertyTypesList={propertyTypesList}
                handoverTimelineOptions={handoverTimelineOptions}
                paymentPlanOptions={paymentPlanOptions}
              />
            </div>

            {/* Content Area */}
            <div className="w-full flex-1">
              {/* Reset filter notification bar if filtered results is empty */}
              {sortedProjects.length === 0 && (
                <div className="rounded-3xl border bg-white p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <RotateCcw className="h-10 w-10 text-slate-300 animate-spin duration-1000" />
                  <h3 className="text-xl font-bold text-slate-900">No Listings Match Filters</h3>
                  <p className="text-sm text-slate-500 max-w-sm">Try widening your price limits or resetting parameters to see more listings.</p>
                  <Button onClick={handleResetFilters} variant="default" className="rounded-xl px-6">
                    Reset All Filters
                  </Button>
                </div>
              )}

              {/* Grid View */}
              {sortedProjects.length > 0 && (
                <>
                  <ProjectGrid projects={sortedProjects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage)} />
                  
                  {/* Pagination Bar */}
                  {Math.ceil(sortedProjects.length / projectsPerPage) > 1 && (
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
                      <p className="text-xs text-slate-500 font-medium">
                        Showing <span className="font-semibold text-slate-800">{Math.min((currentPage - 1) * projectsPerPage + 1, sortedProjects.length)}</span> to{" "}
                        <span className="font-semibold text-slate-800">{Math.min(currentPage * projectsPerPage, sortedProjects.length)}</span> of{" "}
                        <span className="font-semibold text-slate-800">{sortedProjects.length}</span> listings
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
                        {Array.from({ length: Math.ceil(sortedProjects.length / projectsPerPage) }, (_, i) => i + 1).map((page) => (
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
                          onClick={() => setCurrentPage((p) => Math.min(Math.ceil(sortedProjects.length / projectsPerPage), p + 1))}
                          disabled={currentPage === Math.ceil(sortedProjects.length / projectsPerPage)}
                          className="h-9 w-9 p-0 rounded-xl"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <main className="pt-24 pb-16 lg:pt-32 bg-slate-50/50 min-h-screen flex items-center justify-center">
          <div className="text-slate-450 text-sm font-semibold uppercase tracking-wider animate-pulse">
            Loading Listings...
          </div>
        </main>
      </>
    }>
      <ProjectsPageContent />
    </Suspense>
  );
}