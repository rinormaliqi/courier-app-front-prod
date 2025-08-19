"use client";

import { useRef } from "react";
import Script from "next/script";

export default function KosovoMapPage() {
  const KOSOVO_BOUNDS = {
    north: 43.3,
    south: 41.8,
    west: 20.0,
    east: 21.9,
  } as const;
  const KOSOVO_CENTER = { lat: 42.6026, lng: 20.903 } as const;

  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const initMap = () => {
    // Wait until the next frame so the div has layout
    requestAnimationFrame(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!mapDivRef.current || !(window as any).google?.maps) return;

      const map = new google.maps.Map(mapDivRef.current, {
        center: KOSOVO_CENTER,
        zoom: 8,
        gestureHandling: "greedy",
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        mapTypeControl: true,
        restriction: {
          latLngBounds: KOSOVO_BOUNDS,
          strictBounds: false,
        },
      });

      mapRef.current = map;
    });
  };

  const recenter = () => {
    if (!mapRef.current) return;
    mapRef.current.fitBounds({
      north: KOSOVO_BOUNDS.north,
      south: KOSOVO_BOUNDS.south,
      east: KOSOVO_BOUNDS.east,
      west: KOSOVO_BOUNDS.west,
    });
  };

  return (
    <div className="h-[calc(100vh-200px)] w-full relative rounded-lg overflow-hidden">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=weekly`}
        strategy="afterInteractive"
        onLoad={initMap}
      />

      <div ref={mapDivRef} className="absolute inset-0" />

      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={recenter}
          className="px-4 py-2 rounded-lg bg-white shadow hover:shadow-lg text-sm font-medium"
        >
          Center Kosovo
        </button>
      </div>
    </div>
  );
}
