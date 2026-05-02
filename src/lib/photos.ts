/**
 * Zenith Discovery Engine — TripAdvisor
 * Hybrid architecture combining hardcoded "Goated" precision 
 * with infinite Unsplash discovery logic.
 */

// 1. Curated "Goated" IDs (High-fidelity Unsplash mappings)
const PHOTO_MAP: Record<string, string> = {
  "japan": "1493976040374-85c8e12f0c0e",
  "iceland": "1476610182048-b716b8518aae",
  "india": "1524492412937-b28074a5d7da",
  "switzerland": "1534073828943-f801091bb18c",
  "thailand": "1528181304800-2f190854b963",
  "indonesia": "1537996194471-e657df975ab4",
  "vietnam": "1528127269322-539c6d941fd7",
  "sri-lanka": "1546708929-7e372d58793e",
  "nepal": "1544735711-b457e5e3474d",
  "kyoto": "1493976040374-85c8e12f0c0e",
  "tokyo": "1540962323411-76a1628d601a",
  "zermatt": "1534073828943-f801091bb18c",
  "junagadh": "1597659840241-1f95106a446a",
  "girnar": "1597659840241-1f95106a446a",
};

// 2. Precision Keywords for tricky locations
const KEYWORD_MAP: Record<string, string> = {
  "Shanti Stupa": "leh shanti stupa architecture",
  "Pangong Tso": "pangong lake ladakh",
  "Khardung La": "khardung la pass snow",
  "Nubra Valley": "nubra valley camels desert",
  "Uparkot": "uparkot fort junagadh caves",
  "Mahabat Maqbara": "mahabat maqbara architecture",
};

// 3. Orbital Coordinates
const COORDINATES: Record<string, string> = {
  "Junagadh": "70.4579,21.5222",
  "Girnar": "70.5284,21.5273",
  "Kyoto": "135.7681,35.0116",
  "Bali": "115.1889,-8.4095",
  "Tokyo": "139.6503,35.6762",
};

export type PhotoProvider = 'lorem' | 'unsplash' | 'picsum' | 'art' | 'wiki' | 'satellite';

export function getPhotoUrl(query: string, width: number = 800, height: number = 600, provider: PhotoProvider = 'unsplash') {
  const cleanQuery = query.replace(/[^\w\s]/gi, '').toLowerCase();
  const slug = cleanQuery.split(' ')[0];
  
  // Deterministic seed with query-based salting
  const salt = "tripadvisor-zenith-2026";
  const seedStr = `${cleanQuery}-${salt}-${width}x${height}`;
  const seed = seedStr.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);

  // Orbital Handling
  if (provider === 'satellite') {
    const coords = COORDINATES[query] || "70.4579,21.5222";
    const [lon, lat] = coords.split(',').map(Number);
    return `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&z=13&l=sat&size=${width},${height}`;
  }

  // Goated Precision Check
  const mappedId = PHOTO_MAP[slug] || PHOTO_MAP[cleanQuery];
  if (mappedId && provider === 'unsplash') {
    return `https://images.unsplash.com/photo-${mappedId}?q=80&w=${width}&h=${height}&auto=format&fit=crop`;
  }

  // Smart Discovery Keywords
  const keywords = ["landscape", "architecture", "culture", "nature", "city", "vibe"];
  const finalQuery = KEYWORD_MAP[query] || `${query} ${keywords[seed % keywords.length]}`;

  // Infinite Unsplash Source Redirect (Variety Engine)
  if (provider === 'unsplash') {
    // We use a specific variety lock to ensure Japan != Taiwan
    return `https://source.unsplash.com/featured/${width}x${height}/?${encodeURIComponent(finalQuery)}&sig=${seed}`;
  }

  if (provider === 'picsum') {
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
  }

  // Fallback: LoremFlickr with strict locking
  return `https://loremflickr.com/${width}/${height}/${encodeURIComponent(finalQuery)}/all?lock=${seed}`;
}

export const getPhotoPulse = (place: string, count: number = 8, provider: PhotoProvider = 'unsplash') => {
  const modifiers = [
    "view", "detail", "architecture", "street", 
    "landscape", "lifestyle", "mood", "candid",
    "aerial", "interior", "texture", "culture"
  ];

  return Array.from({ length: count }).map((_, i) => {
    const mod = modifiers[i % modifiers.length];
    return getPhotoUrl(`${place} ${mod}`, 800, 800, provider);
  });
}
