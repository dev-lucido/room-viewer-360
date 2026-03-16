import type { Room } from "./types";
import living from "/rooms/Living_Room.jpg";
import bedroom from "/rooms/Bedroom.jpg";
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
    imageUrl: living,
    initialLon: 0,
    initialLat: 0,
    hotspots: [
      {
        id: "hs-to-pool",
        targetRoomId: "pool",
        lon: -14,
        lat: 0,
      },
      {
        id: "hs-to-bedroom",
        targetRoomId: "bedroom",
        lon: -20,
        lat: -10,
      },
    ],
    pois: [
      {
        id: "poi-sofa",
        label: "Modern Sofa",
        description: "Italian leather sofa, seats 4",
        lon: 0,
        lat: -15,
        icon: "🛋️",
      },
      {
        id: "poi-kitchen",
        label: "Kitchen",
        description: "Marble countertop with under-cabinet storage",
        lon: -90,
        lat: -5,
        icon: "🍳",
      },
      {
        id: "poi-fridge",
        label: "Refrigerator",
        description: "Smart fridge with inventory tracking",
        lon: -50,
        lat: -15,
        icon: "🧊",
      },
    ],
  },
  {
    id: "bedroom",
    name: "Bedroom",
    imageUrl: bedroom,
    initialLon: 180,
    initialLat: 0,
    hotspots: [
      {
        id: "hs-back-to-living",
        targetRoomId: "living-room",
        lon: -90,
        lat: -10,
      },
      {
        id: "hs-to-pool",
        targetRoomId: "pool",
        lon: 87,
        lat: -5,
      },
    ],
    pois: [
      
      {
        id: "poi-bed",
        label: "King Bed",
        description: "Memory foam mattress with adjustable base",
        lon: 185,
        lat: -20,
        icon: "🛏️",
      },
      {
        id: "poi-tv",
        label: "Smart TV",
        description: '75" 4K OLED Display',
        lon: 15,
        lat: 2,
        icon: "📺",
      },
    ],
  },
  {
    id: "pool",
    name: "Indoor Pool",
    imageUrl: pool,
    initialLon: 175,
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
        id: "poi-window",
        label: "Bay Window",
        description: "Floor-to-ceiling panoramic view",
        lon: 0,
        lat: 5,
        icon: "🪟",
      },
    ],
  },
];
