import { groupBy } from "@/lib/utils";
import type { Mark } from "../../utils/types";

export function mergeOverlappingMarks(marks: Mark[]) {
  const marksByType = groupBy(marks, "type");
  const mergedMarks = Object.values(marksByType).flatMap((marks) => {
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
