"use client";

import { useEffect, useState } from "react";

export function useDelayedVisible(active: boolean, delay = 1000) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    if (active) t = setTimeout(() => setVisible(true), delay);
    else setVisible(false);
    return () => {
      if (t) clearTimeout(t);
    };
  }, [active, delay]);
  return visible;
}
