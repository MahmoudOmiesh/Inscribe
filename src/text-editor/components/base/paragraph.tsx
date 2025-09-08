import { memo } from "react";
import type { ParagraphNode as ParagraphNodeType } from "../../model/schema";
import { MarkRenderer } from "../mark-renderer";
import { cn } from "@/lib/utils";
import type { GetReferenceProps, SetReference } from "./general-node";
import { alignmentToCss, placeholderToCss } from "../utils";

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
        data-placeholder={node.placeholder}
        className={cn(
          "mt-(--editor-paragraph-mt) text-(length:--editor-paragraph-s) whitespace-pre-wrap",
          node.placeholder && node.text.length === 0 && placeholderToCss(),
          alignmentToCss(node.alignment),
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
