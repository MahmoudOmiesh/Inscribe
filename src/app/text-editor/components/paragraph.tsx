import { memo } from "react";
import type { ParagraphNode as ParagraphNodeType } from "../utils/types";
import { MarkRenderer } from "./mark-renderer";
import { cn } from "@/lib/utils";

export const Paragraph = memo(({ node }: { node: ParagraphNodeType }) => {
  return (
    <p
      data-node-id={node.id}
      className={cn(
        "whitespace-pre-wrap",
        node.alignment === "center" && "text-center",
        node.alignment === "right" && "text-right",
        node.alignment === "justify" && "text-justify",
      )}
    >
      {node.text.length > 0 ? (
        <MarkRenderer text={node.text} marks={node.marks} />
      ) : (
        <br />
      )}
    </p>
  );
});

Paragraph.displayName = "Paragraph";
