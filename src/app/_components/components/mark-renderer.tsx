import { memo, type ReactNode } from "react";
import type { Mark } from "../types";

//TODO fix this piece of shit
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
  let content: ReactNode = text;

  for (const mark of marks) {
    content = wrapWithMark(content, mark);
  }

  return <>{content}</>;
});

TextSegment.displayName = "TextSegment";

function wrapWithMark(content: ReactNode, mark: Mark) {
  switch (mark.type) {
    case "bold":
      return <strong>{content}</strong>;
    case "italic":
      return <em>{content}</em>;
    case "underline":
      return <u>{content}</u>;
    case "strikethrough":
      return <s>{content}</s>;
    default:
      return content;
  }
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
