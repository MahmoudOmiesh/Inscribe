import {
  flip,
  autoUpdate,
  offset,
  useFloating,
  shift,
  useInteractions,
  useDismiss,
  size,
} from "@floating-ui/react";
import { useState } from "react";

export function useAI() {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom",
    // Make sure the tooltip stays on the screen
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width + 10}px`,
          });
        },
      }),
    ],
  });

  const dismiss = useDismiss(context);

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  return {
    isOpen,
    setIsOpen,
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
  };
}
