import type { EditorNode, Mark } from "../model/schema";

export function exportToMarkdown(nodes: EditorNode[]) {
  const mdNodes = nodes
    .map((node) => {
      const text = generateText(node.text, node.marks);

      switch (node.type) {
        case "heading-1":
          return `\n# ${text}`;
        case "heading-2":
          return `\n## ${text}`;
        case "heading-3":
          return `\n### ${text}`;
        case "heading-4":
          return `\n#### ${text}`;
        case "paragraph":
          return `\n${text}`;
        case "unordered-list-item": {
          const indentLevel = node.indentLevel;
          const prefix = " ".repeat(indentLevel * 2);
          return `${prefix}- ${text}`;
        }
        case "ordered-list-item": {
          const indentLevel = node.indentLevel;
          const prefix = " ".repeat(indentLevel * 2);
          return `${prefix}1. ${text}`;
        }
        case "check-list-item": {
          const indentLevel = node.indentLevel;
          const prefix = " ".repeat(indentLevel * 2);
          return `${prefix}- [${node.checked ? "x" : " "}] ${text}`;
        }
        case "blockquote":
          return `\n> ${text}`;
        case "separator":
          return "\n---\n";
        default:
          const _: never = node;
          return _;
      }
    })
    .join("\n");

  return mdNodes.startsWith("\n") ? mdNodes.slice(1) : mdNodes;
}

function generateText(text: string, marks: Mark[]) {
  let boundaries = marks.flatMap((mark) => [mark.start, mark.end]);
  boundaries.push(0, text.length);
  boundaries.sort((a, b) => a - b);
  boundaries = [...new Set(boundaries)];

  const textParts = [];

  for (let i = 0; i < boundaries.length - 1; i++) {
    const start = boundaries[i]!;
    const end = boundaries[i + 1]!;
    const marksInRange = marks.filter(
      (mark) => mark.start <= start && mark.end >= end,
    );

    let textPart = text.slice(start, end);
    marksInRange.forEach((mark) => {
      textPart = wrapWithMark(textPart, mark);
    });

    textParts.push(textPart);
  }

  return textParts.join("");
}

function wrapWithMark(content: string, mark: Mark): string {
  switch (mark.type) {
    case "bold":
      return `**${content}**`;
    case "italic":
      return `*${content}*`;
    case "underline":
      return `<u>${content}</u>`;
    case "strikethrough":
      return `~~${content}~~`;
    case "superscript":
      return `<sup>${content}</sup>`;
    case "subscript":
      return `<sub>${content}</sub>`;
    case "highlight":
      return `<mark>${content}</mark>`;
    case "code":
      return `\`${content}\``;
    default:
      const _exhaustiveCheck: never = mark;
      return _exhaustiveCheck;
  }
}
