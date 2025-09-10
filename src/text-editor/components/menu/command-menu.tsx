import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  autoUpdate,
  flip,
  inline,
  offset,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { useEditorActions } from "../../hooks/use-editor-actions";
import { getSelectionRange } from "../../input/selection-dom";
import {
  BLOCK_TYPES,
  TEXT_BLOCK_TYPES,
  type BlockType,
  type TextBlockType,
} from "../../model/schema";
import type { SelectionRange } from "../../model/selection";
import { renderBlockIcon, renderBlockLabel } from "../utils";
import { changeNodeTypeStep } from "../../steps/change-node-type";
import { deleteCharStep } from "../../steps/delete-char";
import { insertNodeAfterStep } from "@/text-editor/steps/insert-node-after";
import { setRangeStep } from "@/text-editor/steps/set-range";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [isPositioned, setIsPositioned] = useState(false);
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Map<string, HTMLLIElement | null>>(new Map());

  const rangeRef = useRef<SelectionRange | null>(getSelectionRange());

  const { filteredCommands, styleCommands, insertCommands } = useMemo(() => {
    const filteredCommands: BlockType[] = [];
    const styleCommands: TextBlockType[] = [];
    const insertCommands: BlockType[] = [];

    for (const type of BLOCK_TYPES) {
      const label = renderBlockLabel(type);
      if (!label.toLowerCase().includes(query.toLowerCase())) {
        continue;
      }

      filteredCommands.push(type);
      if (TEXT_BLOCK_TYPES.includes(type as TextBlockType)) {
        styleCommands.push(type as TextBlockType);
      } else {
        insertCommands.push(type);
      }
    }

    return {
      filteredCommands,
      styleCommands,
      insertCommands,
    };
  }, [query]);

  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-start",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [inline(), flip(), offset(8)],
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
    requestAnimationFrame(() => {
      if (!isOpen) {
        setIsPositioned(false);
        return;
      }

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
        getClientRects: () => range.getClientRects(),
      });
      setIsPositioned(true);
    });
  }, [refs, isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen && isPositioned) {
      inputRef.current?.focus({
        preventScroll: true,
      });
    }
  }, [isOpen, isPositioned]);

  function executeCommand(index?: number) {
    const commandIndex = index ?? activeCommandIndex;
    const chosen = filteredCommands[commandIndex];
    if (!rangeRef.current || !chosen) return;

    actions.customCommand([
      chosen === "separator"
        ? insertNodeAfterStep(rangeRef.current.start.nodeId, "separator")
        : changeNodeTypeStep(rangeRef.current.start.nodeId, chosen),
      setRangeStep({
        ...rangeRef.current.start,
        offset: rangeRef.current.start.offset + 1,
      }),
      deleteCharStep("backward"),
    ]);
    setIsOpen(false);
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
        const nextIndex = Math.min(
          activeCommandIndex + 1,
          filteredCommands.length - 1,
        );
        setActiveCommandIndex(nextIndex);

        const item = itemRefs.current.get(filteredCommands[nextIndex]!);
        if (item) {
          item.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }

        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const nextIndex = Math.max(activeCommandIndex - 1, 0);
        setActiveCommandIndex(nextIndex);

        const item = itemRefs.current.get(filteredCommands[nextIndex]!);
        if (item) {
          item.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }

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
    isOpen &&
    isPositioned && (
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className="bg-background border-border z-50 rounded-md border p-1 shadow-md"
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
        <ScrollArea className="h-[250px]">
          {styleCommands.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-medium">Style</div>
              <ul className="flex flex-col gap-1">
                {styleCommands.map((type, index) => (
                  <li
                    key={type}
                    ref={(li) => {
                      itemRefs.current.set(type, li);
                      return () => {
                        itemRefs.current.delete(type);
                      };
                    }}
                  >
                    <Button
                      variant={
                        activeCommandIndex === index ? "default" : "ghost"
                      }
                      size="sm"
                      className="w-full justify-start transition-none"
                      onClick={() => executeCommand(index)}
                    >
                      {renderBlockIcon(type)}
                      <span className="text-xs">{renderBlockLabel(type)}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {insertCommands.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-medium">Insert</div>
              <ul className="flex flex-col gap-1">
                {insertCommands.map((type, index) => (
                  <li
                    key={type}
                    ref={(li) => {
                      itemRefs.current.set(type, li);
                      return () => {
                        itemRefs.current.delete(type);
                      };
                    }}
                  >
                    <Button
                      variant={
                        activeCommandIndex === styleCommands.length + index
                          ? "default"
                          : "ghost"
                      }
                      size="sm"
                      className="w-full justify-start transition-none"
                      onClick={() => executeCommand(index)}
                    >
                      {renderBlockIcon(type)}
                      <span className="text-xs">{renderBlockLabel(type)}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {filteredCommands.length === 0 && (
            <div className="px-2 py-1.5 text-center text-xs font-medium italic">
              No commands found
            </div>
          )}
        </ScrollArea>
      </div>
    )
  );
}
