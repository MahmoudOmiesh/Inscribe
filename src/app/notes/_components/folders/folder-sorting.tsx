"use client";

import { Button } from "@/components/ui/button";
import { GripVerticalIcon, XIcon } from "lucide-react";
import { createContext, use, useState } from "react";

const FolderSortingContext = createContext<{
  isSorting: boolean;
  setIsSorting: (isSorting: boolean) => void;
  isMutating: boolean;
  setIsMutating: (isMutating: boolean) => void;
} | null>(null);

export function FolderSortingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSorting, setIsSorting] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  return (
    <FolderSortingContext.Provider
      value={{ isSorting, setIsSorting, isMutating, setIsMutating }}
    >
      {children}
    </FolderSortingContext.Provider>
  );
}

export function useFolderSorting() {
  const context = use(FolderSortingContext);
  if (!context) {
    throw new Error(
      "useFolderSorting must be used within a FolderSortingProvider",
    );
  }
  return context;
}

export function FolderSortingButton() {
  const { isSorting, setIsSorting, isMutating } = useFolderSorting();

  if (isMutating) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      onClick={() => setIsSorting(!isSorting)}
      data-label={isSorting ? "Cancel reordering" : "Reorder folders"}
    >
      {isSorting ? <XIcon /> : <GripVerticalIcon />}
    </Button>
  );
}
