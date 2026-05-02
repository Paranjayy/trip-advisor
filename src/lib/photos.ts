/**
 * High-fidelity Unsplash mapping for 'Goated' destinations.
 * Using specific IDs ensures consistent, premium aesthetics.
 */
export const PHOTO_MAP: Record<string, string> = {
  // Countries
  "japan": "1493976040374-85c8e12f0c0e",
  "iceland": "1476610182048-b716b8518aae",
  "india": "1524492412937-b28074a5d7da",
  "switzerland": "1534073828943-f801091bb18c",
  "thailand": "1528181304800-2f190854b963",
  "indonesia": "1537996194471-e657df975ab4",
  "vietnam": "1528127269322-539c6d941fd7",
  "malaysia": "1555400038-63f5ba517a47",
  "sri-lanka": "1546708929-7e372d58793e",
  "nepal": "1544735711-b457e5e3474d",
  
  // Specific Cities/Regions
  "tokyo": "1540962323411-76a1628d601a",
  "kyoto": "1493976040374-85c8e12f0c0e",
  "osaka": "1590559063931-d138af24e12e",
  "reykjavik": "1504123001308-2086307127e9",
  "srinagar": "1597816073103-6a978641951f",
  "leth": "1595237395844-3309e6046e7a",
  "ladakh": "1595237395844-3309e6046e7a",
  "gulmarg": "1597816073103-6a978641951f",
  "udaipur": "1597659840241-1f95106a446a",
  "jaipur": "1524222717473-730000406903",
  "zermatt": "1534073828943-f801091bb18c",
  "bangkok": "1508933566362-eb352e88a10d",
  "phuket": "1589394815824-d2b16503c872",
  "ubud": "1537996194471-e657df975ab4",
};

/**
 * Generates a high-quality Unsplash URL for a given place or keyword.
 * Uses the mapping if available, otherwise falls back to a search query.
 */
export function getPhotoUrl(place: string, width: number = 1200, height: number = 800): string {
  const slug = place.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const photoId = PHOTO_MAP[slug];

  if (photoId) {
    return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&q=80`;
  }

  // Fallback: Use LoremFlickr or similar for dynamic keyword search if ID not mapped
  // Note: Unsplash Source is deprecated, so we use a curated fallback image or search param
  return `https://loremflickr.com/${width}/${height}/${encodeURIComponent(place)}/all`;
}
