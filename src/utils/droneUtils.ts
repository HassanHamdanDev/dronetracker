export const getDroneStatus = (registration: string) => {
    // Check if there's a hyphen and if the part after it starts with 'B'
    const parts = registration.split('-');
    if (parts.length > 1) {
        return parts[1].startsWith('B') ? 'allowed' : 'not allowed';
    }
    // Fallback to original check if no hyphen
    return registration.startsWith('B') ? 'allowed' : 'not allowed';
};

export const formatFlightTime = (startTime: number | undefined) => {
    if (!startTime) return '00:00:00';
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatAltitude = (altitude: number) => {
    return `${altitude} m`;
};

export const isValidCoordinate = (coords: [number, number]) => {
    return (
        Math.abs(coords[0]) <= 180 &&
        Math.abs(coords[1]) <= 90
    );
};