import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://chlonestone.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/crm/", "/api/"],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
