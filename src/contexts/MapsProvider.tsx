"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const MapsContext = createContext<google.maps.Map | null>(null);

export function MapsProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    });
    loader.load().then(() => {
      const mapInstance = new google.maps.Map(document.createElement("div"));
      setMap(mapInstance);
    });
  }, []);

  return <MapsContext.Provider value={map}>{children}</MapsContext.Provider>;
}

export const useMap = () => useContext(MapsContext);
