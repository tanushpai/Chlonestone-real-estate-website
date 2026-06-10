"use client";

import { Grid3x3, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewSwitcherProps {
  view: "grid" | "map";
  setView: (view: "grid" | "map") => void;
}

export default function ViewSwitcher({ view, setView }: ViewSwitcherProps) {
  return (
    <div className="flex gap-1 sm:gap-2">
      <Button
        variant={view === "grid" ? "default" : "outline"}
        size="sm"
        onClick={() => setView("grid")}
        className="gap-1 sm:gap-2 text-xs sm:text-sm"
        title="Grid view"
      >
        <Grid3x3 className="h-4 w-4" />
        <span className="hidden sm:inline">Grid</span>
      </Button>

      <Button
        variant={view === "map" ? "default" : "outline"}
        size="sm"
        onClick={() => setView("map")}
        className="gap-1 sm:gap-2 text-xs sm:text-sm"
        title="Map view"
      >
        <Map className="h-4 w-4" />
        <span className="hidden sm:inline">Map</span>
      </Button>
    </div>
  );
}