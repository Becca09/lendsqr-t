"use client";

import { useEffect } from "react";

function removeIndicators() {
  const selectors = [
    "#__nextBuildIndicator",
    "#__next-build-indicator",
    "#nextjs__container",
    "[data-nextjs-dev-overlay]",
    "[data-nextjs-overlay]",
    "[data-nextjs-portal]",
    "[data-nextjs-toast]",
  ];
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      try {
        el.remove();
      } catch {
        // ignore
      }
    });
  });
}

export default function DevIndicatorHider() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    removeIndicators();

    const attempts = 20; // ~2s total
    let count = 0;
    const i = setInterval(() => {
      removeIndicators();
      if (++count >= attempts) clearInterval(i);
    }, 100);

    return () => clearInterval(i);
  }, []);

  return null;
}
