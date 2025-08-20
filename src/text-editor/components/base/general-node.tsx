import { memo, useState, type ComponentProps } from "react";
import { CheckList, OrderedList, UnorderedList } from "./lists";
import { Paragraph } from "./paragraph";
import { Heading } from "./headings";

import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useDismiss,
  useInteractions,
  FloatingPortal,
  safePolygon,
  type UseInteractionsReturn,
  type ExtendedRefs,
} from "@floating-ui/react";
import { EditorNodeModifier } from "../floating/editor-node-modifier";
import type { useEditorActions } from "../../hooks/use-editor-actions";
import { Separator } from "./separator";

type HeadingProps = Omit<
  ComponentProps<typeof Heading>,
  "setReference" | "getReferenceProps"
>;
type ParagraphProps = Omit<
  ComponentProps<typeof Paragraph>,
  "setReference" | "getReferenceProps"
>;
type UnorderedListProps = Omit<
  ComponentProps<typeof UnorderedList>,
  "setReference" | "getReferenceProps"
>;
type OrderedListProps = Omit<
  ComponentProps<typeof OrderedList>,
  "setReference" | "getReferenceProps"
>;
type CheckListProps = Omit<
  ComponentProps<typeof CheckList>,
  "setReference" | "getReferenceProps"
>;
type SeparatorProps = Omit<
  ComponentProps<typeof Separator>,
  "setReference" | "getReferenceProps"
>;

export type GetReferenceProps = UseInteractionsReturn["getReferenceProps"];
export type SetReference = ExtendedRefs<HTMLElement>["setReference"];

type GeneralNodeProps = (
  | {
      type: "heading";
      nodeProps: HeadingProps;
    }
  | {
      type: "paragraph";
      nodeProps: ParagraphProps;
    }
  | {
      type: "unordered-list";
      nodeProps: UnorderedListProps;
    }
  | {
      type: "ordered-list";
      nodeProps: OrderedListProps;
    }
  | {
      type: "check-list";
      nodeProps: CheckListProps;
    }
  | {
      type: "separator";
      nodeProps: SeparatorProps;
    }
) & {
  actions: ReturnType<typeof useEditorActions>;
};

export const GeneralNode = memo((props: GeneralNodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (next) => {
      if (!isInteracting) {
        setIsOpen(next);
      }
    },
    placement: "left",
    // Make sure the tooltip stays on the screen
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(20),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
    ],
  });

  // Event listeners to change the open state
  const hover = useHover(context, {
    move: false,
    handleClose: safePolygon(),
    delay: {
      open: 200,
      close: 0,
    },
  });
  const dismiss = useDismiss(context, {
    outsidePress: () => !isInteracting,
  });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    dismiss,
  ]);
  return (
    <>
      {renderNode(props, refs.setReference, getReferenceProps)}
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <EditorNodeModifier
              nodeId={getNodeId(props)}
              activeBlock={getActiveBlock(props)}
              actions={props.actions}
              onFloatingInteraction={setIsInteracting}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}, propsEqual);

GeneralNode.displayName = "GeneralNode";

function renderNode(
  { type, nodeProps }: GeneralNodeProps,
  setReference: SetReference,
  getReferenceProps: GetReferenceProps,
) {
  switch (type) {
    case "heading":
      return (
        <Heading
          {...nodeProps}
          setReference={setReference}
          getReferenceProps={getReferenceProps}
        />
      );
    case "separator":
      return (
        <Separator
          node={nodeProps.node}
          setReference={setReference}
          getReferenceProps={getReferenceProps}
        />
      );
    case "paragraph":
      return (
        <Paragraph
          {...nodeProps}
          setReference={setReference}
          getReferenceProps={getReferenceProps}
        />
      );
    case "unordered-list":
      return (
        <UnorderedList
          {...nodeProps}
          setReference={setReference}
          getReferenceProps={getReferenceProps}
        />
      );
    case "ordered-list":
      return (
        <OrderedList
          {...nodeProps}
          setReference={setReference}
          getReferenceProps={getReferenceProps}
        />
      );
    case "check-list":
      return (
        <CheckList
          {...nodeProps}
          setReference={setReference}
          getReferenceProps={getReferenceProps}
        />
      );
    default:
      const _: never = type;
      return _;
  }
}

function propsEqual(prev: GeneralNodeProps, next: GeneralNodeProps) {
  if (prev.type !== next.type) return false;
  if (prev.actions !== next.actions) return false;

  switch (prev.type) {
    case "heading":
    case "paragraph":
      return prev.nodeProps.node === (next as typeof prev).nodeProps.node;
    case "unordered-list":
    case "ordered-list":
    case "check-list":
      const a = prev.nodeProps.items;
      const b = (next as typeof prev).nodeProps.items;
      return (
        a.length === b.length && a.every((item, index) => item === b[index])
      );
    default:
      return false;
  }
}

function getNodeId(props: GeneralNodeProps) {
  switch (props.type) {
    case "heading":
    case "paragraph":
    case "separator":
      return props.nodeProps.node.id;
    case "unordered-list":
    case "ordered-list":
    case "check-list":
      return props.nodeProps.items[0]!.id;
    default:
      const _: never = props;
      return _;
  }
}

function getActiveBlock(props: GeneralNodeProps) {
  switch (props.type) {
    case "heading":
    case "paragraph":
    case "separator":
      return props.nodeProps.node.type;
    case "unordered-list":
    case "ordered-list":
    case "check-list":
      return props.nodeProps.items[0]!.type;
    default:
      const _: never = props;
      return _;
  }
}
