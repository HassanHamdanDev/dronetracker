"use client";
import { useDronesStore } from "@/store/drones";
import { getDroneStatus } from "@/utils/droneUtils";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Dashboard() {
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
        <div className="w-full bg-[#121212] p-2 m-2">
            <h2 className="text-2xl font-bold mb-2">Drone Operations Dashboard 🎉</h2>
            <div className="flex  items-center justify-center  w-full bg-black">
                <div className="text-lg text-[#B0B3B8] flex  items-center justify-center  w-full p-4">
                    Try clicking the MAP tab to see live drone tracking!
                    <span className=" animate-bounce text-6xl">🛸</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#242526] p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Total Drones</h3>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </div>

                <div className="bg-[#242526] p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Authorized</h3>
                    <p className="text-3xl font-bold text-[#30E130]">{stats.allowed}</p>
                </div>

                <div className="bg-[#242526] p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Unauthorized</h3>
                    <p className="text-3xl font-bold text-[#FF3A3A]">{stats.notAllowed}</p>
                </div>
            </div>

            <div className="bg-[#242526] p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Altitude Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={Object.values(drones)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#323436" />
                            <XAxis dataKey="properties.altitude" name="Altitude" unit="m" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="properties.altitude" fill="#4287f5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}