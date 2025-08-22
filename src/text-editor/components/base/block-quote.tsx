import { memo } from "react";
import type { BlockquoteNode } from "../../model/schema";
import type { GetReferenceProps, SetReference } from "./general-node";
import { MarkRenderer } from "../mark-renderer";
import { cn } from "@/lib/utils";
import { alignmentToCss } from "../utils";

export const Blockquote = memo(
  ({
    node,
    setReference,
    getReferenceProps,
  }: {
    node: BlockquoteNode;
    setReference: SetReference;
    getReferenceProps: GetReferenceProps;
  }) => {
    return (
      <blockquote
        className={cn(
          "relative my-(--editor-blockquote-my) py-(--editor-blockquote-py) pl-(--editor-blockquote-pl) text-(length:--editor-blockquote-s) whitespace-pre-wrap before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:bg-gray-200 before:content-['']",
          alignmentToCss(node.alignment),
        )}
        ref={setReference}
        {...getReferenceProps()}
      >
        <p data-node-id={node.id}>
          {node.text.length > 0 ? (
            <MarkRenderer text={node.text} marks={node.marks} />
          ) : (
            <br />
          )}
          {node.text.endsWith("\n") && <br />}
        </p>
      </blockquote>
    );
  },
);

Blockquote.displayName = "Blockquote";
