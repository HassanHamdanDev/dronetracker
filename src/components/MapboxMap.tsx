"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Source, Layer, Marker, MapRef, NavigationControl } from "react-map-gl";
import { useRef, useEffect, useMemo, useState } from "react";
import { useDronesStore } from "@/store/drones";
import { getDroneStatus, isValidCoordinate } from "@/utils/droneUtils";
import DronePopup from "@/components/DronePopup";
import Image from "next/image";
import droneIcon from "@/assets/Icon/drone.svg";
import { useUIStore } from "@/store/ui";
import MapErrorBoundary from "./MapErrorBoundary";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

const INITIAL_VIEW = {
    longitude: 35.93131881204147,
    latitude: 31.94878648036645,
    zoom: 12,
};

export default function MapboxMap() {
    const mapRef = useRef<MapRef>(null);
    const { activePanel } = useUIStore();
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (activePanel === "map" && mapRef.current) {
            setTimeout(() => mapRef.current?.resize(), 0);
        }
    }, [activePanel]);

    const { drones, tracks, selectedDroneSerial, hoveredDroneSerial, selectDrone, hoverDrone } = useDronesStore();

    // Center on selected drone
    useEffect(() => {
        if (!selectedDroneSerial || !drones[selectedDroneSerial]) return;
        const coords = drones[selectedDroneSerial].geometry.coordinates;

        if (isValidCoordinate(coords)) {
            mapRef.current?.flyTo({
                center: coords,
                zoom: 15,
                speed: 1.3,
                curve: 1,
                essential: true,
            });
        }
    }, [selectedDroneSerial, drones]);

    // Path layers for all drones
    const pathGeoJSONs = useMemo(() => {
        return Object.entries(tracks)
            .filter(([serial]) => {
                const drone = drones[serial];
                return drone && isValidCoordinate(drone.geometry.coordinates);
            })
            .map(([serial, track]) => {
                const color = getDroneStatus(drones[serial].properties.registration) === "allowed"
                    ? "#30E130"
                    : "#FF3A3A";
                return {
                    id: `track-${serial}`,
                    data: {
                        type: "Feature",
                        geometry: {
                            type: "LineString",
                            coordinates: track.positions,
                        },
                    },
                    color,
                };
            });
    }, [tracks, drones]);

    // Markers for all drones
    const markers = useMemo(() => {
        return Object.values(drones)
            .filter(drone => isValidCoordinate(drone.geometry.coordinates))
            .map((drone) => {
                const coords = drone.geometry.coordinates;
                const status = getDroneStatus(drone.properties.registration);

                return (
                    <Marker
                        key={drone.properties.serial}
                        longitude={coords[0]}
                        latitude={coords[1]}
                        anchor="center"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            selectDrone(drone.properties.serial);
                        }}
                    >
                        <button
                            className={`group rounded-full p-0 border-2 ${status === "allowed"
                                ? "border-[#3CE13C] bg-[#222327]"
                                : "border-[#FF3A3A] bg-[#222327]"
                                } ${hoveredDroneSerial === drone.properties.serial
                                    ? "ring-[3px] ring-[#fff] ring-opacity-60"
                                    : ""
                                }`}
                            title={drone.properties.Name}
                            onMouseEnter={() => hoverDrone(drone.properties.serial)}
                            onMouseLeave={() => hoverDrone(null)}
                            aria-label={`Drone: ${drone.properties.Name}`}
                        >
                            <span
                                style={{
                                    display: "inline-block",
                                    transform: `rotate(${drone.properties.yaw}deg)`,
                                }}
                            >
                                <div
                                    className={`pointer-events-none relative w-10 h-10 flex-shrink-0 ${status === "allowed" ? "bg-[#3CE13C]" : "bg-[#FF3A3A]"
                                        } rounded-full flex items-center justify-center`}
                                >
                                    <Image
                                        src={droneIcon}
                                        alt="Drone"
                                        width={44}
                                        height={44}
                                        className="w-11 h-auto"
                                        draggable={false}
                                        priority
                                    />
                                </div>
                            </span>
                        </button>
                    </Marker>
                );
            });
    }, [drones, hoveredDroneSerial, selectDrone, hoverDrone]);

    // Popup for hovered or selected drone
    const popupSerial = hoveredDroneSerial || selectedDroneSerial;
    const popupDrone = popupSerial && drones[popupSerial] &&
        isValidCoordinate(drones[popupSerial].geometry.coordinates)
        ? drones[popupSerial]
        : null;

    return (
        <MapErrorBoundary>
            <Map
                ref={mapRef}
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={INITIAL_VIEW}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                attributionControl={false}
                style={{ width: "100%", height: "100%" }}
                onClick={() => selectDrone(null)}
                dragRotate
                cooperativeGestures
                onLoad={() => setMapLoaded(true)}
                reuseMaps
                optimizeForTerrain
            >
                {mapLoaded && (
                    <>
                        <NavigationControl position="top-right" showCompass={false} />
                        {pathGeoJSONs.map(({ id, data, color }) => (
                            <Source key={id} id={id} type="geojson" data={data}>
                                <Layer
                                    id={`${id}-layer`}
                                    type="line"
                                    paint={{
                                        "line-color": color,
                                        "line-width": 3.5,
                                        "line-opacity": 0.9,
                                    }}
                                />
                            </Source>
                        ))}
                        {markers}
                        {popupDrone && (
                            <DronePopup
                                drone={popupDrone}
                                track={tracks[popupDrone.properties.serial]}
                                onClose={() => hoverDrone(null)}
                            />
                        )}
                    </>
                )}
            </Map>
        </MapErrorBoundary>
    );
}