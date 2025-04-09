"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Create the media query list and set initial value
    const media = window.matchMedia(query);
    setMatches(media.matches);

    // Define callback function
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Add the callback function as a listener for changes to the media query
    media.addEventListener("change", listener);

    // Clean up
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  // Always return false on server side to prevent hydration issues
  if (!isClient) return false;

  return matches;
}

// Predefined media query hooks
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 639px)");
}

export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

export function useIsDarkMode(): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)");
}

export function useIsReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsOrientationPortrait(): boolean {
  return useMediaQuery("(orientation: portrait)");
}

export function useIsOrientationLandscape(): boolean {
  return useMediaQuery("(orientation: landscape)");
}

export function useIsTouchDevice(): boolean {
  // Check if touch is supported
  // Not a true media query but sometimes grouped with them in API contexts
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
    );
  }, []);

  return isTouch;
}
