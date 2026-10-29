/**
 * CarteCabinets : Carte interactive Leaflet des cabinets I-CA.RE.
 *
 * Features:
 * - Filtre par ville (pills) avec compteurs dynamiques
 * - Animations flyTo / flyToBounds (respect prefers-reduced-motion)
 * - Bouton recentrer (Crosshair)
 * - Markers actifs (sauge plein) vs en travaux (or pâle pointillés + "...")
 * - Popups conditionnelles (CTA Google Maps masqué pour cabinets en travaux)
 * - Synchro bidirectionnelle marker ↔ sidebar
 * - URL state ?cabinet=slug (deep-link partageable)
 * - A11y : radiogroup pour pills, aria-pressed pour cards
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Crosshair } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { googleMapsPlaceUrl } from "@/lib/google-maps-url";
import { openingForecastLabel, quarterLabel } from "@/lib/centres";
import { marqueAffichee } from "@/lib/brand";
import { parseLat, parseLng } from "@/lib/geo";
import { MapErrorBoundary } from "@/components/MapErrorBoundary";

const SAGE = "#9EB8A5";
const SAGE_LIGHT = "#E2EAE5";
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
  dateOuvertureCible: string | null;
};


type CabinetSource = {
  slug: string; name: string; address: string | null; city: string;
  status: string; lat: unknown; lng: unknown; google_place_id: string | null;
  date_ouverture_cible: string | null;
};

type CabinetRead =
  | { status: "loading" | "error" }
  | { status: "ready"; generation: number; cabinets: Cabinet[]; excludedCount: number };

const MAP_PAGE_SIZE = 200;
const MAP_MAX_PAGES = 50;
const MAP_MAX_ROWS = 10000;

function isCabinetSource(value: unknown): value is CabinetSource {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const row = value as Record<string, unknown>;
  return typeof row.slug === "string" && row.slug.trim().length > 0 &&
    typeof row.name === "string" && typeof row.city === "string" &&
    typeof row.status === "string" &&
    (row.address === null || typeof row.address === "string") &&
    (row.google_place_id === null || typeof row.google_place_id === "string") &&
    (row.date_ouverture_cible === null || typeof row.date_ouverture_cible === "string");
}

/** Reçu entier seulement : le plafond serveur peut être inférieur à range().
 *  Le slug est UNIQUE dans le schéma versionné ; il départage les noms égaux.
 *  Un compte stable ne constitue pas un instantané transactionnel. */
async function readGeolocatedCabinets(isCurrent: () => boolean) {
  const sources: CabinetSource[] = [];
  const slugs = new Set<string>();
  let expectedCount: number | null = null;
  for (let page = 0; page < MAP_MAX_PAGES; page++) {
    if (!isCurrent()) return null;
    const { data, error, count } = await supabase
      .from("projets")
      .select("slug, name, address, city, status, lat, lng, google_place_id, date_ouverture_cible", { count: "exact" })
      .not("lat", "is", null)
      .not("lng", "is", null)
      .order("name")
      .order("slug")
      .range(sources.length, sources.length + MAP_PAGE_SIZE - 1);
    if (!isCurrent()) return null;
    if (error || !Array.isArray(data) || !Number.isSafeInteger(count) ||
        count < 0 || count > MAP_MAX_ROWS || data.length > MAP_PAGE_SIZE) {
      throw new Error("Incomplete map receipt");
    }
    if (expectedCount !== null && count !== expectedCount) throw new Error("Unstable map receipt");
    expectedCount = count;
    for (const row of data as unknown[]) {
      if (!isCabinetSource(row) || slugs.has(row.slug)) throw new Error("Invalid map receipt");
      slugs.add(row.slug);
      sources.push(row);
    }
    if (sources.length > count) throw new Error("Contradictory map receipt");
    if (sources.length === count) {
      const cabinets = sources.map((r): Cabinet | null => {
        const lat = parseLat(r.lat);
        const lng = parseLng(r.lng);
        if (lat === null || lng === null) return null;
        return {
          slug: r.slug, name: r.name, address: r.address ?? "", city: r.city,
          status: r.status, lat, lng, googlePlaceId: r.google_place_id,
          dateOuvertureCible: r.date_ouverture_cible,
        };
      }).filter((r): r is Cabinet => r !== null);
      return { cabinets, excludedCount: sources.length - cabinets.length };
    }
    if (data.length === 0) throw new Error("Truncated map receipt");
  }
  throw new Error("Map receipt limit");
}

