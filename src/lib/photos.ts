/**
 * Zenith Absolute Discovery Engine — TripAdvisor
 * Purged of unreliable providers. Powered by Absolute Unsplash Mapping.
 */

// 1. Massive "Goated" Mapping (Curated Unsplash IDs)
const PHOTO_MAP: Record<string, string> = {
  // Countries
  "japan": "1493976040374-85c8e12f0c0e",
  "iceland": "1476610182048-b716b8518aae",
  "india": "1524492412937-b28074a5d7da",
  "switzerland": "1534073828943-f801091bb18c",
  "thailand": "1528181304800-2f190854b963",
  "indonesia": "1537996194471-e657df975ab4",
  "vietnam": "1528127269322-539c6d941fd7",
  "taiwan": "1504109586057-7a2ae83d1338",
  "malaysia": "1555400038-63f5ba517a47",
  "sri-lanka": "1546708929-7e372d58793e",
  "nepal": "1544735711-b457e5e3474d",
  "dubai": "1512453973963-7840387ca056",
  "france": "1502600148151-7b7ad1086321",
  "italy": "1523906834658-6e24ef23a3f9",
  "greece": "1506744038136-46273834b3fb",

  // Specific Regional Nodes
  "tokyo": "1540962323411-76a1628d601a",
  "kyoto": "1493976040374-85c8e12f0c0e",
  "srinagar": "1597816073103-6a978641951f",
  "leh": "1595237395844-3309e6046e7a",
  "hampi": "1598103593060-6466f272a0f8",
  "junagadh": "1597659840241-1f95106a446a",
  "girnar": "1597659840241-1f95106a446a",
  "uparkot": "1597659840241-1f95106a446a",
  "mahabat-maqbara": "1597659840241-1f95106a446a",
};

export type PhotoProvider = 'unsplash' | 'picsum' | 'satellite';

export function getPhotoUrl(query: string, width: number = 800, height: number = 600, provider: PhotoProvider = 'unsplash') {
  const cleanQuery = query.replace(/[^\w\s]/gi, '').toLowerCase();
  const slug = cleanQuery.split(' ')[0];
  
  // Deterministic seed with query-based salting
  const salt = "tripadvisor-perfecto-2026";
  const seedStr = `${cleanQuery}-${salt}-${width}x${height}`;
  const seed = seedStr.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);

  // Satellite Restoration
  if (provider === 'satellite') {
    const coords = query.includes(',') ? query : "70.4579,21.5222";
    const [lon, lat] = coords.split(',').map(Number);
    return `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&z=13&l=sat&size=${width},${height}`;
  }

  // 1. Try Absolute Mapping
  const mappedId = PHOTO_MAP[slug] || PHOTO_MAP[cleanQuery];
  if (mappedId) {
    return `https://images.unsplash.com/photo-${mappedId}?q=80&w=${width}&h=${height}&auto=format&fit=crop`;
  }

  // 2. High-Fidelity Generative Fallback (Infinite Variety Engine)
  // Replaces dead Unsplash Source with a synchronous, high-res AI generation API.
  // This ensures perfect visual resolution for ANY global search (e.g. 'Chicago', 'Varanasi').
  const keywords = ["cinematic travel photography", "high resolution", "beautiful lighting"];
  const finalQuery = `${query} ${keywords.join(', ')}`;
  
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(finalQuery)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
}

export const getPhotoPulse = (place: string, count: number = 8) => {
  const modifiers = [
    "view", "street", "landscape", "architecture",
    "culture", "mood", "detail", "aerial",
    "interior", "texture", "lifestyle", "candid"
  ];

  return Array.from({ length: count }).map((_, i) => {
    const mod = modifiers[i % modifiers.length];
    return getPhotoUrl(`${place} ${mod}`, 800, 800);
  });
}
