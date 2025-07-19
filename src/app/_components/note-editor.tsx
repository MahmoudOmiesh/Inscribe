"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { CaretPosition, EditorNode, Operation } from "./types";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  addCharacter,
  getCaretPosition,
  setCaretPosition,
  deleteCharacter,
  mergeNodes,
  splitNode,
} from "./utils";
import { HeadingNode, ParagraphNode } from "./editor-nodes";

function apply(nodes: EditorNode[], operation: Operation) {
  switch (operation.type) {
    case "insertText": {
      const { text, caretPosition } = operation;
      const nodeIndex = nodes.findIndex((n) => n.id === caretPosition.nodeId);
      if (nodeIndex === -1) return nodes;

      const node = nodes[nodeIndex]!;
      const newNode = addCharacter(node, caretPosition, text);

      return [
        ...nodes.slice(0, nodeIndex),
        newNode,
        ...nodes.slice(nodeIndex + 1),
      ];
    }
    case "deleteText": {
      const { caretPosition } = operation;
      const nodeIndex = nodes.findIndex((n) => n.id === caretPosition.nodeId);
      if (nodeIndex === -1) return nodes;

      const node = nodes[nodeIndex]!;
      const newNode = deleteCharacter(node, caretPosition);

      return [
        ...nodes.slice(0, nodeIndex),
        newNode,
        ...nodes.slice(nodeIndex + 1),
      ];
    }
    case "mergeNodes": {
      const { firstNodeId, secondNodeId } = operation;
      const firstNodeIndex = nodes.findIndex((n) => n.id === firstNodeId);
      const secondNodeIndex = nodes.findIndex((n) => n.id === secondNodeId);
      if (firstNodeIndex === -1 || secondNodeIndex === -1) return nodes;

      const firstNode = nodes[firstNodeIndex]!;
      const secondNode = nodes[secondNodeIndex]!;
      const newNode = mergeNodes(firstNode, secondNode);

      return [
        ...nodes.slice(0, firstNodeIndex),
        newNode,
        ...nodes.slice(secondNodeIndex + 1),
      ];
    }
    case "insertParagraph": {
      const { caretPosition, newNodeId } = operation;
      const nodeIndex = nodes.findIndex((n) => n.id === caretPosition.nodeId);
      if (nodeIndex === -1) return nodes;

      const node = nodes[nodeIndex]!;
      const [left, right] = splitNode(node, caretPosition, newNodeId);

      if (right.children.length === 0) right.type = "paragraph";

      return [
        ...nodes.slice(0, nodeIndex),
        left,
        right,
        ...nodes.slice(nodeIndex + 1),
      ];
    }
  }
}

export function NoteEditor() {
  const [nodes, setNodes] = useState<EditorNode[]>([
    {
      id: "20ce649b-df96-447c-b90a-5715989b02c4",
      type: "heading",
      children: [
        { type: "text", text: "Heading " },
        {
          type: "text",
          text: "bold",
          bold: true,
        },
      ],
    },
    {
      id: "cb7929b8-77a4-4fa0-8b4a-c3d190e5dfb8",
      type: "paragraph",
      children: [{ type: "text", text: "Hello, world!" }],
    },
    {
      id: "12345678-1234-1234-1234-123456789012",
      type: "paragraph",
      children: [],
    },
  ]);

  const editorRef = useRef<HTMLDivElement>(null);
  const pendingCaretPositionRef = useRef<CaretPosition | null>(null);

  const handleBeforeInput = useCallback(
    (e: InputEvent) => {
      const caretPosition = getCaretPosition(nodes);
      if (!caretPosition) return;

      const { inputType, data } = e;

      switch (inputType) {
        case "insertText": {
          e.preventDefault();
          const text = data ?? "";
          setNodes((prev) =>
            apply(prev, {
              type: "insertText",
              text,
              caretPosition,
            }),
          );
          pendingCaretPositionRef.current = {
            ...caretPosition,
            offset: caretPosition.offset + text.length,
          };
          break;
        }
        case "deleteContentBackward": {
          //TODO doesn't work if the node is empty
          e.preventDefault();
          if (caretPosition.offset === 0) {
            const nodeIdx = nodes.findIndex(
              (n) => n.id === caretPosition.nodeId,
            );
            if (nodeIdx === -1 || nodeIdx === 0) return;

            const node = nodes[nodeIdx]!;
            const prevNode = nodes[nodeIdx - 1]!;

            setNodes((prev) =>
              apply(prev, {
                type: "mergeNodes",
                firstNodeId: prevNode.id,
                secondNodeId: node.id,
                caretPosition,
              }),
            );
            pendingCaretPositionRef.current = {
              nodeId: prevNode.id,
              childIndex: prevNode.children.length - 1,
              offset:
                prevNode.children[prevNode.children.length - 1]!.text.length,
            };
            break;
          }

          setNodes((prev) =>
            apply(prev, { type: "deleteText", caretPosition }),
          );
          pendingCaretPositionRef.current = {
            ...caretPosition,
            offset: caretPosition.offset - 1,
          };
          break;
        }
        case "insertParagraph": {
          e.preventDefault();
          const newNodeId = crypto.randomUUID();
          setNodes((prev) =>
            apply(prev, {
              type: "insertParagraph",
              caretPosition,
              newNodeId,
            }),
          );
          pendingCaretPositionRef.current = {
            nodeId: newNodeId,
            childIndex: 0,
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
    setCaretPosition(nodes, position);
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
          {nodes.map((node) => {
            if (node.type === "heading") {
              return <HeadingNode key={node.id} node={node} />;
            }
            return <ParagraphNode key={node.id} node={node} />;
          })}
        </div>
      </CardContent>
    </Card>
  );
}
