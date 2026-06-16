"use client";

import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSidebarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  community: string;
  setCommunity: (val: string) => void;
  propertyType: string;
  setPropertyType: (val: string) => void;
  developer: string;
  setDeveloper: (val: string) => void;
  minPrice: string;
  setMinPrice: (val: string) => void;
  maxPrice: string;
  setMaxPrice: (val: string) => void;
  handoverYear: string;
  setHandoverYear: (val: string) => void;
  beds: string;
  setBeds: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  handleReset: () => void;
}

export default function FilterSidebar({
  searchQuery,
  setSearchQuery,
  community,
  setCommunity,
  propertyType,
  setPropertyType,
  developer,
  setDeveloper,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handoverYear,
  setHandoverYear,
  beds,
  setBeds,
  sortBy,
  setSortBy,
  handleReset,
}: FilterSidebarProps) {
  return (
    <div className="rounded-[2rem] border border-border bg-white p-5 shadow-soft space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Filter className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">
            Filters
          </p>
          <h3 className="text-base font-extrabold text-slate-900 font-heading">
            Refine Search
          </h3>
        </div>
      </div>

      <div className="space-y-5">
        
        {/* Keyword Search */}
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
            Search Keyword
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Keyword (e.g. Sobha)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs rounded-xl h-9 bg-slate-50 border-slate-100"
            />
          </div>
        </div>

        {/* Sort Order Selector */}
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
            Sort Listings
          </label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full rounded-xl border-slate-100 bg-slate-50 text-xs h-9">
              <SelectValue placeholder="Sort by default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Order</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="handover-asc">Handover Date: Earliest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Community */}
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
            Community
          </label>
          <Select value={community} onValueChange={setCommunity}>
            <SelectTrigger className="w-full rounded-xl border-slate-100 bg-slate-50 text-xs h-9">
              <SelectValue placeholder="Select community" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Community</SelectItem>
              <SelectItem value="downtown-dubai">Downtown Dubai</SelectItem>
              <SelectItem value="dubai-marina">Dubai Marina</SelectItem>
              <SelectItem value="palm-jumeirah">Palm Jumeirah</SelectItem>
              <SelectItem value="ras-al-khor">Ras Al Khor</SelectItem>
              <SelectItem value="dubailand">Dubailand</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Developer Selector */}
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
            Developer
          </label>
          <Select value={developer} onValueChange={setDeveloper}>
            <SelectTrigger className="w-full rounded-xl border-slate-100 bg-slate-50 text-xs h-9">
              <SelectValue placeholder="Select developer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Developer</SelectItem>
              <SelectItem value="emaar">Emaar</SelectItem>
              <SelectItem value="sobha">Sobha</SelectItem>
              <SelectItem value="damac">DAMAC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
            Property Type
          </label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-full rounded-xl border-slate-100 bg-slate-50 text-xs h-9">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Property Type</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
            Bedrooms
          </label>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["any", "1+", "2+", "3+", "4+"].map((bedOption) => (
              <button
                key={bedOption}
                onClick={() => setBeds(bedOption)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                  beds === bedOption
                    ? "bg-primary text-white border-primary"
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300"
                }`}
              >
                {bedOption === "any" ? "Any" : bedOption}
              </button>
            ))}
          </div>
        </div>

        {/* Handover Year Timeline */}
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
            Handover Year
          </label>
          <Select value={handoverYear} onValueChange={setHandoverYear}>
            <SelectTrigger className="w-full rounded-xl border-slate-100 bg-slate-50 text-xs h-9">
              <SelectValue placeholder="Select handover year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Year</SelectItem>
              <SelectItem value="2027">2027</SelectItem>
              <SelectItem value="2028">2028</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
            Price Range (AED)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="text-xs rounded-xl h-9 bg-slate-50 border-slate-100"
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="text-xs rounded-xl h-9 bg-slate-50 border-slate-100"
            />
          </div>
        </div>

        {/* Action button */}
        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full text-xs rounded-xl border-slate-200 hover:bg-slate-50 h-9 font-semibold text-slate-600 bg-white"
        >
          Reset Filters
        </Button>

      </div>
    </div>
  );
}