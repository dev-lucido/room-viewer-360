// import { useEffect, useRef, useState, useCallback } from "react";
// import * as THREE from "three";
// import type { Room, HotspotData, POIData } from "./types";

// interface Props {
//   room: Room;
//   rooms: Room[];
//   onNavigate: (roomId: string) => void;
// }

// export default function Viewer360({ room, rooms, onNavigate }: Props) {
//   const mountRef = useRef<HTMLDivElement>(null);
//   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//   const sceneRef = useRef<THREE.Scene | null>(null);
//   const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
//   const hotspotMeshesRef = useRef<THREE.Mesh[]>([]);
//   const poiMeshesRef = useRef<THREE.Mesh[]>([]);
//   const frameRef = useRef<number>(0);

//   // Drag state — mirrors the official Three.js example exactly
//   const isUserInteracting = useRef(false);
//   const onPointerDownMouseX = useRef(0);
//   const onPointerDownMouseY = useRef(0);
//   const lon = useRef(room.initialLon ?? 0);
//   const onPointerDownLon = useRef(0);
//   const lat = useRef(room.initialLat ?? 0);
//   const onPointerDownLat = useRef(0);

//   const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);
//   const [transitioning, setTransitioning] = useState(false);

//   const toCartesian = (lonDeg: number, latDeg: number, r = 490) => {
//     const phi = THREE.MathUtils.degToRad(90 - latDeg);
//     const theta = THREE.MathUtils.degToRad(lonDeg);
//     return new THREE.Vector3(
//       r * Math.sin(phi) * Math.cos(theta),
//       r * Math.cos(phi),
//       r * Math.sin(phi) * Math.sin(theta)
//     );
//   };

//   useEffect(() => {
//     const mount = mountRef.current;
//     if (!mount) return;

//     // Renderer
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(mount.clientWidth, mount.clientHeight);
//     mount.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     // Scene & Camera
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       mount.clientWidth / mount.clientHeight,
//       1,
//       1100  // official Three.js example uses 1100
//     );
//     camera.position.set(0, 0, 0);
//     cameraRef.current = camera;

//     // 360 Sphere — exactly as in the official Three.js equirectangular example:
//     // https://github.com/mrdoob/three.js/blob/dev/examples/webgl_panorama_equirectangular.html
//     //
//     // geometry.scale(-1,1,1) flips the sphere inside-out so the camera inside sees the texture.
//     // The texture is passed directly into MeshBasicMaterial — Three.js returns the Texture
//     // object immediately and populates it asynchronously. This is the correct pattern.
//     const geometry = new THREE.SphereGeometry(500, 60, 40);
//     geometry.scale(-1, 1, 1);
//     const texture = new THREE.TextureLoader().load(room.imageUrl);
//     const material = new THREE.MeshBasicMaterial({ map: texture });
//     const mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);

//     // Hotspots (navigation rings)
//     hotspotMeshesRef.current = [];
//     room.hotspots.forEach((hs) => {
//       const pos = toCartesian(hs.lon, hs.lat);
//       const geo = new THREE.RingGeometry(6, 12, 32);
//       const mat = new THREE.MeshBasicMaterial({
//         color: 0x00e5ff,
//         side: THREE.DoubleSide,
//         transparent: true,
//         opacity: 0.9,
//       });
//       const hsMesh = new THREE.Mesh(geo, mat);
//       hsMesh.position.copy(pos);
//       hsMesh.lookAt(0, 0, 0);
//       hsMesh.userData = { type: "hotspot", data: hs };

//       const innerGeo = new THREE.CircleGeometry(4, 32);
//       const innerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
//       hsMesh.add(new THREE.Mesh(innerGeo, innerMat));

//       scene.add(hsMesh);
//       hotspotMeshesRef.current.push(hsMesh);
//     });

