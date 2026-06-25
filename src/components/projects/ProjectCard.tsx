"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Home, Scale } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: number;
  slug: string;
  name: string;
  developer: string;
  community: string;
  communityName?: string;
  location: string;
  address?: string | null;
  propertyType: string;
  startingPrice: string;
  handover: string;
  paymentPlan: string;
  image: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  const checkCompare = () => {
    try {
      const compareStr = localStorage.getItem("chlonestone_compare");
      if (compareStr) {
        const compareList = JSON.parse(compareStr);
        setIsCompared(compareList.includes(project.id));
      } else {
        setIsCompared(false);
      }
    } catch (err) {
      console.error(err);
      setIsCompared(false);
    }
  };

  const checkWishlist = () => {
    try {
      const userStr = localStorage.getItem("chlonestone_user");
      if (userStr && userStr !== "undefined" && userStr !== "null") {
        const user = JSON.parse(userStr);
        if (user && user.email) {
          const saved = localStorage.getItem(`wishlist_${user.email}_${project.id}`) === "true";
          setIsWishlisted(saved);
          return;
        }
      }
    } catch (err) {
      console.error("Error reading wishlist state:", err);
    }
    setIsWishlisted(false);
  };

  useEffect(() => {
    checkWishlist();
    checkCompare();
    window.addEventListener("wishlist-change", checkWishlist);
    window.addEventListener("compare-change", checkCompare);
    window.addEventListener("auth-state-change", checkWishlist);
    return () => {
      window.removeEventListener("wishlist-change", checkWishlist);
      window.removeEventListener("compare-change", checkCompare);
      window.removeEventListener("auth-state-change", checkWishlist);
    };
  }, [project.id]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const userStr = localStorage.getItem("chlonestone_user");
    let loggedInUser = null;
    
    if (userStr && userStr !== "undefined" && userStr !== "null") {
      try {
        const u = JSON.parse(userStr);
        if (u && u.email) {
          loggedInUser = u;
        }
      } catch (err) {
        console.error("Error parsing chlonestone_user:", err);
      }
    }

    if (!loggedInUser) {
      console.warn("Wishlist click: No valid user logged in. Opening auth modal.");
      window.dispatchEvent(
        new CustomEvent("open-auth-lead-capture", {
          detail: {
            interestType: "wishlist",
            projectName: project.name,
            onSuccess: () => {
              const updatedUserStr = localStorage.getItem("chlonestone_user");
              if (updatedUserStr && updatedUserStr !== "undefined" && updatedUserStr !== "null") {
                try {
                  const u = JSON.parse(updatedUserStr);
                  if (u && u.email) {
                    setIsWishlisted(true);
                    localStorage.setItem(`wishlist_${u.email}_${project.id}`, "true");
                    window.dispatchEvent(new Event("wishlist-change"));
                  }
                } catch (err) {
                  console.error(err);
                }
              }
            },
          },
        })
      );
    } else {
      const nextState = !isWishlisted;
      setIsWishlisted(nextState);
      localStorage.setItem(`wishlist_${loggedInUser.email}_${project.id}`, String(nextState));
      window.dispatchEvent(new Event("wishlist-change"));
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const compareStr = localStorage.getItem("chlonestone_compare");
      let compareList: number[] = compareStr ? JSON.parse(compareStr) : [];

      if (compareList.includes(project.id)) {
        compareList = compareList.filter(id => id !== project.id);
        localStorage.setItem("chlonestone_compare", JSON.stringify(compareList));
        setIsCompared(false);
        window.dispatchEvent(new Event("compare-change"));
      } else {
        if (compareList.length >= 3) {
          alert("You can compare up to 3 properties side-by-side.");
          return;
        }
        compareList.push(project.id);
        localStorage.setItem("chlonestone_compare", JSON.stringify(compareList));
        setIsCompared(true);
        window.dispatchEvent(new Event("compare-change"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Link href={`/projects/${project.slug}`}>
      <Card className="group h-full overflow-hidden border border-border bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col">
        {/* Image Container - Taller for vertical rectangle layout */}
        <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Compare Button */}
          <button
            onClick={handleCompareClick}
            className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center bg-white border border-slate-100 shadow-md transition hover:bg-slate-50 z-10 rounded-full"
            title="Add to Compare"
          >
            <Scale className={`h-4.5 w-4.5 ${isCompared ? "text-primary fill-primary/10" : "text-slate-700"}`} />
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-slate-50 z-10"
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? "text-pink-600 fill-pink-600 animate-pulse" : "text-slate-700"}`} />
          </button>
        </div>

        <CardContent className="flex flex-col flex-grow p-4 sm:p-5 justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xl font-bold text-foreground sm:text-2xl font-heading">
                  {project.startingPrice}
                </p>
              </div>
              <Badge variant="secondary" className="border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-amber-900">
                {project.propertyType}
              </Badge>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-1 font-heading">
              {project.name}
            </h3>

            <div className="flex items-center justify-between gap-2 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="h-4 w-4 flex-shrink-0 text-amber-600" />
                <span className="truncate">{project.communityName || project.community || ""}</span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
                {project.handover}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}