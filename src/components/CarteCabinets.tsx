/**
 * CarteCabinets — Carte interactive Leaflet des cabinets I-CA.RE.
 *
 * Données : table Supabase `projets` (lat/lng, statut, google_place_id).
 * Tuiles  : OpenStreetMap (libre, sans clé API).
 * Markers : SVG sauge (#9EB8A5) pour cabinets actifs, or pâle (#D9C7A1)
 *           pour cabinets en travaux. Popup avec CTA + lien Google Maps.
 *
 * À importer en lazy (React.lazy) sur la page preview pour ne pas alourdir
 * le bundle des pages qui ne l'utilisent pas.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { googleMapsPlaceUrl } from "@/lib/google-maps-url";

const SAGE = "#9EB8A5";
const GOLD_PALE = "#D9C7A1";
const CREAM = "#F6F5F0";
const ANTHRACITE = "#2B2B2B";

type Cabinet = {
  slug: string;
  name: string;
  address: string;
  city: string;
  status: string;
  lat: number;
  lng: number;
  googlePlaceId: string | null;
};

/** Build a Leaflet DivIcon from inline SVG using charte colors. */
function buildIcon(active: boolean): L.DivIcon {
  const fill = active ? SAGE : GOLD_PALE;
  const html = `
    <div style="position:relative;width:32px;height:40px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40">
        <path d="M16 0C7.2 0 0 7.2 0 16c0 11.5 14.4 22.5 15.1 23 .5.4 1.3.4 1.8 0C17.6 38.5 32 27.5 32 16 32 7.2 24.8 0 16 0z" fill="${fill}" stroke="${ANTHRACITE}" stroke-width="1.2" stroke-opacity="0.4"/>
        <circle cx="16" cy="16" r="5.5" fill="${CREAM}"/>
        ${!active ? `<circle cx="13" cy="16" r="1" fill="${ANTHRACITE}" opacity="0.55"/><circle cx="16" cy="16" r="1" fill="${ANTHRACITE}" opacity="0.55"/><circle cx="19" cy="16" r="1" fill="${ANTHRACITE}" opacity="0.55"/>` : ""}
      </svg>
    </div>
  `;
  return L.divIcon({
    html,
    className: "i-care-marker",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  });
}

const ICON_ACTIVE = buildIcon(true);
const ICON_WORK = buildIcon(false);

