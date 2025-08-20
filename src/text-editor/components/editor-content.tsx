import { memo, useMemo, type ReactNode } from "react";
import type {
  CheckListItemNode,
  EditorNode,
  OrderedListItemNode,
  UnorderedListItemNode,
} from "../model/schema";
import { GeneralNode } from "./base/general-node";
import type { useEditorActions } from "../hooks/use-editor-actions";
import { getListBoundaries } from "../model/lists";

export const EditorContent = memo(
  ({
    nodes,
    actions,
  }: {
    nodes: EditorNode[];
    actions: ReturnType<typeof useEditorActions>;
  }) => {
    const nodeComponents = useMemo(() => {
      const components: ReactNode[] = [];

      for (let i = 0; i < nodes.length; i++) {
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
            break;
          case "separator":
            components.push(
              <GeneralNode
                key={node.id}
                type="separator"
                nodeProps={{ node }}
                actions={actions}
              />,
            );
            break;
          case "unordered-list-item":
          case "ordered-list-item":
          case "check-list-item": {
            const listBoundary = getListBoundaries(nodes, i)!;
            const items = nodes.slice(listBoundary.start, listBoundary.end + 1);

            components.push(
              node.type === "ordered-list-item" ? (
                <GeneralNode
                  key={node.listId}
                  type="ordered-list"
                  nodeProps={{ items: items as OrderedListItemNode[] }}
                  actions={actions}
                />
              ) : node.type === "unordered-list-item" ? (
                <GeneralNode
                  key={node.listId}
                  type="unordered-list"
                  nodeProps={{ items: items as UnorderedListItemNode[] }}
                  actions={actions}
                />
              ) : (
                <GeneralNode
                  key={node.listId}
                  type="check-list"
                  nodeProps={{
                    items: items as CheckListItemNode[],
                    toggleCheckbox: actions.toggleCheckbox,
                  }}
                  actions={actions}
                />
              ),
            );
            i = listBoundary.end;
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

EditorContent.displayName = "EditorContent";
