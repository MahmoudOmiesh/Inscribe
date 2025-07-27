import { memo } from "react";
import type { EditorNode } from "../utils/types";
import { Paragraph } from "./paragraph";
import { Heading } from "./headings";

export const NoteContent = memo(({ nodes }: { nodes: EditorNode[] }) => {
  return (
    <>
      {nodes.map((node) => {
        if (
          node.type === "heading-1" ||
          node.type === "heading-2" ||
          node.type === "heading-3" ||
          node.type === "heading-4"
        ) {
          return <Heading key={node.id} node={node} />;
        }
        return <Paragraph key={node.id} node={node} />;
      })}
    </>
  );
});

NoteContent.displayName = "NoteContent";
