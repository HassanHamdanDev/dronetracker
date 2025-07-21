import { DroneFeature, DroneTrack } from "@/types/drone";
import { Popup } from "react-map-gl";
import { formatFlightTime, formatAltitude, isValidCoordinate } from "@/utils/droneUtils";

export default function DronePopup({
    drone,
    track,
    onClose,
}: {
    drone: DroneFeature;
    track?: DroneTrack;
    onClose: () => void;
}) {
    const coords = drone.geometry.coordinates;
    if (!isValidCoordinate(coords)) return null;

    return (
        <Popup
            longitude={coords[0]}
            latitude={coords[1]}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            offset={[0, -8]}
            className="z-50"
            onClose={onClose}
            focusAfterOpen={false}
        >
            <div className="bg-[#18191A] text-white rounded-lg px-4 py-2 shadow-lg min-w-[130px] text-center border border-[#242526]">
                <div className="font-bold text-base">{drone.properties.Name}</div>
                <div className="text-xs mt-1 text-[#B0B3B8]">
                    Altitude <span className="font-semibold">{formatAltitude(drone.properties.altitude)}</span>
                </div>
                <div className="text-xs text-[#B0B3B8]">
                    Flight Time{" "}
                    <span className="font-semibold">
                        {track ? formatFlightTime(track.startTime) : "00:00:00"}
                    </span>
                </div>
            </div>
        </Popup>
    );
}