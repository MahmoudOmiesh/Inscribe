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
  BlockType,
  EditorNode,
} from "../model/schema";
import { getSelectionRange, setSelectionRange } from "../input/selection-dom";
import {
  getActiveMarksOverRange,
  getActiveBlockType,
  getActiveBlockAlignment,
  isSameRange,
} from "../model/selection";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

export function useEditor(initialNodes: EditorNode[]) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef(new History());

  const [editorState, setEditorState] = useState<EditorState>(() => {
    const firstId = initialNodes[0]?.id ?? "missing";
    return createInitialEditorState(initialNodes, {
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
    // always refresh selection from DOM before building tx
    const sel = getSelectionRange();
    if (!sel) return editorState;

    return {
      ...editorState,
      selection: sel,
      typingMarks: active.marks,
    };
  }, [editorState, active.marks]);

  const dispatch = useCallback((tx: Transaction) => {
    const next = tx.apply();
    setEditorState((prev) => {
      historyRef.current.push(prev);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    setEditorState((cur) => historyRef.current.popUndo(cur) ?? cur);
  }, []);
  const redo = useCallback(() => {
    setEditorState((cur) => historyRef.current.popRedo(cur) ?? cur);
  }, []);

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

    const selectionChanged = !isSameRange(
      editorState.selection,
      currentSelectionRange,
    );

    if (selectionChanged) {
      setEditorState((prev) => ({
        ...prev,
        typingMarks: activeMarks,
      }));
    }

    const typingMarks =
      !selectionChanged && currentSelectionRange.isCollapsed
        ? editorState.typingMarks
        : activeMarks;

    setActive({
      marks: typingMarks,
      block: activeBlockType,
      align: activeBlockAlignment,
    });
  }, [editorState]);

  const handleSelect = useDebouncedCallback(_handleSelect, 16);

  // Sync DOM selection after state changes
  useEffect(() => {
    setSelectionRange(editorState.selection);
  }, [editorState.selection, editorState.nodes]);

  useEffect(() => {
    handleSelect();
  }, [editorState, handleSelect]);

  // useEffect(() => {
  //   console.log("NODES", editorState.nodes);
  // }, [editorState.nodes]);

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
    activeMarks: active.marks,
    activeBlockType: active.block,
    activeAlignment: active.align,
  };
}