//     // POIs
//     poiMeshesRef.current = [];
//     room.pois.forEach((poi) => {
//       const pos = toCartesian(poi.lon, poi.lat);
//       const geo = new THREE.CircleGeometry(8, 32);
//       const mat = new THREE.MeshBasicMaterial({
//         color: 0xffb300,
//         side: THREE.DoubleSide,
//         transparent: true,
//         opacity: 0.95,
//       });
//       const poiMesh = new THREE.Mesh(geo, mat);
//       poiMesh.position.copy(pos);
//       poiMesh.lookAt(0, 0, 0);
//       poiMesh.userData = { type: "poi", data: poi };

//       const ringGeo = new THREE.RingGeometry(8, 11, 32);
//       const ringMat = new THREE.MeshBasicMaterial({
//         color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.6,
//       });
//       poiMesh.add(new THREE.Mesh(ringGeo, ringMat));

//       scene.add(poiMesh);
//       poiMeshesRef.current.push(poiMesh);
//     });

//     // Animate — same lookAt math as the official example
//     const animate = () => {
//       frameRef.current = requestAnimationFrame(animate);

//       const clampedLat = Math.max(-85, Math.min(85, lat.current));
//       const phi = THREE.MathUtils.degToRad(90 - clampedLat);
//       const theta = THREE.MathUtils.degToRad(lon.current);

//       camera.lookAt(
//         500 * Math.sin(phi) * Math.cos(theta),
//         500 * Math.cos(phi),
//         500 * Math.sin(phi) * Math.sin(theta)
//       );

//       // Keep markers facing inward
//       [...hotspotMeshesRef.current, ...poiMeshesRef.current].forEach((m) =>
//         m.lookAt(0, 0, 0)
//       );

//       // Pulse hotspots
//       const t = Date.now() * 0.002;
//       hotspotMeshesRef.current.forEach((m) => {
//         (m.material as THREE.MeshBasicMaterial).opacity = 0.55 + 0.35 * Math.sin(t);
//       });

//       renderer.render(scene, camera);
//     };
//     animate();

//     // Resize
//     const onResize = () => {
//       renderer.setSize(mount.clientWidth, mount.clientHeight);
//       camera.aspect = mount.clientWidth / mount.clientHeight;
//       camera.updateProjectionMatrix();
//     };
//     window.addEventListener("resize", onResize);

//     return () => {
//       cancelAnimationFrame(frameRef.current);
//       window.removeEventListener("resize", onResize);
//       if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
//       renderer.dispose();
//       rendererRef.current = null;
//       sceneRef.current = null;
//       cameraRef.current = null;
//     };
//   }, [room]);

//   // Raycaster helper
//   const getIntersects = useCallback((clientX: number, clientY: number) => {
//     const mount = mountRef.current;
//     const camera = cameraRef.current;
//     const scene = sceneRef.current;
//     if (!mount || !camera || !scene) return [];
//     const rect = mount.getBoundingClientRect();
//     const mouse = new THREE.Vector2(
//       ((clientX - rect.left) / rect.width) * 2 - 1,
//       -((clientY - rect.top) / rect.height) * 2 + 1
//     );
//     const raycaster = new THREE.Raycaster();
//     raycaster.setFromCamera(mouse, camera);
//     return raycaster.intersectObjects(
//       [...hotspotMeshesRef.current, ...poiMeshesRef.current],
//       true
//     );
//   }, []);

//   // Pointer events — mirrors the official example's onPointerDown/Move/Up
//   const onPointerDown = (e: React.PointerEvent) => {
//     isUserInteracting.current = true;
//     onPointerDownMouseX.current = e.clientX;
//     onPointerDownMouseY.current = e.clientY;
//     onPointerDownLon.current = lon.current;
//     onPointerDownLat.current = lat.current;
//   };

