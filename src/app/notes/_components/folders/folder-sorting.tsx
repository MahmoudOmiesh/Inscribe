"use client";

import { Button } from "@/components/ui/button";
import { GripVerticalIcon, XIcon } from "lucide-react";
import { createContext, use, useState } from "react";

const FolderSortingContext = createContext<{
  isSorting: boolean;
  setIsSorting: (isSorting: boolean) => void;
} | null>(null);

export function FolderSortingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSorting, setIsSorting] = useState(false);
  return (
    <FolderSortingContext.Provider value={{ isSorting, setIsSorting }}>
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
  const { isSorting, setIsSorting } = useFolderSorting();

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
