import { localDB } from "../db";

export async function getLastPulledAt(userId: string) {
  const row = await localDB.syncMeta.get(userId);
  return row?.lastPulledAt;
}
