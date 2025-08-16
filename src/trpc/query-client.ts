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
      toastOnError?: boolean;
      onSuccessMessage?: string;
    };
  }
}

export const createQueryClient = () =>
  new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: async (_data, _variables, _context, mutation) => {
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
      },
      onError: (_error, _variables, _context, mutation) => {
        const toastOnError = mutation.meta?.toastOnError;
        if (toastOnError === undefined || toastOnError) {
          toast.error(_error.message);
        }
      },
    }),

    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
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
