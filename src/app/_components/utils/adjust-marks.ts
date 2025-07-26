import type { Mark, TextChange } from "./types";

export function adjustMarks(marks: Mark[], change: TextChange) {
  return marks
    .map((mark) => adjustMark(mark, change))
    .filter((mark) => mark !== null)
    .filter((mark) => mark.start < mark.end);
}

function adjustMark(mark: Mark, change: TextChange) {
  const { offset, deletedLength, insertedLength } = change;
  const changeEnd = offset + deletedLength;
  const netChange = insertedLength - deletedLength;

  // If the mark is before the change - no adjustment
  if (mark.end <= offset) {
    return mark;
  }

  // If the mark is after the change - adjust the start and end
  if (mark.start >= changeEnd) {
    return {
      ...mark,
      start: mark.start + netChange,
      end: mark.end + netChange,
    };
  }

  // If the mark is completely within the change - remove it
  if (mark.start >= offset && mark.end <= changeEnd) {
    return null;
  }

  // Mark starts before the change and ends after the change - adjust the end
  if (mark.start < offset && mark.end > changeEnd) {
    return {
      ...mark,
      end: mark.end + netChange,
    };
  }

  // Mark starts before the change and ends within the change - truncate the end
  if (mark.start < offset && mark.end <= changeEnd) {
    return {
      ...mark,
      end: offset,
    };
  }

  // Mark starts within the change and ends after the change - move the start
  if (mark.start >= offset && mark.end > changeEnd) {
    return {
      ...mark,
      start: offset + insertedLength,
      end: mark.end + netChange,
    };
  }

  return mark;
}

// Helper functions to create common changes

export function createInsertChange(offset: number, insertedLength: number) {
  return {
    offset,
    deletedLength: 0,
    insertedLength,
  };
}

export function createDeleteChange(offset: number, deletedLength: number) {
  return {
    offset,
    deletedLength,
    insertedLength: 0,
  };
}

export function createReplaceChange(
  offset: number,
  deletedLength: number,
  insertedLength: number,
) {
  return {
    offset,
    deletedLength,
    insertedLength,
  };
}
