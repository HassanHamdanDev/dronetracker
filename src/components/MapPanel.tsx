"use client";
import dynamic from "next/dynamic";
import DroneListPanel from "./DroneListPanel";
import DroneCounter from "./DroneCounter";

// Use dynamic import for Mapbox to avoid SSR hydration errors.
const MapboxMap = dynamic(() => import("./MapboxMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-[#121212]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    )
});

/**
 * MapPanel renders the map and drone list side by side.
 */
export default function MapPanel() {
    return (
        <div className="relative w-full h-full flex">
            <DroneListPanel />
            <div className="flex-1 relative h-full">
                <MapboxMap />
                <DroneCounter />
            </div>
        </div>
    );
}