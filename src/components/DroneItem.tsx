import { DroneFeature, DroneTrack } from "@/types/drone";
import { formatFlightTime, getDroneStatus } from "@/utils/droneUtils";
import Image from "next/image";
import droneIcon from "@/assets/Icon/drone.svg";

export default function DroneItem({
    drone,
    track,
    selected,
    hovered,
    onClick,
    onHover,
    onLeave,
}: {
    drone: DroneFeature;
    selected: boolean;
    track?: DroneTrack;
    hovered: boolean;
    onClick: () => void;
    onHover: () => void;
    onLeave: () => void;
}) {
    const status = getDroneStatus(drone.properties.registration);

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${selected
                    ? "bg-[#222327] border-l-4 border-[#FF3A3A]"
                    : "hover:bg-[#232324]"
                } ${hovered ? "ring-2 ring-[#fff] ring-opacity-30" : ""
                }`}
            onClick={onClick}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            tabIndex={0}
            role="button"
            aria-label={`Select drone ${drone.properties.Name}`}
        >
            <div
                className={`pointer-events-none relative w-10 h-10 flex-shrink-0 ${status === "allowed" ? "bg-[#3CE13C]" : "bg-[#FF3A3A]"
                    } rounded-full flex items-center justify-center`}
            >
                <Image
                    src={droneIcon}
                    alt="Drone Icon"
                    width={40}
                    height={40}
                    draggable={false}
                    priority
                />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <div className="font-semibold text-base truncate">{drone.properties.Name}</div>
                <div className="flex items-center text-xs text-[#B0B3B8]">
                    <span>Serial #</span>
                    <span className="font-mono ml-1">{drone.properties.serial}</span>
                </div>
                <div className="flex items-center text-xs text-[#B0B3B8]">
                    <span>Registration #</span>
                    <span className="ml-1">{drone.properties.registration}</span>
                    <span className="ml-2 flex items-center">
                        <span
                            className={`inline-block w-3 h-3 rounded-full ml-1 ${status === "allowed" ? "bg-[#30E130]" : "bg-[#FF3A3A]"
                                }`}
                        />
                    </span>
                </div>
                <div className="flex flex-row text-xs text-[#B0B3B8] mt-1">
                    <span>Pilot {drone.properties.pilot}</span>
                    <span className="ml-3">Organization {drone.properties.organization}</span>
                </div>
                {track && (
                    <div className="text-xs text-[#B0B3B8]">
                        Flight Time: {formatFlightTime(track.startTime)}
                    </div>
                )}
            </div>
        </div>
    );
}