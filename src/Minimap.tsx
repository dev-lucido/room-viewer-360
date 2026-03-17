// import { useEffect, useRef } from "react";
// import type { Room } from "./types";

// interface Props {
//   viewerRef: React.RefObject<MinimapHandle | null>;
//   room: Room;
//   rooms: Room[];
//   currentRoomId: string;
//   onNavigate: (roomId: string) => void;
// }

// const ROOM_POSITIONS: Record<string, { x: number; y: number }> = {
//   "living-room": { x: 0.5, y: 0.6 },
//   "bedroom":     { x: 0.25, y: 0.3 },
//   "pool":        { x: 0.75, y: 0.25 },
// };

// const ROOM_COLORS: Record<string, string> = {
//   "living-room": "#00e5ff",
//   "bedroom":     "#b388ff",
//   "pool":        "#69f0ae",
// };

// const ROOM_ICONS: Record<string, string> = {
//   "living-room": "🛋",
//   "bedroom":     "🛏",
//   "pool":        "🏊",
// };

// const FOV_DEG = 75; // matches camera FOV in Viewer360

// export interface MinimapHandle {
//   getLon: () => number;
// }

// export default function Minimap({ viewerRef, room, rooms, currentRoomId, onNavigate }: Props) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const frameRef = useRef<number>(0);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const SIZE = canvas.width; // square canvas
//     const CX = SIZE / 2;
//     const CY = SIZE / 2;
//     const R = SIZE / 2 - 6; // outer radius

//     const draw = () => {
//       frameRef.current = requestAnimationFrame(draw);
//       const ctx = canvas.getContext("2d");
//       if (!ctx) return;

//       ctx.clearRect(0, 0, SIZE, SIZE);

//       // ── Background circle ────────────────────────────────────────────────
//       ctx.save();
//       ctx.beginPath();
//       ctx.arc(CX, CY, R, 0, Math.PI * 2);
//       ctx.fillStyle = "rgba(8, 8, 18, 0.88)";
//       ctx.fill();
//       ctx.strokeStyle = "rgba(255,255,255,0.12)";
//       ctx.lineWidth = 1.5;
//       ctx.stroke();
//       ctx.restore();

//       // Clip all subsequent drawing to the circle
//       ctx.save();
//       ctx.beginPath();
//       ctx.arc(CX, CY, R, 0, Math.PI * 2);
//       ctx.clip();

//       // ── Subtle grid ──────────────────────────────────────────────────────
//       ctx.strokeStyle = "rgba(255,255,255,0.04)";
//       ctx.lineWidth = 1;
//       for (let i = 1; i < 4; i++) {
//         const r2 = (R / 4) * i;
//         ctx.beginPath();
//         ctx.arc(CX, CY, r2, 0, Math.PI * 2);
//         ctx.stroke();
//       }
//       // crosshairs
//       ctx.beginPath();
//       ctx.moveTo(CX - R, CY); ctx.lineTo(CX + R, CY);
//       ctx.moveTo(CX, CY - R); ctx.lineTo(CX, CY + R);
//       ctx.stroke();

//       // ── Connection lines between rooms that share hotspots ───────────────
//       rooms.forEach((r) => {
//         const posA = ROOM_POSITIONS[r.id];
//         if (!posA) return;
//         const ax = CX + (posA.x - 0.5) * (R * 1.6);
//         const ay = CY + (posA.y - 0.5) * (R * 1.6);

//         r.hotspots.forEach((hs) => {
//           const posB = ROOM_POSITIONS[hs.targetRoomId];
//           if (!posB) return;
//           const bx = CX + (posB.x - 0.5) * (R * 1.6);
//           const by = CY + (posB.y - 0.5) * (R * 1.6);
//           ctx.beginPath();
//           ctx.moveTo(ax, ay);
//           ctx.lineTo(bx, by);
//           ctx.strokeStyle = "rgba(255,255,255,0.07)";
//           ctx.lineWidth = 1;
//           ctx.setLineDash([3, 5]);
//           ctx.stroke();
//           ctx.setLineDash([]);
//         });
//       });

//       // ── POI dots for current room ────────────────────────────────────────
//       const curPos = ROOM_POSITIONS[currentRoomId] ?? { x: 0.5, y: 0.5 };
//       const curX = CX + (curPos.x - 0.5) * (R * 1.6);
//       const curY = CY + (curPos.y - 0.5) * (R * 1.6);

