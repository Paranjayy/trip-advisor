/**
 * A sophisticated photo discovery engine for TripAdvisor.
 * Aggregates high-fidelity imagery from curated providers.
 */

// Manual mapping for tricky locations to ensure "goated" visual accuracy
const PHOTO_MAPPING: Record<string, string> = {
  "Shanti Stupa": "leh shanti stupa architecture",
  "Pangong Tso": "pangong lake ladakh",
  "Khardung La": "khardung la pass snow",
  "Nubra Valley": "nubra valley camels desert",
  "Kinkaku-ji": "golden pavilion kyoto",
  "Shibuya Crossing": "shibuya crossing neon",
  "Akihabara": "akihabara electronics neon",
  "Tsukiji": "tsukiji fish market sushi",
  "Jungfraujoch": "jungfraujoch top of europe",
  "Lauterbrunnen": "lauterbrunnen valley waterfalls",
  "Lake Brienz": "lake brienz turquoise water",
};

export const getPhotoUrl = (query: string, width: number = 800, height: number = 600) => {
  // Check mapping first for precision
  const preciseQuery = PHOTO_MAPPING[query] || query;
  
  // Clean the query (remove special chars, etc.)
  const cleanQuery = preciseQuery.replace(/[^\w\s]/gi, '');

  const seed = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const keywords = ["travel", "cinematic", "architecture", "landscape", "adventure"];
  const subQuery = keywords[seed % keywords.length];
  
  // Using Source Unsplash with refined query and signature
  return `https://source.unsplash.com/featured/${width}x${height}/?${encodeURIComponent(cleanQuery)},${subQuery},travel&sig=${seed}`;
};

/**
 * Returns a collection of diverse photos for a given place
 */
export const getPhotoPulse = (place: string, count: number = 5) => {
  return Array.from({ length: count }).map((_, i) => {
    return getPhotoUrl(`${place} detail ${i}`, 800, 800);
  });
};
