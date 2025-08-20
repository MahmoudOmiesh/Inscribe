import {
  useFloating,
  useDismiss,
  useInteractions,
  flip,
  shift,
  inline,
  autoUpdate,
  offset,
} from "@floating-ui/react";
import { useEffect, useState } from "react";

export function FloatingToolbar({
  containerRef,
  children,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: "top",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [inline(), flip(), shift(), offset(8)],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);

  const { getFloatingProps } = useInteractions([dismiss]);

  useEffect(() => {
    function handleRange() {
      setTimeout(() => {
        const selection = window.getSelection();
        const range =
          typeof selection?.rangeCount === "number" && selection.rangeCount > 0
            ? selection.getRangeAt(0)
            : null;

        if (selection?.isCollapsed) {
          setIsOpen(false);
          return;
        }

        if (
          !range ||
          !containerRef.current?.contains(range.commonAncestorContainer)
        ) {
          setIsOpen(false);
          return;
        }

        refs.setReference({
          getBoundingClientRect: () => range.getBoundingClientRect(),
          getClientRects: () => range.getClientRects(),
        });
        setIsOpen(true);
      });
    }

    function handleMouseUp(event: MouseEvent) {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return;
      }

      handleRange();
    }

    function handleMouseDown(event: MouseEvent) {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return;
      }

      if (window.getSelection()?.isCollapsed) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return;
      }

      handleRange();
    }

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [refs, containerRef]);

  return (
    isOpen && (
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className="z-[1000]"
        {...getFloatingProps()}
      >
        {children}
      </div>
    )
  );
}
