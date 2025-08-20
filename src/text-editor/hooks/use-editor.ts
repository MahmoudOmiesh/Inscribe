import { useCallback, useEffect, useRef, useState } from "react";
import {
  createInitialEditorState,
  type EditorState,
} from "../state/editor-state";
import { History } from "../state/history";
import type { Transaction } from "../state/transaction";
import type {
  ActiveMarkDescriptor,
  Alignment,
  EditorNode,
  BlockType,
} from "../model/schema";
import { getSelectionRange, setSelectionRange } from "../input/selection-dom";
import {
  getActiveMarksOverRange,
  getActiveBlockType,
  getActiveBlockAlignment,
  isSameRange,
  type SelectionRange,
} from "../model/selection";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useThrottleCallback } from "@/hooks/use-throttle-callback";

export function useEditor(initialNodes?: EditorNode[]) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef(new History());
  const preserveAtRef = useRef<SelectionRange | null>(null);

  const [editorState, setEditorState] = useState<EditorState>(() => {
    const firstId = initialNodes?.[0]?.id ?? "missing";
    return createInitialEditorState(initialNodes ?? [], {
      start: { nodeId: firstId, offset: 0 },
      end: { nodeId: firstId, offset: 0 },
      isCollapsed: true,
    });
  });

  const [active, setActive] = useState<{
    marks: ActiveMarkDescriptor[];
    block: BlockType | null;
    align: Alignment | null;
  }>({
    marks: [],
    block: null,
    align: null,
  });

  const getState = useCallback(() => {
    const sel = getSelectionRange();
    if (!sel) return editorState;

    const preserve =
      sel.isCollapsed &&
      preserveAtRef.current &&
      isSameRange(sel, preserveAtRef.current);

    return {
      ...editorState,
      selection: sel,
      typingMarks: preserve ? editorState.typingMarks : active.marks,
    };
  }, [editorState, active.marks]);

  const throttledHistoryPush = useThrottleCallback((prev: EditorState) => {
    historyRef.current.push(prev);
  }, 500);

  const dispatch = useCallback(
    (tx: Transaction) => {
      const next = tx.apply();
      const sel = getSelectionRange();

      throttledHistoryPush({
        ...editorState,
        selection: sel ?? editorState.selection,
      });
      setEditorState(next);
    },
    [throttledHistoryPush, editorState],
  );

  const undo = useCallback(() => {
    const prev = historyRef.current.popUndo(editorState);
    if (!prev) return;
    setEditorState(prev);
  }, [editorState]);

  const redo = useCallback(() => {
    const next = historyRef.current.popRedo(editorState);
    if (!next) return;
    setEditorState(next);
  }, [editorState]);

  const canUndo = historyRef.current.canUndo();
  const canRedo = historyRef.current.canRedo();

  const _handleSelect = useCallback(() => {
    const currentSelectionRange = getSelectionRange();
    if (!currentSelectionRange) return;

    const activeBlockType = getActiveBlockType(
      editorState.nodes,
      editorState.nodeIdIndex,
      currentSelectionRange,
    );
    const activeBlockAlignment = getActiveBlockAlignment(
      editorState.nodes,
      editorState.nodeIdIndex,
      currentSelectionRange,
    );
    const activeMarks = getActiveMarksOverRange(
      editorState.nodes,
      editorState.nodeIdIndex,
      currentSelectionRange,
    );

    const preserve =
      currentSelectionRange.isCollapsed &&
      preserveAtRef.current &&
      isSameRange(currentSelectionRange, preserveAtRef.current);

    const displayMarks = preserve ? editorState.typingMarks : activeMarks;

    if (!preserve) {
      preserveAtRef.current = null;
    }

    setActive({
      marks: displayMarks,
      block: activeBlockType,
      align: activeBlockAlignment,
    });
  }, [editorState]);

  const handleSelect = useDebouncedCallback(_handleSelect, 16);

  const preserveTypingMarksAtCurrentPosition = useCallback(() => {
    const sel = getSelectionRange();
    if (sel?.isCollapsed) {
      preserveAtRef.current = sel;
    }
  }, []);

  // Sync DOM selection after state changes
  useEffect(() => {
    // console.log("editorState.nodes", editorState.nodes);
    setSelectionRange(editorState.selection);
  }, [editorState.selection, editorState.nodes]);

  useEffect(() => {
    handleSelect();
  }, [editorState, handleSelect]);

  return {
    editorRef,
    state: editorState,
    getState,
    dispatch,
    undo,
    redo,
    canUndo,
    canRedo,
    handleSelect,
    preserveTypingMarksAtCurrentPosition,
    active,
  };
}
