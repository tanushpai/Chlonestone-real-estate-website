import Link from "next/link";
import Image from "next/image";
import { Award, ArrowRight, Home, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import prisma from "@/lib/prisma";

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

          {/* Grid list of developers */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {developers.map((dev) => {
              const slug = dev.slug || slugify(dev.name);
              
              let developerLogo = dev.logoUrl;
              
              if (slug === "emaar") {
                developerLogo = "https://upload.wikimedia.org/wikipedia/commons/e/e3/Emaar_Properties_Logo.svg";
              } else if (slug === "sobha") {
                developerLogo = "https://upload.wikimedia.org/wikipedia/commons/b/ba/Sobha_Realty_Logo.svg";
              } else if (slug === "damac") {
                developerLogo = "https://upload.wikimedia.org/wikipedia/commons/e/ea/DAMAC_Properties_Logo.svg";
              }

              return (
                <div 
                  key={slug}
                  className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Dedicated Logo Header Container (No property image) */}
                  <div className="relative h-44 w-full bg-slate-50 flex items-center justify-center p-4 border-b border-slate-100/60">
                    {developerLogo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={developerLogo}
                        alt={dev.name}
                        className="h-full w-full object-contain max-h-[130px] max-w-[250px]"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <Award className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-bold text-slate-900 font-heading">
                          {dev.name}
                        </h2>
                        
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 uppercase tracking-wider">
                          {dev.projectCount} {dev.projectCount === 1 ? 'Project' : 'Projects'}
                        </span>
                      </div>
                      
                      <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6">
                        {dev.description}
                      </p>
                    </div>

                    {/* Stats & Link */}
                    <div className="border-t pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed</p>
                          <p className="text-sm font-extrabold text-slate-800 mt-0.5">{dev.completedProjects.toLocaleString()}+ Units</p>
                        </div>
                        <div className="bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">On-Time Rate</p>
                          <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{dev.onTimeRate}</p>
                        </div>
                      </div>

                      <Link 
                        href={`/developers/${slug}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 text-xs sm:text-sm transition shadow-sm"
                      >
                        View Developer Profile
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </>
  );
}
