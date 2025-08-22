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

  updateFont: (noteId: number) => {
    const utils = api.useUtils();

    const updateFont = api.note.updateFont.useMutation({
      onMutate: async (data) => {
        await utils.note.get.cancel();

        const prevNote = utils.note.get.getData({ noteId });

        utils.note.get.setData({ noteId }, (old) => {
          if (!old) return old;
          return { ...old, font: data.font };
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

    return updateFont;
  },

  updateSmallText: (noteId: number) => {
    const utils = api.useUtils();

    const updateSmallText = api.note.updateSmallText.useMutation({
      onMutate: async (data) => {
        await utils.note.get.cancel();

        const prevNote = utils.note.get.getData({ noteId });

        utils.note.get.setData({ noteId }, (old) => {
          if (!old) return old;
          return { ...old, smallText: data.smallText };
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

    return updateSmallText;
  },

  updateLocked: (noteId: number) => {
    const utils = api.useUtils();

    const updateLocked = api.note.updateLocked.useMutation({
      onMutate: async (data) => {
        await utils.note.get.cancel();

        const prevNote = utils.note.get.getData({ noteId });

        utils.note.get.setData({ noteId }, (old) => {
          if (!old) return old;
          return { ...old, locked: data.locked };
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

    return updateLocked;
  },

  updateFullWidth: (noteId: number) => {
    const utils = api.useUtils();

    const updateFullWidth = api.note.updateFullWidth.useMutation({
      onMutate: async (data) => {
        await utils.note.get.cancel();

        const prevNote = utils.note.get.getData({ noteId });

        utils.note.get.setData({ noteId }, (old) => {
          if (!old) return old;
          return { ...old, fullWidth: data.fullWidth };
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

    return updateFullWidth;
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
