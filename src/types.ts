export interface HotspotData {
  id: string;
  targetRoomId: string;
  /** Longitude in degrees (-180 to 180) */
  lon: number;
  /** Latitude in degrees (-85 to 85) */
  lat: number;
   /** Position on floor plan image, 0–1 normalized */
  mapX?: number;
  mapY?: number;
}

export interface POIData {
  id: string;
  label: string;
  description?: string;
  lon: number;
  lat: number;
  icon?: string; // emoji or label
  /** Position on floor plan image, 0–1 normalized */
  mapX?: number;
  mapY?: number;
}

export interface Room {
  id: string;
  name: string;
  /** URL or local path to a 360° equirectangular image */
  imageUrl: string;
  hotspots: HotspotData[];
  pois: POIData[];
  /** Starting longitude when entering this room */
  initialLon?: number;
  /** Starting latitude when entering this room */
  initialLat?: number;
  /** Center of this room on the floor plan image, 0–1 normalized */
  mapX?: number;
  mapY?: number;
}