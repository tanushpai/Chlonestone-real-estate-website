"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState("any");
  const [priceRange, setPriceRange] = useState("any");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("query", query.trim());
    }
    if (propertyType && propertyType !== "any") {
      params.set("type", propertyType);
    }
    if (priceRange && priceRange !== "any") {
      params.set("price", priceRange);
    }
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className="absolute -bottom-16 left-1/2 z-20 w-[90%] max-w-2xl -translate-x-1/2 md:-bottom-12 md:max-w-3xl">
      <div className="rounded-[2rem] bg-white/95 p-4 shadow-soft ring-1 ring-border/80 md:p-6">
        
        {/* Header with tab */}
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] shadow-sm">
            Off-Plan Projects
          </span>
        </div>

        {/* Filters - Compact Grid */}
        <div className="grid gap-2 md:gap-3 grid-cols-1 md:grid-cols-[3fr_1fr_1fr_auto]">
          
          {/* Location */}
          <div className="flex items-center gap-3 rounded-[1.25rem] border border-border bg-muted px-4 py-3">
            <MapPin className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="City, community or project"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full border-none bg-transparent text-sm text-foreground outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Property Type */}
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="h-12 rounded-[1.25rem] border border-gray-200 text-sm font-medium bg-white">
                <SelectValue placeholder="Property Type" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="any">Any Type</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
                <SelectItem value="duplex">Duplex</SelectItem>
                <SelectItem value="serviced-apartment">Serviced Apartment</SelectItem>
                <SelectItem value="office-space">Office Space</SelectItem>
                <SelectItem value="retail-space">Retail Space</SelectItem>
                <SelectItem value="residential-plot">Residential Plot</SelectItem>
                <SelectItem value="commercial-plot">Commercial Plot</SelectItem>
                <SelectItem value="hotel-apartment">Hotel Apartment</SelectItem>
                <SelectItem value="farmhouse">Farmhouse</SelectItem>
                <SelectItem value="mansion">Mansion</SelectItem>
            </SelectContent>
         </Select>

          {/* Price */}
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="h-12 rounded-[1.25rem] border border-gray-200 text-sm font-medium bg-white">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="any">Any Price</SelectItem>
                <SelectItem value="under-1m">Under AED 1M</SelectItem>
                <SelectItem value="1m-2m">AED 1M - 2M</SelectItem>
                <SelectItem value="2m-5m">AED 2M - 5M</SelectItem>
                <SelectItem value="5m-10m">AED 5M - 10M</SelectItem>
                <SelectItem value="10m-plus">AED 10M+</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Button */}
          <Button onClick={handleSearch} variant="default" className="h-12 rounded-[1.25rem] px-8 text-sm font-semibold">
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}