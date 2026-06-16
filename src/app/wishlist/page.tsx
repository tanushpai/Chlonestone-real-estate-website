"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Lock, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ProjectCard from "@/components/projects/ProjectCard";
import { getProjects } from "@/lib/dataService";
import { Project } from "@/data/projects";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [likedProjects, setLikedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const checkWishlist = async () => {
    setLoading(true);
    const storedUser = localStorage.getItem("chlonestone_user");
    if (!storedUser || storedUser === "undefined" || storedUser === "null") {
      setUser(null);
      setLikedProjects([]);
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser && parsedUser.email) {
        const allProjects = await getProjects();
        const wishlisted = allProjects.filter((p) => {
          return localStorage.getItem(`wishlist_${parsedUser.email}_${p.id}`) === "true";
        });
        setLikedProjects(wishlisted);
      }
    } catch (err) {
      console.error("Error loading wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkWishlist();
    // Listen to changes in auth or wishlist state
    window.addEventListener("auth-state-change", checkWishlist);
    window.addEventListener("wishlist-change", checkWishlist);
    return () => {
      window.removeEventListener("auth-state-change", checkWishlist);
      window.removeEventListener("wishlist-change", checkWishlist);
    };
  }, []);

  const handleSignInClick = () => {
    window.dispatchEvent(
      new CustomEvent("open-auth-lead-capture", {
        detail: {
          interestType: "wishlist-page",
          projectName: "Wishlist Page Signin",
          onSuccess: () => {
            checkWishlist();
          }
        },
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 max-w-7xl mx-auto px-6 w-full">
        {loading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-primary" />
            <p className="text-sm text-slate-500 font-medium">Loading your saved properties...</p>
          </div>
        ) : !user ? (
          /* Sign In Prompt / Protected Page State */
          <div className="mx-auto max-w-md bg-white border border-border rounded-[2rem] p-8 text-center shadow-soft mt-12 space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Lock className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900 font-heading">
                Sign In Required
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                You must be signed in to access your saved properties. Please sign in or register to browse your personal wishlist.
              </p>
            </div>
            <Button 
              onClick={handleSignInClick} 
              className="w-full bg-primary hover:bg-blue-800 text-white font-bold h-12 rounded-xl shadow-md gap-2"
            >
              Sign In / Register
            </Button>
          </div>
        ) : likedProjects.length === 0 ? (
          /* Empty wishlist state */
          <div className="mx-auto max-w-lg bg-white border border-border rounded-[2rem] p-10 text-center shadow-soft mt-12 space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-pink-500">
              <Heart className="h-7 w-7 fill-pink-50" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900 font-heading">
                Your Wishlist is Empty
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                You haven't liked any properties yet. Explore our luxury off-plan projects in Dubai and tap the heart icon on any card to save it here.
              </p>
            </div>
            <Link href="/projects" className="block">
              <Button className="w-full bg-primary hover:bg-blue-800 text-white font-bold h-12 rounded-xl shadow-md gap-2">
                Browse Projects <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          /* Active wishlist view */
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-heading">
                My Liked Properties
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                You have {likedProjects.length} saved off-plan project{likedProjects.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {likedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
