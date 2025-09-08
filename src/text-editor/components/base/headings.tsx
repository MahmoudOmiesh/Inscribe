import { memo } from "react";
import { cn } from "@/lib/utils";
import type { HeadingNode } from "../../model/schema";
import { MarkRenderer } from "../mark-renderer";
import type { GetReferenceProps, SetReference } from "./general-node";
import { alignmentToCss, placeholderToCss } from "../utils";
import type { ClassValue } from "clsx";

const headingData: Record<
  HeadingNode["type"],
  {
    Tag: "h1" | "h2" | "h3" | "h4";
    className: ClassValue;
  }
> = {
  "heading-1": {
    Tag: "h1",
    className:
      "text-(length:--editor-heading-1-s) mt-(--editor-heading-1-mt) font-bold",
  },
  "heading-2": {
    Tag: "h2",
    className:
      "text-(length:--editor-heading-2-s) mt-(--editor-heading-2-mt) font-bold",
  },
  "heading-3": {
    Tag: "h3",
    className:
      "text-(length:--editor-heading-3-s) mt-(--editor-heading-3-mt) font-semibold",
  },
  "heading-4": {
    Tag: "h4",
    className:
      "text-(length:--editor-heading-4-s) mt-(--editor-heading-4-mt) font-medium",
  },
};

export const Heading = memo(
  ({
    node,
    setReference,
    getReferenceProps,
  }: {
    node: HeadingNode;
    setReference: SetReference;
    getReferenceProps: GetReferenceProps;
  }) => {
    const { Tag, className } = headingData[node.type];

    return (
      <Tag
        {...getReferenceProps()}
        ref={setReference}
        data-node-id={node.id}
        data-placeholder={node.placeholder}
        className={cn(
          "whitespace-pre-wrap",
          node.placeholder && node.text.length === 0 && placeholderToCss(),
          className,
          alignmentToCss(node.alignment),
        )}
      >
        {node.text.length > 0 ? (
          <MarkRenderer text={node.text} marks={node.marks} />
        ) : (
          <br />
        )}
        {node.text.endsWith("\n") && <br />}
      </Tag>
    );
  },
);

Heading.displayName = "Heading";
