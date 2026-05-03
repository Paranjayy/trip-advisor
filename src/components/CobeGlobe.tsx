import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import { COUNTRIES } from "@/data/countries";

export function CobeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [{ phi, theta }, setRot] = useState({ phi: 0, theta: 0 });

  useEffect(() => {
    let currentPhi = phi;
    let currentTheta = theta;
    const width = canvasRef.current?.offsetWidth || 1000;
    
    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1], // Primary color
      glowColor: [1, 1, 1],
      markers: COUNTRIES.map(c => ({
         location: [c.lat, c.lng],
         size: 0.03 + (Math.sqrt(c.touristCount) / 4000) // Much smaller markers
      })),
      onRender: (state) => {
        if (!pointerInteracting.current) {
          currentPhi += 0.003;
        }
        state.phi = currentPhi + pointerInteractionMovement.current;
        state.theta = currentTheta;
        state.width = width * 2;
        state.height = width * 2;
      }
    });

    return () => globe.destroy();
  }, []);

  return (
    <div className="w-full aspect-square md:aspect-[16/9] relative flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[800px] max-h-[800px] object-contain opacity-90 transition-opacity duration-1000"
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 200;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 100;
          }
        }}
      />
    </div>
  );
}
