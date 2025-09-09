import { useEffect, useRef, type Ref } from "react";

export function useClickOutside<T extends HTMLElement>(
  callback: (elem: T) => void,
): Ref<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(ref.current);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [callback]);

  return ref as Ref<T>;
}
