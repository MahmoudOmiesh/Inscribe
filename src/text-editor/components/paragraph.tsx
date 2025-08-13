import { memo } from "react";
import type { ParagraphNode as ParagraphNodeType } from "../model/schema";
import { MarkRenderer } from "./mark-renderer";
import { cn } from "@/lib/utils";
import type { GetReferenceProps, SetReference } from "./general-node";

export const Paragraph = memo(
  ({
    node,
    setReference,
    getReferenceProps,
  }: {
    node: ParagraphNodeType;
    setReference: SetReference;
    getReferenceProps: GetReferenceProps;
  }) => {
    return (
      <p
        data-node-id={node.id}
        className={cn(
          "whitespace-pre-wrap",
          node.alignment === "center" && "text-center",
          node.alignment === "right" && "text-right",
          node.alignment === "justify" && "text-justify",
        )}
        ref={setReference}
        {...getReferenceProps()}
      >
        {node.text.length > 0 ? (
          <MarkRenderer text={node.text} marks={node.marks} />
        ) : (
          <br />
        )}
        {node.text.endsWith("\n") && <br />}
      </p>
    );
  },
);

Paragraph.displayName = "Paragraph";
