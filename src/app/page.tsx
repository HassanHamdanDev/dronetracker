"use client";
import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useDronesStore } from "@/store/drones";
import { useUIStore } from "@/store/ui";
import AppHeader from "@/components/AppHeader";
import AppSidebar from "@/components/AppSidebar";
import DashboardPanel from "@/components/DashboardPanel";
import MapPanel from "@/components/MapPanel";

export default function HomePage() {
  const activePanel = useUIStore((s) => s.activePanel);

  const socket = useSocket();

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <div className="flex flex-col h-full min-h-screen bg-black">
      <AppHeader />
      <div className="flex flex-1 min-h-0">
        <AppSidebar />
        <main className="flex-1 relative overflow-hidden">
          {activePanel === "dashboard" ? <DashboardPanel /> : <MapPanel />}
        </main>
      </div>
    </div>
  );
}