import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { useEditorActions } from "../hooks/use-editor-actions";
import { getSelectionRange } from "../input/selection-dom";
import { BLOCK_TYPES } from "../model/schema";
import type { SelectionRange } from "../model/selection";
import { renderBlockIcon, renderBlockLabel } from "./utils";
import { changeNodeTypeStep } from "../steps/change-node-type";
import { deleteCharStep } from "../steps/delete-char";

export function CommandMenu({
  isOpen,
  setIsOpen,
  actions,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  actions: ReturnType<typeof useEditorActions>;
}) {
  const [query, setQuery] = useState("");
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const rangeRef = useRef<SelectionRange | null>(getSelectionRange());

  const filteredCommands = useMemo(
    () =>
      BLOCK_TYPES.filter((type) =>
        renderBlockLabel(type).toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-start",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [flip(), shift(), offset(8)],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context, {
    escapeKey: false,
  });

  const { getFloatingProps } = useInteractions([dismiss]);

  useEffect(() => {
    setActiveCommandIndex((prev) =>
      Math.max(0, Math.min(prev, filteredCommands.length - 1)),
    );
  }, [filteredCommands]);

  useEffect(() => {
    const selection = window.getSelection();
    const range =
      typeof selection?.rangeCount === "number" && selection.rangeCount > 0
        ? selection.getRangeAt(0)
        : null;

    if (!range) {
      setIsOpen(false);
      return;
    }

    refs.setReference({
      getBoundingClientRect: () => range.getBoundingClientRect(),
    });
    setIsOpen(true);
    inputRef.current?.focus();
  }, [refs, setIsOpen]);

  function executeCommand() {
    if (rangeRef.current && filteredCommands[activeCommandIndex]) {
      actions.customCommand([
        changeNodeTypeStep(
          rangeRef.current.start.nodeId,
          filteredCommands[activeCommandIndex],
        ),
        deleteCharStep("backward"),
      ]);
      setIsOpen(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "Escape": {
        e.preventDefault();
        setIsOpen(false);
        if (rangeRef.current) {
          actions.setRange({
            ...rangeRef.current.start,
            offset: rangeRef.current.start.offset + 1,
          });
        }
        break;
      }
      case "Backspace": {
        if (query.length > 0) break;
        e.preventDefault();
        setIsOpen(false);
        actions.deleteBackward();
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        setActiveCommandIndex((prev) =>
          Math.min(prev + 1, filteredCommands.length - 1),
        );
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setActiveCommandIndex((prev) => Math.max(prev - 1, 0));
        break;
      }
      case "Enter": {
        e.preventDefault();
        executeCommand();
        break;
      }
    }
  }

  return (
    isOpen && (
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className="bg-background border-border rounded-md border p-1 shadow-md"
        {...getFloatingProps()}
      >
        <Input
          type="text"
          placeholder="Search for a command..."
          className="bg-background dark:bg-background h-fit w-full border-none px-2 py-1 text-xs outline-none focus-visible:ring-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />

        <Separator className="my-1" />
        {filteredCommands.length > 0 ? (
          <>
            <div className="px-2 py-1.5 text-xs font-medium">Style</div>
            <ul className="flex flex-col gap-1">
              {filteredCommands.map((type, index) => (
                <li key={type}>
                  <Button
                    variant={activeCommandIndex === index ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start transition-none"
                    onClick={executeCommand}
                  >
                    {renderBlockIcon(type)}
                    <span className="text-xs">{renderBlockLabel(type)}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="px-2 py-1.5 text-center text-xs font-medium italic">
            No commands found
          </div>
        )}
      </div>
    )
  );
}
