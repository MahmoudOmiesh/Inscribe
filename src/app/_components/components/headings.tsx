import { memo } from "react";
import { cn } from "@/lib/utils";
import type { HeadingNode } from "../utils/types";
import { MarkRenderer } from "./mark-renderer";

export const Heading = memo(({ node }: { node: HeadingNode }) => {
  const commonClassNames = "whitespace-pre-wrap";

  switch (node.type) {
    case "heading-1":
      return (
        <h1 className={cn("text-4xl", commonClassNames)} data-node-id={node.id}>
          {node.text.length > 0 ? (
            <MarkRenderer text={node.text} marks={node.marks} />
          ) : (
            <br />
          )}
        </h1>
      );
    case "heading-2":
      return (
        <h2 className={cn("text-3xl", commonClassNames)} data-node-id={node.id}>
          {node.text.length > 0 ? (
            <MarkRenderer text={node.text} marks={node.marks} />
          ) : (
            <br />
          )}
        </h2>
      );
    case "heading-3":
      return (
        <h3 className={cn("text-2xl", commonClassNames)} data-node-id={node.id}>
          {node.text.length > 0 ? (
            <MarkRenderer text={node.text} marks={node.marks} />
          ) : (
            <br />
          )}
        </h3>
      );
    case "heading-4":
      return (
        <h4 className={cn("text-xl", commonClassNames)} data-node-id={node.id}>
          {node.text.length > 0 ? (
            <MarkRenderer text={node.text} marks={node.marks} />
          ) : (
            <br />
          )}
        </h4>
      );
  }
});

Heading.displayName = "Heading";
