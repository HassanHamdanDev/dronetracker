"use client";
import { useMemo } from "react";
import { useDronesStore } from "@/store/drones";
import { useUIStore } from "@/store/ui";
import DroneItem from "./DroneItem";

export default function DroneListPanel() {
    const { drones, tracks, selectedDroneSerial, selectDrone, hoveredDroneSerial, hoverDrone } = useDronesStore();
    const { sidebarOpen } = useUIStore();

    const droneList = useMemo(
        () =>
            Object.values(drones).sort((a, b) =>
                a.properties.registration.localeCompare(b.properties.registration)
            ),
        [drones]
    );

    return (
        <aside
            className={`w-[370px] max-w-full bg-[#242526] border-r border-[#323436] flex flex-col overflow-y-auto min-h-0 transition-all duration-200 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'
                }`}
            style={{ zIndex: 20 }}
        >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#323436]">
                <div>
                    <div className="font-bold text-lg tracking-wide">DRONE FLYING</div>
                    <div className="text-xs mt-1 font-medium text-[#B0B3B8]">
                        {droneList.length} active drones
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 px-2 py-2">
                {droneList.map((drone) => {
                    const track = tracks[drone.properties.serial];
                    return (
                        <DroneItem
                            key={drone.properties.serial}
                            drone={drone}
                            track={track}
                            selected={drone.properties.serial === selectedDroneSerial}
                            hovered={drone.properties.serial === hoveredDroneSerial}
                            onClick={() => selectDrone(drone.properties.serial)}
                            onHover={() => hoverDrone(drone.properties.serial)}
                            onLeave={() => hoverDrone(null)}
                        />
                    );
                })}
                {droneList.length === 0 && (
                    <div className="text-center text-[#B0B3B8] py-12">
                        No drones detected. Waiting for data...
                    </div>
                )}
            </div>
        </aside>
    );
}