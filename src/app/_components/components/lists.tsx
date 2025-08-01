import { memo } from "react";
import type {
  ListItemNode as ListItemNodeType,
  OrderedListItemNode,
  UnorderedListItemNode,
} from "../utils/types";
import { MarkRenderer } from "./mark-renderer";
import { cn } from "@/lib/utils";

export const UnorderedList = memo(
  ({ items }: { items: UnorderedListItemNode[] }) => {
    return (
      <ul className="list-disc pl-4">
        {items.map((item) => (
          <ListItem key={item.id} node={item} />
        ))}
      </ul>
    );
  },
);

UnorderedList.displayName = "UnorderedList";

export const OrderedList = memo(
  ({ items }: { items: OrderedListItemNode[] }) => {
    return (
      <ol className="list-decimal pl-4">
        {items.map((item) => (
          <ListItem key={item.id} node={item} />
        ))}
      </ol>
    );
  },
);

OrderedList.displayName = "OrderedList";

export const ListItem = memo(({ node }: { node: ListItemNodeType }) => {
  return (
    <li
      data-node-id={node.id}
      className={cn(
        "whitespace-pre-wrap",
        node.alignment === "center" && "text-center",
        node.alignment === "right" && "text-right",
        node.alignment === "justify" && "text-justify",
      )}
    >
      {node.text.length > 0 ? (
        <MarkRenderer text={node.text} marks={node.marks} />
      ) : (
        <br />
      )}
    </li>
  );
});

ListItem.displayName = "ListItem";
