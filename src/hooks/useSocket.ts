import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { DronesGeoJSON } from "@/types/drone";
import { useDronesStore } from "@/store/drones";

const SOCKET_IO_URL = process.env.NEXT_PUBLIC_SOCKET_IO_URL || "http://localhost:9013";

export function useSocket() {
    const socketRef = useRef<Socket | null>(null);
    const setDrones = useDronesStore(state => state.setDrones);
    const lastUpdate = useRef<number>(0);
    const UPDATE_INTERVAL = 2000; // Update every 2 seconds

    useEffect(() => {
        if (typeof window === "undefined") return;

        const socket = io(SOCKET_IO_URL, {
            transports: ["polling"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        const messageHandler = (data: DronesGeoJSON) => {
            const now = Date.now();
            // Throttle updates to reduce frequency
            if (now - lastUpdate.current > UPDATE_INTERVAL) {
                setDrones(data);
                lastUpdate.current = now;
            }
        };

        socket.on("message", messageHandler);

        return () => {
            socket.off("message", messageHandler);
            socket.disconnect();
        };
    }, [setDrones]);

    return socketRef.current;
}