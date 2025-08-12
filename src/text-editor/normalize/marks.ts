import { mergeSameTypeMarks, subtractMark } from "../model/marks";
import type { EditorNode, Mark } from "../model/schema";

export function normalizeMarks(nodes: EditorNode[]) {
  return nodes.map((node) => {
    let marks = [...node.marks];

    marks = clampMarks(marks, node.text.length);
    marks = enforceCodeExclusivity(marks);
    marks = enforceHighlightExclusivity(marks);
    marks = mergeSameTypeMarks(marks);

    return {
      ...node,
      marks,
    };
  });
}

function clampMarks(marks: Mark[], maxLength: number) {
  return marks.map((mark) => ({
    ...mark,
    start: Math.max(0, mark.start),
    end: Math.min(mark.end, maxLength),
  }));
}

function enforceCodeExclusivity(marks: Mark[]) {
  // for each code span, remove any marks that overlap with it
  const codeMarks = marks.filter((mark) => mark.type === "code");
  if (codeMarks.length === 0) return marks;

  const otherMarks = marks.filter((mark) => mark.type !== "code");
  const result = [...codeMarks];

  otherMarks.forEach((mark) => {
    let subtracted = [mark];
    codeMarks.forEach((codeMark) => {
      const newSubtracted: Mark[] = [];
      for (const m of subtracted) {
        newSubtracted.push(...subtractMark(m, codeMark));
      }
      subtracted = newSubtracted;
    });
    result.push(...subtracted);
  });

  return result;
}

function enforceHighlightExclusivity(marks: Mark[]) {
  // for each highlight, remove any highlight that overlaps with it

  const highlightMarks = marks.filter((mark) => mark.type === "highlight");
  const otherMarks = marks.filter((mark) => mark.type !== "highlight");

  const result: Mark[] = [...otherMarks];
  const lastHighlight = highlightMarks[highlightMarks.length - 1];

  if (!lastHighlight) return marks;

  for (let i = 0; i < highlightMarks.length - 1; i++) {
    const highlight = highlightMarks[i]!;
    const subtracted = subtractMark(highlight, lastHighlight);
    result.push(...subtracted);
  }

  result.push(lastHighlight);

  return result;
}
