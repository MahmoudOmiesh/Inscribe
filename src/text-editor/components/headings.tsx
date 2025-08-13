import { memo } from "react";
import { cn } from "@/lib/utils";
import type { HeadingNode } from "../model/schema";
import { MarkRenderer } from "./mark-renderer";
import type { GetReferenceProps, SetReference } from "./general-node";

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
    const commonClassNames = cn(
      "whitespace-pre-wrap",
      node.alignment === "center" && "text-center",
      node.alignment === "right" && "text-right",
      node.alignment === "justify" && "text-justify",
    );

    switch (node.type) {
      case "heading-1":
        return (
          <h1
            className={cn("text-4xl", commonClassNames)}
            data-node-id={node.id}
            ref={setReference}
            {...getReferenceProps()}
          >
            {node.text.length > 0 ? (
              <MarkRenderer text={node.text} marks={node.marks} />
            ) : (
              <br />
            )}
            {node.text.endsWith("\n") && <br />}
          </h1>
        );
      case "heading-2":
        return (
          <h2
            className={cn("text-3xl", commonClassNames)}
            data-node-id={node.id}
            ref={setReference}
            {...getReferenceProps()}
          >
            {node.text.length > 0 ? (
              <MarkRenderer text={node.text} marks={node.marks} />
            ) : (
              <br />
            )}
            {node.text.endsWith("\n") && <br />}
          </h2>
        );
      case "heading-3":
        return (
          <h3
            className={cn("text-2xl", commonClassNames)}
            data-node-id={node.id}
            ref={setReference}
            {...getReferenceProps()}
          >
            {node.text.length > 0 ? (
              <MarkRenderer text={node.text} marks={node.marks} />
            ) : (
              <br />
            )}
            {node.text.endsWith("\n") && <br />}
          </h3>
        );
      case "heading-4":
        return (
          <h4
            className={cn("text-xl", commonClassNames)}
            data-node-id={node.id}
            ref={setReference}
            {...getReferenceProps()}
          >
            {node.text.length > 0 ? (
              <MarkRenderer text={node.text} marks={node.marks} />
            ) : (
              <br />
            )}
            {node.text.endsWith("\n") && <br />}
          </h4>
        );
    }
  },
);

Heading.displayName = "Heading";
