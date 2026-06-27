import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://chlonestone.com";

  // Static routes
  const routes = ["", "/about", "/services", "/projects", "/communities", "/developers"].map((route) => ({
    url: `${appUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    // Dynamic project routes
    const projects = await prisma.project.findMany({ select: { slug: true } });
    const projectRoutes = projects.map((p) => ({
      url: `${appUrl}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Dynamic community routes
    const communities = await prisma.community.findMany({ select: { slug: true } });
    const communityRoutes = communities.map((c) => ({
      url: `${appUrl}/communities/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Dynamic developer routes
    const developers = await prisma.developer.findMany({ select: { slug: true } });
    const developerRoutes = developers.map((d) => ({
      url: `${appUrl}/developers/${d.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...routes, ...projectRoutes, ...communityRoutes, ...developerRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return routes;
  }
}