/** Mapping ville -> métropole. */
const CITY_TO_METRO: Record<string, string> = {
  Bordeaux: "Bordeaux Métropole",
  Floirac: "Bordeaux Métropole",
  Lormont: "Bordeaux Métropole",
  "Le Bouscat": "Bordeaux Métropole",
  Toulouse: "Toulouse Métropole",
};

function metroOf(city: string): string {
  return CITY_TO_METRO[city] ?? city;
}

/** Build a Leaflet DivIcon from inline SVG using charte colors. */
function buildIcon(active: boolean, highlighted = false): L.DivIcon {
  const fill = active ? SAGE : GOLD_PALE;
  const baseW = 30;
  const baseH = 38;
  const w = highlighted ? Math.round(baseW * 1.3) : baseW;
  const h = highlighted ? Math.round(baseH * 1.3) : baseH;
  const stroke = active ? "" : 'stroke-dasharray="3,2"';
  const filter = highlighted
    ? 'filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"'
    : 'filter="drop-shadow(0 1px 2px rgba(0,0,0,0.15))"';
  const dotsForWork = !active
    ? `<circle cx="13" cy="16" r="1.1" fill="${ANTHRACITE}" opacity="0.65"/><circle cx="16" cy="16" r="1.1" fill="${ANTHRACITE}" opacity="0.65"/><circle cx="19" cy="16" r="1.1" fill="${ANTHRACITE}" opacity="0.65"/>`
    : "";
  const html = `
    <div style="position:relative;width:${w}px;height:${h}px;transition:transform 0.2s ease;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="${w}" height="${h}" ${filter}>
        <path d="M16 0C7.2 0 0 7.2 0 16c0 11.5 14.4 22.5 15.1 23 .5.4 1.3.4 1.8 0C17.6 38.5 32 27.5 32 16 32 7.2 24.8 0 16 0z"
              fill="${fill}" stroke="${ANTHRACITE}" stroke-width="1.4" stroke-opacity="0.55" ${stroke}/>
        <circle cx="16" cy="16" r="5.5" fill="${CREAM}"/>
        ${dotsForWork}
      </svg>
    </div>
  `;
  return L.divIcon({
    html,
    className: "i-care-marker",
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h + 4],
  });
}

