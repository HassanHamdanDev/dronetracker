import { useDronesStore } from "@/store/drones";
import { getDroneStatus } from "@/utils/droneUtils";
import { useMemo } from "react";

/**
 * Bottom-right floating counter, shows number of red (not allowed) drones.
 */
export default function DroneCounter() {
    const drones = useDronesStore(state => state.drones);

    const stats = useMemo(() => {
        const total = Object.keys(drones).length;
        const allowed = Object.values(drones).filter(
            drone => getDroneStatus(drone.properties.registration) === 'allowed'
        ).length;

        return {
            total,
            allowed,
            notAllowed: total - allowed,
            avgAltitude: total > 0
                ? Object.values(drones).reduce((sum, drone) => sum + drone.properties.altitude, 0) / total
                : 0
        };
    }, [drones]);

    return (
        <div className="fixed bottom-5 right-7 z-50 bg-white text-black rounded-xl flex items-center shadow-xl px-5 py-2 text-sm font-semibold border border-[#242526]">
            <span>
                <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#FF3A3A] text-white mr-2 font-bold">
                    {stats.allowed}
                </span>
                Drone Flying
            </span>
        </div>
    );
}