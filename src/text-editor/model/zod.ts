import { z } from "zod";
import { ALIGNMENT_TYPES, HIGHLIGHT_COLORS } from "./schema";

const AlignmentSchema = z.enum(ALIGNMENT_TYPES);
const NonHighlightMarkTypeSchema = z.enum([
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "superscript",
  "subscript",
  "code",
]);

const HighlightMarkSchema = z.object({
  type: z.literal("highlight"),
  start: z.number(),
  end: z.number(),
  color: z.enum(HIGHLIGHT_COLORS),
});

const SimpleMarkSchema = z.object({
  type: NonHighlightMarkTypeSchema,
  start: z.number(),
  end: z.number(),
});

const MarkSchema = z.union([HighlightMarkSchema, SimpleMarkSchema]);

const BaseNodeSchema = z.object({
  id: z.string(),
  text: z.string(),
  placeholder: z.string().optional(),
  alignment: AlignmentSchema.default("left"),
  marks: z.array(MarkSchema).default([]),
});

const ParagraphNodeSchema = BaseNodeSchema.extend({
  type: z.literal("paragraph"),
});

const HeadingNodeSchema = z.union([
  BaseNodeSchema.extend({ type: z.literal("heading-1") }),
  BaseNodeSchema.extend({ type: z.literal("heading-2") }),
  BaseNodeSchema.extend({ type: z.literal("heading-3") }),
  BaseNodeSchema.extend({ type: z.literal("heading-4") }),
]);

const ListItemBaseSchema = BaseNodeSchema.extend({
  listId: z.string(),
  indentLevel: z.number().nonnegative().default(0),
});

const UnorderedListItemSchema = ListItemBaseSchema.extend({
  type: z.literal("unordered-list-item"),
});

const OrderedListItemSchema = ListItemBaseSchema.extend({
  type: z.literal("ordered-list-item"),
});

const CheckListItemSchema = ListItemBaseSchema.extend({
  type: z.literal("check-list-item"),
  checked: z.boolean(),
});

const SeparatorNodeSchema = BaseNodeSchema.extend({
  type: z.literal("separator"),
});

const BlockquoteNodeSchema = BaseNodeSchema.extend({
  type: z.literal("blockquote"),
});

export const EditorNodeSchema = z.discriminatedUnion("type", [
  ParagraphNodeSchema,
  ...HeadingNodeSchema.options,
  UnorderedListItemSchema,
  OrderedListItemSchema,
  CheckListItemSchema,
  SeparatorNodeSchema,
  BlockquoteNodeSchema,
]);

export type ParsedEditorNode = z.infer<typeof EditorNodeSchema>;
