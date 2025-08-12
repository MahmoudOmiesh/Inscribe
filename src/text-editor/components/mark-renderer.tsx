import { memo, type ReactNode } from "react";
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

    return <>{buildMarkTree(text, marks, 0, text.length)}</>;
  },
);

MarkRenderer.displayName = "MarkRenderer";

function buildMarkTree(
  text: string,
  marks: Mark[],
  start: number,
  end: number,
): ReactNode {
  if (start >= end) return null;

  // Find marks that start exactly at this position
  const activeMarks = marks.filter(
    (mark) => mark.start <= start && mark.end > start,
  );

  if (activeMarks.length === 0) {
    // No marks starting here, find the next boundary
    const nextBoundary = findNextStartBoundary(marks, start, end);

    if (nextBoundary === end) {
      // No more boundaries, return the remaining text
      return text.slice(start, end);
    }

    // Return text up to next boundary + continue from there
    return (
      <>
        {text.slice(start, nextBoundary)}
        {buildMarkTree(text, marks, nextBoundary, end)}
      </>
    );
  }

  // Find the mark that starts here and ends furthest
  const longestMark = activeMarks.reduce((longest, current) => {
    const currentLength = current.end - current.start;
    const longestLength = longest.end - longest.start;
    if (currentLength === longestLength) {
      return MARK_PRIORITY[current.type] > MARK_PRIORITY[longest.type]
        ? current
        : longest;
    }
    return currentLength > longestLength ? current : longest;
  });

  // Build content for this mark
  const markEnd = Math.min(longestMark.end, end);
  const innerContent = buildMarkTree(
    text,
    marks.filter((mark) => mark !== longestMark),
    start,
    markEnd,
  );
  const wrappedContent = wrapWithMark(innerContent, longestMark);

  // Continue after this mark ends
  if (markEnd < end) {
    return (
      <>
        {wrappedContent}
        {buildMarkTree(text, marks, markEnd, end)}
      </>
    );
  }

  return wrappedContent;
}

function findNextStartBoundary(
  marks: Mark[],
  start: number,
  end: number,
): number {
  let nextBoundary = end;

  for (const mark of marks) {
    if (mark.start > start && mark.start < nextBoundary) {
      nextBoundary = mark.start;
    }
  }

  return nextBoundary;
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
        <code className="rounded-sm bg-gray-700 p-1 text-inherit">
          {content}
        </code>
      );
    default:
      const _exhaustiveCheck: never = mark;
      return _exhaustiveCheck;
  }
}
