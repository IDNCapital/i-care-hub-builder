import { parseAddress, regionFromPostalCode } from "./projectSchema.ts";
import { BASE_URL, pageUrl } from "./siteUrl.ts";

interface ProjectIdentity {
  name: string;
  city: string;
  address?: string | null;
  show_address?: boolean | null;
  lat?: number | string | null;
  lng?: number | string | null;
}

/** Use the page's visible description, rather than a second, hidden editorial copy. */
export function buildProjectStructuredData({
  project,
  description,
  canonicalPath,
  heroPath,
}: {
  project: ProjectIdentity;
  description: string;
  canonicalPath: string;
  heroPath?: string | null;
}): Record<string, unknown> {
  const parsed = parseAddress(project.address ?? "");
  const region = regionFromPostalCode(parsed.postalCode);
  const address: Record<string, unknown> = {
    "@type": "PostalAddress",
    addressLocality: project.city,
    addressCountry: "FR",
  };
  if (project.show_address) {
    if (parsed.streetAddress) address.streetAddress = parsed.streetAddress;
    if (parsed.postalCode) address.postalCode = parsed.postalCode;
    if (region) address.addressRegion = region;
  }

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: project.name,
    description,
    url: pageUrl(canonicalPath),
    email: "contact@i-ca.re",
    address,
    areaServed: { "@type": "City", name: project.city },
  };

  if (heroPath?.trim()) {
    try {
      const image = new URL(heroPath, `${BASE_URL}/`);
      if (["https:", "http:"].includes(image.protocol) && !image.username && !image.password) {
        schema.image = image.href;
      }
    } catch {
      // An invalid source image must not produce a malformed URL for crawlers.
    }
  }

  if (project.show_address && project.lat != null && project.lng != null && String(project.lat).trim() && String(project.lng).trim()) {
    const latitude = Number(project.lat);
    const longitude = Number(project.lng);
    if (Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180) {
      schema.geo = { "@type": "GeoCoordinates", latitude, longitude };
    }
  }
  // Opening hours, prices and availability require their own verified visible source.
  return schema;
}
