import { memo } from "react";
import type { ParagraphNode as ParagraphNodeType } from "../utils/types";
import { cn } from "@/lib/utils";
import { MarkRenderer } from "./mark-renderer";

export const Paragraph = memo(({ node }: { node: ParagraphNodeType }) => {
  return (
    <p
      data-node-id={node.id}
      className={cn(
        "whitespace-pre-wrap",
        node.text.length === 0 &&
          "after:pointer-events-none after:block after:content-['\\200b']",
      )}
    >
      <MarkRenderer text={node.text} marks={node.marks} />
    </p>
  );
});

Paragraph.displayName = "Paragraph";
