import { memo, useMemo, type ReactNode } from "react";
import type {
  CheckListItemNode,
  EditorNode,
  ListItemNode,
  OrderedListItemNode,
  UnorderedListItemNode,
} from "../model/schema";
import { GeneralNode } from "./general-node";
import type { useEditorActions } from "../hooks/use-editor-actions";

export const NoteContent = memo(
  ({
    nodes,
    actions,
  }: {
    nodes: EditorNode[];
    actions: ReturnType<typeof useEditorActions>;
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
              <GeneralNode
                key={node.id}
                type="heading"
                nodeProps={{ node }}
                actions={actions}
              />,
            );
            i++;
            break;
          case "paragraph":
            components.push(
              <GeneralNode
                key={node.id}
                type="paragraph"
                nodeProps={{ node }}
                actions={actions}
              />,
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
                  nodeProps={{ items: items as OrderedListItemNode[] }}
                  actions={actions}
                />
              ) : node.type === "unordered-list-item" ? (
                <GeneralNode
                  key={listId}
                  type="unordered-list"
                  nodeProps={{ items: items as UnorderedListItemNode[] }}
                  actions={actions}
                />
              ) : (
                <GeneralNode
                  key={listId}
                  type="check-list"
                  nodeProps={{
                    items: items as CheckListItemNode[],
                    toggleCheckbox: actions.toggleCheckbox,
                  }}
                  actions={actions}
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
    }, [nodes, actions]);

    return <>{nodeComponents}</>;
  },
);

NoteContent.displayName = "NoteContent";
