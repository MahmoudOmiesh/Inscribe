import { Fragment, memo } from "react";
import type {
  HeadingNode as HeadingNodeType,
  ParagraphNode as ParagraphNodeType,
  TextNode as TextNodeType,
} from "./types";

export const HeadingNode = memo(({ node }: { node: HeadingNodeType }) => {
  return (
    <h1 data-node-id={node.id} className="text-3xl whitespace-pre-wrap">
      {node.children.map((child) => (
        <TextNode key={child.text} node={child} />
      ))}
    </h1>
  );
});
HeadingNode.displayName = "HeadingNode";

export const ParagraphNode = memo(({ node }: { node: ParagraphNodeType }) => {
  return (
    <p data-node-id={node.id} className="whitespace-pre-wrap">
      {node.children.length > 0
        ? node.children.map((child) => (
            <TextNode key={child.text} node={child} />
          ))
        : "\u200B"}
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