//       room.pois.forEach((poi) => {
//         // Place POI dots around the current room node based on lon
//         const angleRad = ((poi.lon - 90) * Math.PI) / 180;
//         const dist = 22;
//         const px = curX + Math.cos(angleRad) * dist;
//         const py = curY + Math.sin(angleRad) * dist;
//         ctx.beginPath();
//         ctx.arc(px, py, 3, 0, Math.PI * 2);
//         ctx.fillStyle = "#ffb300";
//         ctx.fill();
//         ctx.strokeStyle = "rgba(255,179,0,0.4)";
//         ctx.lineWidth = 1;
//         ctx.stroke();
//       });

//       // ── Room nodes ───────────────────────────────────────────────────────
//       rooms.forEach((r) => {
//         const pos = ROOM_POSITIONS[r.id] ?? { x: 0.5, y: 0.5 };
//         const nx = CX + (pos.x - 0.5) * (R * 1.6);
//         const ny = CY + (pos.y - 0.5) * (R * 1.6);
//         const isCurrent = r.id === currentRoomId;
//         const color = ROOM_COLORS[r.id] ?? "#ffffff";
//         const nodeR = isCurrent ? 10 : 7;

//         // Glow for current
//         if (isCurrent) {
//           const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, 20);
//           grd.addColorStop(0, color.replace(")", ", 0.35)").replace("rgb", "rgba"));
//           grd.addColorStop(1, "transparent");
//           ctx.beginPath();
//           ctx.arc(nx, ny, 20, 0, Math.PI * 2);
//           ctx.fillStyle = grd;
//           ctx.fill();
//         }

//         ctx.beginPath();
//         ctx.arc(nx, ny, nodeR, 0, Math.PI * 2);
//         ctx.fillStyle = isCurrent ? color : "rgba(20,20,35,0.9)";
//         ctx.fill();
//         ctx.strokeStyle = color;
//         ctx.lineWidth = isCurrent ? 2 : 1.5;
//         ctx.stroke();

//         // Icon
//         ctx.font = `${isCurrent ? 10 : 8}px serif`;
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         ctx.fillText(ROOM_ICONS[r.id] ?? "🚪", nx, ny);

//         // Label
//         ctx.font = `${isCurrent ? "600 9px" : "400 8px"} DM Sans, sans-serif`;
//         ctx.fillStyle = isCurrent ? color : "rgba(255,255,255,0.5)";
//         ctx.fillText(r.name, nx, ny + nodeR + 9);
//       });

//       // ── Vision cone for current room ─────────────────────────────────────
//       const lon = viewerRef.current?.getLon() ?? 0;

//       // In our sphere: lon=0 → forward (+Z in Three.js), increasing lon → rotate left
//       // On the 2D minimap: map lon to canvas angle. lon=0 → up (north), +lon → clockwise
//       const headingRad = ((-lon - 90) * Math.PI) / 180;
//       const halfFov = (FOV_DEG / 2 / 180) * Math.PI;
//       const coneLen = R * 0.55;

//       // Filled cone
//       const grad = ctx.createRadialGradient(curX, curY, 0, curX, curY, coneLen);
//       grad.addColorStop(0, "rgba(0,229,255,0.25)");
//       grad.addColorStop(1, "rgba(0,229,255,0.0)");

//       ctx.beginPath();
//       ctx.moveTo(curX, curY);
//       ctx.arc(curX, curY, coneLen, headingRad - halfFov, headingRad + halfFov);
//       ctx.closePath();
//       ctx.fillStyle = grad;
//       ctx.fill();

//       // Cone outline
//       ctx.beginPath();
//       ctx.moveTo(curX, curY);
//       ctx.arc(curX, curY, coneLen, headingRad - halfFov, headingRad + halfFov);
//       ctx.closePath();
//       ctx.strokeStyle = "rgba(0,229,255,0.55)";
//       ctx.lineWidth = 1;
//       ctx.stroke();

//       // Direction arrow tip
//       const arrowX = curX + Math.cos(headingRad) * (coneLen * 0.72);
//       const arrowY = curY + Math.sin(headingRad) * (coneLen * 0.72);
//       ctx.beginPath();
//       ctx.arc(arrowX, arrowY, 2.5, 0, Math.PI * 2);
//       ctx.fillStyle = "#00e5ff";
//       ctx.fill();

//       ctx.restore(); // end clip

