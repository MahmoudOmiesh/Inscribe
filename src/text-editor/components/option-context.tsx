import { createContext, use } from "react";
import type { FontType } from "../model/schema";

export interface EditorOptions {
  font?: FontType;
  locked?: boolean;
  smallText?: boolean;
}

export const OptionContext = createContext<EditorOptions>({
  font: "default",
  locked: false,
  smallText: false,
});

export function OptionProvider({
  children,
  options,
}: {
  children: React.ReactNode;
  options: EditorOptions;
}) {
  return (
    <OptionContext.Provider value={options}>{children}</OptionContext.Provider>
  );
}

export function useOptionContext() {
  const options = use(OptionContext);
  if (!options) {
    throw new Error("useOptionContext must be used within an OptionProvider");
  }
  return options;
}
