import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home, Compass, ShieldCheck, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ProjectCard from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getCommunityData(slug: string) {
  // Query DB first
  const dbComm = await prisma.community.findUnique({
    where: { slug }
  });

  if (dbComm) {
    return {
      ...dbComm,
      highlights: dbComm.highlights as string[],
      driveTimes: dbComm.driveTimes as { location: string; time: string }[]
    };
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const community = await getCommunityData(slug);

  if (!community) {
    return {
      title: "Community Area Guide | Chlonestone",
    };
  }

  return {
    title: `${community.name} Area Guide - Living in Dubai`,
    description: `Learn about living in ${community.name}, Dubai. Avg prices: ${community.avgPrice}, Rental yield: ${community.rentalYield}, highlights and off-plan projects.`,
  };
}

export default async function CommunityDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const community = await getCommunityData(slug);

  if (!community) {
    notFound();
  }

  // Filter projects located in this community
  // Query DB
  const dbProjects = await prisma.project.findMany({
    where: {
      communityName: {
        equals: community.name,
        mode: 'insensitive'
      }
    }
  });

  let communityProjects: any[] = dbProjects.map(p => ({
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

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-16 lg:pt-32 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link href="/communities" className="hover:text-primary transition">
              Communities
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-slate-900 font-semibold truncate">{community.name}</span>
          </nav>

          {/* Hero Banner Banner */}
          <section className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-soft mb-8 bg-slate-900">
            <Image
              src={community.image}
              alt={community.name}
              fill
              priority
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/35 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="rounded-full bg-primary px-3.5 py-1 text-xs font-bold text-slate-950 uppercase tracking-widest">
                Area Guide
              </span>
              <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl font-heading text-white">
                {community.name}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-200 font-medium">
                {community.tagline}
              </p>
            </div>
          </section>

          {/* Key Neighborhood Stats Panel */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-3xl border border-border bg-slate-50 p-6 sm:p-8 mb-10">
            <div className="text-center p-2">
              <p className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Average Sale Price</p>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">{community.avgPrice}</p>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <p className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Rental Yield (ROI)</p>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1">{community.rentalYield}</p>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <p className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-wider text-slate-400">YoY Price Growth</p>
              <p className="text-xl sm:text-2xl font-extrabold text-primary mt-1">{community.growth}</p>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <p className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Ideal For</p>
              <p className="text-sm sm:text-base font-bold text-slate-800 mt-2 truncate">{community.popularFor?.split(" & ")[0] || "Investment"}</p>
            </div>
          </section>

          {/* Two Column details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Left Description Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold font-heading text-slate-900 sm:text-3xl">
                  Overview of the Community
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {community.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-heading text-slate-900">Key Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {community.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 border rounded-xl bg-slate-50/50">
                      <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Transit Column */}
            <div className="lg:col-span-1">
              <div className="rounded-3xl border border-border bg-slate-50 p-6 space-y-5">
                <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" /> Proximity & Transit
                </h3>
                <p className="text-xs text-slate-500">Estimated drive times from the community to popular landmarks.</p>
                
                <div className="space-y-3 pt-2">
                  {community.driveTimes.map((dt, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-xl">
                      <span className="text-xs sm:text-sm font-semibold text-slate-700">{dt.location}</span>
                      <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{dt.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Active Off plan projects in this community */}
          <section className="border-t pt-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                Off-Plan Projects in {community.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore luxury pre-construction projects launched in this neighborhood.
              </p>
            </div>

            {communityProjects.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {communityProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 border rounded-2xl">
                <Compass className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No projects currently launched here.</p>
                <p className="text-xs text-slate-400 mt-1">Check back soon for upcoming project launches by leading developers.</p>
                <Link href="/projects">
                  <Button variant="outline" size="sm" className="mt-4 rounded-xl text-xs">
                    View all projects
                  </Button>
                </Link>
              </div>
            )}
          </section>

        </div>
      </main>
    </>
  );
}
