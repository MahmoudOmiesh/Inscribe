import { memo } from "react";
import type {
  CheckListItemNode,
  ListItemNode,
  OrderedListItemNode,
  UnorderedListItemNode,
} from "../../model/schema";
import { MarkRenderer } from "../mark-renderer";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import type { GetReferenceProps, SetReference } from "./general-node";
import { alignmentToCss } from "../utils";

type NestedListItemNode<T extends ListItemNode> = {
  item: T;
  children: NestedListItemNode<T>[];
};

export const UnorderedList = memo(
  ({
    items,
    setReference,
    getReferenceProps,
  }: {
    items: UnorderedListItemNode[];
    setReference: SetReference;
    getReferenceProps: GetReferenceProps;
  }) => {
    const nestedItems = createNestedListItems(items);
    return (
      <UnorderedListNested
        items={nestedItems}
        level={0}
        setReference={setReference}
        getReferenceProps={getReferenceProps}
      />
    );
  },
);

UnorderedList.displayName = "UnorderedList";

function UnorderedListNested({
  items,
  level,
  setReference,
  getReferenceProps,
}: {
  items: NestedListItemNode<UnorderedListItemNode>[];
  level: number;
  setReference: SetReference;
  getReferenceProps: GetReferenceProps;
}) {
  const isRoot = level === 0;
  const ref = isRoot ? setReference : undefined;
  const rest = isRoot ? getReferenceProps() : {};

  return (
    <ul
      className={cn(
        "pl-6 leading-[1.6]",
        level === 0 && "my-6 list-[disc]",
        level === 1 && "list-[circle]",
        level >= 2 && "list-[square]",
      )}
      ref={ref}
      {...rest}
    >
      {items.map((item) => (
        <ListItem key={item.item.id} node={item.item}>
          {item.children.length > 0 && (
            <UnorderedListNested
              items={item.children}
              level={item.children[0]!.item.indentLevel}
              setReference={setReference}
              getReferenceProps={getReferenceProps}
            />
          )}
        </ListItem>
      ))}
    </ul>
  );
}

export const OrderedList = memo(
  ({
    items,
    setReference,
    getReferenceProps,
  }: {
    items: OrderedListItemNode[];
    setReference: SetReference;
    getReferenceProps: GetReferenceProps;
  }) => {
    const nestedItems = createNestedListItems(items);
    return (
      <OrderedListNested
        items={nestedItems}
        level={0}
        setReference={setReference}
        getReferenceProps={getReferenceProps}
      />
    );
  },
);

OrderedList.displayName = "OrderedList";

function OrderedListNested({
  items,
  level,
  setReference,
  getReferenceProps,
}: {
  items: NestedListItemNode<OrderedListItemNode>[];
  level: number;
  setReference: SetReference;
  getReferenceProps: GetReferenceProps;
}) {
  const isRoot = level === 0;
  const ref = isRoot ? setReference : undefined;
  const rest = isRoot ? getReferenceProps() : {};
  return (
    <ol
      className={cn(
        "pl-6 leading-[1.6]",
        level === 0 && "my-6 list-[decimal]",
        level === 1 && "list-[lower-alpha]",
        level >= 2 && "list-[lower-roman]",
      )}
      ref={ref}
      {...rest}
    >
      {items.map((item) => (
        <ListItem key={item.item.id} node={item.item}>
          {item.children.length > 0 && (
            <OrderedListNested
              items={item.children}
              level={item.children[0]!.item.indentLevel}
              setReference={setReference}
              getReferenceProps={getReferenceProps}
            />
          )}
        </ListItem>
      ))}
    </ol>
  );
}

export const CheckList = memo(
  ({
    items,
    toggleCheckbox,
    setReference,
    getReferenceProps,
  }: {
    items: CheckListItemNode[];
    toggleCheckbox: (nodeId: string) => void;
    setReference: SetReference;
    getReferenceProps: GetReferenceProps;
  }) => {
    const nestedItems = createNestedListItems(items);
    return (
      <CheckListNested
        items={nestedItems}
        level={0}
        toggleCheckbox={toggleCheckbox}
        setReference={setReference}
        getReferenceProps={getReferenceProps}
      />
    );
  },
);

CheckList.displayName = "CheckList";

function CheckListNested({
  items,
  level,
  toggleCheckbox,
  setReference,
  getReferenceProps,
}: {
  items: NestedListItemNode<CheckListItemNode>[];
  level: number;
  toggleCheckbox: (nodeId: string) => void;
  setReference: SetReference;
  getReferenceProps: GetReferenceProps;
}) {
  const isRoot = level === 0;
  const ref = isRoot ? setReference : undefined;
  const rest = isRoot ? getReferenceProps() : {};
  return (
    <ul
      className={cn("pl-1 leading-[1.6]", level === 0 && "my-6")}
      ref={ref}
      {...rest}
    >
      {items.map((item) => (
        <CheckListItem
          key={item.item.id}
          node={item.item}
          toggleCheckbox={toggleCheckbox}
        >
          {item.children.length > 0 && (
            <CheckListNested
              items={item.children}
              level={item.children[0]!.item.indentLevel}
              toggleCheckbox={toggleCheckbox}
              setReference={setReference}
              getReferenceProps={getReferenceProps}
            />
          )}
        </CheckListItem>
      ))}
    </ul>
  );
}

export const CheckListItem = memo(
  ({
    node,
    toggleCheckbox,
    children,
  }: {
    node: CheckListItemNode;
    toggleCheckbox: (nodeId: string) => void;
    children?: React.ReactNode;
  }) => {
    return (
      <li
        className={cn(
          "flex gap-2.5 whitespace-pre-wrap",
          alignmentToCss(node.alignment),
        )}
      >
        <label contentEditable={false} className="relative h-fit w-fit pt-0.5">
          <Checkbox
            checked={node.checked}
            onCheckedChange={() => toggleCheckbox(node.id)}
            className="cursor-pointer select-none"
          />
        </label>
        <div className="min-w-0 flex-1">
          <p
            data-node-id={node.id}
            className={cn(
              node.type === "check-list-item" &&
                node.checked &&
                "text-muted-foreground line-through",
            )}
          >
            {node.text.length > 0 ? (
              <MarkRenderer text={node.text} marks={node.marks} />
            ) : (
              <br />
            )}
            {node.text.endsWith("\n") && <br />}
          </p>

          {children}
        </div>
      </li>
    );
  },
);

CheckListItem.displayName = "CheckListItem";

export const ListItem = memo(
  ({ node, children }: { node: ListItemNode; children?: React.ReactNode }) => {
    return (
      <li className={cn("whitespace-pre-wrap", alignmentToCss(node.alignment))}>
        <p
          data-node-id={node.id}
          className={cn(
            node.type === "check-list-item" &&
              node.checked &&
              "text-muted-foreground line-through",
          )}
        >
          {node.text.length > 0 ? (
            <MarkRenderer text={node.text} marks={node.marks} />
          ) : (
            <br />
          )}
          {node.text.endsWith("\n") && <br />}
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
  const roots: NestedListItemNode<T>[] = [];
  const stack: NestedListItemNode<T>[] = [];

  for (const item of items) {
    const node: NestedListItemNode<T> = {
      item,
      children: [],
    };
    const level = item.indentLevel;

    while (
      stack.length > 0 &&
      stack[stack.length - 1]!.item.indentLevel >= level
    ) {
      stack.pop();
    }

    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1]!.children.push(node);
    }

    stack.push(node);
  }

  return roots;
}
