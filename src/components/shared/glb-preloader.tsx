"use client";

/**
 * GLBPreloader — mounts once in the root layout and kicks off useGLTF.preload
 * for all 23 characters as soon as the browser is ready.
 *
 * Why this exists:
 * - useGLTF.preload() inside agent-glb-viewer.tsx only runs when that module
 *   is first evaluated.  With next/dynamic(ssr:false), the module isn't
 *   evaluated until the first GLBCanvas renders, which is AFTER the page
 *   paints — so on initial load the user sees placeholders, and on
 *   client-side navigation the module may already be cached but the preload
 *   hasn't fired for new sessions.
 *
 * - By calling preload from the layout (always mounted), all 23 GLBs start
 *   fetching in the background the moment the app shell hydrates, well before
 *   any Agent3D component mounts.
 */

import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

const ALL_GLBS = Array.from(
  { length: 23 },
  (_, i) => `/agents/agent-${String(i + 1).padStart(2, "0")}.glb`
);

let preloaded = false; // module-level flag — only preload once per session

export function GLBPreloader() {
  useEffect(() => {
    if (preloaded) return;
    preloaded = true;
    // Stagger slightly so we don't hammer the browser on first paint
    ALL_GLBS.forEach((url, i) => {
      setTimeout(() => useGLTF.preload(url), i * 40); // 40ms between each = 920ms total spread
    });
  }, []);

  return null; // renders nothing
}
