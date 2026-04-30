/**
 * Build a universal Google Maps URL pointing to a specific place.
 *
 * Uses the documented "Maps URLs" format (Search action) which is the only
 * format that works reliably in BOTH the Google Maps web app AND the native
 * iOS/Android Maps apps. The legacy `/maps/place/?q=place_id:...` format
 * still resolves on desktop web but fails on mobile ("Aucun résultat trouvé"
 * / "No results found").
 *
 * Format:
 *   https://www.google.com/maps/search/?api=1
 *     &query={NAME_URL_ENCODED}
 *     &query_place_id={PLACE_ID}
 *
 * The `query` parameter is REQUIRED for Google to honour `query_place_id`.
 *
 * @see https://developers.google.com/maps/documentation/urls/get-started#search-action
 *
 * @param name    Human-readable place name (e.g. "I-CA.RE Pey-Berland",
 *                "Loubna Lamri Sophrologue Bordeaux"). Used as the visible
 *                fallback query if the Place ID can't be resolved client-side.
 * @param placeId Google Place ID (format `ChIJ…`). When falsy, the function
 *                returns `null` so callers can hide the link entirely
 *                ("no ghost button leading nowhere").
 * @returns A fully-qualified Google Maps URL, or `null` if `placeId` is empty.
 */
export function googleMapsPlaceUrl(
  name: string,
  placeId: string | null | undefined,
): string | null {
  if (!placeId || !placeId.trim()) return null;
  const safeName = (name && name.trim()) || placeId.trim();
  const params = new URLSearchParams({
    api: "1",
    query: safeName,
    query_place_id: placeId.trim(),
  });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}
