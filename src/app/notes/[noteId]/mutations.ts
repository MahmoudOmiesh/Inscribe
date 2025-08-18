/* eslint-disable react-hooks/rules-of-hooks */
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export const NOTE_MUTATIONS = {
  toggleFavorite: (noteId: number) => {
    const utils = api.useUtils();

    const toggleFavorite = api.note.toggleFavorite.useMutation({
      onMutate: async () => {
        await utils.note.get.cancel();

        const prevNote = utils.note.get.getData({ noteId });

        utils.note.get.setData({ noteId }, (old) => {
          if (!old) return old;
          return { ...old, isFavorite: !old.isFavorite };
        });

        return { prevNote };
      },
      onError: (_e, _v, context) => {
        utils.note.get.setData({ noteId }, context?.prevNote);
      },
      meta: {
        subscribeToMutationStatus: true,
      },
    });

    return toggleFavorite;
  },

  duplicate: (folderId: number) => {
    const router = useRouter();
    const utils = api.useUtils();

    const duplicate = api.note.duplicate.useMutation({
      onSuccess: (data) => {
        router.push(`/notes/${data.id}`);
      },
      meta: {
        invalidateQueries: () => utils.folder.getNotes.invalidate({ folderId }),
      },
    });

    return duplicate;
  },
};
