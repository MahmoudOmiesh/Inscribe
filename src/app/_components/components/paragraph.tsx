import { memo } from "react";
import type { ParagraphNode as ParagraphNodeType } from "../utils/types";
import { MarkRenderer } from "./mark-renderer";

export const Paragraph = memo(({ node }: { node: ParagraphNodeType }) => {
  return (
    <p data-node-id={node.id} className="whitespace-pre-wrap">
      {node.text.length > 0 ? (
        <MarkRenderer text={node.text} marks={node.marks} />
      ) : (
        <br />
      )}
    </p>
  );
});

Paragraph.displayName = "Paragraph";