/** Helper component to fit bounds or recenter map when selection changes. */
function MapController({
  cabinets,
  centerOn,
}: {
  cabinets: Cabinet[];
  centerOn: "all" | string;
}) {
  const map = useMap();
  useEffect(() => {
    if (cabinets.length === 0) return;
    if (centerOn === "all") {
      const bounds = L.latLngBounds(cabinets.map((c) => [c.lat, c.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    } else {
      const c = cabinets.find((x) => x.slug === centerOn);
      if (c) map.setView([c.lat, c.lng], 15, { animate: true });
    }
  }, [centerOn, cabinets, map]);
  return null;
}

interface CarteCabinetsProps {
  centerOn?: "all" | string;
  height?: string;
  showSidebar?: boolean;
}

export function CarteCabinets({
  centerOn: centerOnProp = "all",
  height,
  showSidebar = true,
}: CarteCabinetsProps) {
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<"all" | string>(centerOnProp);
  const markerRefs = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: err } = await supabase
        .from("projets")
        .select("slug, name, address, city, status, lat, lng, google_place_id")
        .not("lat", "is", null)
        .not("lng", "is", null)
        .order("name");
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      const rows: Cabinet[] = (data ?? [])
        .filter((r) => r.lat != null && r.lng != null)
        .map((r) => ({
          slug: r.slug,
          name: r.name,
          address: r.address ?? "",
          city: r.city,
          status: r.status,
          lat: Number(r.lat),
          lng: Number(r.lng),
          googlePlaceId: r.google_place_id,
        }));
      setCabinets(rows);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Default visual height
  const mapHeight = height ?? "min(70vh, 520px)";
  const mapHeightMobile = height ?? "min(60vh, 380px)";

  const handleSelect = (slug: string) => {
    setSelected(slug);
    // Open the popup after a tick so MapController has recentered
    setTimeout(() => {
      const m = markerRefs.current[slug];
      if (m) m.openPopup();
    }, 350);
  };

  const isActive = (status: string) => status === "en_exploitation";

  // Memoize map element so it doesn't fully remount when sidebar selection changes
  const mapElement = useMemo(() => {
    if (cabinets.length === 0) return null;
    const initial: [number, number] = [cabinets[0].lat, cabinets[0].lng];
    return (
      <MapContainer
        center={initial}
        zoom={12}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
        aria-label="Carte des cabinets I-CA.RE à Bordeaux"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController cabinets={cabinets} centerOn={selected} />
        {cabinets.map((c) => {
          const active = isActive(c.status);
          const mapsUrl = googleMapsPlaceUrl(c.name, c.googlePlaceId);
          return (
            <Marker
              key={c.slug}
              position={[c.lat, c.lng]}
              icon={active ? ICON_ACTIVE : ICON_WORK}
              ref={(ref) => {
                if (ref) markerRefs.current[c.slug] = ref;
              }}
              alt={`Cabinet I-CA.RE ${c.name} — ${c.address}`}
            >
              <Popup>
                <div style={{ minWidth: 220, fontFamily: "Inter, system-ui, sans-serif" }}>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 18,
                      color: ANTHRACITE,
                      margin: 0,
                      marginBottom: 4,
                      fontWeight: 600,
                    }}
                  >
                    {c.name}
                  </h3>
                  {!active && (
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: GOLD_PALE,
                        color: ANTHRACITE,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "3px 8px",
                        borderRadius: 3,
                        marginBottom: 6,
                      }}
                    >
                      En travaux
                    </span>
                  )}
                  <p style={{ fontSize: 13, color: "#555", margin: 0, marginBottom: 10, lineHeight: 1.4 }}>
                    {c.address}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <Link
                      to={`/projets/${c.slug}`}
                      style={{
                        display: "inline-block",
                        backgroundColor: SAGE,
                        color: ANTHRACITE,
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        textAlign: "center",
                        padding: "8px 12px",
                        borderRadius: 2,
                        textDecoration: "none",
                      }}
                    >
                      Voir le cabinet
                    </Link>
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          border: `1px solid ${GOLD_PALE}`,
                          color: ANTHRACITE,
                          fontSize: 11,
                          fontWeight: 500,
                          letterSpacing: "0.04em",
                          textAlign: "center",
                          padding: "6px 12px",
                          borderRadius: 2,
                          textDecoration: "none",
                          backgroundColor: "transparent",
                        }}
                      >
                        Ouvrir dans Google Maps
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    );
    // selected intentionally NOT in deps: handled by MapController
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cabinets]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center bg-muted/30 rounded-md"
        style={{ height: mapHeight }}
      >
        <p className="text-sm text-muted-foreground">Chargement de la carte…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center bg-destructive/10 rounded-md p-6">
        <p className="text-sm text-destructive">Carte indisponible : {error}</p>
      </div>
    );
  }
  if (cabinets.length === 0) {
    return (
      <div className="flex items-center justify-center bg-muted/30 rounded-md p-6">
        <p className="text-sm text-muted-foreground">Aucun cabinet géolocalisé.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${showSidebar ? "lg:grid-cols-3" : ""} gap-6`}>
      {/* Carte */}
      <div className={showSidebar ? "lg:col-span-2" : ""}>
        <div
          className="rounded-md overflow-hidden border border-border"
          style={{
            height: mapHeight,
          }}
        >
          <div className="lg:block hidden h-full">{mapElement}</div>
          <div
            className="lg:hidden block w-full"
            style={{ height: mapHeightMobile }}
          >
            {mapElement}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <aside className="lg:col-span-1">
          <h2 className="font-heading text-xl text-foreground mb-3">Nos cabinets</h2>
          <ul className="space-y-2 list-none p-0 m-0">
            {cabinets.map((c) => {
              const active = isActive(c.status);
              const isSelected = selected === c.slug;
              return (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => handleSelect(c.slug)}
                    className={`w-full text-left p-3 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-heading text-[18px] text-foreground leading-tight">
                          {c.name}
                        </div>
                        <div className="font-sans text-[14px] text-muted-foreground mt-1 leading-snug">
                          {c.address}
                        </div>
                      </div>
                      <span
                        className="font-sans text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shrink-0"
                        style={{
                          backgroundColor: active ? `${SAGE}33` : `${GOLD_PALE}55`,
                          color: ANTHRACITE,
                        }}
                      >
                        {active ? "Actif" : "En travaux"}
                      </span>
                    </div>
                    <Link
                      to={`/projets/${c.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block mt-2 text-xs font-medium text-primary hover:underline"
                    >
                      Voir le cabinet →
                    </Link>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      )}
    </div>
  );
}

export default CarteCabinets;
