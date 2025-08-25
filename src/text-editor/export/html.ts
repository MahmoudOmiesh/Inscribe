import type {
  EditorNode,
  Mark,
  ListItemNode,
  UnorderedListItemNode,
  OrderedListItemNode,
  CheckListItemNode,
  Alignment,
  FontType,
} from "../model/schema";
import { HIGHLIGHT_COLORS_CSS } from "../model/schema";
import { getListBoundaries } from "../model/lists";
import { HTML_STYLES_CSS } from "./html-styles";
import { editorVariables } from "../components/style";

export function exportToHtml(
  nodes: EditorNode[],
  {
    title,
    smallText,
    font,
  }: { title: string; smallText: boolean; font: FontType },
) {
  const parts: string[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!;
    const textHtml =
      node.text.length > 0
        ? generateMarkedHtml(node.text, node.marks)
        : "<br/>";
    const alignmentStyle = alignmentToStyle(node.alignment);
    const trailingBreak = node.text.endsWith("\n") ? "<br/>" : "";

    switch (node.type) {
      case "heading-1":
        parts.push(
          `<h1 style="${alignmentStyle}">${textHtml}${trailingBreak}</h1>`,
        );
        break;
      case "heading-2":
        parts.push(
          `<h2 style="${alignmentStyle}">${textHtml}${trailingBreak}</h2>`,
        );
        break;
      case "heading-3":
        parts.push(
          `<h3 style="${alignmentStyle}">${textHtml}${trailingBreak}</h3>`,
        );
        break;
      case "heading-4":
        parts.push(
          `<h4 style="${alignmentStyle}">${textHtml}${trailingBreak}</h4>`,
        );
        break;
      case "paragraph":
        parts.push(
          `<p style="${alignmentStyle}">${textHtml}${trailingBreak}</p>`,
        );
        break;
      case "blockquote":
        parts.push(
          `<blockquote style="${alignmentStyle}">${textHtml}${trailingBreak}</blockquote>`,
        );
        break;
      case "separator":
        parts.push(`<hr/>`);
        break;
      case "unordered-list-item":
      case "ordered-list-item":
      case "check-list-item": {
        const boundary = getListBoundaries(nodes, i)!;
        const group = nodes.slice(
          boundary.start,
          boundary.end + 1,
        ) as ListItemNode[];
        parts.push(serializeListGroup(group));
        i = boundary.end;
        break;
      }
      default:
        const _exhaustiveCheck: never = node;
        return _exhaustiveCheck;
    }
  }

  const editorVariablesCss = editorVariables[smallText ? "small" : "big"];
  const editorVariablesCssString = Object.entries(editorVariablesCss)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n");

  const doc = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      :root{${editorVariablesCssString}}
      ${HTML_STYLES_CSS}
    </style>
    <title>${escapeHtml(title)}</title>
  </head>
  <body>
    <div class="editor">
      ${parts.join("\n")}
    </div>
  </body>
  </html>
  `;

  return doc;
}

function generateMarkedHtml(text: string, marks: Mark[]) {
  // Collect unique boundaries.
  let boundaries = marks.flatMap((m) => [m.start, m.end]);
  boundaries.push(0, text.length);
  boundaries.sort((a, b) => a - b);
  boundaries = [...new Set(boundaries)];

  const textParts = [];

  for (let i = 0; i < boundaries.length - 1; i++) {
    const start = boundaries[i]!;
    const end = boundaries[i + 1]!;
    if (start >= end) continue;

    const marksInRange = marks.filter((m) => m.start <= start && m.end >= end);

    let textPart = escapeHtml(text.slice(start, end));
    for (const mark of marksInRange) {
      textPart = wrapWithMark(textPart, mark);
    }

    textParts.push(textPart);
  }

  return textParts.join("");
}

function wrapWithMark(content: string, mark: Mark): string {
  switch (mark.type) {
    case "bold":
      return `<strong>${content}</strong>`;
    case "italic":
      return `<em>${content}</em>`;
    case "underline":
      return `<u>${content}</u>`;
    case "strikethrough":
      return `<s>${content}</s>`;
    case "superscript":
      return `<sup>${content}</sup>`;
    case "subscript":
      return `<sub>${content}</sub>`;
    case "highlight":
      return `<mark style="background-color: ${HIGHLIGHT_COLORS_CSS[mark.color]}; color: inherit;">${content}</mark>`;
    case "code":
      return `<code>${content}</code>`;
    default:
      const _: never = mark;
      return _;
  }
}

function alignmentToStyle(alignment: Alignment) {
  switch (alignment) {
    case "left":
      return "text-align: left;";
    case "center":
      return "text-align: center;";
    case "right":
      return "text-align: right;";
    case "justify":
      return "text-align: justify;";
    default:
      const _: never = alignment;
      return _;
  }
}

function serializeListGroup(items: ListItemNode[]): string {
  if (items.length === 0) return "";

  const first = items[0]!;
  if (first.type === "unordered-list-item") {
    const nested = createNested(items as UnorderedListItemNode[]);
    return renderUnordered(nested);
  }
  if (first.type === "ordered-list-item") {
    const nested = createNested(items as OrderedListItemNode[]);
    return renderOrdered(nested);
  }
  // check-list-item
  const nested = createNested(items as CheckListItemNode[]);
  return renderCheck(nested);
}

type NestedItem<T extends ListItemNode> = {
  item: T;
  children: NestedItem<T>[];
};

function createNested<T extends ListItemNode>(items: T[]): NestedItem<T>[] {
  const roots: NestedItem<T>[] = [];
  const stack: NestedItem<T>[] = [];

  for (const it of items) {
    const node: NestedItem<T> = { item: it, children: [] };
    const level = it.indentLevel;

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

function renderUnordered(items: NestedItem<UnorderedListItemNode>[]): string {
  return `<ul>${items.map(renderUnorderedLi).join("")}</ul>`;
}
function renderUnorderedLi(node: NestedItem<UnorderedListItemNode>): string {
  const content =
    node.item.text.length > 0
      ? generateMarkedHtml(node.item.text, node.item.marks)
      : "<br/>";
  const trailingBreak = node.item.text.endsWith("\n") ? "<br/>" : "";
  const alignmentStyle = alignmentToStyle(node.item.alignment);
  const children =
    node.children.length > 0 ? renderUnordered(node.children) : "";

  return `<li><p style="${alignmentStyle}">${content}${trailingBreak}</p>${children}</li>`;
}

function renderOrdered(items: NestedItem<OrderedListItemNode>[]): string {
  return `<ol>${items.map(renderOrderedLi).join("")}</ol>`;
}
function renderOrderedLi(node: NestedItem<OrderedListItemNode>): string {
  const content =
    node.item.text.length > 0
      ? generateMarkedHtml(node.item.text, node.item.marks)
      : "<br/>";
  const trailingBreak = node.item.text.endsWith("\n") ? "<br/>" : "";
  const alignmentStyle = alignmentToStyle(node.item.alignment);
  const children = node.children.length > 0 ? renderOrdered(node.children) : "";

  return `<li><p style="${alignmentStyle}">${content}${trailingBreak}</p>${children}</li>`;
}

function renderCheck(items: NestedItem<CheckListItemNode>[]): string {
  return `<ul>${items.map(renderCheckLi).join("")}</ul>`;
}
function renderCheckLi(node: NestedItem<CheckListItemNode>): string {
  const content =
    node.item.text.length > 0
      ? generateMarkedHtml(node.item.text, node.item.marks)
      : "<br/>";
  const trailingBreak = node.item.text.endsWith("\n") ? "<br/>" : "";
  const children = node.children.length > 0 ? renderCheck(node.children) : "";
  const checked = node.item.checked ? " checked" : "";
  const alignmentStyle = alignmentToStyle(node.item.alignment);

  return `<li><input type="checkbox" ${checked}/> <span style="${alignmentStyle}">${content}${trailingBreak}</span>${children}</li>`;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
