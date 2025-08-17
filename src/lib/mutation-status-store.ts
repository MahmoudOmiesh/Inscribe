type Status = "idle" | "syncing" | "success" | "error";

type MutationSyncSnapshot = {
  sessionId: number;
  status: Status;

  active: number; // number of active mutations
  started: number; // number of started mutations
  succeeded: number; // number of succeeded mutations
  failed: number; // number of failed mutations

  hasError: boolean; // whether there was an error in the current session
  lastError: string | null; // last error message in the current session
};

const listeners = new Set<() => void>();
const store: MutationSyncSnapshot = {
  sessionId: 0,
  status: "idle",

  active: 0,
  started: 0,
  succeeded: 0,
  failed: 0,

  hasError: false,
  lastError: null,
};

let snapshot: Readonly<MutationSyncSnapshot> = { ...store };

function emit() {
  snapshot = { ...store };
  for (const l of listeners) l();
}

function beginSessionIfIdle() {
  if (store.active === 0) {
    store.sessionId++;
    store.status = "syncing";

    store.started = 0;
    store.succeeded = 0;
    store.failed = 0;

    store.hasError = false;
    store.lastError = null;
  }
}

export const mutationStatusStore = {
  start() {
    beginSessionIfIdle();

    store.active++;
    store.started++;
    store.status = "syncing";

    emit();
  },
  success() {
    store.succeeded++;
    store.active = Math.max(0, store.active - 1);

    if (store.active === 0) {
      store.status = store.hasError ? "error" : "success";
    }

    emit();
  },
  error(message?: string) {
    store.failed++;
    store.active = Math.max(0, store.active - 1);

    store.hasError = true;
    store.lastError = message ?? store.lastError;

    if (store.active === 0) {
      store.status = "error";
    }

    emit();
  },

  subscribe(this: void, cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  getSnapshot(this: void) {
    return snapshot;
  },
};
