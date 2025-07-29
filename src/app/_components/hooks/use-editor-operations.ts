import { useCallback, type RefObject } from "react";
import { applyOperation } from "../operations";
import type {
  EditorNode,
  Mark,
  Operation,
  PendingCaretPosition,
  SelectionRange,
} from "../utils/types";
import { commands } from "../commands";
import { setSelectionRange } from "../utils/range";

interface useEditorOperationsProps {
  nodes: EditorNode[];
  setNodes: (nodes: EditorNode[]) => void;
  activeMarks: Mark["type"][];
  setActiveMarks: (activeMarks: Mark["type"][]) => void;
  setPendingCaretPosition: (position: PendingCaretPosition) => void;
  undoStackRef: RefObject<
    {
      nodes: EditorNode[];
      selectionRange: SelectionRange;
    }[]
  >;
  redoStackRef: RefObject<
    {
      nodes: EditorNode[];
      selectionRange: SelectionRange;
    }[]
  >;
}

export function useEditorOperations({
  nodes,
  setNodes,
  activeMarks,
  setActiveMarks,
  setPendingCaretPosition,
  undoStackRef,
  redoStackRef,
}: useEditorOperationsProps) {
  const executeOperation = useCallback(
    (operation: Operation | null) => {
      if (!operation) return;

      const { nodes: newNodes, newCaretPosition } = applyOperation(
        nodes,
        activeMarks,
        operation,
      );
      setNodes(newNodes);
      if (newCaretPosition) setPendingCaretPosition(newCaretPosition);
    },
    [nodes, activeMarks, setNodes, setPendingCaretPosition],
  );

  const toggleMark = useCallback(
    (mark: Mark["type"]) => {
      const operation = commands.mark.createToggleMarkCommand(mark);
      if (!operation) return;

      const { nodes: newNodes, newCaretPosition } = applyOperation(
        nodes,
        activeMarks,
        operation,
      );

      setNodes(newNodes);
      if (newCaretPosition) setPendingCaretPosition(newCaretPosition);

      if (operation.range.isCollapsed) {
        setActiveMarks(
          activeMarks.includes(mark)
            ? activeMarks.filter((m) => m !== mark)
            : [...activeMarks, mark],
        );

        // if the range is collapsed and the mark is to be added
        // the nodes don't change
        // so we need to set the selection range manually
        if (newCaretPosition && newNodes === nodes)
          setSelectionRange(newCaretPosition);
      }
    },
    [activeMarks, setActiveMarks, setPendingCaretPosition, setNodes, nodes],
  );

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
      const operation = commands.text.createInsertParagraphCommand();
      executeOperation(operation);
    }, [executeOperation]),
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

    // Mark operations
    toggleMark,
  };
}
