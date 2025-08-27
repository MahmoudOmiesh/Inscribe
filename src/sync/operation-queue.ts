import { localDB } from "@/local/db";
import type { SyncOperation } from "@/local/schema/sync";
import { nanoid } from "nanoid";

export class OperationQueue {
  private syncTrigger?: () => void;

  setSyncTrigger(syncTrigger: () => void) {
    this.syncTrigger = syncTrigger;
  }

  async add(operation: Omit<SyncOperation, "id" | "timestamp" | "status">) {
    const id = nanoid();

    await localDB.syncOperations.add({
      ...operation,
      id,
      timestamp: Date.now(),
      status: "pending",
    });

    if (this.syncTrigger) {
      this.syncTrigger();
    }

    return id;
  }

  async getPendingOperations(userId: string) {
    return localDB.syncOperations
      .where("[userId+status+timestamp]")
      .between([userId, "pending", 0], [userId, "pending", Date.now()])
      .toArray();
  }

  async removeSyncedOperations(operationIds: string[]) {
    await localDB.syncOperations.bulkDelete(operationIds);
  }
}

export const operationQueue = new OperationQueue();