const ICON_ACTIVE = buildIcon(true);
const ICON_WORK = buildIcon(false);
const ICON_ACTIVE_HL = buildIcon(true, true);
const ICON_WORK_HL = buildIcon(false, true);

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Helper component to fit bounds or fly to a cabinet. */
function MapController({
  cabinets,
  selected,
  fitTrigger,
}: {
  cabinets: Cabinet[];
  selected: string | null;
  fitTrigger: number;
}) {
  const map = useMap();
  const reduced = prefersReducedMotion();
  const isFirstFit = useRef(true);
  const isFirstSelect = useRef(true);

  // fitBounds when fitTrigger changes (filter switch or recenter)
  useEffect(() => {
    if (cabinets.length === 0) return;
    // Hypothèse (non vérifiée en profondeur) : sur un chargement à froid,
    // le conteneur pourrait ne pas encore avoir sa taille finale
    // (polices/CSS pas chargées) au moment où cet effet s'exécute, ce qui
    // amènerait Leaflet à calculer un zoom/centre sur une vue 0x0 et un
    // LatLng (NaN, NaN). Par précaution on force une mesure à jour du
    // conteneur avant de bouger la carte, et on n'anime jamais ce tout
    // premier positionnement.
    map.invalidateSize();
    const bounds = L.latLngBounds(cabinets.map((c) => [c.lat, c.lng] as [number, number]));
    if (!bounds.isValid()) return;
    const instant = reduced || isFirstFit.current;
    isFirstFit.current = false;
    if (cabinets.length === 1) {
      const c = cabinets[0];
      if (instant) map.setView([c.lat, c.lng], 14);
      else map.flyTo([c.lat, c.lng], 14, { duration: 0.8 });
    } else {
      if (instant) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      else map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 13, duration: 0.8 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitTrigger]);

  // flyTo when selected cabinet changes
  useEffect(() => {
    const initialSelection = isFirstSelect.current;
    isFirstSelect.current = false;
    if (!selected) return;
    const c = cabinets.find((x) => x.slug === selected);
    if (!c) return;
    if (!Number.isFinite(c.lat) || !Number.isFinite(c.lng)) return;
    // La toute première sélection (ex. deep-link ?cabinet=) arrive juste
    // après le premier positionnement ci-dessus, qui vient déjà de placer
    // la carte sans animation : l'animer ici produirait un second
    // mouvement visible juste après le premier. On ne l'anime donc que
    // pour les sélections suivantes, faites par l'utilisateur.
    const instant = reduced || initialSelection;
    if (instant) map.setView([c.lat, c.lng], 16);
    else map.flyTo([c.lat, c.lng], 16, { duration: 0.9 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return null;
}

interface CarteCabinetsProps {
  centerOn?: "all" | string;
  height?: string;
  showSidebar?: boolean;
}

type CityFilter = "all" | string;

export function CarteCabinets({
  centerOn: centerOnProp = "all",
  height,
  showSidebar = true,
}: CarteCabinetsProps) {
  const [read, setRead] = useState<CabinetRead>({ status: "loading" });
  const generation = useRef(0);
  const [filterView, setFilterView] = useState<{ slug: string | null; filter: CityFilter }>({ slug: null, filter: "all" });
  const [fallbackSelection, setFallbackSelection] = useState<string | null>(
    centerOnProp !== "all" ? centerOnProp : null,
  );
  const [fitTrigger, setFitTrigger] = useState(0);
  const [tilesUnavailable, setTilesUnavailable] = useState(false);
  const markerRefs = useRef<Record<string, L.Marker>>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const contextKey = location.key;
  const currentContext = useRef(contextKey);
  currentContext.current = contextKey;
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const cabinets = useMemo(() => read.status === "ready" ? read.cabinets : [], [read]);
  const excludedCount = read.status === "ready" ? read.excludedCount : 0;
  const requestedSlug = searchParams.get("cabinet") ?? fallbackSelection;
  const selectedCabinet = cabinets.find((c) => c.slug === requestedSlug);
  const selected = selectedCabinet?.slug ?? null;
  const cityFilter = selectedCabinet && filterView.slug !== selectedCabinet.slug
    ? metroOf(selectedCabinet.city) : filterView.filter;
  const sidebarVisible = showSidebar || tilesUnavailable;

  const loadCabinets = useCallback(async () => {
    const current = ++generation.current;
    setRead({ status: "loading" });
    setTilesUnavailable(false);
    markerRefs.current = {};
    try {
      const result = await readGeolocatedCabinets(() => generation.current === current);
      if (result && generation.current === current) setRead({ status: "ready", generation: current, ...result });
    } catch {
      if (generation.current === current) setRead({ status: "error" });
    }
  }, []);

  const cancelRead = useCallback(() => { generation.current++; }, []);
  useEffect(() => {
    void loadCabinets();
    return cancelRead;
  }, [loadCabinets, cancelRead]);

  // La lecture ne capture pas la recherche : l'URL courante choisit toujours
  // dans le reçu entier courant, même si elle change pendant la réception.
  useEffect(() => {
    if (!fallbackSelection || !selectedCabinet || searchParams.has("cabinet")) return;
    const next = new URLSearchParams(searchParams);
    next.set("cabinet", selectedCabinet.slug);
    setSearchParams(next, { replace: true });
    setFallbackSelection(null);
  }, [fallbackSelection, selectedCabinet, searchParams, setSearchParams]);

  // Metro counts
  const metros = useMemo(() => {
    const map = new Map<string, number>();
    cabinets.forEach((c) => {
      const m = metroOf(c.city);
      map.set(m, (map.get(m) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [cabinets]);

  // Filtered cabinets
  const filtered = useMemo(() => {
    if (cityFilter === "all") return cabinets;
    return cabinets.filter((c) => metroOf(c.city) === cityFilter);
  }, [cabinets, cityFilter]);

  const isActive = (status: string) => status === "en_exploitation";

  // Open popup after flyTo finishes
  useEffect(() => {
    if (!selected) return;
    const timer = setTimeout(() => {
      const m = markerRefs.current[selected];
      if (m) m.openPopup();
    }, prefersReducedMotion() ? 50 : 950);
    return () => clearTimeout(timer);
  }, [selected]);

  const updateSelection = useCallback((slug: string | null) => {
    if (read.status !== "ready" || read.generation !== generation.current || currentContext.current !== contextKey) return;
    if (slug && !cabinets.some((c) => c.slug === slug)) return;
    setFallbackSelection(null);
    const next = new URLSearchParams(searchParams);
    if (slug) next.set("cabinet", slug);
    else next.delete("cabinet");
    setSearchParams(next, { replace: true });
  }, [read, cabinets, searchParams, setSearchParams, contextKey]);

  const handleSelectSlug = useCallback((slug: string) => {
    if (read.status !== "ready" || read.generation !== generation.current || currentContext.current !== contextKey) return;
    setFilterView({ slug, filter: cityFilter });
    updateSelection(slug);
  }, [read, contextKey, cityFilter, updateSelection]);

  const handleFilterChange = useCallback((city: CityFilter) => {
    if (read.status !== "ready" || read.generation !== generation.current || currentContext.current !== contextKey) return;
    setFilterView({ slug: null, filter: city });
    updateSelection(null);
    setFitTrigger((t) => t + 1);
  }, [read, updateSelection, contextKey]);

  const handleRecenter = useCallback(() => {
    if (read.status !== "ready" || read.generation !== generation.current || currentContext.current !== contextKey) return;
    setFilterView({ slug: null, filter: cityFilter });
    updateSelection(null);
    setFitTrigger((t) => t + 1);
  }, [read, updateSelection, contextKey, cityFilter]);

  // Default visual height
  const mapHeight = height ?? "min(70vh, 520px)";

  // Memoize map element so it doesn't fully remount when sidebar selection changes
  const mapElement = useMemo(() => {
    if (filtered.length === 0) return null;
    const initial: [number, number] = [filtered[0].lat, filtered[0].lng];
    return (
      <MapContainer
        center={initial}
        zoom={12}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
        aria-label={lang === "fr" ? "Carte des cabinets I‑CA.RE" : "I‑CA.RE office map"}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="i-care-tiles"
          eventHandlers={{ tileerror: () => setTilesUnavailable(true) }}
        />
        <MapController cabinets={filtered} selected={selected} fitTrigger={fitTrigger} />
        {filtered.map((c) => {
          const active = isActive(c.status);
          const highlighted = selected === c.slug;
          const icon = active
            ? highlighted
              ? ICON_ACTIVE_HL
              : ICON_ACTIVE
            : highlighted
              ? ICON_WORK_HL
              : ICON_WORK;
          const mapsUrl = active ? googleMapsPlaceUrl(c.name, c.googlePlaceId) : null;
          const quarter = quarterLabel(c.dateOuvertureCible, "Q");
          const forecast = lang === "fr" ? openingForecastLabel(c.dateOuvertureCible)
            : quarter ? `Expected opening ${quarter}` : "Opening upcoming";
          return (
            <Marker
              key={c.slug}
              position={[c.lat, c.lng]}
              icon={icon}
              eventHandlers={{
                click: () => handleSelectSlug(c.slug),
              }}
              ref={(ref) => {
                if (ref) markerRefs.current[c.slug] = ref;
                else delete markerRefs.current[c.slug];
              }}
              alt={`Cabinet I-CA.RE ${c.name}, ${c.address}`}
            >
              <Popup>
                <div style={{ minWidth: 220, fontFamily: "Inter, system-ui, sans-serif" }}>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 18,
                      color: ANTHRACITE,
                      margin: 0,
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    {c.name}
                  </h3>
                  {!active && (
                    <div style={{ marginBottom: 8 }}>
                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor: GOLD_PALE,
                          color: ANTHRACITE,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "4px 10px",
                          borderRadius: 3,
                          marginBottom: 4,
                        }}
                      >
                        {lang === "fr" ? "En travaux" : "Under construction"}
                      </span>
                      <div
                        style={{
                          fontSize: 12,
                          color: ANTHRACITE,
                          fontWeight: 600,
                          marginTop: 4,
                        }}
                      >
                        {forecast}
                      </div>
                    </div>
                  )}
                  <p
                    style={{
                      fontSize: 13,
                      color: "#555",
                      margin: 0,
                      marginBottom: 10,
                      lineHeight: 1.4,
                    }}
                  >
                    {c.address}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <Link
                      to={lang === "fr" ? `/projets/${c.slug}` : `/en/projects/${c.slug}`}
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
                      {lang === "fr" ? "Voir le cabinet" : "View office"}
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
                        {lang === "fr" ? "Ouvrir dans Google Maps" : "Open in Google Maps"}
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
  }, [filtered, selected, fitTrigger, lang, handleSelectSlug]);

  const projectsHref = lang === "fr" ? "/projets" : "/en/projects";
  if (read.status !== "ready") {
    return (
      <div
        role={read.status === "error" ? "alert" : "status"}
        className="flex flex-col items-center justify-center gap-3 bg-muted/30 rounded-md p-6 text-center"
        style={read.status === "loading" ? { height: mapHeight } : undefined}
      >
        <p className="text-sm text-muted-foreground">
          {read.status === "loading"
            ? lang === "fr" ? "Chargement des cabinets…" : "Loading offices…"
            : lang === "fr"
              ? "La liste complète des cabinets n'a pas pu être reçue."
              : "The complete office list could not be received."}
        </p>
        {read.status === "error" && (
          <button type="button" onClick={() => void loadCabinets()} className="min-h-11 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-[#9EB8A5]/40 rounded">
            {lang === "fr" ? "Réessayer" : "Try again"}
          </button>
        )}
        <Link to={projectsHref} className="min-h-11 inline-flex items-center text-sm font-medium underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-[#9EB8A5]/40 rounded">
          {lang === "fr" ? "Voir tous les cabinets" : "See all offices"}
        </Link>
      </div>
    );
  }

  if (cabinets.length === 0) {
    // Si des lignes ont été reçues mais toutes écartées (coordonnées
    // invalides), ne pas affirmer qu'aucun cabinet n'existe : orienter
    // vers la liste complète plutôt que de fermer la porte.
    const allExcluded = excludedCount > 0;
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-center bg-muted/30 rounded-md p-6">
        <p className="text-sm text-muted-foreground">
          {allExcluded
            ? lang === "fr"
              ? "La carte ne peut pas afficher nos cabinets pour le moment."
              : "The map cannot display our offices right now."
            : lang === "fr"
              ? "Aucun cabinet géolocalisé."
              : "No geolocated office."}
        </p>
        <Link
          to={projectsHref}
          className="text-sm font-medium underline underline-offset-2 text-primary focus:outline-none focus:ring-2 focus:ring-[#9EB8A5]/40 rounded"
        >
          {lang === "fr" ? "Voir tous les cabinets" : "See all offices"}
        </Link>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${sidebarVisible ? "lg:grid-cols-3" : ""} gap-6`}>
      {/* Carte */}
      <div className={sidebarVisible ? "lg:col-span-2" : ""}>
        {tilesUnavailable && (
          <p role="status" className="text-sm text-muted-foreground mb-3">
            {lang === "fr"
              ? "Certaines tuiles de la carte n’ont pas pu être chargées. La liste des cabinets reste disponible."
              : "Some map tiles could not be loaded. The office list remains available."}
          </p>
        )}
        {excludedCount > 0 && (
          <p className="text-xs text-muted-foreground mb-2">
            {lang === "fr"
              ? "Certains cabinets ne sont pas affichés sur la carte."
              : "Some offices are not shown on the map."}{" "}
            <Link
              to={projectsHref}
              className="underline underline-offset-2 hover:text-foreground"
            >
              {lang === "fr" ? "Voir la liste complète" : "See the full list"}
            </Link>
          </p>
        )}
        <MapErrorBoundary lang={lang}>
          <div
            className="relative rounded-md overflow-hidden border border-border"
            style={{ height: mapHeight }}
          >
            {mapElement}
            {/* Bouton recentrer */}
            <button
              type="button"
              onClick={handleRecenter}
              aria-label={lang === "fr" ? "Recentrer sur tous les cabinets" : "Recenter on all offices"}
              title={lang === "fr" ? "Recentrer sur tous les cabinets" : "Recenter on all offices"}
              className="absolute top-3 right-3 z-[400] bg-white hover:bg-[#F6F5F0] border border-[#9EB8A5]/40 rounded-md w-10 h-10 flex items-center justify-center shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#9EB8A5]"
              style={{ color: ANTHRACITE }}
            >
              <Crosshair size={18} strokeWidth={2} />
            </button>
          </div>
        </MapErrorBoundary>
      </div>

      {/* Sidebar */}
      {sidebarVisible && (
        <aside className="lg:col-span-1 flex flex-col" style={{ maxHeight: mapHeight }}>
          <h2 className="font-heading text-xl text-foreground mb-3">{lang === "fr" ? "Nos cabinets" : "Our offices"}</h2>

          {/* Filtres ville */}
          <div
            role="radiogroup"
            aria-label={lang === "fr" ? "Filtrer les cabinets par métropole" : "Filter offices by metropolitan area"}
            className="flex flex-wrap gap-2 mb-4"
          >
            <FilterPill
              label={`${lang === "fr" ? "Toutes" : "All"} (${cabinets.length})`}
              active={cityFilter === "all"}
              onClick={() => handleFilterChange("all")}
            />
            {metros.map(([metro, count]) => (
              <FilterPill
                key={metro}
                label={`${metro} (${count})`}
                active={cityFilter === metro}
                onClick={() => handleFilterChange(metro)}
              />
            ))}
          </div>

          <ul className="space-y-2 list-none p-0 m-0 overflow-y-auto pr-1 flex-1 min-h-0">
            {filtered.map((c) => {
              const active = isActive(c.status);
              const isSelected = selected === c.slug;
              return (
                <li key={c.slug}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelectSlug(c.slug)}
                    className="w-full text-left p-3 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-[#9EB8A5]/40"
                    style={{
                      border: isSelected
                        ? `2px solid ${SAGE}`
                        : `1px solid hsl(var(--border))`,
                      backgroundColor: isSelected ? SAGE_LIGHT : "transparent",
                      padding: isSelected ? "11px" : "12px",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-heading text-[18px] text-foreground leading-tight">
                          {marqueAffichee(c.name)}
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
                        {lang === "fr" ? active ? "Actif" : "En travaux" : active ? "Active" : "Under construction"}
                      </span>
                    </div>
                    <Link
                      to={lang === "fr" ? `/projets/${c.slug}` : `/en/projects/${c.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block mt-2 text-xs font-medium text-primary hover:underline"
                    >
                      {lang === "fr" ? "Voir le cabinet →" : "View office →"}
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

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className="transition-all focus:outline-none focus:ring-2 focus:ring-[#9EB8A5]/40"
      style={{
        fontSize: 13,
        fontFamily: "Inter, sans-serif",
        padding: "6px 14px",
        borderRadius: 999,
        border: active ? `1px solid ${SAGE}` : `1px solid #D8D8D8`,
        backgroundColor: active ? SAGE : CREAM,
        color: active ? CREAM : ANTHRACITE,
        cursor: "pointer",
        whiteSpace: "nowrap",
        fontWeight: active ? 600 : 500,
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = SAGE;
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = "#D8D8D8";
      }}
    >
      {label}
    </button>
  );
}

export default CarteCabinets;
