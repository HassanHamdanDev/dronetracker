import { create } from "zustand";
import { DronesGeoJSON, DroneFeature, DroneTrack } from "@/types/drone";

interface DronesState {
    drones: Record<string, DroneFeature>;
    tracks: Record<string, DroneTrack>;
    selectedDroneSerial: string | null;
    hoveredDroneSerial: string | null;
    setDrones: (geojson: DronesGeoJSON) => void;
    selectDrone: (serial: string | null) => void;
    hoverDrone: (serial: string | null) => void;
    clear: () => void;
    clearTracks: () => void;
}

// Minimum distance in degrees to consider as movement
const MOVEMENT_THRESHOLD = 0.0005; // ~50 meters

export const useDronesStore = create<DronesState>((set, get) => {
    // Cleanup interval for inactive drones
    if (typeof window !== "undefined") {
        setInterval(() => {
            const now = Date.now();
            set((state) => {
                const drones = { ...state.drones };
                const tracks = { ...state.tracks };
                let changed = false;

                Object.entries(drones).forEach(([serial, drone]) => {
                    if (drone.properties.lastSeen && now - drone.properties.lastSeen > 10000) {
                        delete drones[serial];
                        delete tracks[serial];
                        changed = true;
                    }
                });

                return changed ? { drones, tracks } : state;
            });
        }, 10000);
    }

    return {
        drones: {},
        tracks: {},
        selectedDroneSerial: null,
        hoveredDroneSerial: null,
        setDrones: (geojson) => {
            const now = Date.now();
            set((state) => {
                const nextDrones: Record<string, DroneFeature> = { ...state.drones };
                const nextTracks: Record<string, DroneTrack> = { ...state.tracks };
                let updated = false;

                for (const feature of geojson.features) {
                    const serial = feature.properties.serial;
                    const existing = nextDrones[serial];
                    
                    // Create updated feature with lastSeen property
                    const updatedFeature: DroneFeature = {
                        ...feature,
                        properties: {
                            ...feature.properties,
                            lastSeen: now
                        }
                    };

                    nextDrones[serial] = updatedFeature;

                    // Initialize track if not exists
                    if (!nextTracks[serial]) {
                        nextTracks[serial] = {
                            positions: [feature.geometry.coordinates],
                            startTime: now
                        };
                        updated = true;
                    } else {
                        const lastCoord = nextTracks[serial].positions.at(-1);
                        const newCoord = feature.geometry.coordinates;

                        // Calculate distance between points
                        const distance = lastCoord 
                            ? Math.sqrt(
                                Math.pow(newCoord[0] - lastCoord[0], 2) + 
                                Math.pow(newCoord[1] - lastCoord[1], 2)
                            )
                            : Infinity;

                        // Only update position if significant movement detected
                        if (!lastCoord || distance > MOVEMENT_THRESHOLD) {
                            nextTracks[serial].positions.push(newCoord);
                            
                            // Limit track length to 100 points
                            if (nextTracks[serial].positions.length > 100) {
                                nextTracks[serial].positions.shift();
                            }
                            
                            updated = true;
                        }
                    }
                }

                return updated ? { drones: nextDrones, tracks: nextTracks } : state;
            });
        },
        selectDrone: (serial) => set({ selectedDroneSerial: serial }),
        hoverDrone: (serial) => set({ hoveredDroneSerial: serial }),
        clear: () => set({ 
            drones: {}, 
            tracks: {}, 
            selectedDroneSerial: null, 
            hoveredDroneSerial: null 
        }),
        clearTracks: () => set((state) => {
            const nextTracks: Record<string, DroneTrack> = {};
            Object.keys(state.tracks).forEach(serial => {
                if (state.drones[serial]) {
                    // Keep current position only
                    nextTracks[serial] = {
                        positions: [state.drones[serial].geometry.coordinates],
                        startTime: Date.now()
                    };
                }
            });
            return { tracks: nextTracks };
        }),
    };
});