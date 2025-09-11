import { useIsMobile } from "@/hooks/use-mobile";
import {
  useFloating,
  useDismiss,
  useInteractions,
  flip,
  inline,
  autoUpdate,
  offset,
  FloatingPortal,
} from "@floating-ui/react";
import { useEffect, useState } from "react";

export function FloatingToolbar({
  containerRef,
  children,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  const [bottomOffset, setBottomOffset] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const { refs, floatingStyles, context } = useFloating({
    placement: "top",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [inline(), flip(), offset(8)],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context, {
    enabled: !isMobile,
  });

  const { getFloatingProps } = useInteractions([dismiss]);

  useEffect(() => {
    if (!isMobile) {
      setBottomOffset(0);
      return;
    }

    const vv = window.visualViewport;
    function update() {
      if (!vv) {
        setBottomOffset(0);
        return;
      }

      const overlap = Math.max(
        0,
        window.innerHeight - (vv.offsetTop + vv.height),
      );
      setBottomOffset(overlap);
    }

    update();

    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window?.addEventListener("orientationchange", update);

    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window?.removeEventListener("orientationchange", update);
    };
  }, [isMobile]);

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

    function handleStart(event: MouseEvent | TouchEvent) {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return;
      }

      if (window.getSelection()?.isCollapsed) {
        setIsOpen(false);
      }
    }

    function handleEnd(event: MouseEvent | TouchEvent | KeyboardEvent | Event) {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return;
      }

      handleRange();
    }

    const container = containerRef.current;

    window.addEventListener("mousedown", handleStart);
    window.addEventListener("touchstart", handleStart);
    window.addEventListener("keydown", handleEnd);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchend", handleEnd);

    if (isMobile) {
      container?.addEventListener("selectstart", handleRange);
    }

    return () => {
      window.removeEventListener("mousedown", handleStart);
      window.removeEventListener("touchstart", handleStart);
      window.removeEventListener("keydown", handleEnd);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchend", handleEnd);

      if (isMobile) {
        container?.removeEventListener("selectstart", handleRange);
      }
    };
  }, [refs, containerRef, isMobile]);

  return (
    isOpen &&
    (isMobile ? (
      <FloatingPortal>
        <div
          ref={refs.setFloating}
          className="fixed inset-x-0 z-[1000]"
          style={{
            bottom: `calc(env(safe-area-inset-bottom) + ${bottomOffset}px)`,
          }}
          {...getFloatingProps()}
        >
          {children}
        </div>
      </FloatingPortal>
    ) : (
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className="z-[1000]"
        {...getFloatingProps()}
      >
        {children}
      </div>
    ))
  );
}
