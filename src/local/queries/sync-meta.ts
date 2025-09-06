import { useLiveQuery } from "dexie-react-hooks";
import { localDB } from "../db";
import { useUserId } from "@/app/notes/_components/user-context";

export async function getLastPulledAt(userId: string) {
  const row = await localDB.syncMeta.get(userId);
  return row?.lastPulledAt;
}

export function useLastPulledAt() {
  const userId = useUserId();
  return useLiveQuery(() => getLastPulledAt(userId), [userId], {
    isPending: true,
  });
}
