"use client";

import * as React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface GLBViewerProps {
  url: string;
  size: number;
  cardHovered: boolean;
  onLoaded: () => void;
  onError:  () => void;
}

function Model({
  url,
  cardHovered,
  onLoadedRef,
  onErrorRef,
}: {
  url: string;
  cardHovered: boolean;
  onLoadedRef: React.MutableRefObject<() => void>;
  onErrorRef:  React.MutableRefObject<() => void>;
}) {
  const groupRef                     = React.useRef<THREE.Group>(null);
  const { camera }                   = useThree();
  const [ready, setReady]            = React.useState(false);
  const { scene, animations }        = useGLTF(url);
  const { actions, names }           = useAnimations(animations, groupRef);

  React.useEffect(() => {
    if (!scene || !groupRef.current) return;
    try {
      const clone  = scene.clone(true);
      const box    = new THREE.Box3().setFromObject(clone);
      const centre = new THREE.Vector3();
      const sizeV  = new THREE.Vector3();
      box.getCenter(centre);
      box.getSize(sizeV);
      const maxDim = Math.max(sizeV.x, sizeV.y, sizeV.z);
      if (maxDim === 0) { onErrorRef.current(); return; }
      const s = 1.8 / maxDim;
      clone.scale.setScalar(s);
      clone.position.set(-centre.x * s, -centre.y * s + 0.1, -centre.z * s);
      while (groupRef.current.children.length) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      groupRef.current.add(clone);
      setReady(true);
      onLoadedRef.current();
    } catch {
      onErrorRef.current();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  React.useEffect(() => {
    if (!ready || names.length === 0) return;
    const a = actions[names[0]];
    if (a) a.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    return () => { a?.stop(); };
  }, [ready, actions, names]);

  React.useEffect(() => {
    camera.position.set(0, 0.3, 3.2);
    camera.lookAt(0, 0.3, 0);
  }, [camera]);

  const rotY     = React.useRef(0);
  const bobY     = React.useRef(0);
  const scaleRef = React.useRef(1);
  const tiltRef  = React.useRef(0);

  useFrame((_, dt) => {
    if (!groupRef.current || !ready) return;
    scaleRef.current += ((cardHovered ? 1.12 : 1.0) - scaleRef.current) * dt * 6;
    tiltRef.current  += ((cardHovered ? -0.12 : 0)  - tiltRef.current)  * dt * 6;
    rotY.current     += (cardHovered ? 0 : 0.30) * dt;
    bobY.current     += dt * (cardHovered ? 1.8 : 0.9);
    groupRef.current.scale.setScalar(scaleRef.current);
    groupRef.current.rotation.y = rotY.current;
    groupRef.current.rotation.x = tiltRef.current;
    groupRef.current.position.y = Math.sin(bobY.current) * (cardHovered ? 0.05 : 0.025);
  });

  return <group ref={groupRef} />;
}

export default function GLBViewer({ url, size, cardHovered, onLoaded, onError }: GLBViewerProps) {
  const onLoadedRef = React.useRef(onLoaded);
  const onErrorRef  = React.useRef(onError);
  React.useLayoutEffect(() => { onLoadedRef.current = onLoaded; });
  React.useLayoutEffect(() => { onErrorRef.current  = onError;  });

  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;

  return (
    /*
      CRITICAL: width/height set both as number (px) AND via style.
      The canvas element inside R3F Canvas must have an explicit pixel
      size — "100%" collapses to 0 when parent is position:absolute.
    */
    <Canvas
      style={{
        display:    "block",
        width:      size,
        height:     size,
        background: "transparent",
        overflow:   "visible",
      }}
      gl={{
        alpha:                 true,
        antialias:             true,
        powerPreference:       "high-performance",
        preserveDrawingBuffer: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.setClearAlpha(0);
      }}
      dpr={dpr}
      camera={{ fov: 38, near: 0.1, far: 50 }}
      frameloop="always"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[ 2.5,  5,  3.5]} intensity={1.4} />
      <directionalLight position={[-3,    2,  1  ]} intensity={0.5} />
      <directionalLight position={[ 0,    3, -4  ]} intensity={0.6} color="#ffd0a0" />
      <pointLight       position={[ 0,   -2,  2  ]} intensity={0.25} color="#ffb060" />
      <pointLight       position={[ 0,    6,  0  ]} intensity={0.20} color="#c0d8ff" />

      <React.Suspense fallback={null}>
        <Model
          url={url}
          cardHovered={cardHovered}
          onLoadedRef={onLoadedRef}
          onErrorRef={onErrorRef}
        />
      </React.Suspense>
    </Canvas>
  );
}

/* Preload all 23 GLBs immediately when this module is evaluated client-side */
if (typeof window !== "undefined") {
  for (let i = 1; i <= 23; i++) {
    useGLTF.preload(`/agents/agent-${String(i).padStart(2, "0")}.glb`);
  }
}
