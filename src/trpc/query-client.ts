import { mutationStatusStore } from "@/lib/mutation-status-store";
import {
  defaultShouldDehydrateQuery,
  MutationCache,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import SuperJSON from "superjson";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidateQueries?: (() => Promise<void>) | (() => Promise<void>)[];
      toastOnError?: boolean | string;
      onSuccessMessage?: string;
      subscribeToMutationStatus?: boolean;
    };
  }
}

export const createQueryClient = () =>
  new QueryClient({
    mutationCache: new MutationCache({
      onMutate: (_v, mutation) => {
        if (mutation.meta?.subscribeToMutationStatus) {
          mutationStatusStore.start();
        }
      },

      onSuccess: async (_d, _v, _c, mutation) => {
        const invalidate = mutation.meta?.invalidateQueries;

        if (invalidate) {
          if (Array.isArray(invalidate)) {
            await Promise.all(invalidate.map((promise) => promise()));
          } else {
            await invalidate();
          }
        }

        if (mutation.meta?.onSuccessMessage) {
          toast.success(mutation.meta.onSuccessMessage);
        }

        if (mutation.meta?.subscribeToMutationStatus) {
          mutationStatusStore.success();
        }
      },

      onError: (error, _v, _c, mutation) => {
        const toastOnError = mutation.meta?.toastOnError;
        if (toastOnError === undefined || toastOnError) {
          toast.error(
            typeof toastOnError === "string" ? toastOnError : error.message,
          );
        }

        if (mutation.meta?.subscribeToMutationStatus) {
          mutationStatusStore.error(error.message);
        }
      },
    }),

    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
