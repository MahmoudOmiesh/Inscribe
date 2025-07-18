"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Fragment, useLayoutEffect, useRef, useState } from "react";

type TextNode = {
  type: "text";
  text: string;
  bold?: boolean;
};

type EditorNode = {
  id: string;
  type: "heading" | "paragraph";
  children: TextNode[];
};

const PASSTHROUGH_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

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
  ]);

  const [pendingCaretMove, setPendingCaretMove] = useState<{
    nodeId: string;
    offset: number;
  } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const caretPositionRef = useRef<{
    nodeId: string;
    offset: number;
  }>({
    nodeId: "",
    offset: 0,
  });

  useLayoutEffect(() => {
    if (pendingCaretMove) {
      moveCaret(pendingCaretMove.nodeId, pendingCaretMove.offset);
      setPendingCaretMove(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCaretMove]);

  function renderNode(node: EditorNode | TextNode, idx?: number) {
    if (node.type === "text") {
      if (node.bold) {
        return (
          <span key={idx} className="font-bold">
            {node.text}
          </span>
        );
      }
      return <Fragment key={idx}>{node.text}</Fragment>;
    }

    const isEmpty = node.children.length === 0;
    switch (node.type) {
      case "heading":
        return (
          <h1
            key={node.id}
            data-node-id={node.id}
            className="text-3xl whitespace-pre-wrap"
          >
            {isEmpty ? (
              <br />
            ) : (
              node.children.map((child, idx) => renderNode(child, idx))
            )}
          </h1>
        );
      case "paragraph":
        return (
          <p
            key={node.id}
            data-node-id={node.id}
            className="whitespace-pre-wrap"
          >
            {isEmpty ? (
              <br />
            ) : (
              node.children.map((child, idx) => renderNode(child, idx))
            )}
          </p>
        );
      default:
        return null;
    }
  }

  function getCaretOffsetInNode(nodeId: string) {
    const node = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (!node) return 0;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();

    preCaretRange.selectNodeContents(node);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    const caretOffset = preCaretRange.toString().length;
    return caretOffset;
  }

  function moveCaretToNode(node: Node, offset: number) {
    const range = document.createRange();
    range.setStart(node, offset);
    range.collapse(true);

    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  function moveCaret(nodeId: string, offset = 0) {
    const node = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (!node) return;

    let currentOffset = 0;

    function traverseNodes(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const textLength = node.textContent?.length ?? 0;
        if (currentOffset + textLength >= offset) {
          moveCaretToNode(node, offset - currentOffset);
          return true;
        } else {
          currentOffset += textLength;
        }
      } else {
        for (const child of node.childNodes) {
          if (child && traverseNodes(child)) {
            return true;
          }
        }
      }
      return false; // Not found in this branch
    }

    if (offset === 0) {
      moveCaretToNode(node, 0);
    } else {
      traverseNodes(node);
    }
  }

  function getNodeEndOffset(node: EditorNode) {
    return node.children.reduce((acc, child) => acc + child.text.length, 0);
  }

  function deleteCharacter(node: EditorNode, offset: number) {
    let currentOffset = 0;
    const newChildren = node.children.map((child) => {
      const combinedOffset = currentOffset + child.text.length;
      let ret;
      if (combinedOffset >= offset && currentOffset < offset) {
        const newText =
          child.text.slice(0, offset - currentOffset - 1) +
          child.text.slice(offset - currentOffset);
        ret =
          newText.length > 0
            ? {
                ...child,
                text: newText,
              }
            : undefined;
      } else {
        ret = child;
      }
      currentOffset += child.text.length;
      return ret;
    });

    return {
      ...node,
      children: newChildren.filter((c) => c !== undefined),
    };
  }

  function addCharacter(node: EditorNode, char: string, offset: number) {
    let currentOffset = 0;
    const newChildren =
      node.children.length > 0
        ? node.children.map((child) => {
            const combinedOffset = currentOffset + child.text.length;
            let ret;

            if (combinedOffset >= offset && currentOffset < offset) {
              const newText =
                child.text.slice(0, offset - currentOffset) +
                char +
                child.text.slice(offset - currentOffset);
              ret = {
                ...child,
                text: newText,
              };
            } else {
              ret = child;
            }

            currentOffset += child.text.length;
            return ret;
          })
        : [
            {
              type: "text" as const,
              text: char,
            },
          ];

    return {
      ...node,
      children: newChildren.filter((c) => c !== undefined),
    };
  }

  function mergeNodes(node: EditorNode, prevNode: EditorNode) {
    return {
      ...prevNode,
      children: [...prevNode.children, ...node.children],
    };
  }

  function splitNode(node: EditorNode, offset: number) {
    const left: EditorNode = {
      id: node.id,
      type: node.type,
      children: [],
    };
    const right: EditorNode = {
      id: crypto.randomUUID(),
      type: node.type,
      children: [],
    };

    let currentOffset = 0;
    node.children.forEach((child) => {
      const combinedOffset = currentOffset + child.text.length;
      if (combinedOffset < offset) {
        left.children.push(child);
      }
      if (combinedOffset >= offset && currentOffset <= offset) {
        const leftText = child.text.slice(0, offset - currentOffset);
        const rightText = child.text.slice(offset - currentOffset);
        if (leftText.length > 0) {
          left.children.push({
            ...child,
            text: leftText,
          });
        }
        if (rightText.length > 0) {
          right.children.push({
            ...child,
            text: rightText,
          });
        }
      }
      if (currentOffset > offset) {
        right.children.push(child);
      }

      currentOffset += child.text.length;
    });

    return [left, right] as const;
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (PASSTHROUGH_KEYS.includes(e.key)) return;
    e.preventDefault();

    const { nodeId, offset } = caretPositionRef.current;
    const currentNodeIdx = nodes.findIndex((node) => node.id === nodeId);
    if (currentNodeIdx === -1) return;
    const currentNode = nodes[currentNodeIdx]!;

    switch (e.key) {
      case "Enter": {
        const [left, right] = splitNode(currentNode, offset);
        // user pressed enter at the end of the node,
        // so we need to create a new paragraph node
        // regardless of the type of the current node
        if (right.children.length === 0) right.type = "paragraph";

        // flushSync is used to ensure that the new node is added to the DOM
        // before the caret is moved
        setNodes([
          ...nodes.slice(0, currentNodeIdx),
          left,
          right,
          ...nodes.slice(currentNodeIdx + 1),
        ]);
        setPendingCaretMove({ nodeId: right.id, offset: 0 });
        break;
      }
      case "Backspace": {
        if (offset === 0) {
          if (currentNodeIdx === 0) return;
          const isNodeEmpty = currentNode.children.length === 0;
          const prevNode = nodes[currentNodeIdx - 1]!;

          if (isNodeEmpty) {
            setNodes([
              ...nodes.slice(0, currentNodeIdx),
              ...nodes.slice(currentNodeIdx + 1),
            ]);
            setPendingCaretMove({
              nodeId: prevNode.id,
              offset: getNodeEndOffset(prevNode),
            });
          } else {
            const newNode = mergeNodes(currentNode, prevNode);
            const prevNodeOffset = getNodeEndOffset(prevNode);
            setNodes([
              ...nodes.slice(0, currentNodeIdx - 1),
              newNode,
              ...nodes.slice(currentNodeIdx + 1),
            ]);
            setPendingCaretMove({ nodeId: newNode.id, offset: prevNodeOffset });
          }
        } else {
          // delete the character
          const newNode = deleteCharacter(currentNode, offset);
          setNodes([
            ...nodes.slice(0, currentNodeIdx),
            newNode,
            ...nodes.slice(currentNodeIdx + 1),
          ]);
          setPendingCaretMove({ nodeId: newNode.id, offset: offset - 1 });
        }
        break;
      }
      default: {
        const newNode = addCharacter(currentNode, e.key, offset);
        setNodes([
          ...nodes.slice(0, currentNodeIdx),
          newNode,
          ...nodes.slice(currentNodeIdx + 1),
        ]);
        setPendingCaretMove({ nodeId: newNode.id, offset: offset + 1 });
        break;
      }
    }
  }

  // sync caret position with the DOM
  function syncCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    let node = selection.anchorNode;
    while (node && node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    const nodeElement = (node as HTMLElement)?.closest("[data-node-id]");
    if (!nodeElement) return;

    const nodeId = nodeElement.getAttribute("data-node-id")!;
    const offset = getCaretOffsetInNode(nodeId);

    caretPositionRef.current = { nodeId, offset };
  }

  return (
    <Card className="w-xl">
      <CardContent>
        <div
          ref={editorRef}
          onSelect={syncCaretPosition}
          onInput={syncCaretPosition}
          onKeyDown={handleKeyDown}
          contentEditable
          suppressContentEditableWarning
          className="p-0.5 whitespace-pre outline-none"
        >
          {nodes.map((node) => renderNode(node))}
        </div>
      </CardContent>
    </Card>
  );
}
