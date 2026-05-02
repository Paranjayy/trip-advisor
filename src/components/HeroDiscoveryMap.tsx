import React from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { COUNTRIES } from "@/data/countries";
import { Flag } from "@/components/Flag";
import { useTheme } from "@/lib/theme";
import { getVisaStatus, getVisaLabel, getVisaTone } from "@/lib/passport";
import { useUserSettings } from "@/lib/user-settings";

export function HeroDiscoveryMap() {
  const { theme } = useTheme();
  const { citizenship } = useUserSettings();
  const tileUrl = theme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="h-full w-full relative group">
      <MapContainer
        center={[20, 20]}
        zoom={2}
        minZoom={2}
        maxZoom={4}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}
        dragging={true}
        style={{ height: "100%", width: "100%", background: "#0a0a0c" }}
      >
        <TileLayer url={tileUrl} />
        {COUNTRIES.map((c) => {
          const visa = getVisaStatus(c.slug, citizenship);
          return (
            <CircleMarker
              key={c.slug}
              center={[c.lat, c.lng]}
              radius={4}
              pathOptions={{
                color: "hsl(var(--primary))",
                fillColor: "hsl(var(--primary))",
                fillOpacity: 0.6,
                weight: 1,
              }}
            >
              <Tooltip direction="top" offset={[0, -5]} opacity={1}>
                 <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5 font-bold text-[8px]">
                       <Flag emoji={c.flag} size={10} /> {c.name}
                    </span>
                    <span className={`text-[6px] font-black uppercase px-1 py-0.5 rounded border self-start ${getVisaTone(visa)}`}>
                       {getVisaLabel(visa)}
                    </span>
                 </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/40 via-transparent to-transparent pointer-events-none" />
      
      <div className="absolute bottom-6 left-6 z-[1000]">
         <div className="glass-card px-3 py-1.5 flex items-center gap-3 animate-float border-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Discovery Engine</span>
         </div>
      </div>
    </div>
  );
}
