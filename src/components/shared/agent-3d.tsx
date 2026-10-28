"use client";

import * as React from "react";
import { getAgentGlb } from "./agent-3d-config";

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
  // All start false — server and first client render produce identical HTML (nothing)
  const [clientReady, setClientReady] = React.useState(false);
  const [canMount,    setCanMount]    = React.useState(false);
  const [viewerReady, setViewerReady] = React.useState(false);

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const glbUrl  = getAgentGlb(seed);

  React.useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [glbUrl]);

  React.useEffect(() => {
    setClientReady(true);
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

  React.useEffect(() => {
    if (!clientReady) return;
    if (size >= 120) { setCanMount(true); return; }
    const el = wrapRef.current;
    if (!el) { setCanMount(true); return; }
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 200) { setCanMount(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setCanMount(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [clientReady, size]);

  const handleLoaded = React.useCallback(() => setLoaded(true),  []);
  const handleError  = React.useCallback(() => setErrored(true), []);
  const GLBViewer    = _GLBViewer;

  // Nothing at all until loaded — no orange circle flash
  const showCanvas = clientReady && canMount && viewerReady && !errored && GLBViewer;

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
        // Reserve space but stay invisible until loaded
        opacity:    loaded ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      {showCanvas && (
        <GLBErrorBoundary>
          <GLBViewer
            url={glbUrl}
            size={size}
            cardHovered={cardHovered}
            onLoaded={handleLoaded}
            onError={handleError}
          />
        </GLBErrorBoundary>
      )}
    </div>
  );
}
