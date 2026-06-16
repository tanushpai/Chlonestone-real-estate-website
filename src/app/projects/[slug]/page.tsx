import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ProjectDetailClient from "@/components/projects/ProjectDetailClient";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";
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

async function getProjectData(slug: string) {
  // Query DB first
  const dbProject = await prisma.project.findUnique({
    where: { slug },
    include: { agent: true }
  });

  if (dbProject) {
    // Query Developer profile dynamically
    const dbDev = await prisma.developer.findFirst({
      where: {
        name: {
          equals: dbProject.developer,
          mode: 'insensitive'
        }
      }
    });

    const devProfile = dbDev ? {
      name: dbDev.name,
      description: dbDev.description,
      completedProjects: dbDev.completedProjects,
      onTimeRate: dbDev.onTimeRate,
      logoUrl: dbDev.logoUrl
    } : (dbProject.developerProfile as any);

    return {
      ...dbProject,
      community: dbProject.communityName || "",
      images: dbProject.images as string[],
      paymentPlanDetails: dbProject.paymentPlanDetails as any[],
      unitMix: dbProject.unitMix as any[],
      amenities: dbProject.amenities as string[],
      locationHighlights: dbProject.locationHighlights as any[],
      developerProfile: devProfile,
      coordinates: dbProject.coordinates as { lat: number; lng: number },
      agent: dbProject.agent || null
    };
  }

  // Fallback to static mock projects
  const staticProj = projects.find((p) => p.slug === slug);
  return staticProj || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectData(slug);
  
  if (!project) {
    return {
      title: "Project Not Found | Chlonestone",
    };
  }

  return {
    title: `${project.name} by ${project.developer} at ${project.community} - Chlonestone`,
    description: `${project.name} off-plan development by ${project.developer} in ${project.community}, Dubai. Starting price ${project.startingPrice}. Floor plans & details.`,
  };
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectData(slug);

  if (!project) {
    notFound();
  }

  // Find similar projects (exclude current, matching same developer or location or type)
  // Fetch from DB
  const dbProjects = await prisma.project.findMany({
    where: {
      NOT: { id: project.id }
    },
    take: 3
  });

  let similarProjects: any[] = dbProjects.map(p => ({
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

  if (similarProjects.length === 0) {
    similarProjects = projects
      .filter((p) => p.id !== project.id)
      .slice(0, 3);
  }

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": project.name,
    "description": project.description,
    "image": project.image,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": project.community,
      "addressRegion": project.location,
      "addressCountry": "AE",
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "AED",
      "lowPrice": project.startingPrice.replace(/[^0-9]/g, ""),
      "price": project.startingPrice.replace(/[^0-9]/g, ""),
    },
    "provider": {
      "@type": "RealEstateAgent",
      "name": "Chlonestone Properties",
      "url": "https://chlonestone.com",
    },
  };

  return (
    <>
      {/* JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="pt-24 pb-16 lg:pt-32 bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link href="/projects" className="hover:text-primary transition">
              Projects
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-slate-900 font-semibold truncate">{project.name}</span>
          </nav>

          {/* Back Navigation for mobile */}
          <div className="mb-6">
            <Link 
              href="/projects" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-primary transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all projects
            </Link>
          </div>

          {/* Heading Section */}
          <div className="mb-8 border-b pb-6 sm:pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <Link href={`/developers/${slugify(project.developer)}`}>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary border border-amber-200/50 hover:bg-amber-100 transition">
                  {project.developer} Development
                </span>
              </Link>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl font-heading">
                {project.name}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-500 flex items-center gap-2">
                <span className="font-semibold text-slate-800">{project.community}</span> · {project.location}
              </p>
            </div>
            
            <div className="text-left md:text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Starting Price</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-primary font-heading mt-1">
                {project.startingPrice}
              </p>
            </div>
          </div>

          {/* Interactive Core Client Side Modules */}
          <ProjectDetailClient project={project} />

          {/* Similar Projects Section */}
          {similarProjects.length > 0 && (
            <section className="mt-16 sm:mt-24 border-t pt-12 sm:pt-16">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-heading text-slate-900 sm:text-3xl">
                    Similar Developments
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Other off-plan projects in Dubai you might like.
                  </p>
                </div>
                <Link 
                  href="/projects" 
                  className="text-xs sm:text-sm font-bold text-primary hover:text-amber-800 transition"
                >
                  View all projects
                </Link>
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {similarProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}