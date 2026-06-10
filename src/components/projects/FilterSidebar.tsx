"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterSidebar() {
  return (
    <div className="rounded-lg border bg-white p-4 sm:p-5 space-y-5 sm:space-y-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Filter className="h-5 w-5" />
        <h3 className="font-semibold text-lg">Filters</h3>
      </div>

      <div className="space-y-5 sm:space-y-6">
        {/* Community */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-2 sm:mb-3">
            Community
          </label>
          <Select defaultValue="any">
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Select community" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any community</SelectItem>
              <SelectItem value="downtown">Downtown Dubai</SelectItem>
              <SelectItem value="marina">Marina</SelectItem>
              <SelectItem value="jbr">JBR</SelectItem>
              <SelectItem value="palm">Palm Jumeirah</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-2 sm:mb-3">
            Property Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {["Apartment", "Villa", "Penthouse", "Townhouse", "Studio", "Office"].map(
              (type) => (
                <button
                  key={type}
                  className="rounded-lg border border-gray-200 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition hover:border-gray-400"
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-2 sm:mb-3">
            Bedrooms
          </label>
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            {["1+", "2+", "3+", "4+", "5+"].map((bed) => (
              <button
                key={bed}
                className="rounded-lg border border-gray-200 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition hover:border-gray-400"
              >
                {bed}
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-2 sm:mb-3">
            Bathrooms
          </label>
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            {["1+", "2+", "3+", "4+"].map((bath) => (
              <button
                key={bath}
                className="rounded-lg border border-gray-200 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition hover:border-gray-400"
              >
                {bath}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-2 sm:mb-3">
            Price Range (AED)
          </label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Min"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Max"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Reset Button */}
        <Button variant="outline" className="w-full text-sm">
          Reset filters
        </Button>
      </div>
    </div>
  );
}