//       // ── Outer ring (drawn outside clip so it looks crisp) ────────────────
//       ctx.beginPath();
//       ctx.arc(CX, CY, R, 0, Math.PI * 2);
//       ctx.strokeStyle = "rgba(0,229,255,0.2)";
//       ctx.lineWidth = 1;
//       ctx.stroke();
//     };

//     frameRef.current = requestAnimationFrame(draw);
//     return () => cancelAnimationFrame(frameRef.current);
//   }, [room, rooms, currentRoomId, viewerRef]);

//   return (
//     <div
//       style={{
//         position: "absolute",
//         bottom: "calc(108px + env(safe-area-inset-bottom, 0px))",
//         left: 16,
//         zIndex: 50,
//         width: 130,
//         height: 130,
//         borderRadius: "50%",
//         overflow: "hidden",
//         boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,229,255,0.15)",
//         // Allow clicking through to room nodes later if you want interactivity
//         pointerEvents: "none",
//       }}
//     >
//       <canvas
//         ref={canvasRef}
//         width={130}
//         height={130}
//         style={{ display: "block" }}
//       />
//     </div>
//   );
// }



















import { useEffect, useRef } from "react";
import type { Room } from "./types";
import { floorPlan } from "./roomsData";

export interface MinimapHandle {
  getLon: () => number;
}

interface Props {
  viewerRef: React.RefObject<MinimapHandle | null>;
  room: Room;
  rooms: Room[];
  currentRoomId: string;
  onNavigate: (roomId: string) => void;
}

const FOV_DEG = 75;
const W = 200;
const H = 200;

const ROOM_COLORS: Record<string, string> = {
  "living-room": "#00e5ff",
  "bedroom":     "#b388ff",
  "pool":        "#69f0ae",
};

