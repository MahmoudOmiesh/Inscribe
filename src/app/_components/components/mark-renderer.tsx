import { memo, type ReactNode } from "react";
import type { Mark } from "../utils/types";

const MARK_PRIORITY: Record<Mark["type"], number> = {
  bold: 1,
  italic: 2,
  underline: 3,
  strikethrough: 4,
};

//TODO still not wrapping the marks correctly
// <strong>bo</strong><strong>ld <em>italic</em></strong>
// instead of
// <strong>bold <em>italic</em></strong>

export const MarkRenderer = memo(
  ({ text, marks }: { text: string; marks: Mark[] }) => {
    if (marks.length === 0) {
      return <>{text}</>;
    }

    const segments = createTextSegments(text, marks);

    return (
      <>
        {segments.map((segment, index) => (
          <TextSegment key={index} {...segment} />
        ))}
      </>
    );
  },
);

MarkRenderer.displayName = "MarkRenderer";

const TextSegment = memo(({ text, marks }: { text: string; marks: Mark[] }) => {
  return <>{wrapWithMarks(text, marks)}</>;
});

TextSegment.displayName = "TextSegment";

function wrapWithMarks(text: string, marks: Mark[]) {
  const sortedMarks = [...marks].sort(
    (a, b) => MARK_PRIORITY[a.type] - MARK_PRIORITY[b.type],
  );

  return sortedMarks.reduceRight<ReactNode>((acc, mark) => {
    switch (mark.type) {
      case "bold":
        return <strong>{acc}</strong>;
      case "italic":
        return <em>{acc}</em>;
      case "underline":
        return <u>{acc}</u>;
      case "strikethrough":
        return <s>{acc}</s>;
      default:
        return acc;
    }
  }, text);
}

function createTextSegments(text: string, marks: Mark[]) {
  const boundaries = new Set<number>();

  boundaries.add(0);
  boundaries.add(text.length);

  for (const mark of marks) {
    boundaries.add(mark.start);
    boundaries.add(mark.end);
  }

  const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);

  const segments: { text: string; marks: Mark[] }[] = [];

  for (let i = 0; i < sortedBoundaries.length - 1; i++) {
    const start = sortedBoundaries[i]!;
    const end = sortedBoundaries[i + 1]!;

    const textSegment = text.slice(start, end);
    const activeMarks = marks.filter(
      (mark) => mark.start <= start && mark.end >= end,
    );

    segments.push({ text: textSegment, marks: activeMarks });
  }

  return segments;
}
