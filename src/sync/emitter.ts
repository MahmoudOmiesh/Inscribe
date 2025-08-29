import type { RouterOutputs } from "@/trpc/react";
import EventEmitter from "events";

type Result = RouterOutputs["sync"]["syncOperations"];

export interface UserDataSyncedEvent {
  userId: string;
  results: Result;
}

interface SyncEventEmitterEvents {
  userDataSynced: (data: UserDataSyncedEvent) => void;
}

class SyncEventEmitter extends EventEmitter {
  on<T extends keyof SyncEventEmitterEvents>(
    event: T,
    listener: SyncEventEmitterEvents[T],
  ): this {
    return super.on(event, listener);
  }

  emit<T extends keyof SyncEventEmitterEvents>(
    event: T,
    ...args: Parameters<SyncEventEmitterEvents[T]>
  ): boolean {
    return super.emit(event, ...args);
  }
}

export const syncEventEmitter = new SyncEventEmitter();
