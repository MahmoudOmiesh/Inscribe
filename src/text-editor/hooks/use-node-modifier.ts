import {
  autoUpdate,
  offset,
  useFloating,
  useHover,
  safePolygon,
  useInteractions,
  flip,
} from "@floating-ui/react";
import { useEffect, useState } from "react";

export function useNodeModifier() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "left",
    // Make sure the tooltip stays on the screen
    whileElementsMounted: autoUpdate,
    middleware: [offset(20), flip()],
  });

  // Event listeners to change the open state
  const hover = useHover(context, {
    enabled: !isMenuOpen,
    move: false,
    handleClose: safePolygon(),
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  useEffect(() => {
    if (!isMenuOpen) {
      setTimeout(() => {
        setIsOpen(false);
      }, 50);
    }
  }, [isMenuOpen]);

  return {
    isOpen,
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    setIsMenuOpen,
  };
}
