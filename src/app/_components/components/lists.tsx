import { memo } from "react";
import type {
  ListItemNode,
  ListItemNode as ListItemNodeType,
  OrderedListItemNode,
  UnorderedListItemNode,
} from "../utils/types";
import { MarkRenderer } from "./mark-renderer";
import { cn } from "@/lib/utils";

type NestedListItemNode<T extends ListItemNode> = {
  item: T;
  children: NestedListItemNode<T>[];
};

export const UnorderedList = memo(
  ({ items }: { items: UnorderedListItemNode[] }) => {
    const nestedItems = createNestedListItems(items);
    return <UnorderedListNested items={nestedItems} level={0} />;
  },
);

UnorderedList.displayName = "UnorderedList";

function UnorderedListNested({
  items,
  level,
}: {
  items: NestedListItemNode<UnorderedListItemNode>[];
  level: number;
}) {
  return (
    <ul
      className={cn(
        "pl-4",
        level === 0 && "list-[disc]",
        level === 1 && "list-[circle]",
        level >= 2 && "list-[square]",
      )}
    >
      {items.map((item) => (
        <ListItem key={item.item.id} node={item.item}>
          {item.children.length > 0 && (
            <UnorderedListNested
              items={item.children}
              level={item.children[0]!.item.indentLevel}
            />
          )}
        </ListItem>
      ))}
    </ul>
  );
}

export const OrderedList = memo(
  ({ items }: { items: OrderedListItemNode[] }) => {
    const nestedItems = createNestedListItems(items);
    return <OrderedListNested items={nestedItems} level={0} />;
  },
);

OrderedList.displayName = "OrderedList";

function OrderedListNested({
  items,
  level,
}: {
  items: NestedListItemNode<OrderedListItemNode>[];
  level: number;
}) {
  return (
    <ol
      className={cn(
        "pl-4",
        level === 0 && "list-[decimal]",
        level === 1 && "list-[lower-alpha]",
        level >= 2 && "list-[lower-roman]",
      )}
    >
      {items.map((item) => (
        <ListItem key={item.item.id} node={item.item}>
          {item.children.length > 0 && (
            <OrderedListNested
              items={item.children}
              level={item.children[0]!.item.indentLevel}
            />
          )}
        </ListItem>
      ))}
    </ol>
  );
}

export const ListItem = memo(
  ({
    node,
    children,
  }: {
    node: ListItemNodeType;
    children?: React.ReactNode;
  }) => {
    return (
      <li
        className={cn(
          "whitespace-pre-wrap",
          node.alignment === "center" && "text-center",
          node.alignment === "right" && "text-right",
          node.alignment === "justify" && "text-justify",
        )}
      >
        <p data-node-id={node.id}>
          {node.text.length > 0 ? (
            <MarkRenderer text={node.text} marks={node.marks} />
          ) : (
            <br />
          )}
        </p>

        {children}
      </li>
    );
  },
);

ListItem.displayName = "ListItem";

export function createNestedListItems<T extends ListItemNode>(
  items: T[],
): NestedListItemNode<T>[] {
  const nestedItems: NestedListItemNode<T>[] = items.map((item) => ({
    item,
    children: [],
  }));

  const indentIdxMap = new Map<number, number[]>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    const indentLevel = item.indentLevel;
    const indentIdx = indentIdxMap.get(indentLevel) ?? [];
    indentIdxMap.set(indentLevel, [...indentIdx, i]);
  }

  const marked = new Set<number>();
  for (let i = nestedItems.length - 1; i >= 0; --i) {
    const nestedItem = nestedItems[i]!;
    const indentLevel = nestedItem.item.indentLevel;

    const childrenIndices = indentIdxMap.get(indentLevel + 1) ?? [];
    for (const idx of childrenIndices) {
      if (idx < i || marked.has(idx)) continue;
      marked.add(idx);
      nestedItem.children.push(nestedItems[idx]!);
    }
  }

  const rootLevelIndices = indentIdxMap.get(0) ?? [];
  const rootLevelItems: NestedListItemNode<T>[] = [];
  rootLevelIndices.forEach((idx) => rootLevelItems.push(nestedItems[idx]!));

  return rootLevelItems;
}
