import { Fragment, memo } from "react";
import type {
  HeadingNode as HeadingNodeType,
  ParagraphNode as ParagraphNodeType,
  TextNode as TextNodeType,
} from "./types";
import { cn } from "@/lib/utils";

export const HeadingNode = memo(({ node }: { node: HeadingNodeType }) => {
  return (
    <h1
      data-node-id={node.id}
      className={cn(
        "text-3xl whitespace-pre-wrap",
        node.children.length === 0 &&
          "after:pointer-events-none after:block after:content-['\\00a0']",
      )}
    >
      {node.children.map((child) => (
        <TextNode key={child.text} node={child} />
      ))}
    </h1>
  );
});
HeadingNode.displayName = "HeadingNode";

export const ParagraphNode = memo(({ node }: { node: ParagraphNodeType }) => {
  return (
    <p
      data-node-id={node.id}
      className={cn(
        "whitespace-pre-wrap",
        node.children.length === 0 &&
          "after:pointer-events-none after:block after:content-['\\00a0']",
      )}
    >
      {node.children.map((child) => (
        <TextNode key={child.text} node={child} />
      ))}
    </p>
  );
});
ParagraphNode.displayName = "ParagraphNode";

export const TextNode = memo(({ node }: { node: TextNodeType }) => {
  if (node.bold) {
    return <span className="font-bold">{node.text}</span>;
  }
  return <Fragment>{node.text}</Fragment>;
});
TextNode.displayName = "TextNode";
