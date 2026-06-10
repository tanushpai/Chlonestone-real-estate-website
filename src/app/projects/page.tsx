"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import FilterSidebar from "@/components/projects/FilterSidebar";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ViewSwitcher from "@/components/projects/ViewSwitcher";
import ProjectMap from "@/components/projects/ProjectMap";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ProjectsPage() {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-16 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          {/* Header Section */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:mb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold sm:text-4xl">
                Off-plan projects in Dubai
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                New launches from leading developers — flexible payment plans, projected ROI and handover timelines.
              </p>

              <p className="mt-2 text-xs text-gray-400">
                0 LISTINGS
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 lg:hidden"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <FilterSidebar />
                </SheetContent>
              </Sheet>

              {/* View Switcher */}
              <ViewSwitcher view={view} setView={setView} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex gap-4 lg:gap-6">
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden w-80 flex-shrink-0 lg:block">
              <FilterSidebar />
            </div>

            {/* Content Area */}
            <div className="w-full flex-1">
              {/* Grid View: Grid Only */}
              {view === "grid" && (
                <div>
                  <ProjectGrid />
                </div>
              )}

              {/* Map View: Map Only */}
              {view === "map" && (
                <div>
                  <ProjectMap />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}