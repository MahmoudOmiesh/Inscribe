import { markEqual, mergeSameTypeMarks, subtractMark } from "../model/marks";
import type { EditorNode, Mark } from "../model/schema";

export function normalizeMarks(nodes: EditorNode[]) {
  let changed = false;
  const normalizedNodes = nodes.map((node) => {
    const originalMarks = node.marks;

    const clamped = clampMarks(originalMarks, node.text.length);
    const codeExclusive = enforceCodeExclusivity(clamped);
    const highlightExclusive = enforceHighlightExclusivity(codeExclusive);
    const merged = mergeSameTypeMarks(highlightExclusive);

    if (marksEqual(originalMarks, merged)) {
      return node;
    }

    changed = true;
    return {
      ...node,
      marks: merged,
    };
  });

  return changed ? normalizedNodes : nodes;
}

function clampMarks(marks: Mark[], maxLength: number) {
  let changed = false;
  const clampedMarks = marks.map((mark) => {
    const start = Math.max(0, mark.start);
    const end = Math.min(mark.end, maxLength);
    if (start !== mark.start || end !== mark.end) {
      changed = true;
      return {
        ...mark,
        start,
        end,
      };
    }
    return mark;
  });

  return changed ? clampedMarks : marks;
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

function marksEqual(marksOne: Mark[], marksTwo: Mark[]) {
  if (marksOne === marksTwo) return true;
  if (marksOne.length !== marksTwo.length) return false;

  for (let i = 0; i < marksOne.length; i++) {
    if (!markEqual(marksOne[i]!, marksTwo[i]!)) return false;
  }

  return true;
}
