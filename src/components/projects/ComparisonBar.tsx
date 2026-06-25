"use client";

import React, { useState, useEffect } from "react";
import { Scale, X, ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Project {
  id: number;
  slug: string;
  name: string;
  developer: string;
  startingPrice: string;
  image: string;
}

export default function ComparisonBar() {
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);

  const loadCompareIds = () => {
    try {
      const compareStr = localStorage.getItem("chlonestone_compare");
      setCompareIds(compareStr ? JSON.parse(compareStr) : []);
    } catch (err) {
      console.error(err);
      setCompareIds([]);
    }
  };

  useEffect(() => {
    loadCompareIds();
    window.addEventListener("compare-change", loadCompareIds);

    // Fetch basic project details for thumbnails
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error loading comparison bar projects:", err));

    return () => {
      window.removeEventListener("compare-change", loadCompareIds);
    };
  }, []);

  useEffect(() => {
    // Filter projects matching selected IDs
    const matched = projects.filter((p) => compareIds.includes(p.id));
    setSelectedProjects(matched);
  }, [compareIds, projects]);

  const handleRemove = (id: number) => {
    try {
      const updated = compareIds.filter((item) => item !== id);
      localStorage.setItem("chlonestone_compare", JSON.stringify(updated));
      setCompareIds(updated);
      window.dispatchEvent(new Event("compare-change"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = () => {
    try {
      localStorage.removeItem("chlonestone_compare");
      setCompareIds([]);
      window.dispatchEvent(new Event("compare-change"));
    } catch (err) {
      console.error(err);
    }
  };

  if (selectedProjects.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-1/2 md:-translate-x-1/2 md:right-auto w-auto md:w-[600px] bg-[#0F1123]/98 border border-slate-800 text-slate-200 shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-40 rounded-none animate-fade-in font-sans">
      
      {/* List of items */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
          <Scale className="h-4.5 w-4.5 text-primary" />
          <span>Compare ({selectedProjects.length}/3)</span>
        </div>
        <span className="hidden sm:inline-block text-slate-700">|</span>
        <div className="flex gap-2">
          {selectedProjects.map((p) => (
            <div key={p.id} className="relative h-11 w-16 bg-slate-900 border border-slate-800 group">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover"
              />
              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-950 text-white text-[9px] font-bold px-2 py-1 border border-slate-850 whitespace-nowrap z-50">
                {p.name}
              </div>
              {/* Remove button */}
              <button
                onClick={() => handleRemove(p.id)}
                className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-0.5 shadow z-10 transition"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
        <button
          onClick={handleClearAll}
          className="text-[10px] text-slate-400 hover:text-white uppercase font-bold tracking-wider transition flex items-center gap-1 px-2.5 py-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
        <Link href="/compare" className="w-full sm:w-auto">
          <Button 
            className="w-full sm:w-auto bg-primary hover:bg-blue-800 text-white rounded-none font-bold uppercase tracking-wider text-[10px] h-9 gap-1.5 px-4"
          >
            Compare Now <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

    </div>
  );
}
