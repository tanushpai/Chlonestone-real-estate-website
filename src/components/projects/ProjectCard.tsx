"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Home } from "lucide-react";

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
    window.addEventListener("wishlist-change", checkWishlist);
    window.addEventListener("auth-state-change", checkWishlist);
    return () => {
      window.removeEventListener("wishlist-change", checkWishlist);
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
  return (
    <Link href={`/projects/${project.slug}`}>
      <Card className="group h-full overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
        {/* Image Container */}
        <div className="relative h-52 sm:h-56 lg:h-60 bg-slate-100 overflow-hidden">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Wishlist Icon */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-slate-50 z-10"
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? "text-pink-600 fill-pink-600 animate-pulse" : "text-slate-700"}`} />
          </button>
        </div>

        <CardContent className="flex flex-col flex-grow p-4 sm:p-5">
          <div className="flex-grow space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xl font-semibold text-foreground sm:text-2xl font-heading">
                  {project.startingPrice}
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-900">
                {project.propertyType.toUpperCase()}
              </Badge>
            </div>

            <h3 className="text-lg font-semibold text-foreground line-clamp-1 font-heading">
              {project.name}
            </h3>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4 flex-shrink-0 text-amber-700" />
              <span className="truncate">{project.communityName || project.community || ""}</span>
            </div>
          </div>

          <div className="mt-6 grid gap-2 border-t border-border pt-4 text-xs font-medium text-slate-600 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-1.5 rounded-full bg-slate-50 hover:bg-slate-100 transition px-3 py-2 text-center">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 rounded-full bg-slate-50 hover:bg-slate-100 transition px-3 py-2 text-center">
              <span className="truncate">{project.developer}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 rounded-full bg-slate-50 hover:bg-slate-100 transition px-3 py-2 text-center">
              <span className="truncate">{project.handover}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}