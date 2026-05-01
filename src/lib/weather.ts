export type MonthlyWeather = {
  tempHigh: number;
  tempLow: number;
  rainDays: number;
  condition: "sunny" | "rainy" | "snowy" | "cloudy" | "humid";
};

export const WEATHER_DATA: Record<string, MonthlyWeather[]> = {
  "japan": [
    { tempHigh: 10, tempLow: 2, rainDays: 5, condition: "sunny" },
    { tempHigh: 11, tempLow: 2, rainDays: 6, condition: "sunny" },
    { tempHigh: 14, tempLow: 5, rainDays: 10, condition: "sunny" },
    { tempHigh: 19, tempLow: 10, rainDays: 10, condition: "sunny" },
    { tempHigh: 23, tempLow: 15, rainDays: 10, condition: "cloudy" },
    { tempHigh: 26, tempLow: 19, rainDays: 12, condition: "humid" },
    { tempHigh: 30, tempLow: 23, rainDays: 10, condition: "humid" },
    { tempHigh: 31, tempLow: 24, rainDays: 8, condition: "sunny" },
    { tempHigh: 27, tempLow: 20, rainDays: 11, condition: "rainy" },
    { tempHigh: 22, tempLow: 14, rainDays: 9, condition: "sunny" },
    { tempHigh: 17, tempLow: 9, rainDays: 6, condition: "sunny" },
    { tempHigh: 12, tempLow: 4, rainDays: 4, condition: "sunny" }
  ],
  "switzerland": [
    { tempHigh: 3, tempLow: -3, rainDays: 10, condition: "snowy" },
    { tempHigh: 5, tempLow: -2, rainDays: 9, condition: "snowy" },
    { tempHigh: 10, tempLow: 1, rainDays: 11, condition: "cloudy" },
    { tempHigh: 15, tempLow: 4, rainDays: 12, condition: "rainy" },
    { tempHigh: 19, tempLow: 9, rainDays: 13, condition: "rainy" },
    { tempHigh: 23, tempLow: 12, rainDays: 11, condition: "sunny" },
    { tempHigh: 25, tempLow: 14, rainDays: 10, condition: "sunny" },
    { tempHigh: 24, tempLow: 14, rainDays: 10, condition: "sunny" },
    { tempHigh: 20, tempLow: 10, rainDays: 9, condition: "cloudy" },
    { tempHigh: 14, tempLow: 6, rainDays: 10, condition: "cloudy" },
    { tempHigh: 8, tempLow: 1, rainDays: 10, condition: "cloudy" },
    { tempHigh: 4, tempLow: -2, rainDays: 11, condition: "snowy" }
  ],
  "srinagar-india": [
    { tempHigh: 7, tempLow: -2, rainDays: 8, condition: "snowy" },
    { tempHigh: 9, tempLow: 0, rainDays: 9, condition: "snowy" },
    { tempHigh: 16, tempLow: 4, rainDays: 11, condition: "rainy" },
    { tempHigh: 21, tempLow: 8, rainDays: 10, condition: "sunny" },
    { tempHigh: 26, tempLow: 12, rainDays: 8, condition: "sunny" },
    { tempHigh: 30, tempLow: 16, rainDays: 6, condition: "sunny" },
    { tempHigh: 31, tempLow: 19, rainDays: 9, condition: "humid" },
    { tempHigh: 30, tempLow: 18, rainDays: 8, condition: "sunny" },
    { tempHigh: 28, tempLow: 13, rainDays: 4, condition: "sunny" },
    { tempHigh: 23, tempLow: 6, rainDays: 3, condition: "sunny" },
    { tempHigh: 16, tempLow: 1, rainDays: 4, condition: "sunny" },
    { tempHigh: 9, tempLow: -1, rainDays: 5, condition: "cloudy" }
  ]
};

export function getWeather(slug: string, month: number): MonthlyWeather {
  const data = WEATHER_DATA[slug] || generateMockWeather(slug);
  return data[month - 1];
}

function generateMockWeather(slug: string): MonthlyWeather[] {
  // Simple heuristic-based weather generation
  return Array.from({ length: 12 }, (_, i) => ({
    tempHigh: 20 + Math.sin((i - 6) / 3) * 10,
    tempLow: 10 + Math.sin((i - 6) / 3) * 10,
    rainDays: Math.floor(Math.random() * 15),
    condition: i > 4 && i < 8 ? "sunny" : "cloudy"
  }));
}
