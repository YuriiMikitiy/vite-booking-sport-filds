import { useSyncExternalStore } from "react";

/**
 * Надійна підписка на matchMedia (коректніше за useState+useEffect для ширини вікна).
 * @param {string} query CSS media query, e.g. "(min-width: 901px)"
 */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined" || !window.matchMedia) {
        return () => {};
      }
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : false),
    () => false
  );
}
