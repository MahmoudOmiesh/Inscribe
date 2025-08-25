"use client";

import { createContext, use } from "react";

const UserContext = createContext<{
  userId: string;
} | null>(null);

export function UserProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ userId }}>{children}</UserContext.Provider>
  );
}

export function useUserId() {
  const context = use(UserContext);
  if (!context) {
    throw new Error("useUserId must be used within a UserProvider");
  }
  return context.userId;
}
