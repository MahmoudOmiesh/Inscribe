import {
  flip,
  autoUpdate,
  offset,
  useFloating,
  shift,
  useHover,
  safePolygon,
  useInteractions,
  useDismiss,
} from "@floating-ui/react";
import { useState } from "react";

export function useNodeModifier() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (next) => {
      if (!isInteracting) {
        setIsOpen(next);
      }
    },
    placement: "left",
    // Make sure the tooltip stays on the screen
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(20),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
    ],
  });

  // Event listeners to change the open state
  const hover = useHover(context, {
    move: false,
    handleClose: safePolygon(),
    delay: {
      open: 200,
      close: 0,
    },
  });
  const dismiss = useDismiss(context, {
    outsidePress: () => !isInteracting,
  });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    dismiss,
  ]);

  return {
    isOpen,
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    setIsInteracting,
  };
}
