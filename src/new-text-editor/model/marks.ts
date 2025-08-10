import type { ActiveMarkDescriptor, Mark } from "./schema";

export type TextChange = {
  offset: number;
  deletedLength: number;
  insertedLength: number;
};

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

function attrsKey(m: Mark): string {
  switch (m.type) {
    case "highlight":
      return `highlight:${m.color}`;
    // case "link": return `link:${m.href}|${m.title ?? ""}`;
    default:
      return m.type;
  }
}

export function mergeSameTypeMarks(marks: Mark[]) {
  const marksByType = new Map<string, Mark[]>();
  for (const mark of marks) {
    const key = attrsKey(mark);
    const arr = marksByType.get(key) ?? [];
    arr.push(mark);
    marksByType.set(key, arr);
  }

  const mergedMarks = Array.from(marksByType.values()).flatMap((marks) => {
    const sortedMarks = marks.sort((a, b) => a.start - b.start);
    const merged: Mark[] = [];
    let currentMark = sortedMarks[0]!;

    for (let i = 1; i < sortedMarks.length; ++i) {
      const nextMark = sortedMarks[i]!;
      if (nextMark.start <= currentMark.end) {
        currentMark = {
          ...currentMark,
          end: Math.max(currentMark.end, nextMark.end),
        };
      } else {
        merged.push(currentMark);
        currentMark = nextMark;
      }
    }

    merged.push(currentMark);
    return merged;
  });

  return mergedMarks;
}

export function splitMarkAt(
  marks: Mark[],
  markToSplit: ActiveMarkDescriptor,
  position: number,
) {
  const newMarks = [];
  for (const mark of marks) {
    if (mark.type !== markToSplit.type) {
      newMarks.push(mark);
      continue;
    }

    if (
      mark.type === "highlight" &&
      markToSplit.type === "highlight" &&
      mark.color !== markToSplit.color
    ) {
      newMarks.push(mark);
      continue;
    }

    if (position <= mark.start || position >= mark.end) {
      newMarks.push(mark);
      continue;
    }

    const leftMark = {
      ...mark,
      end: position,
    };

    const rightMark = {
      ...mark,
      start: position,
    };

    newMarks.push(leftMark, rightMark);
  }

  return newMarks;
}

export function subtractMark(mark: Mark, otherMark: Mark) {
  const { start: start1, end: end1 } = mark;
  const { start: start2, end: end2 } = otherMark;

  // If the other mark is completely outside the mark - no adjustment
  if (start2 >= end1 || end2 <= start1) return [mark];

  // If the other mark is completely inside the mark - remove the other mark
  if (start2 <= start1 && end2 >= end1) return [];

  const result: Mark[] = [];
  if (start1 < start2) {
    result.push({
      ...mark,
      end: start2,
    });
  }

  if (end1 > end2) {
    result.push({
      ...mark,
      start: end2,
    });
  }

  return result;
}
