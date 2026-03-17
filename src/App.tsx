// import { useState } from "react";
// import Viewer360 from "./Viewer360";
// import POIPanel from "./POIPanel";
// import { ROOMS } from "./roomsData";
// import type { Room, POIData } from "./types";

// export default function App() {
//   const [currentRoom, setCurrentRoom] = useState<Room>(ROOMS[0]);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [selectedPOI, setSelectedPOI] = useState<POIData | null>(null);
//   // lookAtTarget changes every time a POI is selected, triggering smooth camera pan
//   const [lookAtTarget, setLookAtTarget] = useState<{ lon: number; lat: number } | null>(null);

//   const handleNavigate = (roomId: string) => {
//     const target = ROOMS.find((r) => r.id === roomId);
//     if (target) {
//       setCurrentRoom(target);
//       setMenuOpen(false);
//       setSelectedPOI(null);
//       setLookAtTarget(null);
//     }
//   };

//   const handlePOISelect = (poi: POIData | null) => {
//     setSelectedPOI(poi);
//     if (poi) setLookAtTarget({ lon: poi.lon, lat: poi.lat });
//   };

//   return (
//     <div style={{
//       width: "100vw",
//       height: "100dvh",
//       background: "#0a0a12",
//       fontFamily: "'DM Sans', sans-serif",
//       overflow: "hidden",
//       position: "relative",
//     }}>
//       {/* 360 Viewer — fills the whole screen */}
//       <Viewer360
//         key={currentRoom.id}
//         room={currentRoom}
//         rooms={ROOMS}
//         onNavigate={handleNavigate}
//         onPOIClick={handlePOISelect}
//         lookAtTarget={lookAtTarget}
//       />

//       {/* ── Top HUD ─────────────────────────────────────────────────────────── */}
//       <div style={{
//         position: "absolute",
//         top: 0, left: 0, right: 0,
//         padding: "14px 16px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)",
//         zIndex: 50,
//         pointerEvents: "none",
//         // Handle iPhone notch
//         paddingTop: "max(14px, env(safe-area-inset-top, 14px))",
//       }}>
//         {/* Room name */}
//         <div>
//           <div style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
//             Now Viewing
//           </div>
//           <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 2 }}>
//             {currentRoom.name}
//           </div>
//         </div>

//         {/* Controls hint — hidden on small screens */}
//         <div style={{
//           fontSize: 11, color: "rgba(255,255,255,0.35)",
//           display: "flex", gap: 14, pointerEvents: "none",
//         }} className="hints">
//           <span>🖱 Drag to look</span>
//           <span>🔵 Navigate</span>
//           <span>🟡 Info</span>
//         </div>
//       </div>

//       {/* ── Rooms button (top-right) ─────────────────────────────────────────── */}
//       <div style={{
//         position: "absolute",
//         // On mobile shift down to avoid overlap with room name
//         top: "max(14px, env(safe-area-inset-top, 14px))",
//         right: 16,
//         zIndex: 60,
//       }}>
//         <button
//           onClick={() => setMenuOpen((v) => !v)}
//           style={{
//             background: menuOpen ? "rgba(0,229,255,0.15)" : "rgba(15,15,25,0.85)",
//             border: "1px solid rgba(0,229,255,0.4)",
//             borderRadius: 8,
//             color: "#00e5ff",
//             // Min 44px tap target
//             padding: "10px 16px",
//             minHeight: 44,
//             cursor: "pointer",
//             fontSize: 13,
//             fontWeight: 600,
//             backdropFilter: "blur(10px)",
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             transition: "all 0.2s",
//             WebkitTapHighlightColor: "transparent",
//           }}
//         >
//           <span style={{ fontSize: 16 }}>⊞</span>
//           <span>Rooms</span>
//         </button>

//         {/* Dropdown */}
//         {menuOpen && (
//           <div style={{
//             position: "absolute",
//             top: "calc(100% + 8px)",
//             right: 0,
//             background: "rgba(10,10,20,0.96)",
//             backdropFilter: "blur(16px)",
//             border: "1px solid rgba(255,255,255,0.1)",
//             borderRadius: 10,
//             overflow: "hidden",
//             minWidth: 190,
//             boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
//           }}>
//             {ROOMS.map((room) => {
//               const icons: Record<string, string> = { "living-room": "🛋️", "kitchen": "🍳", "bedroom": "🛏️" };
//               const isActive = currentRoom.id === room.id;
//               return (
//                 <button
//                   key={room.id}
//                   onClick={() => handleNavigate(room.id)}
//                   style={{
//                     width: "100%",
//                     background: isActive ? "rgba(0,229,255,0.12)" : "transparent",
//                     border: "none",
//                     borderBottom: "1px solid rgba(255,255,255,0.06)",
//                     color: isActive ? "#00e5ff" : "#fff",
//                     padding: "13px 16px",
//                     minHeight: 48,
//                     cursor: "pointer",
//                     fontSize: 14,
//                     textAlign: "left",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 10,
//                     transition: "background 0.15s",
//                     WebkitTapHighlightColor: "transparent",
//                   }}
//                 >
//                   <span style={{ fontSize: 20 }}>{icons[room.id] ?? "🚪"}</span>
//                   <span style={{ flex: 1 }}>{room.name}</span>
//                   {isActive && <span style={{ fontSize: 11, opacity: 0.5 }}>current</span>}
//                 </button>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Dismiss menu on outside tap */}
//       {menuOpen && (
//         <div
//           style={{ position: "absolute", inset: 0, zIndex: 55 }}
//           onClick={() => setMenuOpen(false)}
//         />
//       )}

//       {/* ── POI strip + info card ────────────────────────────────────────────── */}
//       <POIPanel
//         room={currentRoom}
//         selectedPOI={selectedPOI}
//         onSelect={handlePOISelect}
//       />

