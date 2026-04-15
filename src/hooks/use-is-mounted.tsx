import { useEffect, useRef } from "react";

/**
 * Returns a boolean indicating whether the component is currently mounted.
 * Useful for preventing state updates after the component has been unmounted
 * (e.g., when a page is minimized or navigated away).
 */
export function useIsMounted() {
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return mounted.current;
}