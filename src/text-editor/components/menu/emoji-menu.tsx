import {
  autoUpdate,
  flip,
  offset,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { useEffect, useRef, useState } from "react";
import type { useEditorActions } from "../../hooks/use-editor-actions";
import { getSelectionRange } from "../../input/selection-dom";
import type { SelectionRange } from "../../model/selection";
import { deleteCharStep } from "../../steps/delete-char";
import {
  ListEmojiPicker,
  ListEmojiPickerSearch,
  ListEmojiPickerContent,
} from "@/components/ui/list-emoji-picker";
import { insertTextStep } from "../../steps/insert-text";
import { setRangeStep } from "@/text-editor/steps/set-range";

export function EmojiMenu({
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
  const inputRef = useRef<HTMLInputElement>(null);

  const rangeRef = useRef<SelectionRange | null>(getSelectionRange());

  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-start",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [flip(), offset(8)],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context, {
    escapeKey: false,
  });

  const { getFloatingProps } = useInteractions([dismiss]);

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

  function executeCommand(emoji: string) {
    if (!rangeRef.current) return;

    actions.customCommand([
      setRangeStep({
        ...rangeRef.current.start,
        offset: rangeRef.current.start.offset + 1,
      }),
      deleteCharStep("backward"),
      insertTextStep(`${emoji} `),
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
    }
  }

  return (
    isOpen &&
    isPositioned && (
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        {...getFloatingProps()}
      >
        <ListEmojiPicker
          className="z-50 h-[326px] rounded-lg border shadow-md"
          onEmojiSelect={(emoji) => executeCommand(emoji.emoji)}
        >
          <ListEmojiPickerSearch
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for an emoji"
            ref={inputRef}
          />
          <ListEmojiPickerContent />
        </ListEmojiPicker>
      </div>
    )
  );
}
