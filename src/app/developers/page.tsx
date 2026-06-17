import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import prisma from "@/lib/prisma";
import DevelopersGrid from "@/components/developers/DevelopersGrid";

export const dynamic = "force-dynamic";

const slugify = (text: string) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

export default async function DevelopersPage() {
  // Fetch developers from DB
  const dbDevs = await prisma.developer.findMany({
    orderBy: { id: "asc" }
  });
  
  // Fetch all projects from DB to get counts
  const dbProjects = await prisma.project.findMany();

  const developers = dbDevs.map((d) => {
    const projectCount = dbProjects.filter(
      (p) => p.developer.trim().toLowerCase() === d.name.trim().toLowerCase() || slugify(p.developer) === d.slug
    ).length;

    return {
      name: d.name,
      slug: d.slug,
      logoUrl: d.logoUrl || undefined,
      description: d.description,
      completedProjects: d.completedProjects,
      onTimeRate: d.onTimeRate,
      projectCount
    };
  });

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-16 lg:pt-32 bg-slate-50/50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-slate-900 font-semibold truncate">Developers</span>
          </nav>

          {/* Header */}
          <div className="mb-10 max-w-2xl">
            <h1 className="text-3xl font-extrabold sm:text-4xl text-slate-900 font-heading">
              Renowned Developers in Dubai
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-500">
              Discover master builders shaping Dubai's premium skylines and luxury communities with world-class residential and commercial projects.
            </p>
          </div>

          {/* Grid list of developers with pagination */}
          <DevelopersGrid developers={developers} />

        </div>
      </main>
    </>
  );
}
