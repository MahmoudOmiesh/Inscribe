import { useCallback, useRef, useState, type RefObject } from "react";
import { applyOperation } from "../operations";
import type {
  EditorNode,
  Mark,
  Operation,
  PendingCaretPosition,
  SelectionRange,
} from "../utils/types";
import { commands } from "../commands";
import { getSelectionRange } from "../utils/range";
import { useThrottleCallback } from "@/hooks/use-throttle-callback";

interface useEditorOperationsProps {
  nodes: EditorNode[];
  setNodes: (nodes: EditorNode[]) => void;
  setPendingCaretPosition: (position: PendingCaretPosition) => void;

  activeMarks: Mark["type"][];
  setActiveMarks: (activeMarks: Mark["type"][]) => void;

  preserveActiveMarksAtCurrentPosition: () => void;

  nodeIdIndexMapRef: RefObject<Map<string, number>>;
}

const UNDO_REDO_STACK_MAX_LENGTH = 5;
interface UndoRedoStack {
  nodes: EditorNode[];
  selectionRange: SelectionRange;
}

export function useEditorOperations({
  nodes,
  setNodes,
  activeMarks,
  setActiveMarks,
  setPendingCaretPosition,
  preserveActiveMarksAtCurrentPosition,
  nodeIdIndexMapRef,
}: useEditorOperationsProps) {
  const [canUndoRedo, setCanUndoRedo] = useState([false, false]);
  const undoStackRef = useRef<UndoRedoStack[]>([]);
  const redoStackRef = useRef<UndoRedoStack[]>([]);

  const updateCanUndoRedo = useCallback(() => {
    const undoStack = undoStackRef.current;
    const redoStack = redoStackRef.current;
    setCanUndoRedo([undoStack.length > 0, redoStack.length > 0] as const);
  }, []);

  const updateUndoStack = useThrottleCallback(
    (nodes: EditorNode[], selectionRange: SelectionRange) => {
      const undoStack = undoStackRef.current;
      if (undoStack.length >= UNDO_REDO_STACK_MAX_LENGTH) {
        undoStack.shift();
      }
      undoStack.push({ nodes, selectionRange });

      redoStackRef.current = [];

      updateCanUndoRedo();
    },
    500,
  );

  const updateNodeIdIndexMap = useCallback(
    (oldNodes: EditorNode[], newNodes: EditorNode[]) => {
      if (
        newNodes.length !== oldNodes.length ||
        newNodes.some((node, i) => node.id !== oldNodes[i]?.id)
      ) {
        nodeIdIndexMapRef.current.clear();
        newNodes.forEach((node, index) => {
          nodeIdIndexMapRef.current.set(node.id, index);
        });
      }
    },
    [nodeIdIndexMapRef],
  );

  const executeOperation = useCallback(
    (operation: Operation | null) => {
      if (!operation) return;

      const selectionRange = getSelectionRange();
      if (selectionRange) {
        updateUndoStack(nodes, selectionRange);
      }

      const { nodes: newNodes, newCaretPosition } = applyOperation(
        nodes,
        nodeIdIndexMapRef.current,
        activeMarks,
        operation,
      );

      updateNodeIdIndexMap(nodes, newNodes);
      setNodes(newNodes);
      if (newCaretPosition) setPendingCaretPosition(newCaretPosition);
    },
    [
      nodes,
      activeMarks,
      setNodes,
      setPendingCaretPosition,
      updateUndoStack,
      nodeIdIndexMapRef,
      updateNodeIdIndexMap,
    ],
  );

  const toggleMark = useCallback(
    (mark: Mark["type"]) => {
      const operation = commands.node.createToggleMarkCommand(mark);
      if (!operation) return;

      executeOperation(operation);

      if (operation.range.isCollapsed) {
        setActiveMarks(
          activeMarks.includes(mark)
            ? activeMarks.filter((m) => m !== mark)
            : [...activeMarks, mark],
        );

        preserveActiveMarksAtCurrentPosition();
      }
    },
    [
      activeMarks,
      setActiveMarks,
      executeOperation,
      preserveActiveMarksAtCurrentPosition,
    ],
  );

  const undo = useCallback(() => {
    const undoStack = undoStackRef.current;
    const selectionRange = getSelectionRange();
    if (undoStack.length === 0 || !selectionRange) return;

    const { nodes: previousNodes, selectionRange: previousSelectionRange } =
      undoStack.pop()!;
    setNodes(previousNodes);
    setPendingCaretPosition(previousSelectionRange);

    const redoStack = redoStackRef.current;
    if (redoStack.length >= UNDO_REDO_STACK_MAX_LENGTH) {
      redoStack.shift();
    }
    redoStack.push({
      nodes,
      selectionRange,
    });

    updateCanUndoRedo();
  }, [
    nodes,
    undoStackRef,
    redoStackRef,
    setNodes,
    setPendingCaretPosition,
    updateCanUndoRedo,
  ]);

  const redo = useCallback(() => {
    const redoStack = redoStackRef.current;
    const selectionRange = getSelectionRange();
    if (redoStack.length === 0 || !selectionRange) return;

    const { nodes: previousNodes, selectionRange: previousSelectionRange } =
      redoStack.pop()!;
    setNodes(previousNodes);
    setPendingCaretPosition(previousSelectionRange);

    undoStackRef.current.push({
      nodes,
      selectionRange,
    });

    updateCanUndoRedo();
  }, [
    nodes,
    redoStackRef,
    undoStackRef,
    setNodes,
    setPendingCaretPosition,
    updateCanUndoRedo,
  ]);

  return {
    // Text operations
    insertText: useCallback(
      (text: string) => {
        const operation = commands.text.createInsertTextCommand(text);
        executeOperation(operation);
      },
      [executeOperation],
    ),
    insertParagraph: useCallback(() => {
      const operation = commands.text.createInsertParagraphCommand(nodes);
      executeOperation(operation);
    }, [nodes, executeOperation]),
    pasteText: useCallback(
      (content: string, contentType: "plain" | "html") => {
        const operation = commands.text.createPasteTextCommand(
          content,
          contentType,
        );
        executeOperation(operation);
      },
      [executeOperation],
    ),

    // Delete operations
    deleteTextBackward: useCallback(() => {
      const operation = commands.delete.createDeleteBackwardCommand(nodes);
      executeOperation(operation);
    }, [nodes, executeOperation]),
    deleteWordBackward: useCallback(() => {
      const operation = commands.delete.createDeleteWordBackwardCommand(nodes);
      executeOperation(operation);
    }, [nodes, executeOperation]),
    deleteTextForward: useCallback(() => {
      const operation = commands.delete.createDeleteForewardCommand(nodes);
      executeOperation(operation);
    }, [nodes, executeOperation]),
    deleteWordForward: useCallback(() => {
      const operation = commands.delete.createDeleteWordForwardCommand(nodes);
      executeOperation(operation);
    }, [nodes, executeOperation]),
    deleteByCut: useCallback(() => {
      const operation = commands.delete.createDeleteByCutCommand();
      executeOperation(operation);
    }, [executeOperation]),

    // Node operations
    toggleMark,
    toggleNodeType: useCallback(
      (nodeType: EditorNode["type"]) => {
        const operation = commands.node.createToggleNodeTypeCommand(nodeType);
        executeOperation(operation);
      },
      [executeOperation],
    ),
    toggleNodeAlignment: useCallback(
      (alignment: EditorNode["alignment"]) => {
        const operation = commands.node.createToggleAlignmentCommand(alignment);
        executeOperation(operation);
      },
      [executeOperation],
    ),

    // Undo/Redo operations
    undo,
    canUndo: canUndoRedo[0],
    redo,
    canRedo: canUndoRedo[1],

    // List operations
    indentListItem: useCallback(() => {
      const operation = commands.node.createIndentListItemCommand();
      executeOperation(operation);
    }, [executeOperation]),
    unindentListItem: useCallback(() => {
      const operation = commands.node.createUnindentListItemCommand(nodes);
      executeOperation(operation);
    }, [nodes, executeOperation]),
  };
}
