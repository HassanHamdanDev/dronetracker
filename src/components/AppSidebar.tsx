/* eslint-disable @typescript-eslint/no-explicit-any */
import dashboardIcon from "../assets/Icon/dashboard-svgrepo-com-2.svg";
import mapIcon from "../assets/Icon/location-svgrepo-com-2.svg";
import Image from "next/image";
import { useUIStore } from "@/store/ui";

/**
 * Sidebar for navigation (Dashboard, Map), with highlight.
 */
export default function AppSidebar() {
    const { activePanel, setActivePanel } = useUIStore();

    return (
        <aside className="w-48 bg-[#18191A] border-r border-[#242526] flex flex-col py-4">
            <div className="h-16" />
            <SidebarButton
                active={activePanel === "dashboard"}
                icon={dashboardIcon}
                label="DASHBOARD"
                onClick={() => setActivePanel("dashboard")}
            />
            <SidebarButton
                active={activePanel === "map"}
                icon={mapIcon}
                label="MAP"
                onClick={() => setActivePanel("map")}
            />
        </aside>
    );
}

function SidebarButton({
    active,
    icon,
    label,
    onClick,
}: {
    active: boolean;
    icon: any;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            className={`flex items-center gap-3 px-6 py-3 text-lg font-semibold ${active
                    ? "bg-[#222327] border-l-4 border-[#FF3A3A] text-white"
                    : "text-[#B0B3B8] hover:bg-[#222327]"
                }`}
            onClick={onClick}
        >
            <Image src={icon} alt={label} width={24} height={24} />
            {label}
        </button>
    );
}