import { useEffect, useRef } from "react";
import type { Room, POIData } from "./types";

interface Props {
  room: Room;
  selectedPOI: POIData | null;
  onSelect: (poi: POIData | null) => void;
}

export default function POIPanel({ room, selectedPOI, onSelect }: Props) {
  const stripRef = useRef<HTMLDivElement>(null);

  // When selectedPOI changes, scroll its button into view in the strip
  useEffect(() => {
    if (!selectedPOI || !stripRef.current) return;
    const btn = stripRef.current.querySelector(`[data-poi-id="${selectedPOI.id}"]`) as HTMLElement | null;
    btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedPOI]);

  if (room.pois.length === 0) return null;

  return (
    <>
      {/* Scrollable pill strip */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)", // iPhone notch support
      }}>
        <div
          ref={stripRef}
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            padding: "16px 16px 20px",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Hide scrollbar cross-browser */}
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          {room.pois.map((poi) => {
            const isActive = selectedPOI?.id === poi.id;
            return (
              <button
                key={poi.id}
                data-poi-id={poi.id}
                onClick={() => onSelect(isActive ? null : poi)}
                style={{
                  flexShrink: 0,
                  background: isActive ? "rgba(255,179,0,0.95)" : "rgba(15,15,25,0.85)",
                  color: "#fff",
                  border: `1px solid ${isActive ? "rgba(255,179,0,0.8)" : "rgba(255,255,255,0.15)"}`,
                  borderRadius: 40,
                  // Mobile-friendly tap target: min 44px height
                  padding: "10px 18px",
                  minHeight: 44,
                  cursor: "pointer",
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  backdropFilter: "blur(10px)",
                  transition: "background 0.2s, border-color 0.2s, transform 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  transform: isActive ? "translateY(-3px)" : "none",
                  boxShadow: isActive ? "0 4px 16px rgba(255,179,0,0.35)" : "none",
                  whiteSpace: "nowrap",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{poi.icon ?? "📍"}</span>
                <span>{poi.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info card — slides up from bottom on mobile, floats above strip on desktop */}
      {selectedPOI && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(10,10,20,0.94)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,179,0,0.3)",
            borderRadius: 14,
            padding: "18px 22px",
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            // Responsive width: fill on small screens, fixed on large
            width: "min(320px, calc(100vw - 32px))",
            zIndex: 60,
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            animation: "slideUp 0.22s ease",
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateX(-50%) translateY(12px); }
              to   { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
          `}</style>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{selectedPOI.icon ?? "📍"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{selectedPOI.label}</div>
              {selectedPOI.description && (
                <div style={{ fontSize: 13, opacity: 0.72, lineHeight: 1.6 }}>{selectedPOI.description}</div>
              )}
            </div>
            <button
              onClick={() => onSelect(null)}
              style={{
                flexShrink: 0,
                background: "rgba(255,255,255,0.08)",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: 14,
                borderRadius: "50%",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: -2,
                WebkitTapHighlightColor: "transparent",
              }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}