import { memo } from "react";
import type { EditorNode } from "../types";
import { Paragraph } from "./paragraph";
import { Heading } from "./heading";

export const NoteContent = memo(({ nodes }: { nodes: EditorNode[] }) => {
  return (
    <>
      {nodes.map((node) => {
        if (node.type === "heading") {
          return <Heading key={node.id} node={node} />;
        }
        return <Paragraph key={node.id} node={node} />;
      })}
    </>
  );
});

NoteContent.displayName = "NoteContent";
