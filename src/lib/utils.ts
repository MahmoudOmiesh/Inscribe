import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupBy<T>(array: T[], key: keyof T) {
  return array.reduce(
    (acc, item) => {
      const value = String(item[key]);
      acc[value] = acc[value] ?? [];
      acc[value].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs = 300,
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Args) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, delayMs);
  };
}

export function getDistinctWordsFromText(text: string) {
  const words = text.split(" ");
  const distinctWords = words.reduce(
    (acc, word) => {
      acc[word] = true;
      return acc;
    },
    {} as Record<string, boolean>,
  );
  return Object.keys(distinctWords);
}
