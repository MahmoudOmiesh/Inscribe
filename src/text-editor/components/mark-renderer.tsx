import { Fragment, memo, type ReactNode } from "react";
import { HIGHLIGHT_COLORS_CSS, type Mark } from "../model/schema";

const MARK_PRIORITY: Record<Mark["type"], number> = {
  bold: 1,
  italic: 2,
  underline: 3,
  strikethrough: 4,
  superscript: 5,
  subscript: 6,
  highlight: 7,
  code: 8,
};

export const MarkRenderer = memo(
  ({ text, marks }: { text: string; marks: Mark[] }) => {
    if (marks.length === 0) {
      return <>{text}</>;
    }

    const textParts = markText(text, marks);

    return (
      <>
        {textParts.map((part, index) => (
          <Fragment key={`${text}-${index}`}>{part}</Fragment>
        ))}
      </>
    );
  },
);

MarkRenderer.displayName = "MarkRenderer";

function markText(text: string, marks: Mark[]) {
  let boundaries = marks.flatMap((m) => [m.start, m.end]);
  boundaries.push(0, text.length);
  boundaries.sort((a, b) => a - b);
  boundaries = [...new Set(boundaries)];

  const textParts: ReactNode[] = [];

  for (let i = 0; i < boundaries.length - 1; i++) {
    const start = boundaries[i]!;
    const end = boundaries[i + 1]!;
    if (start >= end) continue;

    const marksInRange = marks.filter((m) => m.start <= start && m.end >= end);
    const sortedMarks = marksInRange.sort(
      (a, b) => MARK_PRIORITY[b.type] - MARK_PRIORITY[a.type],
    );

    let textPart: ReactNode = <>{text.slice(start, end)}</>;
    for (const mark of sortedMarks) {
      textPart = wrapWithMark(textPart, mark);
    }

    textParts.push(textPart);
  }

  return textParts;
}

function wrapWithMark(content: ReactNode, mark: Mark): ReactNode {
  switch (mark.type) {
    case "bold":
      return <strong>{content}</strong>;
    case "italic":
      return <em>{content}</em>;
    case "underline":
      return <u>{content}</u>;
    case "strikethrough":
      return <s>{content}</s>;
    case "superscript":
      return <sup>{content}</sup>;
    case "subscript":
      return <sub>{content}</sub>;
    case "highlight":
      return (
        <mark
          style={{
            backgroundColor: HIGHLIGHT_COLORS_CSS[mark.color],
            color: "inherit",
          }}
        >
          {content}
        </mark>
      );
    case "code":
      return (
        <code className="rounded-[3px] border bg-neutral-300 px-[0.2rem] py-[0.1rem] font-(family-name:--font-mono) text-sm dark:border-neutral-600 dark:bg-neutral-700">
          {content}
        </code>
      );
    default:
      const _exhaustiveCheck: never = mark;
      return _exhaustiveCheck;
  }
}
