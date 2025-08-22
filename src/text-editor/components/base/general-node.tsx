import { memo, type ComponentProps } from "react";
import { Heading } from "./headings";
import { CheckList, OrderedList, UnorderedList } from "./lists";
import { Paragraph } from "./paragraph";

import {
  FloatingPortal,
  type ExtendedRefs,
  type UseInteractionsReturn,
} from "@floating-ui/react";
import type { useEditorActions } from "../../hooks/use-editor-actions";
import { EditorNodeModifier } from "../floating/editor-node-modifier";
import { Blockquote } from "./block-quote";
import { Separator } from "./separator";
import { useNodeModifier } from "@/text-editor/hooks/use-node-modifier";
import { useAI } from "@/text-editor/hooks/use-ai";
import { EditorAIPrompt } from "../floating/editor-ai-prompt";
import { useOptionContext } from "../option-context";

type HeadingProps = Omit<
  ComponentProps<typeof Heading>,
  "setReference" | "getReferenceProps"
>;
type ParagraphProps = Omit<
  ComponentProps<typeof Paragraph>,
  "setReference" | "getReferenceProps"
>;
type BlockquoteProps = Omit<
  ComponentProps<typeof Blockquote>,
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
      type: "blockquote";
      nodeProps: BlockquoteProps;
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
  const {
    isOpen: isNodeModifierOpen,
    refs: nodeModifierRefs,
    floatingStyles: nodeModifierFloatingStyles,
    getReferenceProps: nodeModifierGetReferenceProps,
    getFloatingProps: nodeModifierGetFloatingProps,
    setIsInteracting: setIsNodeModifierInteracting,
  } = useNodeModifier();

  const {
    isOpen: isAIOpen,
    setIsOpen: setIsAIOpen,
    refs: aiRefs,
    floatingStyles: aiFloatingStyles,
    getFloatingProps: aiGetFloatingProps,
  } = useAI();

  const { locked } = useOptionContext();

  if (aiRefs.reference.current !== nodeModifierRefs.reference.current) {
    aiRefs.setReference(nodeModifierRefs.reference.current);
  }

  const showNodeModifier = !locked && isNodeModifierOpen;
  const showAIPrompt = !locked && isAIOpen;

  return (
    <>
      {renderNode(
        props,
        nodeModifierRefs.setReference,
        nodeModifierGetReferenceProps,
      )}
      {showNodeModifier && (
        <FloatingPortal>
          <div
            ref={nodeModifierRefs.setFloating}
            style={nodeModifierFloatingStyles}
            {...nodeModifierGetFloatingProps()}
          >
            <EditorNodeModifier
              nodeId={getNodeId(props)}
              activeBlock={getActiveBlock(props)}
              actions={props.actions}
              onFloatingInteraction={setIsNodeModifierInteracting}
              openAiPrompt={() => setIsAIOpen(true)}
            />
          </div>
        </FloatingPortal>
      )}
      {showAIPrompt && (
        <FloatingPortal>
          <div
            ref={aiRefs.setFloating}
            style={aiFloatingStyles}
            {...aiGetFloatingProps()}
          >
            <EditorAIPrompt
              nodeId={getNodeId(props)}
              nodeText={getNodeText(props)}
              nodeMarks={getNodeMarks(props)}
              actions={props.actions}
              closeAiPrompt={() => setIsAIOpen(false)}
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
          {...nodeProps}
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
    case "blockquote":
      return (
        <Blockquote
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
    case "blockquote":
    case "separator":
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
      const _: never = prev;
      return _;
  }
}

function getNodeId(props: GeneralNodeProps) {
  switch (props.type) {
    case "heading":
    case "paragraph":
    case "blockquote":
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
    case "blockquote":
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

function getNodeText(props: GeneralNodeProps) {
  switch (props.type) {
    case "heading":
    case "paragraph":
    case "blockquote":
    case "separator":
      return props.nodeProps.node.text;
    case "unordered-list":
    case "ordered-list":
    case "check-list":
      return props.nodeProps.items.map((item) => item.text).join("\n");
    default:
      const _: never = props;
      return _;
  }
}

function getNodeMarks(props: GeneralNodeProps) {
  switch (props.type) {
    case "heading":
    case "paragraph":
    case "blockquote":
    case "separator":
      return props.nodeProps.node.marks;
    case "unordered-list":
    case "ordered-list":
    case "check-list":
      return props.nodeProps.items[0]!.marks;
    default:
      const _: never = props;
      return _;
  }
}
