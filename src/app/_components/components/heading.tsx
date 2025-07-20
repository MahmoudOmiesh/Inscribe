import { memo } from "react";
import { cn } from "@/lib/utils";
import type { HeadingNode as HeadingNodeType } from "../types";
import { MarkRenderer } from "./mark-renderer";

export const Heading = memo(({ node }: { node: HeadingNodeType }) => {
  return (
    <h1
      data-node-id={node.id}
      className={cn(
        "text-3xl whitespace-pre-wrap",
        node.text.length === 0 &&
          "after:pointer-events-none after:block after:content-['\\200b']",
      )}
    >
      <MarkRenderer text={node.text} marks={node.marks} />
    </h1>
  );
});

Heading.displayName = "Heading";
