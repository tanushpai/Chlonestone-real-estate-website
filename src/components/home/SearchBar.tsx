"use client";

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
  return (
    <div className="absolute -bottom-16 left-1/2 z-20 w-[90%] max-w-2xl -translate-x-1/2 md:-bottom-12 md:max-w-3xl">
      <div className="rounded-2xl bg-white p-4 shadow-lg md:p-6">
        
        {/* Header with tab */}
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full bg-black px-4 py-1.5 text-white text-xs font-semibold md:text-sm">
            Off-Plan Projects
          </span>
        </div>

        {/* Filters - Compact Grid */}
        <div className="grid gap-2 md:gap-3 grid-cols-1 md:grid-cols-[3fr_1fr_1fr_auto]">
          
          {/* Location */}
          <div className="flex items-center rounded-lg border border-gray-200 px-3 md:px-4">
            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="City, community or project"
              className="w-full border-none outline-none py-2.5 text-sm placeholder-gray-400"
            />
          </div>

          {/* Property Type */}
          <Select>
            <SelectTrigger className="h-12 rounded-lg border border-gray-200 text-sm font-medium">
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
          <Select>
            <SelectTrigger className="h-12 rounded-lg border border-gray-200 text-sm font-medium">
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
          <Button className="h-12 rounded-lg px-8 text-sm font-medium">
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500 md:gap-6 md:text-sm">
          <span>200+ Projects</span>
          <span>50+ Communities</span>
          <span>20+ Developers</span>
        </div>
      </div>
    </div>
  );
}