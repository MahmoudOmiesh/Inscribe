"use client";

import { NotebookPenIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { useUserId } from "./user-context";
import { getFirstNote } from "@/local/queries/notes";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/spinner";
import { useDelayedVisible } from "@/hooks/use-delayed-visible";

export function RouteHandler() {
  const userId = useUserId();
  const { data: firstNote, isLoading } = useQuery({
    queryKey: ["firstNote", userId],
    queryFn: () => getFirstNote(userId),
  });

  const showLoading = useDelayedVisible(isLoading);

  if (isLoading) {
    return (
      showLoading && (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      )
    );
  }

  if (firstNote) {
    redirect(`/notes/${firstNote.id}`);
  }

  return (
    <div className="flex-1">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-muted grid size-16 place-items-center rounded-full p-2">
            <NotebookPenIcon className="size-6" />
          </div>
          <h3 className="text-xl font-bold">{"You don't have any notes"}</h3>
          <p className="text-muted-foreground text-sm">
            Create a new note to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
