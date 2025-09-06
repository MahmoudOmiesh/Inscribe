"use client";

import { NotebookPenIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFirstNote } from "@/local/queries/notes";
import { Spinner } from "@/components/spinner";
import { useLastPulledAt } from "@/local/queries/sync-meta";
import { useDelayedVisible } from "@/hooks/use-delayed-visible";
import { useEffect } from "react";

export function RouteHandler() {
  const firstNote = useFirstNote();
  const lastPulledAt = useLastPulledAt();
  const router = useRouter();

  const isFirstNotePending =
    (firstNote && "isPending" in firstNote && firstNote.isPending) ?? false;
  const showLoading = useDelayedVisible(isFirstNotePending);

  useEffect(() => {
    if (firstNote && "id" in firstNote) {
      router.replace(`/notes/${firstNote.id}`);
    }
  }, [firstNote, router]);

  if (lastPulledAt === undefined) {
    return (
      <div className="bg-background/90 fixed inset-0 z-50 grid place-items-center">
        <div className="bg-card max-w-2xs space-y-2 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold">Setting up your notes</h3>
          <p className="text-muted-foreground text-sm">
            We are setting up your notes for you. This may take a few seconds.
          </p>
          <Spinner size="sm" className="mt-4" />
        </div>
      </div>
    );
  }

  if (isFirstNotePending) {
    return (
      showLoading && (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      )
    );
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
