import type { Room } from "./types";
import pool from "/rooms/Pool_Indoor.jpg";

/**
 * Sample room data.
 * Replace imageUrl values with your own equirectangular 360° images.
 * You can use free samples from:
 *   - https://polyhaven.com/hdris  (HDRIs — convert to JPG panorama)
 *   - https://www.flickr.com/groups/equirectangular/
 *   - Or drop your own images in /public/rooms/
 *
 * Hotspot & POI coordinates:
 *   lon: horizontal angle in degrees. 0 = center, -180/180 = behind you.
 *   lat: vertical angle. 0 = horizon, 90 = straight up, -90 = straight down.
 */
export const ROOMS: Room[] = [
  {
    id: "living-room",
    name: "Living Room",
    // Using a freely available equirectangular sample image 
    // imageUrl: "/images/Living-Room.jpg",
    imageUrl: "https://live.staticflickr.com/65535/55145298413_d47b6c84a9_6k.jpg",
    initialLon: 0,
    initialLat: 0,
    hotspots: [
      {
        id: "hs-to-kitchen",
        targetRoomId: "kitchen",
        lon: 45,
        lat: -15,
      },
      {
        id: "hs-to-bedroom",
        targetRoomId: "bedroom",
        lon: -90,
        lat: -10,
      },
    ],
    pois: [
      {
        id: "poi-sofa",
        label: "Modern Sofa",
        description: "Italian leather sofa, seats 4",
        lon: 20,
        lat: 5,
        icon: "🛋️",
      },
      {
        id: "poi-tv",
        label: "Smart TV",
        description: '75" 4K OLED Display',
        lon: -30,
        lat: 2,
        icon: "📺",
      },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    imageUrl: pool,
    initialLon: 180,
    initialLat: 0,
    hotspots: [
      {
        id: "hs-back-to-living",
        targetRoomId: "living-room",
        lon: 0,
        lat: -10,
      },
    ],
    pois: [
      {
        id: "poi-island",
        label: "Kitchen Island",
        description: "Marble countertop with under-cabinet storage",
        lon: 60,
        lat: -5,
        icon: "🍳",
      },
      {
        id: "poi-fridge",
        label: "Refrigerator",
        description: "Smart fridge with inventory tracking",
        lon: -60,
        lat: 0,
        icon: "🧊",
      },
    ],
  },
  {
    id: "bedroom",
    name: "Bedroom",
    imageUrl: "/rooms/Bedroom.jpg",
    initialLon: -45,
    initialLat: 0,
    hotspots: [
      {
        id: "hs-back-to-living2",
        targetRoomId: "living-room",
        lon: 120,
        lat: -15,
      },
    ],
    pois: [
      {
        id: "poi-bed",
        label: "King Bed",
        description: "Memory foam mattress with adjustable base",
        lon: 0,
        lat: 0,
        icon: "🛏️",
      },
      {
        id: "poi-window",
        label: "Bay Window",
        description: "Floor-to-ceiling panoramic view",
        lon: -120,
        lat: 5,
        icon: "🪟",
      },
    ],
  },
];
