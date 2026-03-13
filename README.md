# 360° Room Viewer

A street-view style interactive 360° room viewer built with **React + Vite + TypeScript + Three.js**.

Navigate between rooms, click Points of Interest, and explore spaces in full panoramic view.

---

## ✨ Features

- 🌐 **360° Panoramic View** — Drag to look around in any direction
- 🔵 **Navigation Hotspots** — Click glowing blue rings to teleport to another room
- 🟡 **Points of Interest (POI)** — Click yellow dots or the bottom bar to see info
- 🏠 **Room Selector Menu** — Switch rooms from the top-right dropdown
- 📱 **Touch Support** — Works on mobile with touch drag
- 🎬 **Fade Transitions** — Smooth black fade when switching rooms
- 🧭 **Tooltips** — Hover any hotspot or POI to see its label

---

## 📁 Project Structure

```
room-viewer-360/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx          # React entry point
    ├── index.css         # Global styles + Google Font import
    ├── types.ts          # TypeScript interfaces
    ├── roomsData.ts      # 🔧 YOUR ROOM CONFIG — edit this!
    ├── App.tsx           # Root layout, HUD, room selector
    ├── Viewer360.tsx     # Core Three.js 360° renderer
    └── POIPanel.tsx      # POI button strip + detail card
```

---

## 🚀 Getting Started

### 1. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 2. Build for Production

```bash
npm run build
npm run preview
```

---

## 🗺️ Adding Your Own Rooms

Edit **`src/roomsData.ts`**. Each room needs:

```ts
{
  id: "my-room",           // Unique ID (used for hotspot targeting)
  name: "My Room",         // Display name
  imageUrl: "/rooms/my-room.jpg",  // Path to equirectangular image
  initialLon: 0,           // Starting horizontal angle (degrees)
  initialLat: 0,           // Starting vertical angle (degrees)
  hotspots: [...],         // Navigation points → other rooms
  pois: [...],             // Points of Interest
}
```

### Adding a Hotspot (Navigation)

Hotspots are **blue rings** that take you to another room when clicked.

```ts
hotspots: [
  {
    id: "hs-to-kitchen",
    targetRoomId: "kitchen",  // Must match another room's `id`
    lon: 45,                  // Horizontal position in the panorama
    lat: -15,                 // Vertical position (negative = slightly downward)
  }
]
```

### Adding a POI (Point of Interest)

POIs are **yellow dots** with an info card.

```ts
pois: [
  {
    id: "poi-couch",
    label: "Designer Sofa",
    description: "Italian leather, seats 4",
    lon: 20,
    lat: 5,
    icon: "🛋️",  // Emoji shown in the button and card
  }
]
```

---

## 📐 Understanding Longitude & Latitude

The 360° sphere uses spherical coordinates:

```
         lat = 90° (up)
              |
lon = -180° --+-- lon = 0° (forward) --+-- lon = 180°
              |
         lat = -90° (down)
```

| Direction | lon  | lat |
|-----------|------|-----|
| Straight ahead | 0° | 0° |
| To the right   | 90° | 0° |
| Behind you     | 180° / -180° | 0° |
| To the left    | -90° | 0° |
| Slightly down  | any | -15° |
| Slightly up    | any | 15° |

**Tip**: Run the app, look around until you see where you want to place a hotspot, then estimate the lon/lat values and adjust until it lines up.

---

## 🖼️ Image Requirements

Your 360° images must be **equirectangular panoramas**:

- **Aspect ratio**: 2:1 (e.g. 4096×2048, 8192×4096)
- **Format**: JPG or PNG
- **Where to get them**:
  - Shoot with a 360° camera (Insta360, Ricoh Theta, GoPro MAX)
  - Download free HDRIs from [Polyhaven](https://polyhaven.com/hdris) → convert to JPG
  - [Flickr Equirectangular Group](https://www.flickr.com/groups/equirectangular/)
  - Stitch from drone/DSLR photos with PTGui or Hugin

Place images in **`public/rooms/`** and reference them as `/rooms/my-room.jpg`.

---

## 🎨 Customization

### Change HUD Colors

In `App.tsx`, look for the inline styles. The primary accent color is:
- **Cyan** `#00e5ff` — navigation / UI accent
- **Amber** `#ffb300` — POI color

### Hotspot Style

In `Viewer360.tsx`, the `THREE.RingGeometry` section controls the blue navigation rings. Change the color via `new THREE.MeshBasicMaterial({ color: 0x00e5ff })`.

### POI Dot Style

Also in `Viewer360.tsx`, look for the `CircleGeometry` section. Change `color: 0xffb300` for a different POI color.

### Drag Sensitivity

In `Viewer360.tsx`:
```ts
// Mouse drag sensitivity
lonRef.current -= dx * 0.15;  // ← increase for faster, decrease for slower
latRef.current += dy * 0.15;

// Touch drag sensitivity
lonRef.current -= dx * 0.2;
```

---

## 🔧 Component API

### `<Viewer360 />`

| Prop | Type | Description |
|------|------|-------------|
| `room` | `Room` | The current room to display |
| `rooms` | `Room[]` | All rooms (used to resolve hotspot labels) |
| `onNavigate` | `(roomId: string) => void` | Called when user clicks a hotspot |

### `<POIPanel />`

| Prop | Type | Description |
|------|------|-------------|
| `room` | `Room` | Current room (reads its `pois` array) |

---

## 🧩 Extending the Project

### Add a Minimap

Render a top-down floor plan SVG in a corner and highlight the current room.

### Add Animated Transitions

Instead of a black fade, you could blur + zoom out on leave and zoom in on enter using CSS keyframes on the mount div.

### Add Audio per Room

Use the `Howler.js` library. Load a room's ambient sound in `useEffect` when the room changes:
```ts
import { Howl } from "howler";
useEffect(() => {
  const sound = new Howl({ src: [room.audioUrl], loop: true, volume: 0.3 });
  sound.play();
  return () => sound.stop();
}, [room.id]);
```

### Add Info Overlay per Room

Add a `description` field to the `Room` type and render it in a side panel or modal.

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18 | UI framework |
| `react-dom` | ^18 | DOM rendering |
| `three` | ^0.168 | 3D / WebGL rendering |
| `vite` | ^5 | Dev server & bundler |
| `typescript` | ^5 | Type safety |
| `@types/three` | ^0.168 | Three.js types |

---

## 🐛 Troubleshooting

**Black screen?**
- Check browser console for image load errors
- Ensure the `imageUrl` path is correct and accessible
- Try using an absolute URL to a hosted image first

**Hotspots not visible?**
- Make sure `lon` and `lat` values point toward visible parts of the panorama
- Check the room's `initialLon/Lat` to see where the camera starts

**Jittery dragging on mobile?**
- Add `touch-action: none` CSS to the mount div in `Viewer360.tsx`

---

## 📄 License

MIT — free to use and modify.
