import { ALIGNMENT_TYPES, HIGHLIGHT_COLORS } from "@/text-editor/model/schema";
import type { RouterOutputs } from "@/trpc/react";
import z from "zod";

const zAlignment = z.enum(ALIGNMENT_TYPES);
const zHighlightColor = z.enum(HIGHLIGHT_COLORS as [string, ...string[]]);

const zNonHighlightMark = z.object({
  type: z.enum([
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "superscript",
    "subscript",
    "code",
  ]),
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
});

const zHighlightMark = z.object({
  type: z.literal("highlight"),
  color: zHighlightColor,
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
});

const zMark = z.union([zNonHighlightMark, zHighlightMark]);

const zBaseNode = z.object({
  id: z.string(),
  text: z.string(),
  alignment: zAlignment,
  marks: z.array(zMark),
});

const zParagraphNode = zBaseNode.extend({ type: z.literal("paragraph") });
const zHeading1Node = zBaseNode.extend({ type: z.literal("heading-1") });
const zHeading2Node = zBaseNode.extend({ type: z.literal("heading-2") });
const zHeading3Node = zBaseNode.extend({ type: z.literal("heading-3") });
const zHeading4Node = zBaseNode.extend({ type: z.literal("heading-4") });
const zUnorderedListItemNode = zBaseNode.extend({
  type: z.literal("unordered-list-item"),
  listId: z.string(),
  indentLevel: z.number().int().min(0),
});
const zOrderedListItemNode = zBaseNode.extend({
  type: z.literal("ordered-list-item"),
  listId: z.string(),
  indentLevel: z.number().int().min(0),
});
const zCheckListItemNode = zBaseNode.extend({
  type: z.literal("check-list-item"),
  listId: z.string(),
  indentLevel: z.number().int().min(0),
  checked: z.boolean(),
});

export const editorNodeSchema = z.discriminatedUnion("type", [
  zParagraphNode,
  zHeading1Node,
  zHeading2Node,
  zHeading3Node,
  zHeading4Node,
  zUnorderedListItemNode,
  zOrderedListItemNode,
  zCheckListItemNode,
]);

export const noteTitleUpdateSchema = z.object({
  title: z.string(),
});

export const noteContentUpdateSchema = z.object({
  content: z.array(editorNodeSchema),
});

export type Note = RouterOutputs["note"]["get"];
export type NoteTitleUpdate = z.infer<typeof noteTitleUpdateSchema>;
export type NoteContentUpdate = z.infer<typeof noteContentUpdateSchema>;
