import { memo } from "react";
import { cn } from "@/lib/utils";
import type { HeadingNode } from "../model/schema";
import { MarkRenderer } from "./mark-renderer";
import type { GetReferenceProps, SetReference } from "./general-node";
import { alignmentToCss } from "./utils";

const headingData: Record<
  HeadingNode["type"],
  {
    Tag: "h1" | "h2" | "h3" | "h4";
    className: string;
  }
> = {
  "heading-1": {
    Tag: "h1",
    className: "text-4xl",
  },
  "heading-2": {
    Tag: "h2",
    className: "text-3xl",
  },
  "heading-3": {
    Tag: "h3",
    className: "text-2xl",
  },
  "heading-4": {
    Tag: "h4",
    className: "text-xl",
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
        className={cn(
          "font-bold whitespace-pre-wrap",
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
