import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Home, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ProjectCard from "@/components/projects/ProjectCard";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const slugify = (text: string) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

export default async function DeveloperDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch developer profile from Developer table
  const dbDev = await prisma.developer.findUnique({
    where: { slug }
  });

  // Fetch all projects from DB
  const dbProjects = await prisma.project.findMany();
  
  // Format projects
  const allProjects = dbProjects.map(p => ({
    ...p,
    community: p.communityName || "",
    images: p.images as string[],
    paymentPlanDetails: p.paymentPlanDetails as any[],
    unitMix: p.unitMix as any[],
    amenities: p.amenities as string[],
    locationHighlights: p.locationHighlights as any[],
    developerProfile: p.developerProfile as any,
    coordinates: p.coordinates as { lat: number; lng: number }
  }));

  // Find matches
  let developerProjects: any[] = allProjects.filter(
    (p) => slugify(p.developer) === slug || (dbDev && p.developer.trim().toLowerCase() === dbDev.name.trim().toLowerCase())
  );

  if (developerProjects.length === 0 && !dbDev) {
    notFound();
  }

  const developerName = dbDev ? dbDev.name : (developerProjects[0]?.developer || "");
  const profile = dbDev ? {
    logoUrl: dbDev.logoUrl,
    description: dbDev.description,
    completedProjects: dbDev.completedProjects,
    onTimeRate: dbDev.onTimeRate
  } : developerProjects[0]?.developerProfile;

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-16 lg:pt-32 bg-slate-50/50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link href="/developers" className="hover:text-primary transition">
              Developers
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-slate-900 font-semibold truncate">{developerName}</span>
          </nav>

          <div className="mb-6">
            <Link 
              href="/developers" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-primary transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all developers
            </Link>
          </div>

          {/* Profile Card Details */}
          <section className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm mb-12">
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between border-b pb-6 mb-6">
              
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                {profile?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.logoUrl}
                    alt={developerName}
                    className="h-14 w-auto object-contain max-w-[180px] flex-shrink-0"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary flex-shrink-0">
                    <Award className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
                    {developerName}
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-1">Master Builder Profile · {developerProjects.length} Active Listings</p>
                </div>
              </div>

              {/* Stats Badge Strip */}
              <div className="flex gap-4 w-full lg:w-auto">
                <div className="bg-slate-50 border px-6 py-3 rounded-2xl text-center flex-1 lg:flex-none lg:min-w-[120px]">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{profile?.completedProjects || 0}+ Units</p>
                </div>
                <div className="bg-slate-50 border px-6 py-3 rounded-2xl text-center flex-1 lg:flex-none lg:min-w-[120px]">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">On-Time Rate</p>
                  <p className="text-base font-bold text-emerald-600 mt-0.5">{profile?.onTimeRate || "N/A"}</p>
                </div>
              </div>

            </div>

            {/* Description Biography */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Developer Biography</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-4xl">
                {profile?.description || "A premier development company delivering outstanding communities and landmarks in the region. Committed to strict quality regulations and on-time handovers."}
              </p>
            </div>

          </section>

          {/* Properties Grid */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                Off-Plan Listings by {developerName}
              </h2>
              <p className="text-sm text-slate-500 mt-1">Explore current new project launches and luxury developments.</p>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {developerProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
