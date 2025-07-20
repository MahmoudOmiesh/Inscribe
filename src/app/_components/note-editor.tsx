"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { CaretPosition, EditorNode } from "./types";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSelectionRange, setSelectionRange } from "./utils/range";
import { applyOperation } from "./operations";
import { getCaretPositionAfter } from "./caret-positions";
import { NoteContent } from "./components/note-content";
import { Button } from "@/components/ui/button";
import { getCaretPositionAfterMergeNodes } from "./caret-positions/merge-nodes";

export function NoteEditor() {
  const [nodes, setNodes] = useState<EditorNode[]>([
    {
      id: "20ce649b-df96-447c-b90a-5715989b02c4",
      type: "heading",
      text: "Heading bold",
      marks: [
        { type: "bold", start: 5, end: 12 },
        { type: "italic", start: 9, end: 12 },
      ],
    },
    {
      id: "cb7929b8-77a4-4fa0-8b4a-c3d190e5dfb8",
      type: "paragraph",
      text: "Hello, world!",
      marks: [],
    },
    {
      id: "12345678-1234-1234-1234-123456789012",
      type: "paragraph",
      text: "",
      marks: [],
    },
  ]);

  const editorRef = useRef<HTMLDivElement>(null);
  const pendingCaretPositionRef = useRef<CaretPosition | null>(null);

  const handleBeforeInput = useCallback(
    (e: InputEvent) => {
      const selectionRange = getSelectionRange();
      if (!selectionRange) return;

      const { inputType, data } = e;

      switch (inputType) {
        case "insertText": {
          e.preventDefault();
          const text = data ?? "";
          setNodes(
            applyOperation(nodes, {
              type: "insertText",
              text,
              range: selectionRange,
            }),
          );

          pendingCaretPositionRef.current = getCaretPositionAfter(
            nodes,
            selectionRange,
            "insertText",
          );
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

            setNodes(
              applyOperation(nodes, {
                type: "mergeNodes",
                firstNodeId: prevNode.id,
                secondNodeId: node.id,
                range: selectionRange,
              }),
            );
            pendingCaretPositionRef.current = getCaretPositionAfter(
              nodes,
              selectionRange,
              "mergeNodes",
            );
            break;
          }
          setNodes(
            applyOperation(nodes, {
              type: "deleteText",
              range: selectionRange,
            }),
          );
          pendingCaretPositionRef.current = getCaretPositionAfter(
            nodes,
            selectionRange,
            "deleteText",
          );
          break;
        }
        case "insertParagraph": {
          e.preventDefault();
          const newNodeId = crypto.randomUUID();
          setNodes(
            applyOperation(nodes, {
              type: "insertParagraph",
              range: selectionRange,
              newNodeId,
            }),
          );
          //TODO figure out better way to handle caret position movement
          pendingCaretPositionRef.current = {
            nodeId: newNodeId,
            offset: 0,
          };
          break;
        }
      }
    },
    [nodes],
  );

  useEffect(() => {
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
    setSelectionRange({
      start: position,
    });
    pendingCaretPositionRef.current = null;
  }, [nodes]);

  return (
    <Card className="w-xl">
      <CardContent>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="p-0.5 whitespace-pre outline-none"
        >
          <NoteContent nodes={nodes} />
        </div>
      </CardContent>
    </Card>
  );
}
