export interface DroneProperties {
    serial: string;
    registration: string;
    Name: string;
    altitude: number;
    pilot: string;
    organization: string;
    yaw: number;
    lastSeen?: number;  
}

export interface DroneGeometry {
    type: "Point";
    coordinates: [number, number];
}

export interface DroneFeature {
    type: "Feature";
    properties: DroneProperties;
    geometry: DroneGeometry;
}

export interface DronesGeoJSON {
    type: "FeatureCollection";
    features: DroneFeature[];
}

export interface DroneTrack {
    positions: [number, number][];
    startTime: number;
}