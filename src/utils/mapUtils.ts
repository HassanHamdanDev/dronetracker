/**
 * Utility for Mapbox related conversions.
 */

/**
 * Returns an SVG marker string for a drone, colored and rotated by yaw.
 */
export function getDroneSVG(status: "allowed" | "not_allowed", yaw: number): string {
    // Color and icon SVG inline for performance
    const color = status === "allowed" ? "#30E130" : "#FF3A3A";
    return `
    <svg width="40" height="40" viewBox="0 0 40 40" style="transform: rotate(${yaw}deg);" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="${color}" stroke="#fff" stroke-width="3"/>
      <path d="M15 20h10M20 15v10" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
      <g>
        <circle cx="12" cy="12" r="2" fill="#fff"/><circle cx="28" cy="12" r="2" fill="#fff"/>
        <circle cx="12" cy="28" r="2" fill="#fff"/><circle cx="28" cy="28" r="2" fill="#fff"/>
      </g>
    </svg>
  `;
}