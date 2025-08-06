import * as textCommands from "./text-commands";
import * as nodeCommands from "./node-commands";
import * as deleteCommands from "./delete-commands";

export const commands = {
  text: textCommands,
  delete: deleteCommands,
  node: nodeCommands,
};

export type Command = typeof commands;
