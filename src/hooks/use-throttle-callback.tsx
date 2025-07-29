import { useRef, useEffect, useCallback } from "react";

/**
 * Creates a throttled function that executes only the first call in a series of rapid calls.
 * Once called, all subsequent calls are ignored until there's a period of inactivity.
 * After the delay period with no calls, the next call will execute as a new "first call".
 *
 * @param callback The function to throttle.
 * @param delay The number of milliseconds of inactivity required before allowing the next execution.
 * @returns A new throttled function.
 */
export function useThrottleCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  delay: number,
): (...args: A) => void {
  const callbackRef = useRef(callback);
  const isActiveRef = useRef<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const throttledCallback = useCallback(
    (...args: A) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!isActiveRef.current) {
        // First call in the series - execute immediately
        callbackRef.current(...args);
        isActiveRef.current = true;
      }

      // Set timeout to reset the active state after inactivity
      timeoutRef.current = setTimeout(() => {
        isActiveRef.current = false;
      }, delay);
    },
    [delay],
  );

  return throttledCallback;
}