export default function Minimap({ viewerRef, room, rooms, currentRoomId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const imgRef    = useRef<HTMLImageElement | null>(null);

  // Preload floor plan image once
  useEffect(() => {
    const img = new Image();
    img.src = floorPlan;
    img.onload = () => { imgRef.current = img; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const toCanvas = (nx: number, ny: number) => ({
      x: nx * W,
      y: ny * H,
    });

    const draw = () => {
      frameRef.current = requestAnimationFrame(draw);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, W, H);

      // ── Rounded-rect clip ────────────────────────────────────────────────
      const radius = 12;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(0, 0, W, H, radius);
      ctx.clip();

      // ── Floor plan image ─────────────────────────────────────────────────
      if (imgRef.current) {
        ctx.drawImage(imgRef.current, 0, 0, W, H);
        // Dim it so overlays are readable
        ctx.fillStyle = "rgba(6, 6, 16, 0.48)";
        ctx.fillRect(0, 0, W, H);
      } else {
        ctx.fillStyle = "rgba(8, 8, 20, 0.92)";
        ctx.fillRect(0, 0, W, H);
      }

      // ── Hotspot dots (all rooms) ─────────────────────────────────────────
      rooms.forEach((r) => {
        r.hotspots.forEach((hs) => {
          if (hs.mapX == null || hs.mapY == null) return;
          const { x, y } = toCanvas(hs.mapX, hs.mapY);
          const isCurRoom = r.id === currentRoomId;

          // Connector line to target room node
          const target = rooms.find((t) => t.id === hs.targetRoomId);
          if (target?.mapX != null && target.mapY != null) {
            const { x: tx, y: ty } = toCanvas(target.mapX, target.mapY);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(tx, ty);
            ctx.strokeStyle = isCurRoom
              ? "rgba(0,229,255,0.25)"
              : "rgba(255,255,255,0.08)";
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Dot
          ctx.beginPath();
          ctx.arc(x, y, isCurRoom ? 5 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = isCurRoom ? "#00e5ff" : "rgba(0,229,255,0.35)";
          ctx.fill();
          ctx.strokeStyle = isCurRoom ? "rgba(0,229,255,0.8)" : "rgba(0,229,255,0.2)";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Arrow pointing to target
          if (target?.mapX != null && target.mapY != null && isCurRoom) {
            const { x: tx, y: ty } = toCanvas(target.mapX, target.mapY);
            const angle = Math.atan2(ty - y, tx - x);
            const arrowLen = 5;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle) * 6, y + Math.sin(angle) * 6);
            ctx.lineTo(
              x + Math.cos(angle - 0.4) * arrowLen + Math.cos(angle) * 6,
              y + Math.sin(angle - 0.4) * arrowLen + Math.sin(angle) * 6
            );
            ctx.moveTo(x + Math.cos(angle) * 6, y + Math.sin(angle) * 6);
            ctx.lineTo(
              x + Math.cos(angle + 0.4) * arrowLen + Math.cos(angle) * 6,
              y + Math.sin(angle + 0.4) * arrowLen + Math.sin(angle) * 6
            );
            ctx.strokeStyle = "#00e5ff";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        });
      });

      // ── POI dots (all rooms, dimmed if not current) ──────────────────────
      rooms.forEach((r) => {
        const isCurRoom = r.id === currentRoomId;
        r.pois.forEach((poi) => {
          if (poi.mapX == null || poi.mapY == null) return;
          const { x, y } = toCanvas(poi.mapX, poi.mapY);

          ctx.beginPath();
          ctx.arc(x, y, isCurRoom ? 5 : 3, 0, Math.PI * 2);
          ctx.fillStyle = isCurRoom ? "#ffb300" : "rgba(255,179,0,0.25)";
          ctx.fill();
          ctx.strokeStyle = isCurRoom ? "rgba(255,179,0,0.9)" : "rgba(255,179,0,0.15)";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Icon label for current room POIs
          if (isCurRoom && poi.icon) {
            ctx.font = "8px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText(poi.icon, x, y - 5);
          }
        });
      });

      // ── Room label nodes ─────────────────────────────────────────────────
      rooms.forEach((r) => {
        if (r.mapX == null || r.mapY == null) return;
        const { x, y } = toCanvas(r.mapX, r.mapY);
        const isCurrent = r.id === currentRoomId;
        const color = ROOM_COLORS[r.id] ?? "#ffffff";
        const nodeR = isCurrent ? 7 : 5;

        if (isCurrent) {
          // Glow
          const grd = ctx.createRadialGradient(x, y, 0, x, y, 18);
          grd.addColorStop(0, `${color}44`);
          grd.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(x, y, 18, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = isCurrent ? color : "rgba(20,20,35,0.85)";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = isCurrent ? 2 : 1.5;
        ctx.stroke();

        // Room name label
        ctx.font = `${isCurrent ? "600" : "400"} 8px DM Sans, sans-serif`;
        ctx.fillStyle = isCurrent ? color : "rgba(255,255,255,0.45)";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(r.name, x, y + nodeR + 3);
      });

      // ── Vision cone for current room ─────────────────────────────────────
      const curRoom = rooms.find((r) => r.id === currentRoomId);
      if (curRoom?.mapX != null && curRoom.mapY != null) {
        const { x: cx, y: cy } = toCanvas(curRoom.mapX, curRoom.mapY);
        const lon = viewerRef.current?.getLon() ?? 0;

        // lon=0 → looking "down" on map (+Y axis), increasing lon → clockwise
        const headingRad = ((-lon - 90) * Math.PI) / 180;
        const halfFov = (FOV_DEG / 2 / 180) * Math.PI;
        const coneLen = 44;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coneLen);
        grad.addColorStop(0, "rgba(0,229,255,0.28)");
        grad.addColorStop(1, "rgba(0,229,255,0.0)");

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, coneLen, headingRad - halfFov, headingRad + halfFov);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, coneLen, headingRad - halfFov, headingRad + halfFov);
        ctx.closePath();
        ctx.strokeStyle = "rgba(0,229,255,0.6)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Center direction dot
        ctx.beginPath();
        ctx.arc(
          cx + Math.cos(headingRad) * coneLen * 0.65,
          cy + Math.sin(headingRad) * coneLen * 0.65,
          2, 0, Math.PI * 2
        );
        ctx.fillStyle = "#00e5ff";
        ctx.fill();
      }

      ctx.restore(); // end roundRect clip

      // ── Border ───────────────────────────────────────────────────────────
      ctx.beginPath();
      ctx.roundRect(0, 0, W, H, radius);
      ctx.strokeStyle = "rgba(0,229,255,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [room, rooms, currentRoomId, viewerRef]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "calc(108px + env(safe-area-inset-bottom, 0px))",
        left: 16,
        zIndex: 50,
        width: W,
        height: H,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,255,0.12)",
        pointerEvents: "none",
        opacity:0.8
      }}
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ display: "block" }}
      />
    </div>
  );
}