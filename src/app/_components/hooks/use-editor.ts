import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  PendingCaretPosition,
  CaretPosition,
  EditorNode,
  Mark,
  SelectionRange,
} from "../utils/types";
import { getSelectionRange, setSelectionRange } from "../utils/range";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

export function useEditor(initialNodes: EditorNode[]) {
  const [nodes, setNodes] = useState(initialNodes);
  const [activeMarks, setActiveMarks] = useState<Mark["type"][]>([]);
  const [activeNodeType, setActiveNodeType] = useState<
    EditorNode["type"] | null
  >(null);
  const [activeNodeAlignment, setActiveNodeAlignment] = useState<
    EditorNode["alignment"] | null
  >(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const nodeIdIndexMapRef = useRef<Map<string, number>>(
    new Map(initialNodes.map((node, index) => [node.id, index])),
  );
  const pendingCaretPositionRef = useRef<PendingCaretPosition | null>(null);
  const preserveActiveMarksAtPositionRef = useRef<CaretPosition | null>(null);

  const getActiveMarks = useMemo(() => {
    const cache = new Map<string, Mark["type"][]>();

    return (range: SelectionRange) => {
      const cacheKey = `${range.start.nodeId}:${range.start.offset}-${range.end.nodeId}:${range.end.offset}`;
      const cachedMarks = cache.get(cacheKey);
      if (cachedMarks) return cachedMarks;

      if (range.start.nodeId === range.end.nodeId) {
        const nodeIndex = nodeIdIndexMapRef.current.get(range.start.nodeId);
        if (nodeIndex === undefined) return;

        const node = nodes[nodeIndex]!;
        const marks = node.marks.filter(
          (m) =>
            m.start <= range.start.offset - Number(range.isCollapsed) &&
            m.end >= range.end.offset,
        );

        return marks.map((m) => m.type);
      }

      const firstNodeIndex = nodeIdIndexMapRef.current.get(range.start.nodeId);
      const lastNodeIndex = nodeIdIndexMapRef.current.get(range.end.nodeId);
      if (firstNodeIndex === undefined || lastNodeIndex === undefined) return;

      const firstNode = nodes[firstNodeIndex]!;
      const lastNode = nodes[lastNodeIndex]!;

      const firstNodeMarks = firstNode.marks.filter(
        (m) => m.start <= range.start.offset && m.end === firstNode.text.length,
      );
      const middleMarks = nodes
        .slice(firstNodeIndex + 1, lastNodeIndex)
        .flatMap((n) =>
          n.marks.filter((m) => m.start === 0 && m.end === n.text.length),
        );
      const lastNodeMarks = lastNode.marks.filter(
        (m) => m.start === 0 && m.end >= range.end.offset,
      );

      const commonMarks = firstNodeMarks.filter((m) => {
        const doesMiddleExist = lastNodeIndex - firstNodeIndex > 1;
        return (
          (doesMiddleExist
            ? middleMarks.some((m2) => m.type === m2.type)
            : true) && lastNodeMarks.some((m2) => m.type === m2.type)
        );
      });

      const marks = commonMarks.map((m) => m.type);
      cache.set(cacheKey, marks);
      return marks;
    };
  }, [nodes]);

  const getActiveNodeType = useCallback(
    (range: SelectionRange) => {
      const firstNodeIndex = nodeIdIndexMapRef.current.get(range.start.nodeId);
      const lastNodeIndex = nodeIdIndexMapRef.current.get(range.end.nodeId);
      if (firstNodeIndex === undefined || lastNodeIndex === undefined)
        return null;

      const firstNode = nodes[firstNodeIndex]!;

      const type = firstNode.type;
      for (let i = firstNodeIndex + 1; i <= lastNodeIndex; i++) {
        const node = nodes[i]!;
        if (node.type !== type) return null;
      }

      return type;
    },
    [nodes],
  );

  const getActiveNodeAlignment = useCallback(
    (range: SelectionRange) => {
      const firstNodeIndex = nodeIdIndexMapRef.current.get(range.start.nodeId);
      const lastNodeIndex = nodeIdIndexMapRef.current.get(range.end.nodeId);
      if (firstNodeIndex === undefined || lastNodeIndex === undefined)
        return null;

      const firstNode = nodes[firstNodeIndex]!;

      const alignment = firstNode.alignment;
      for (let i = firstNodeIndex + 1; i <= lastNodeIndex; i++) {
        const node = nodes[i]!;
        if (node.alignment !== alignment) return null;
      }

      return alignment;
    },
    [nodes],
  );

  const _handleSelect = useCallback(() => {
    const currentSelectionRange = getSelectionRange();

    if (!currentSelectionRange) return;

    const activeNodeType = getActiveNodeType(currentSelectionRange);
    setActiveNodeType(activeNodeType);

    const activeNodeAlignment = getActiveNodeAlignment(currentSelectionRange);
    setActiveNodeAlignment(activeNodeAlignment);

    const preservePosition = preserveActiveMarksAtPositionRef.current;
    const shouldPreserveActiveMarks =
      currentSelectionRange.isCollapsed &&
      preservePosition &&
      preservePosition.nodeId === currentSelectionRange.start.nodeId &&
      preservePosition.offset === currentSelectionRange.start.offset;

    if (shouldPreserveActiveMarks) {
      return;
    }

    const activeMarks = getActiveMarks(currentSelectionRange);
    setActiveMarks(activeMarks ?? []);
    preserveActiveMarksAtPositionRef.current = null;
  }, [getActiveMarks, getActiveNodeType, getActiveNodeAlignment]);

  const handleSelect = useDebouncedCallback(_handleSelect, 16);

  const setPendingCaretPosition = useCallback(
    (position: PendingCaretPosition) => {
      pendingCaretPositionRef.current = position;
    },
    [],
  );

  const preserveActiveMarksAtCurrentPosition = useCallback(() => {
    const range = getSelectionRange();
    if (!range?.isCollapsed) return;

    preserveActiveMarksAtPositionRef.current = range.start;
  }, []);

  useEffect(() => {
    console.log("NODES", nodes);

    const position = pendingCaretPositionRef.current;
    if (!position) return;

    setSelectionRange(position);
    pendingCaretPositionRef.current = null;
  }, [nodes]);

  useEffect(() => {
    handleSelect();
  }, [nodes, handleSelect]);

  return {
    nodes,
    setNodes,
    setPendingCaretPosition,

    activeMarks,
    setActiveMarks,
    preserveActiveMarksAtCurrentPosition,

    activeNodeType,
    activeNodeAlignment,

    handleSelect,

    ref: editorRef,
    nodeIdIndexMapRef: nodeIdIndexMapRef,
  };
}
