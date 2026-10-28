"use client";

import * as React from "react";

/**
 * useReveal — IntersectionObserver-based scroll reveal.
 * Returns { ref, visible }. Once visible, stays visible.
 */
export function useReveal(rootMargin = "80px", once = true) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    // Check if already in viewport immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { setVisible(true); return; }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin, once]);

  return { ref, visible } as const;
}

/**
 * usePageReveal — fires after a deliberate delay on mount.
 * Default 120ms gives the page a moment to paint before animating —
 * feels intentional rather than frantic.
 */
export function usePageReveal(delay = 120) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return visible;
}
