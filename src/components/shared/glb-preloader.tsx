"use client";

/**
 * GLBPreloader — mounts once in the root layout and kicks off GLB preloading.
 *
 * Uses a manual dynamic import of the GLB viewer module so that Three.js /
 * WebGL code is NEVER bundled into the server render.  The import happens
 * inside useEffect which only runs on the client, after hydration.
 */

import { useEffect } from "react";

const ALL_GLBS = Array.from(
  { length: 23 },
  (_, i) => `/agents/agent-${String(i + 1).padStart(2, "0")}.glb`
);

let preloaded = false;

export function GLBPreloader() {
  useEffect(() => {
    if (preloaded) return;
    preloaded = true;

    // Dynamically import useGLTF so Three.js never touches the server bundle
    import("@react-three/drei").then(({ useGLTF }) => {
      ALL_GLBS.forEach((url, i) => {
        setTimeout(() => useGLTF.preload(url), i * 40);
      });
    });
  }, []);

  return null;
}