//   const onPointerMove = (e: React.PointerEvent) => {
//     if (isUserInteracting.current) {
//       lon.current = (onPointerDownMouseX.current - e.clientX) * 0.1 + onPointerDownLon.current;
//       lat.current = (e.clientY - onPointerDownMouseY.current) * 0.1 + onPointerDownLat.current;
//       setTooltip(null);
//     } else {
//       const hits = getIntersects(e.clientX, e.clientY);
//       if (hits.length > 0) {
//         const obj = hits[0].object;
//         const parent = (obj.userData.type ? obj : obj.parent) as THREE.Mesh;
//         if (parent?.userData?.type) {
//           const label =
//             parent.userData.type === "hotspot"
//               ? `Go to: ${rooms.find((r) => r.id === (parent.userData.data as HotspotData).targetRoomId)?.name ?? "Room"}`
//               : (parent.userData.data as POIData).label;
//           setTooltip({ label, x: e.clientX, y: e.clientY });
//           return;
//         }
//       }
//       setTooltip(null);
//     }
//   };

//   const onPointerUp = (e: React.PointerEvent) => {
//     const wasDragging =
//       Math.abs(e.clientX - onPointerDownMouseX.current) > 4 ||
//       Math.abs(e.clientY - onPointerDownMouseY.current) > 4;
//     isUserInteracting.current = false;

//     if (!wasDragging) {
//       const hits = getIntersects(e.clientX, e.clientY);
//       if (hits.length > 0) {
//         const obj = hits[0].object;
//         const parent = (obj.userData.type ? obj : obj.parent) as THREE.Mesh;
//         if (parent?.userData?.type === "hotspot") {
//           const hs = parent.userData.data as HotspotData;
//           setTransitioning(true);
//           setTimeout(() => {
//             onNavigate(hs.targetRoomId);
//             setTransitioning(false);
//           }, 400);
//         }
//       }
//     }
//   };

//   const touchRef = useRef({ x: 0, y: 0 });
//   const onTouchStart = (e: React.TouchEvent) => {
//     touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
//   };
//   const onTouchMove = (e: React.TouchEvent) => {
//     const dx = e.touches[0].clientX - touchRef.current.x;
//     const dy = e.touches[0].clientY - touchRef.current.y;
//     lon.current -= dx * 0.2;
//     lat.current += dy * 0.2;
//     touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
//   };

//   return (
//     <div style={{ position: "relative", width: "100%", height: "100%" }}>
//       <div
//         ref={mountRef}
//         style={{ width: "100%", height: "100%", cursor: "grab" }}
//         onPointerDown={onPointerDown}
//         onPointerMove={onPointerMove}
//         onPointerUp={onPointerUp}
//         onTouchStart={onTouchStart}
//         onTouchMove={onTouchMove}
//       />

//       {/* Fade overlay */}
//       <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           background: "#000",
//           opacity: transitioning ? 1 : 0,
//           transition: "opacity 0.4s ease",
//           pointerEvents: "none",
//         }}
//       />

//       {/* Tooltip */}
//       {tooltip && (
//         <div
//           style={{
//             position: "fixed",
//             left: tooltip.x + 14,
//             top: tooltip.y - 10,
//             background: "rgba(0,0,0,0.82)",
//             color: "#fff",
//             padding: "6px 12px",
//             borderRadius: 6,
//             fontSize: 13,
//             fontFamily: "'DM Sans', sans-serif",
//             pointerEvents: "none",
//             backdropFilter: "blur(6px)",
//             border: "1px solid rgba(255,255,255,0.15)",
//             zIndex: 100,
//           }}
//         >
//           {tooltip.label}
//         </div>
//       )}
//     </div>
//   );
// }



















import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import type { Room, HotspotData, POIData } from "./types";

interface Props {
  room: Room;
  rooms: Room[];
  onNavigate: (roomId: string) => void;
  onPOIClick: (poi: POIData) => void;
  lookAtTarget: { lon: number; lat: number } | null;
}

