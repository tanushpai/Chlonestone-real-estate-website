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
    <div className="absolute bottom-12 left-1/2 z-20 w-[95%] max-w-5xl -translate-x-1/2">
      <div className="rounded-3xl bg-white p-3 shadow-2xl">
        
        {/* Tabs */}
        <div className="mb-5">
            <span className="rounded-full bg-black px-5 py-2 text-white text-sm font-medium">
                Off-Plan Projects
            </span>
        </div>
        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto]">
          
          {/* Location */}
          <div className="flex items-center rounded-xl border px-4">
            <MapPin className="mr-2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="City, community or project"
              className="w-full border-none outline-none py-4"
            />
          </div>

          {/* Property Type */}
          <Select>
            <SelectTrigger className="h-14 rounded-xl">
              <SelectValue placeholder="Any type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="apartment">
                Apartment
              </SelectItem>

              <SelectItem value="villa">
                Villa
              </SelectItem>

              <SelectItem value="townhouse">
                Townhouse
              </SelectItem>

              <SelectItem value="penthouse">
                Penthouse
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Price */}
          <Select>
            <SelectTrigger className="h-14 rounded-xl">
              <SelectValue placeholder="Any price" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="1m">
                Under AED 1M
              </SelectItem>

              <SelectItem value="2m">
                AED 1M - 2M
              </SelectItem>

              <SelectItem value="5m">
                AED 2M - 5M
              </SelectItem>

              <SelectItem value="luxury">
                AED 5M+
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <Button className="h-14 rounded-xl px-8">
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-500">
          <span>200+ Projects</span>
          <span>50+ Communities</span>
          <span>20+ Developers</span>
        </div>
      </div>
    </div>
  );
}