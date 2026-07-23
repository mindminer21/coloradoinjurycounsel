// TEMP NOINDEX phase: crawling stays ALLOWED so Google can fetch pages and see the noindex
// meta/header. Do NOT add a blanket Disallow, or already-crawled URLs linger in the index.
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }], sitemap: `${SITE.baseUrl}/sitemap.xml` };
}