export default function Viewer360({ room, rooms, onNavigate, onPOIClick, lookAtTarget }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const hotspotMeshesRef = useRef<THREE.Mesh[]>([]);
  const poiMeshesRef = useRef<THREE.Mesh[]>([]);
  const frameRef = useRef<number>(0);

  // Current camera lon/lat
  const lon = useRef(room.initialLon ?? 0);
  const lat = useRef(room.initialLat ?? 0);

  // Smooth look-at animation target
  const animTargetLon = useRef<number | null>(null);
  const animTargetLat = useRef<number | null>(null);

  // Drag state — mirrors the official Three.js example
  const isUserInteracting = useRef(false);
  const onPointerDownMouseX = useRef(0);
  const onPointerDownMouseY = useRef(0);
  const onPointerDownLon = useRef(0);
  const onPointerDownLat = useRef(0);

  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  // When parent changes lookAtTarget (POI button clicked), start smooth pan
  useEffect(() => {
    if (lookAtTarget) {
      animTargetLon.current = lookAtTarget.lon;
      animTargetLat.current = lookAtTarget.lat;
    }
  }, [lookAtTarget]);

  const toCartesian = (lonDeg: number, latDeg: number, r = 490) => {
    const phi = THREE.MathUtils.degToRad(90 - latDeg);
    const theta = THREE.MathUtils.degToRad(lonDeg);
    return new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 1, 1100);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // 360 Sphere — official Three.js pattern
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    const texture = new THREE.TextureLoader().load(room.imageUrl);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    scene.add(new THREE.Mesh(geometry, material));

    // Hotspots
    hotspotMeshesRef.current = [];
    room.hotspots.forEach((hs) => {
      const pos = toCartesian(hs.lon, hs.lat);
      const geo = new THREE.RingGeometry(6, 12, 32);
      const mat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
      const hsMesh = new THREE.Mesh(geo, mat);
      hsMesh.position.copy(pos);
      hsMesh.lookAt(0, 0, 0);
      hsMesh.userData = { type: "hotspot", data: hs };
      hsMesh.add(new THREE.Mesh(new THREE.CircleGeometry(4, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })));
      scene.add(hsMesh);
      hotspotMeshesRef.current.push(hsMesh);
    });

    // POIs
    poiMeshesRef.current = [];
    room.pois.forEach((poi) => {
      const pos = toCartesian(poi.lon, poi.lat);
      const geo = new THREE.CircleGeometry(8, 32);
      const mat = new THREE.MeshBasicMaterial({ color: 0xffb300, side: THREE.DoubleSide, transparent: true, opacity: 0.95 });
      const poiMesh = new THREE.Mesh(geo, mat);
      poiMesh.position.copy(pos);
      poiMesh.lookAt(0, 0, 0);
      poiMesh.userData = { type: "poi", data: poi };
      poiMesh.add(new THREE.Mesh(
        new THREE.RingGeometry(8, 11, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
      ));
      scene.add(poiMesh);
      poiMeshesRef.current.push(poiMesh);
    });

    // Animate
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Smooth pan toward animTarget if set and user isn't dragging
      if (!isUserInteracting.current && animTargetLon.current !== null && animTargetLat.current !== null) {
        const SPEED = 0.08;
        lon.current += (animTargetLon.current - lon.current) * SPEED;
        lat.current += (animTargetLat.current - lat.current) * SPEED;

        const lonDone = Math.abs(animTargetLon.current - lon.current) < 0.05;
        const latDone = Math.abs(animTargetLat.current - lat.current) < 0.05;
        if (lonDone && latDone) {
          lon.current = animTargetLon.current;
          lat.current = animTargetLat.current;
          animTargetLon.current = null;
          animTargetLat.current = null;
        }
      }

      const clampedLat = Math.max(-85, Math.min(85, lat.current));
      const phi = THREE.MathUtils.degToRad(90 - clampedLat);
      const theta = THREE.MathUtils.degToRad(lon.current);
      camera.lookAt(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      );

      [...hotspotMeshesRef.current, ...poiMeshesRef.current].forEach((m) => m.lookAt(0, 0, 0));

      const t = Date.now() * 0.002;
      hotspotMeshesRef.current.forEach((m) => {
        (m.material as THREE.MeshBasicMaterial).opacity = 0.55 + 0.35 * Math.sin(t);
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
    };
  }, [room]);

  // Raycaster
  const getIntersects = useCallback((clientX: number, clientY: number) => {
    const mount = mountRef.current;
    const camera = cameraRef.current;
    if (!mount || !camera) return [];
    const rect = mount.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects([...hotspotMeshesRef.current, ...poiMeshesRef.current], true);
  }, []);

  // Pointer events
  const onPointerDown = (e: React.PointerEvent) => {
    isUserInteracting.current = true;
    animTargetLon.current = null; // cancel any smooth pan on drag
    animTargetLat.current = null;
    onPointerDownMouseX.current = e.clientX;
    onPointerDownMouseY.current = e.clientY;
    onPointerDownLon.current = lon.current;
    onPointerDownLat.current = lat.current;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isUserInteracting.current) {
      lon.current = (onPointerDownMouseX.current - e.clientX) * 0.1 + onPointerDownLon.current;
      lat.current = (e.clientY - onPointerDownMouseY.current) * 0.1 + onPointerDownLat.current;
      setTooltip(null);
    } else {
      // Hover tooltip (desktop only — no hover on touch)
      const hits = getIntersects(e.clientX, e.clientY);
      if (hits.length > 0) {
        const obj = hits[0].object;
        const parent = (obj.userData.type ? obj : obj.parent) as THREE.Mesh;
        if (parent?.userData?.type) {
          const label =
            parent.userData.type === "hotspot"
              ? `Go to: ${rooms.find((r) => r.id === (parent.userData.data as HotspotData).targetRoomId)?.name ?? "Room"}`
              : (parent.userData.data as POIData).label;
          setTooltip({ label, x: e.clientX, y: e.clientY });
          return;
        }
      }
      setTooltip(null);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const wasDragging =
      Math.abs(e.clientX - onPointerDownMouseX.current) > 5 ||
      Math.abs(e.clientY - onPointerDownMouseY.current) > 5;
    isUserInteracting.current = false;

    if (!wasDragging) {
      const hits = getIntersects(e.clientX, e.clientY);
      if (hits.length > 0) {
        const obj = hits[0].object;
        const parent = (obj.userData.type ? obj : obj.parent) as THREE.Mesh;
        if (parent?.userData?.type === "hotspot") {
          const hs = parent.userData.data as HotspotData;
          setTransitioning(true);
          setTimeout(() => { onNavigate(hs.targetRoomId); setTransitioning(false); }, 400);
        } else if (parent?.userData?.type === "poi") {
          const poi = parent.userData.data as POIData;
          // Trigger smooth camera pan + open info card
          animTargetLon.current = poi.lon;
          animTargetLat.current = poi.lat;
          onPOIClick(poi);
        }
      }
    }
  };

  // Touch drag (separate from pointer for multi-touch safety)
  const touchRef = useRef({ x: 0, y: 0 });
  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    animTargetLon.current = null;
    animTargetLat.current = null;
    const dx = e.touches[0].clientX - touchRef.current.x;
    const dy = e.touches[0].clientY - touchRef.current.y;
    lon.current -= dx * 0.2;
    lat.current += dy * 0.2;
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={mountRef}
        style={{ width: "100%", height: "100%", cursor: "grab", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      />

      {/* Fade overlay */}
      <div style={{
        position: "absolute", inset: 0, background: "#000",
        opacity: transitioning ? 1 : 0, transition: "opacity 0.4s ease", pointerEvents: "none",
      }} />

      {/* Hover tooltip */}
      {tooltip && (
        <div style={{
          position: "fixed", left: tooltip.x + 14, top: tooltip.y - 10,
          background: "rgba(0,0,0,0.82)", color: "#fff", padding: "6px 12px",
          borderRadius: 6, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
          pointerEvents: "none", backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.15)", zIndex: 100,
        }}>
          {tooltip.label}
        </div>
      )}
    </div>
  );
}