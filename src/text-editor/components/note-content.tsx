import { memo, useMemo, type ReactNode } from "react";
import type {
  CheckListItemNode,
  EditorNode,
  ListItemNode,
  OrderedListItemNode,
  UnorderedListItemNode,
} from "../model/schema";
import { GeneralNode } from "./general-node";

export const NoteContent = memo(
  ({
    nodes,
    toggleCheckbox,
  }: {
    nodes: EditorNode[];
    toggleCheckbox: (nodeId: string) => void;
  }) => {
    const nodeComponents = useMemo(() => {
      const components: ReactNode[] = [];

      let i = 0;
      while (i < nodes.length) {
        const node = nodes[i]!;
        switch (node.type) {
          case "heading-1":
          case "heading-2":
          case "heading-3":
          case "heading-4":
            components.push(
              <GeneralNode key={node.id} type="heading" props={{ node }} />,
            );
            i++;
            break;
          case "paragraph":
            components.push(
              <GeneralNode key={node.id} type="paragraph" props={{ node }} />,
            );
            i++;
            break;
          case "unordered-list-item":
          case "ordered-list-item":
          case "check-list-item": {
            const items: ListItemNode[] = [];
            const listId = node.listId;
            let j = i;
            for (; j < nodes.length; j++) {
              const nextNode = nodes[j]!;
              if (nextNode.type === node.type && nextNode.listId === listId) {
                items.push(nextNode);
              } else {
                break;
              }
            }
            components.push(
              node.type === "ordered-list-item" ? (
                <GeneralNode
                  key={listId}
                  type="ordered-list"
                  props={{ items: items as OrderedListItemNode[] }}
                />
              ) : node.type === "unordered-list-item" ? (
                <GeneralNode
                  key={listId}
                  type="unordered-list"
                  props={{ items: items as UnorderedListItemNode[] }}
                />
              ) : (
                <GeneralNode
                  key={listId}
                  type="check-list"
                  props={{
                    items: items as CheckListItemNode[],
                    toggleCheckbox,
                  }}
                />
              ),
            );
            i = j;
            break;
          }
          default:
            const _exhaustiveCheck: never = node;
            return _exhaustiveCheck;
        }
      }

      return components;
    }, [nodes, toggleCheckbox]);

    return <>{nodeComponents}</>;
  },
);

NoteContent.displayName = "NoteContent";