//       {/* ── Legend (bottom-right, hidden on very small screens) ─────────────── */}
//       <div style={{
//         position: "absolute",
//         bottom: "calc(100px + env(safe-area-inset-bottom, 0px))",
//         right: 16,
//         display: "flex",
//         flexDirection: "column",
//         gap: 6,
//         zIndex: 50,
//         pointerEvents: "none",
//       }}>
//         {[
//           { color: "#00e5ff", label: "Navigate" },
//           { color: "#ffb300", label: "Point of Interest" },
//         ].map(({ color, label }) => (
//           <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
//             <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
//             {label}
//           </div>
//         ))}
//       </div>

//       {/* Responsive hint styles */}
//       <style>{`
//         @media (max-width: 500px) {
//           .hints { display: none !important; }
//         }
//       `}</style>
//     </div>
//   );
// }






























import { useRef, useState } from "react";
import Viewer360, { type Viewer360Handle } from "./Viewer360";
import POIPanel from "./POIPanel";
import { ROOMS } from "./roomsData";
import type { Room, POIData } from "./types";
import Minimap from "./Minimap";

export default function App() {
  const [currentRoom, setCurrentRoom] = useState<Room>(ROOMS[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<POIData | null>(null);
  // lookAtTarget changes every time a POI is selected, triggering smooth camera pan
  const [lookAtTarget, setLookAtTarget] = useState<{ lon: number; lat: number } | null>(null);

  const viewerRef = useRef<Viewer360Handle>(null);

  const handleNavigate = (roomId: string) => {
    const target = ROOMS.find((r) => r.id === roomId);
    if (target) {
      setCurrentRoom(target);
      setMenuOpen(false);
      setSelectedPOI(null);
      setLookAtTarget(null);
    }
  };

  const handlePOISelect = (poi: POIData | null) => {
    setSelectedPOI(poi);
    if (poi) setLookAtTarget({ lon: poi.lon, lat: poi.lat });
  };

  return (
    <div style={{
      width: "100vw",
      height: "100dvh",
      background: "#0a0a12",
      fontFamily: "'DM Sans', sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* 360 Viewer — fills the whole screen */}
      <Viewer360
      ref={viewerRef}
        key={currentRoom.id}
        room={currentRoom}
        rooms={ROOMS}
        onNavigate={handleNavigate}
        onPOIClick={handlePOISelect}
        lookAtTarget={lookAtTarget}
      />

      {/* ── Top HUD ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)",
        zIndex: 50,
        pointerEvents: "none",
        // Handle iPhone notch
        paddingTop: "max(14px, env(safe-area-inset-top, 14px))",
      }}>
        {/* Room name */}
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
            Now Viewing
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 2 }}>
            {currentRoom.name}
          </div>
        </div>

        {/* Controls hint — hidden on small screens */}
        <div style={{
          fontSize: 11, color: "rgba(255,255,255,0.35)",
          display: "flex", gap: 14, pointerEvents: "none",
        }} className="hints">
          <span>🖱 Drag to look</span>
          <span>🔵 Navigate</span>
          <span>🟡 Info</span>
        </div>
      </div>

      {/* ── Rooms button (top-right) ─────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        // On mobile shift down to avoid overlap with room name
        top: "max(14px, env(safe-area-inset-top, 14px))",
        right: 16,
        zIndex: 60,
      }}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            background: menuOpen ? "rgba(0,229,255,0.15)" : "rgba(15,15,25,0.85)",
            border: "1px solid rgba(0,229,255,0.4)",
            borderRadius: 8,
            color: "#00e5ff",
            // Min 44px tap target
            padding: "10px 16px",
            minHeight: 44,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <span style={{ fontSize: 16 }}>⊞</span>
          <span>Rooms</span>
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "rgba(10,10,20,0.96)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            overflow: "hidden",
            minWidth: 190,
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          }}>
            {ROOMS.map((room) => {
              const icons: Record<string, string> = { "living-room": "🛋️", "kitchen": "🍳", "bedroom": "🛏️" };
              const isActive = currentRoom.id === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => handleNavigate(room.id)}
                  style={{
                    width: "100%",
                    background: isActive ? "rgba(0,229,255,0.12)" : "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    color: isActive ? "#00e5ff" : "#fff",
                    padding: "13px 16px",
                    minHeight: 48,
                    cursor: "pointer",
                    fontSize: 14,
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "background 0.15s",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{icons[room.id] ?? "🚪"}</span>
                  <span style={{ flex: 1 }}>{room.name}</span>
                  {isActive && <span style={{ fontSize: 11, opacity: 0.5 }}>current</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Dismiss menu on outside tap */}
      {menuOpen && (
        <div
          style={{ position: "absolute", inset: 0, zIndex: 55 }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── POI strip + info card ────────────────────────────────────────────── */}
      <POIPanel
        room={currentRoom}
        selectedPOI={selectedPOI}
        onSelect={handlePOISelect}
      />

      {/* ── Legend (bottom-right, hidden on very small screens) ─────────────── */}
      <div style={{
        position: "absolute",
        bottom: "calc(100px + env(safe-area-inset-bottom, 0px))",
        right: 16,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        zIndex: 50,
        pointerEvents: "none",
      }}>
        {[
          { color: "#00e5ff", label: "Navigate" },
          { color: "#ffb300", label: "Point of Interest" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>

      {/* Responsive hint styles */}
      <style>{`
        @media (max-width: 500px) {
          .hints { display: none !important; }
        }
      `}</style>

      <Minimap
        viewerRef={viewerRef}
        room={currentRoom}
        rooms={ROOMS}
        currentRoomId={currentRoom.id}
        onNavigate={handleNavigate}
      />
    </div>
  );
}