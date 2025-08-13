import { useState, type ComponentProps } from "react";
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
import { EditorNodeModifier } from "./editor-node-modifier";

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

export type GetReferenceProps = UseInteractionsReturn["getReferenceProps"];
export type SetReference = ExtendedRefs<HTMLElement>["setReference"];

type GeneralNodeProps =
  | {
      type: "heading";
      props: HeadingProps;
    }
  | {
      type: "paragraph";
      props: ParagraphProps;
    }
  | {
      type: "unordered-list";
      props: UnorderedListProps;
    }
  | {
      type: "ordered-list";
      props: OrderedListProps;
    }
  | {
      type: "check-list";
      props: CheckListProps;
    };

export function GeneralNode(props: GeneralNodeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "left-start",
    // Make sure the tooltip stays on the screen
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
    ],
  });

  // Event listeners to change the open state
  const hover = useHover(context, { move: false, handleClose: safePolygon() });
  const dismiss = useDismiss(context);

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
            <EditorNodeModifier />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

function renderNode(
  { type, props }: GeneralNodeProps,
  setReference: SetReference,
  getReferenceProps: GetReferenceProps,
) {
  switch (type) {
    case "heading":
      return (
        <Heading
          {...props}
          setReference={setReference}
          getReferenceProps={getReferenceProps}
        />
      );
    case "paragraph":
      return (
        <Paragraph
          {...props}
          setReference={setReference}
          getReferenceProps={getReferenceProps}
        />
      );
    case "unordered-list":
      return (
        <UnorderedList
          {...props}
          setReference={setReference}
          getReferenceProps={getReferenceProps}
        />
      );
    case "ordered-list":
      return (
        <OrderedList
          {...props}
          setReference={setReference}
          getReferenceProps={getReferenceProps}
        />
      );
    case "check-list":
      return (
        <CheckList
          {...props}
          setReference={setReference}
          getReferenceProps={getReferenceProps}
        />
      );
    default:
      const _: never = type;
      return _;
  }
}
