"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type {
  CaretPosition,
  EditorNode,
  Mark,
  SelectionRange,
} from "./utils/types";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  compareSelectionRanges,
  getSelectionRange,
  setSelectionRange,
} from "./utils/range";
import { applyOperation } from "./operations";
import { NoteContent } from "./components/note-content";
import { Button } from "@/components/ui/button";

export function NoteEditor() {
  const [activeMarks, setActiveMarks] = useState<Mark["type"][]>([]);

  const [nodes, setNodes] = useState<EditorNode[]>([
    {
      id: "20ce649b-df96-447c-b90a-5715989b02c4",
      type: "heading-1",
      text: "Heading bold not bold",
      marks: [
        { type: "italic", start: 3, end: 4 },
        { type: "bold", start: 8, end: 12 },
      ],
    },
    {
      id: "cb7929b8-77a4-4fa0-8b4a-c3d190e5dfb8",
      type: "paragraph",
      text: "Hello, world!",
      marks: [
        {
          type: "bold",
          start: 0,
          end: 5,
        },
      ],
    },
    {
      id: "12345678-1234-1234-1234-123456789012",
      type: "paragraph",
      text: "",
      marks: [],
    },
  ]);

  const editorRef = useRef<HTMLDivElement>(null);
  const previousSelectionRangeRef = useRef<SelectionRange | null>(null);
  const pendingCaretPositionRef = useRef<
    CaretPosition | { start: CaretPosition; end: CaretPosition } | null
  >(null);

  function getActiveMarks() {
    const range = getSelectionRange();
    if (!range) return;

    if (range.start.nodeId === range.end.nodeId) {
      const node = nodes.find((n) => n.id === range.start.nodeId);
      if (!node) return;

      const marks = node.marks.filter(
        (m) =>
          m.start <= range.start.offset - Number(range.isCollapsed) &&
          m.end >= range.end.offset,
      );

      return marks.map((m) => m.type);
    }

    const firstNodeIdx = nodes.findIndex((n) => n.id === range.start.nodeId);
    const lastNodeIdx = nodes.findIndex((n) => n.id === range.end.nodeId);
    if (firstNodeIdx === -1 || lastNodeIdx === -1) return;

    const firstNode = nodes[firstNodeIdx]!;
    const lastNode = nodes[lastNodeIdx]!;

    const firstNodeMarks = firstNode.marks.filter(
      (m) => m.start <= range.start.offset && m.end === firstNode.text.length,
    );
    const middleMarks = nodes
      .slice(firstNodeIdx + 1, lastNodeIdx)
      .flatMap((n) =>
        n.marks.filter((m) => m.start === 0 && m.end === n.text.length),
      );
    const lastNodeMarks = lastNode.marks.filter(
      (m) => m.start === 0 && m.end >= range.end.offset,
    );

    const commonMarks = firstNodeMarks.filter((m) => {
      const doesMiddleExist = lastNodeIdx - firstNodeIdx > 1;
      return (
        (doesMiddleExist
          ? middleMarks.some((m2) => m.type === m2.type)
          : true) && lastNodeMarks.some((m2) => m.type === m2.type)
      );
    });

    return commonMarks.map((m) => m.type);
  }

  const toggleMark = useCallback(
    (mark: Mark["type"]) => {
      const selectionRange = getSelectionRange();
      if (!selectionRange) return;

      const { nodes: newNodes, newCaretPosition } = applyOperation(
        nodes,
        activeMarks,
        {
          type: "toggleMark",
          markType: mark,
          range: selectionRange,
        },
      );

      setNodes(newNodes);
      pendingCaretPositionRef.current = newCaretPosition;

      if (selectionRange.isCollapsed) {
        if (activeMarks.includes(mark)) {
          setActiveMarks(activeMarks.filter((m) => m !== mark));
        } else {
          setActiveMarks([...activeMarks, mark]);
        }
        if (newCaretPosition) setSelectionRange(newCaretPosition);
      }
    },
    [activeMarks, nodes],
  );

  const handleBeforeInput = useCallback(
    (e: InputEvent) => {
      const selectionRange = getSelectionRange();
      if (!selectionRange) return;

      const { inputType, data } = e;
      console.log("INPUT TYPE", inputType);

      switch (inputType) {
        case "insertText": {
          e.preventDefault();
          const text = data ?? "";
          const { nodes: newNodes, newCaretPosition } = applyOperation(
            nodes,
            activeMarks,
            {
              type: "insertText",
              text,
              range: selectionRange,
            },
          );
          setNodes(newNodes);
          pendingCaretPositionRef.current = newCaretPosition;
          break;
        }
        case "deleteContentBackward": {
          e.preventDefault();
          if (selectionRange.isCollapsed && selectionRange.start.offset === 0) {
            const nodeIdx = nodes.findIndex(
              (n) => n.id === selectionRange.start.nodeId,
            );
            if (nodeIdx === -1 || nodeIdx === 0) return;

            const node = nodes[nodeIdx]!;
            const prevNode = nodes[nodeIdx - 1]!;

            const { nodes: newNodes, newCaretPosition } = applyOperation(
              nodes,
              activeMarks,
              {
                type: "mergeNodes",
                firstNodeId: prevNode.id,
                secondNodeId: node.id,
                range: selectionRange,
              },
            );
            setNodes(newNodes);
            pendingCaretPositionRef.current = newCaretPosition;
            break;
          }
          const { nodes: newNodes, newCaretPosition } = applyOperation(
            nodes,
            activeMarks,
            {
              type: "deleteTextBackward",
              range: selectionRange,
            },
          );
          setNodes(newNodes);
          pendingCaretPositionRef.current = newCaretPosition;
          break;
        }
        case "deleteContentForward": {
          e.preventDefault();
          const nodeIdx = nodes.findIndex(
            (n) => n.id === selectionRange.start.nodeId,
          );
          if (nodeIdx === -1) return;

          if (
            selectionRange.isCollapsed &&
            selectionRange.start.offset === nodes[nodeIdx]!.text.length
          ) {
            if (nodeIdx === nodes.length - 1) return;

            const node = nodes[nodeIdx]!;
            const nextNode = nodes[nodeIdx + 1]!;

            const { nodes: newNodes, newCaretPosition } = applyOperation(
              nodes,
              activeMarks,
              {
                type: "mergeNodes",
                firstNodeId: node.id,
                secondNodeId: nextNode.id,
                range: selectionRange,
              },
            );
            setNodes(newNodes);
            pendingCaretPositionRef.current = newCaretPosition;
            break;
          }
          const { nodes: newNodes, newCaretPosition } = applyOperation(
            nodes,
            activeMarks,
            {
              type: "deleteTextForward",
              range: selectionRange,
            },
          );
          setNodes(newNodes);
          pendingCaretPositionRef.current = newCaretPosition;
          break;
        }
        case "deleteWordBackward": {
          e.preventDefault();
          console.log("DELETE WORD BACKWARD");
          if (selectionRange.isCollapsed && selectionRange.start.offset === 0) {
            console.log("HI");
            const nodeIdx = nodes.findIndex(
              (n) => n.id === selectionRange.start.nodeId,
            );
            if (nodeIdx === -1 || nodeIdx === 0) return;

            const node = nodes[nodeIdx]!;
            const prevNode = nodes[nodeIdx - 1]!;

            const { nodes: newNodes, newCaretPosition } = applyOperation(
              nodes,
              activeMarks,
              {
                type: "mergeNodes",
                firstNodeId: prevNode.id,
                secondNodeId: node.id,
                range: selectionRange,
              },
            );
            setNodes(newNodes);
            pendingCaretPositionRef.current = newCaretPosition;
            break;
          }
          const { nodes: newNodes, newCaretPosition } = applyOperation(
            nodes,
            activeMarks,
            {
              type: "deleteWordBackward",
              range: selectionRange,
            },
          );
          setNodes(newNodes);
          pendingCaretPositionRef.current = newCaretPosition;
          break;
        }
        case "deleteWordForward": {
          e.preventDefault();
          const nodeIdx = nodes.findIndex(
            (n) => n.id === selectionRange.start.nodeId,
          );
          if (nodeIdx === -1) return;

          if (
            selectionRange.isCollapsed &&
            selectionRange.start.offset === nodes[nodeIdx]!.text.length
          ) {
            if (nodeIdx === nodes.length - 1) return;

            const node = nodes[nodeIdx]!;
            const nextNode = nodes[nodeIdx + 1]!;

            const { nodes: newNodes, newCaretPosition } = applyOperation(
              nodes,
              activeMarks,
              {
                type: "mergeNodes",
                firstNodeId: node.id,
                secondNodeId: nextNode.id,
                range: selectionRange,
              },
            );
            setNodes(newNodes);
            pendingCaretPositionRef.current = newCaretPosition;
            break;
          }
          const { nodes: newNodes, newCaretPosition } = applyOperation(
            nodes,
            activeMarks,
            {
              type: "deleteWordForward",
              range: selectionRange,
            },
          );
          setNodes(newNodes);
          pendingCaretPositionRef.current = newCaretPosition;
          break;
        }
        case "insertParagraph": {
          e.preventDefault();
          const newNodeId = crypto.randomUUID();
          const { nodes: newNodes, newCaretPosition } = applyOperation(
            nodes,
            activeMarks,
            {
              type: "insertParagraph",
              range: selectionRange,
              newNodeId,
            },
          );
          setNodes(newNodes);
          pendingCaretPositionRef.current = newCaretPosition;
          break;
        }
        case "formatBold": {
          e.preventDefault();
          toggleMark("bold");
          break;
        }
        case "formatItalic": {
          e.preventDefault();
          toggleMark("italic");
          break;
        }
        case "formatUnderline": {
          e.preventDefault();
          toggleMark("underline");
          break;
        }
        case "formatStrikethrough": {
          e.preventDefault();
          toggleMark("strikethrough");
          break;
        }
      }
    },
    [nodes, activeMarks, toggleMark],
  );

  function handleSelect() {
    const currentSelectionRange = getSelectionRange();
    const previousSelectionRange = previousSelectionRangeRef.current;

    if (compareSelectionRanges(currentSelectionRange, previousSelectionRange))
      return;

    const activeMarks = getActiveMarks();
    previousSelectionRangeRef.current = currentSelectionRange;
    setActiveMarks(activeMarks ?? []);
  }

  useEffect(() => {
    // on before input is added with an event listener
    // rather than with onBeforeInput prop
    // because react nativeEvent doesn't contain
    // the event data that comes with the event
    // natively in the browser
    const editor = editorRef.current;
    if (!editor) return;

    editor.addEventListener("beforeinput", handleBeforeInput);
    return () => {
      editor.removeEventListener("beforeinput", handleBeforeInput);
    };
  }, [handleBeforeInput]);

  useEffect(() => {
    console.log("NODES", nodes);

    const position = pendingCaretPositionRef.current;
    if (!position) return;
    setSelectionRange(position);
    pendingCaretPositionRef.current = null;
  }, [nodes]);

  return (
    <Card className="w-xl">
      <CardContent>
        <div
          ref={editorRef}
          onSelect={handleSelect}
          contentEditable
          suppressContentEditableWarning
          className="space-y-2 p-0.5 whitespace-pre outline-none"
        >
          <NoteContent nodes={nodes} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          variant={`${activeMarks.includes("bold") ? "default" : "outline"}`}
          onClick={() => toggleMark("bold")}
        >
          Bold
        </Button>
        <Button
          variant={`${activeMarks.includes("italic") ? "default" : "outline"}`}
          onClick={() => toggleMark("italic")}
        >
          Italic
        </Button>
        <Button
          variant={`${activeMarks.includes("underline") ? "default" : "outline"}`}
          onClick={() => toggleMark("underline")}
        >
          Underline
        </Button>
        <Button
          variant={`${activeMarks.includes("strikethrough") ? "default" : "outline"}`}
          onClick={() => toggleMark("strikethrough")}
        >
          Strikethrough
        </Button>
        <Button
          variant={`${activeMarks.includes("superscript") ? "default" : "outline"}`}
          onClick={() => toggleMark("superscript")}
        >
          Superscript
        </Button>
        <Button
          variant={`${activeMarks.includes("subscript") ? "default" : "outline"}`}
          onClick={() => toggleMark("subscript")}
        >
          Subscript
        </Button>
        <Button
          variant={`${activeMarks.includes("highlight-yellow") ? "default" : "outline"}`}
          onClick={() => toggleMark("highlight-yellow")}
        >
          Highlight Yellow
        </Button>
      </CardFooter>
    </Card>
  );
}

// TODO
// - deal with new line handling (br)
// - fix the mark renderer
// - make the active marks update after a toggle mark operation
// - insertReplacementText operation
// - support for copy, paste, cut
// - support for undo, redo
// - performance improvements (map for getting idx from id, etc)
// - deal with other input types (deleteForward, etc)
// - changing the alignment of the text
// - support for lists (unordered, ordered, task)
// - general clean up for the code
// - imrpove the ui

// - support for images
// - support for links
// - support for code blocks and blockquotes
// - support for arabic?
