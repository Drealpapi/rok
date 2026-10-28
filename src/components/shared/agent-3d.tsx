"use client";

import * as React from "react";
import { getAgentGlb } from "./agent-3d-config";

/*
 * Hydration-safe 3D character component.
 *
 * The server always renders ONLY the placeholder circle.
 * The canvas is added client-side after hydration via useEffect,
 * so server HTML === initial client HTML → no hydration mismatch.
 *
 * After that first effect fires, the module cache and IntersectionObserver
 * do their work as usual.
 */

type GLBViewerType = React.ComponentType<{
  url:         string;
  size:        number;
  cardHovered: boolean;
  onLoaded:    () => void;
  onError:     () => void;
}>;

// Module-level cache — survives page navigations
let _GLBViewer:   GLBViewerType | null = null;
let _loadPromise: Promise<void> | null = null;

function loadGLBViewer(): Promise<void> {
  if (_GLBViewer) return Promise.resolve();
  if (_loadPromise) return _loadPromise;
  _loadPromise = import("./agent-glb-viewer").then(m => {
    _GLBViewer = m.default as GLBViewerType;
  });
  return _loadPromise;
}

// Start loading as soon as this module is evaluated on the client
if (typeof window !== "undefined") {
  loadGLBViewer();
}

class GLBErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

interface Agent3DProps {
  seed:         string;
  size?:        number;
  cardHovered?: boolean;
  accentColor?: string;
  className?:   string;
}

export function Agent3D({
  seed,
  size        = 80,
  cardHovered = false,
  accentColor = "#ff7628",
  className,
}: Agent3DProps) {
  const [loaded,      setLoaded]      = React.useState(false);
  const [errored,     setErrored]     = React.useState(false);

  /*
   * HYDRATION KEY:
   * Both of these start as FALSE so the server and the first client render
   * produce identical HTML (just the placeholder circle, no canvas).
   * useEffect runs only on the client after hydration, then sets these true.
   */
  const [clientReady, setClientReady] = React.useState(false); // false on server + first render
  const [canMount,    setCanMount]    = React.useState(false); // false on server + first render
  const [viewerReady, setViewerReady] = React.useState(false); // false on server + first render

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const glbUrl  = getAgentGlb(seed);

  // Reset when the GLB url changes
  React.useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [glbUrl]);

  /*
   * After hydration: mark client as ready, load the viewer module,
   * and set up IntersectionObserver for small thumbnails.
   * This runs only once per component instance, client-side only.
   */
  React.useEffect(() => {
    setClientReady(true);

    // Load the GLB viewer module
    if (_GLBViewer) {
      setViewerReady(true);
    } else {
      let cancelled = false;
      loadGLBViewer().then(() => {
        if (!cancelled) setViewerReady(true);
      });
      return () => { cancelled = true; };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set up viewport detection after clientReady
  React.useEffect(() => {
    if (!clientReady) return;

    // Large previews always mount immediately
    if (size >= 120) {
      setCanMount(true);
      return;
    }

    const el = wrapRef.current;
    if (!el) { setCanMount(true); return; }

    // Already in view?
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 200) {
      setCanMount(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setCanMount(true); obs.disconnect(); }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [clientReady, size]);

  const handleLoaded = React.useCallback(() => setLoaded(true),  []);
  const handleError  = React.useCallback(() => setErrored(true), []);

  const GLBViewer = _GLBViewer; // safe snapshot

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        width:      size,
        height:     size,
        position:   "relative",
        display:    "block",
        flexShrink: 0,
        overflow:   "visible",
      }}
    >
      {/* Placeholder circle — server renders this, client fades it out */}
      <div
        aria-hidden
        style={{
          position:      "absolute",
          inset:         0,
          borderRadius:  "50%",
          background:    `radial-gradient(circle at 35% 28%, ${accentColor}ee 0%, ${accentColor}88 50%, ${accentColor}44 100%)`,
          boxShadow:     `0 4px 20px ${accentColor}55`,
          transition:    "opacity 0.7s ease",
          opacity:       loaded && !errored ? 0 : 1,
          pointerEvents: "none",
          zIndex:        0,
        }}
      />

      {/*
       * Canvas wrapper — NOT rendered on server (clientReady starts false).
       * Added only after hydration completes, so server HTML matches client.
       */}
      {clientReady && canMount && viewerReady && !errored && GLBViewer && (
        <div
          style={{
            position:   "absolute",
            top:        0,
            left:       0,
            width:      size,
            height:     size,
            overflow:   "visible",
            transition: "opacity 0.7s ease",
            opacity:    loaded ? 1 : 0,
            zIndex:     1,
          }}
        >
          <GLBErrorBoundary>
            <GLBViewer
              url={glbUrl}
              size={size}
              cardHovered={cardHovered}
              onLoaded={handleLoaded}
              onError={handleError}
            />
          </GLBErrorBoundary>
        </div>
      )}
    </div>
  );
}
